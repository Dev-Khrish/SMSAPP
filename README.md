# SMS Management System

This project is a web-based dashboard to manage and monitor an SMS system running on a Linux server. It consists of a Python backend using FastAPI, a React frontend, and uses MongoDB and MySQL for data storage.

## Prerequisites

- Python 3.8+
- Node.js 14+
- MongoDB
- MySQL
- Prometheus
- Grafana

## Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/sms-management-system.git
cd sms-management-system
```

2. Set up the backend:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
pip install -r requirements.txt
```

3. Set up the databases:

```bash
python init_db.py
```

4. Set up the frontend:

```bash
cd ../frontend
npm install
```

5. Configure Prometheus:

- Copy the `prometheus.yml` file to your Prometheus configuration directory.

6. Configure Grafana:

- Import the `grafana-dashboard.json` file into your Grafana instance.

## Running the Application

1. Start the backend:

```bash
cd backend
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
uvicorn main:app --reload
```

2. Start the frontend:

```bash
cd frontend
npm run dev
```

3. Start Prometheus and Grafana according to your system configuration.

4. Access the application at `http://localhost:5173` (or the port specified by Vite).

## Features

- User authentication
- Real-time SMS program management
- SMS metrics visualization
- Integration with Prometheus and Grafana for monitoring

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.