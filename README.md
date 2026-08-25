# YPF (Yield Prediction & Farming)

A full-stack smart farming platform that helps small-scale farmers monitor farm activities, track crop yields, analyze environmental conditions, and make data-driven decisions.

## Overview

YPF is a full-stack agricultural technology platform designed to support modern, efficient, and sustainable farming. It combines a React-based frontend with a Python/Django backend, weather services, predictive analytics, scheduled background tasks, and containerized deployment to give farmers actionable insights for better crop planning and yield management.

The platform supports:

- Farm and field management
- Crop and planting tracking
- Yield recording and analytics
- Weather and climate monitoring
- Yield prediction using machine learning
- Personalized recommendations for farming decisions
- User access, authentication, and dashboards

## Subtitle

A full-stack smart farming platform that uses data analytics, weather insights, and predictive technology to help small-scale farmers improve crop yields and make informed agricultural decisions.

## Tech Stack

### Frontend
- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Router
- Recharts and Leaflet for dashboards and mapping
- Axios and React Query for API integration

### Backend
- Python
- Django
- Django REST Framework
- PostgreSQL with PostGIS
- Redis
- Celery + Celery Beat
- JWT authentication

### Infrastructure and DevOps
- Docker
- Docker Compose
- Gunicorn
- Environment-based configuration

## System Architecture

```text
Frontend (React + Vite + Tailwind)
        |
        v
REST API (Django REST Framework)
        |
   +----+--------------------------+
   |                                |
   v                                v
PostgreSQL/PostGIS              Redis + Celery
   |                                |
   |                                v
   |                         Background tasks
   |                                |
   +------------------+-------------+
                      |
                      v
                Weather APIs / ML services
```

The architecture combines a user-facing dashboard with secure API services, a relational geospatial database, asynchronous task processing, and predictive logic to support smarter agricultural decision-making.

## Core Features

- Farm and field tracking for growers and farm operators
- Crop lifecycle and planting records
- Yield analytics and trend monitoring
- Weather data retrieval and forecast monitoring
- Recommendation generation based on crop and field conditions
- Machine learning-based yield predictions
- Admin dashboard for managing core agricultural data
- REST API built for frontend integration

## API Features

The backend exposes REST endpoints for:

- Authentication and user management
- Farm and field creation and updates
- Crop catalog and planting records
- Yield entry and analytics
- Weather retrieval and forecasting
- Prediction generation
- Recommendations and notifications

## Machine Learning / Prediction Features

The backend includes predictive components built around:

- Weather and soil-related features
- Crop growth and seasonal data
- Yield forecasting logic
- Model-based prediction outputs with confidence scoring
- Scheduled prediction tasks via Celery

## Project Structure

```text
YieldPrediction/
├── README.md
├── backend/
│   ├── .env
│   ├── .env.example
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── manage.py
│   ├── requirements.txt
│   ├── entrypoint.sh
│   ├── ARCHITECTURE.md
│   ├── SETUP_GUIDE.md
│   ├── README.md
│   ├── celerybeat-schedule
│   └── ypf_backend/
│       ├── __init__.py
│       ├── asgi.py
│       ├── celery.py
│       ├── settings.py
│       ├── urls.py
│       ├── wsgi.py
│       ├── api/
│       ├── core/
│       ├── farms/
│       ├── users/
│       └── utils/
└── frontend/
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── index.html
    └── src/
```

## Prerequisites

Before running the project, make sure you have:

- Node.js 18+ and npm
- Python 3.10+
- PostgreSQL 16 with PostGIS enabled
- Redis
- Docker and Docker Compose (optional, for containerized setup)
- Git

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd YieldPrediction
```

### 2. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at:

- http://localhost:5173

### 3. Backend setup

From the project root:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Edit the backend `.env` file and configure your database keys, API keys, and secret values.

### 4. Database setup

Create PostgreSQL/PostGIS database and enable the PostGIS extension:

```bash
createdb yieldprediction_db
psql -U postgres yieldprediction_db -c "CREATE EXTENSION postgis;"
```

If needed, update the database settings in your `.env` file to match your local environment.

### 5. Run Django migrations

```bash
python manage.py migrate
python manage.py createsuperuser
```

### 6. Start the backend services

In one terminal:

```bash
python manage.py runserver 0.0.0.0:8000
```

In another terminal:

```bash
celery -A ypf_backend worker -l info
```

In a third terminal:

```bash
celery -A ypf_backend beat -l info
```

The backend API is available at:

- http://localhost:8000/api/
- Admin panel: http://localhost:8000/admin/

### 7. Optional: Docker setup

From the backend folder:

```bash
docker compose up --build
```

This starts the PostgreSQL, Redis, Django app, and Celery services together.

## Environment Variables

The project uses environment-based configuration for secrets and integrations. The backend includes a sample file at `backend/.env.example`.

Typical variables include:

```env
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
FRONTEND_URL=http://localhost:5173
DB_NAME=yieldprediction_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=postgis
DB_PORT=5432
OPENWEATHER_API_KEY=your_openweather_key
REDIS_URL=redis://redis:6379/0
CELERY_BROKER_URL=redis://redis:6379/0
CELERY_RESULT_BACKEND=redis://redis:6379/0
```

Additional variables may be required for email, SMS, or cloud storage integrations.

## Docker Setup

The repository includes Docker configuration for local development and service orchestration:

```bash
cd backend
docker compose up --build
```

The Docker stack includes:

- PostgreSQL + PostGIS
- Redis
- Django application
- Celery worker
- Celery Beat scheduler

## Development Workflow

### Frontend

```bash
cd frontend
npm install
npm run dev
npm run build
npm run lint
```

### Backend

```bash
cd backend
source .venv/bin/activate
python manage.py makemigrations
python manage.py migrate
python manage.py test
python manage.py runserver 0.0.0.0:8000
```

## Future Enhancements

The project already includes key predictive and backend capabilities, and future improvements may include:

- Expanded farm analytics and reporting
- More advanced ML models for crop yield forecasting
- Improved recommendation engine personalization
- Mobile app support
- Multi-language support
- Integration with more climate and satellite data services
- Enhanced farmer alerting and outreach systems

## Contributing

Contributions are welcome. To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run the relevant tests or validation
5. Open a pull request with a clear description

## License

This project is licensed under the MIT License.

## Additional Documentation

For more detailed setup and architecture notes, see:

- `backend/README.md`
- `backend/SETUP_GUIDE.md`
- `backend/ARCHITECTURE.md`
- `backend/COMPLETION_SUMMARY.md`

