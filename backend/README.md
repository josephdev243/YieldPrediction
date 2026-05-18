# Django Backend Setup & Documentation

## Project Structure

```
backend/
├── ypf_backend/              # Main project directory
│   ├── __init__.py
│   ├── settings.py           # Django settings
│   ├── urls.py               # URL routing
│   ├── wsgi.py               # WSGI application
│   ├── asgi.py               # ASGI application
│   ├── celery.py             # Celery configuration
│   ├── core/                 # Core app (tasks)
│   ├── users/                # User authentication
│   │   ├── models.py         # CustomUser model
│   │   ├── admin.py
│   │   └── migrations/
│   ├── farms/                # Farm & agricultural data
│   │   ├── models.py         # Farm, Field, Crop, YieldRecord, etc.
│   │   ├── admin.py
│   │   └── migrations/
│   ├── api/                  # REST API
│   │   ├── serializers.py    # DRF serializers
│   │   ├── views.py          # ViewSets
│   │   ├── urls.py           # API routes
│   │   └── migrations/
│   └── utils/                # Utilities
│       ├── weather_service.py    # Weather API integration
│       └── ml_predictions.py     # ML yield predictions
├── manage.py                 # Django management
└── requirements.txt          # Python dependencies
```

## Quick Start

### 1. Prerequisites

- Python 3.10+
- PostgreSQL 16 with PostGIS extension
- Redis (for Celery)
- Virtual environment tool (venv or conda)

### 2. Setup Python Environment

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (macOS/Linux)
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Environment Configuration

```bash
# Copy example to .env
cp .env.example .env

# Edit .env with your settings
# - Django secret key
# - Database credentials
# - External API keys
# - Email configuration
```

### 5. Database Setup

```bash
# Create PostgreSQL database
createdb ypf_db
psql ypf_db -c "CREATE EXTENSION postgis;"

# Or with user/password
createdb -U postgres ypf_db
psql -U postgres ypf_db -c "CREATE EXTENSION postgis;"
```

### 6. Django Migrations

```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

### 7. Load Initial Crop Data

```bash
# Create management command for initial data
python manage.py shell

# In shell:
from ypf_backend.farms.models import Crop
crops_data = [
    {
        'name': 'Maize',
        'scientific_name': 'Zea mays',
        'growing_period_days': 120,
        'optimal_temperature_min': 15,
        'optimal_temperature_max': 30,
        'optimal_rainfall_mm': 600,
    },
    # Add more crops...
]
for crop_data in crops_data:
    Crop.objects.create(**crop_data)
```

### 8. Redis Setup

```bash
# Windows (using WSL or separate Redis service)
redis-server

# macOS
brew services start redis

# Linux
sudo systemctl start redis-server
```

### 9. Run Development Server

```bash
# Terminal 1: Django development server
python manage.py runserver 8000

# Terminal 2: Celery worker
celery -A ypf_backend worker -l info

# Terminal 3: Celery beat scheduler
celery -A ypf_backend beat -l info
```

Access the API at: `http://localhost:8000/api/`
Admin panel: `http://localhost:8000/admin/`

## API Endpoints

### Authentication

- `POST /api/auth/token/` - Get access token
- `POST /api/auth/token/refresh/` - Refresh token
- `POST /api/users/register/` - Register new user
- `GET /api/users/profile/` - Get current user profile

### Users

- `GET /api/users/` - List users (admin only)
- `GET /api/users/{id}/` - User details
- `PUT /api/users/{id}/` - Update user

### Farms

- `GET /api/farms/` - List user's farms
- `POST /api/farms/` - Create farm
- `GET /api/farms/{id}/` - Farm details
- `GET /api/farms/{id}/dashboard/` - Farm dashboard

### Fields

- `GET /api/fields/` - List fields
- `POST /api/fields/` - Create field
- `GET /api/fields/{id}/` - Field details

### Crops

- `GET /api/crops/` - List available crops
- `GET /api/crops/{id}/` - Crop details

### Plantings

- `GET /api/plantings/` - List plantings
- `POST /api/plantings/` - Create planting
- `POST /api/plantings/{id}/mark_harvested/` - Mark as harvested

### Yields

- `GET /api/yields/` - List yield records
- `POST /api/yields/` - Create yield record
- `GET /api/yields/analytics/` - Yield analytics

### Weather

- `GET /api/weather/` - Get weather data
- `GET /api/weather/forecast/` - Get weather forecast

### Predictions

- `GET /api/predictions/` - Get predictions

### Recommendations

- `GET /api/recommendations/` - Get recommendations
- `POST /api/recommendations/{id}/mark_read/` - Mark as read

## Background Tasks (Celery)

Tasks run on schedule:

- **Hourly**: Update weather data for all farms
- **Daily (10 PM)**: Generate yield predictions
- **Daily (6 AM)**: Send harvest alerts via email

Manually trigger tasks:

```bash
python manage.py shell
from ypf_backend.core.tasks import update_all_weather_data
update_all_weather_data.delay()
```

## External API Integrations

### OpenWeatherMap

- Used for current weather and 5-day forecasts
- Get API key: https://openweathermap.org/api
- Add to `.env`: `OPENWEATHER_API_KEY=your_key`

### Open-Meteo (Free)

- Used for historical weather data (ML training)
- No API key required
- Documentation: https://open-meteo.com/

### Email (SendGrid or Mailgun)

- Used for harvest alerts and notifications
- Configure in settings.py with EMAIL_BACKEND
- Add credentials to `.env`

### SMS (Twilio)

- For WhatsApp and SMS alerts to farmers
- Get credentials: https://www.twilio.com/
- Add to `.env`: `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`

## Machine Learning

Yield prediction model features:

- Soil pH and moisture levels
- Weather data (temperature, rainfall, humidity)
- Field area and crop type
- Growing period duration

Model: Random Forest Regressor (scikit-learn)
Training: Automatic from historical yield records

## Production Deployment

### Using Gunicorn

```bash
pip install gunicorn
gunicorn ypf_backend.wsgi:application --bind 0.0.0.0:8000
```

### Using Docker

```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "ypf_backend.wsgi:application", "--bind", "0.0.0.0:8000"]
```

### Environment Variables for Production

```
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
SECRET_KEY=your-long-secret-key
DB_HOST=your-postgres-host
DB_PASSWORD=strong-password
CELERY_BROKER_URL=your-redis-url
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
```

### Database Backup

```bash
# Backup
pg_dump -U postgres ypf_db > backup.sql

# Restore
psql -U postgres ypf_db < backup.sql
```

## Common Issues & Troubleshooting

### PostGIS Extension Not Found

```bash
# Make sure PostGIS is installed
psql -U postgres -c "CREATE EXTENSION postgis;"
```

### Celery Tasks Not Running

```bash
# Check Redis is running
redis-cli ping

# Restart Celery worker
celery -A ypf_backend worker -l info --purge
```

### Weather API Errors

- Check API key in `.env`
- Check rate limits on OpenWeatherMap
- Verify farm has GPS coordinates

### ML Model Performance

- Ensure sufficient historical yield records (>20 records per crop)
- Check for missing weather data during growing periods
- Train model with `generate_yield_predictions_for_farm(farm_id)`

## Testing

```bash
python manage.py test

# Run specific test
python manage.py test ypf_backend.api.tests
```

## Documentation

- [Django REST Framework](https://www.django-rest-framework.org/)
- [Celery Documentation](https://docs.celeryproject.org/)
- [GeoDjango Guide](https://docs.djangoproject.com/en/stable/ref/contrib/gis/)
- [SimpleJWT](https://django-rest-framework-simplejwt.readthedocs.io/)
