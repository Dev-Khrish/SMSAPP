from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import List, Optional
import subprocess
import jwt
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
import aiomysql
import asyncio

app = FastAPI()

# JWT Configuration
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Database connections
mongo_client = AsyncIOMotorClient("mongodb://localhost:27017")
mongo_db = mongo_client.sms_management

# MySQL connection pool
mysql_pool = None

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Models
class SMSProgram(BaseModel):
    name: str
    country: str
    operator: str
    is_high_priority: bool
    is_active: bool

class User(BaseModel):
    username: str
    password: str

# JWT token generation
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Dependency to get current user from token
async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    return username

# Routes
@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # In a real application, you would verify the username and password against a database
    if form_data.username != "admin" or form_data.password != "password":
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token = create_access_token(data={"sub": form_data.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/programs", response_model=List[SMSProgram])
async def get_programs(current_user: str = Depends(get_current_user)):
    programs = await mongo_db.programs.find().to_list(length=100)
    return [SMSProgram(**program) for program in programs]

@app.post("/programs")
async def create_program(program: SMSProgram, current_user: str = Depends(get_current_user)):
    result = await mongo_db.programs.insert_one(program.dict())
    if result.inserted_id:
        return {"message": "Program created successfully"}
    raise HTTPException(status_code=500, detail="Failed to create program")

@app.put("/programs/{program_name}")
async def update_program(program_name: str, program: SMSProgram, current_user: str = Depends(get_current_user)):
    result = await mongo_db.programs.update_one({"name": program_name}, {"$set": program.dict()})
    if result.modified_count:
        return {"message": "Program updated successfully"}
    raise HTTPException(status_code=404, detail="Program not found")

@app.delete("/programs/{program_name}")
async def delete_program(program_name: str, current_user: str = Depends(get_current_user)):
    result = await mongo_db.programs.delete_one({"name": program_name})
    if result.deleted_count:
        return {"message": "Program deleted successfully"}
    raise HTTPException(status_code=404, detail="Program not found")

@app.post("/programs/{program_name}/start")
async def start_program(program_name: str, current_user: str = Depends(get_current_user)):
    program = await mongo_db.programs.find_one({"name": program_name})
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")
    
    try:
        subprocess.run(["screen", "-dmS", program_name, "python", f"{program_name}.py"], check=True)
        await mongo_db.programs.update_one({"name": program_name}, {"$set": {"is_active": True}})
        return {"message": f"Program {program_name} started successfully"}
    except subprocess.CalledProcessError:
        raise HTTPException(status_code=500, detail=f"Failed to start program {program_name}")

@app.post("/programs/{program_name}/stop")
async def stop_program(program_name: str, current_user: str = Depends(get_current_user)):
    program = await mongo_db.programs.find_one({"name": program_name})
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")
    
    try:
        subprocess.run(["screen", "-S", program_name, "-X", "quit"], check=True)
        await mongo_db.programs.update_one({"name": program_name}, {"$set": {"is_active": False}})
        return {"message": f"Program {program_name} stopped successfully"}
    except subprocess.CalledProcessError:
        raise HTTPException(status_code=500, detail=f"Failed to stop program {program_name}")

@app.get("/metrics")
async def get_metrics(current_user: str = Depends(get_current_user)):
    async with mysql_pool.acquire() as conn:
        async with conn.cursor() as cur:
            await cur.execute("SELECT country, COUNT(*) as sms_sent, AVG(success) as success_rate FROM sms_logs GROUP BY country")
            result = await cur.fetchall()
    
    metrics = [{"country": country, "sms_sent": sms_sent, "success_rate": float(success_rate)} for country, sms_sent, success_rate in result]
    return metrics

# Startup and shutdown events
@app.on_event("startup")
async def startup_event():
    global mysql_pool
    mysql_pool = await aiomysql.create_pool(
        host='127.0.0.1', port=3306,
        user='your_mysql_user', password='your_mysql_password',
        db='sms_management', loop=asyncio.get_event_loop()
    )

@app.on_event("shutdown")
async def shutdown_event():
    if mysql_pool:
        mysql_pool.close()
        await mysql_pool.wait_closed()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)