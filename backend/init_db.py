import asyncio
import aiomysql
from motor.motor_asyncio import AsyncIOMotorClient

async def init_mongodb():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client.sms_management
    
    # Create indexes
    await db.programs.create_index("name", unique=True)
    
    print("MongoDB initialized successfully")

async def init_mysql():
    conn = await aiomysql.connect(
        host='127.0.0.1',
        port=3306,
        user='your_mysql_user',
        password='your_mysql_password',
        db='sms_management',
        loop=asyncio.get_event_loop()
    )
    
    async with conn.cursor() as cur:
        await cur.execute("""
            CREATE TABLE IF NOT EXISTS sms_logs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                program_name VARCHAR(255),
                country VARCHAR(255),
                operator VARCHAR(255),
                timestamp DATETIME,
                success BOOLEAN,
                INDEX idx_country (country),
                INDEX idx_timestamp (timestamp)
            )
        """)
    
    await conn.commit()
    conn.close()
    print("MySQL initialized successfully")

async def main():
    await init_mongodb()
    await init_mysql()

if __name__ == "__main__":
    asyncio.run(main())