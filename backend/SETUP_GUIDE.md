# YPF Django Backend - Complete Setup Guide

## What's Been Created

✅ **Complete Django Project Structure**

- Multi-app architecture (users, farms, api, core)
- Django ORM models with GeoDjango support
- REST API with Django REST Framework
- JWT authentication
- CORS configuration for React frontend

✅ **Database Models**

- CustomUser (auth)
- Farm (farm ownership)
- Field (individual farm fields)
- Crop (crop definitions)
- CropPlanting (crop tracking)
- YieldRecord (harvest data)
- WeatherData (environmental tracking)
- YieldPrediction (ML predictions)
- Recommendation (AI suggestions)

✅ **REST API Endpoints** (All with JWT protection)

- User management & registration
- Farm CRUD operations
- Field management
- Crop database
- Planting lifecycle
- Yield recording & analytics
- Weather data retrieval
- Yield predictions
- Recommendations

✅ **Authentication**

- JWT tokens (access + refresh)
- User roles (farmer, operator, admin)
- Registration endpoint
- Profile management

✅ **Background Tasks (Celery)**

- Hourly weather data updates
- Nightly yield predictions
- Daily harvest alerts via email
- Scheduled recommendations generation

✅ **External Integrations**

- OpenWeatherMap API (current weather, forecasts)
- Open-Meteo API (free historical data)
- Email notifications (SendGrid/Mailgun ready)
- SMS/WhatsApp (Twilio integration)

✅ **Machine Learning**

- Yield prediction model (Random Forest)
- Feature engineering from weather & soil data
- Confidence scoring
- Per-crop model training

✅ **DevOps**

- Docker & Docker Compose setup
- Gunicorn WSGI application server
- Production-ready settings
- Database backup/restore scripts

---

## Step-by-Step Setup (Recommended Order)

### Phase 1: Local Development Setup

#### Step 1: Initial Configuration

```bash
cd backend
cp .env.example .env
# Edit .env with:
# - SECRET_KEY (generate with: python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')
# - Database name, user, password
# - API keys (leave blank for now)
```

#### Step 2: Create Virtual Environment

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

#### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

#### Step 4: PostgreSQL + PostGIS Setup

```bash
# Install PostgreSQL 16 if not present
# Then:
createdb -U postgres ypf_db
psql -U postgres ypf_db -c "CREATE EXTENSION postgis;"
```

#### Step 5: Django Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

#### Step 6: Create Superuser

```bash
python manage.py createsuperuser
# Follow prompts for username, email, password
```

#### Step 7: Load Initial Crops (Optional)

```bash
python manage.py shell
```

In the shell:

```python
from ypf_backend.farms.models import Crop

crops = [
    {'name': 'Maize', 'scientific_name': 'Zea mays', 'growing_period_days': 120, 'optimal_temperature_min': 15, 'optimal_temperature_max': 30, 'optimal_rainfall_mm': 600},
    {'name': 'Beans', 'scientific_name': 'Phaseolus vulgaris', 'growing_period_days': 90, 'optimal_temperature_min': 18, 'optimal_temperature_max': 28, 'optimal_rainfall_mm': 400},
    {'name': 'Wheat', 'scientific_name': 'Triticum aestivum', 'growing_period_days': 150, 'optimal_temperature_min': 10, 'optimal_temperature_max': 25, 'optimal_rainfall_mm': 500},
]

for crop_data in crops:
    Crop.objects.create(**crop_data)

exit()
```

#### Step 8: Redis Setup

```bash
# Windows WSL or separate service
redis-server

# macOS
brew install redis
brew services start redis

# Linux
sudo apt-get install redis-server
sudo systemctl start redis-server
```

### Phase 2: Test Core Functionality

#### Step 9: Run Development Server

```bash
# Terminal 1: Django
python manage.py runserver

# Terminal 2: Celery Worker
celery -A ypf_backend worker -l info

# Terminal 3: Celery Beat (scheduler)
celery -A ypf_backend beat -l info
```

#### Step 10: Test API Endpoints

```bash
# Register user
curl -X POST http://localhost:8000/api/users/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"farmer1","email":"farmer@example.com","password":"testpass123","password_confirm":"testpass123","role":"farmer"}'

# Get token
curl -X POST http://localhost:8000/api/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"farmer1","password":"testpass123"}'

# Create farm (use token from above)
curl -X POST http://localhost:8000/api/farms/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"My Farm","location":"Nairobi","total_area_hectares":5,"soil_type":"loamy","climate_zone":"tropical"}'
```

#### Step 11: Admin Panel

Visit http://localhost:8000/admin/

- Login with superuser credentials
- View/manage all data models
- Test CRUD operations

### Phase 3: Integration with React Frontend

#### Step 12: Update React API Configuration

In your React frontend (crop-yields/src):

```typescript
// Create src/lib/api.ts or update existing
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

export const api = {
  auth: {
    register: (data) =>
      fetch(`${API_BASE}/users/register/`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    login: (username, password) =>
      fetch(`${API_BASE}/auth/token/`, {
        method: "POST",
        body: JSON.stringify({ username, password }),
      }),
  },
  farms: {
    list: (token) =>
      fetch(`${API_BASE}/farms/`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    create: (data, token) =>
      fetch(`${API_BASE}/farms/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      }),
  },
  // ... add more endpoints as needed
};
```

Update .env.example in React:

```
REACT_APP_API_URL=http://localhost:8000/api
```

### Phase 4: External APIs Configuration

#### Step 13: Add OpenWeatherMap API Key

1. Sign up at https://openweathermap.org/api
2. Get API key from account dashboard
3. Add to .env: `OPENWEATHER_API_KEY=your_key_here`
4. Test: `python manage.py shell` then `from ypf_backend.utils.weather_service import OpenWeatherService; s = OpenWeatherService(); print(s.get_current_weather(-1.2921, 36.8219))`

#### Step 14: Setup Email (Optional)

SendGrid setup:

```bash
# Install sendgrid
pip install sendgrid

# Add to .env
EMAIL_BACKEND=anymail.backends.sendgrid.EmailBackend
SENDGRID_API_KEY=your_sendgrid_key
DEFAULT_FROM_EMAIL=noreply@ypf-farming.com
```

#### Step 15: Setup SMS (Optional)

Twilio setup:

```bash
# Get credentials from https://www.twilio.com/
# Add to .env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

### Phase 5: Production Deployment

#### Step 16: Docker Deployment

```bash
# Build images
docker-compose build

# Start all services
docker-compose up -d

# Create superuser in container
docker-compose exec web python manage.py createsuperuser

# Run migrations
docker-compose exec web python manage.py migrate
```

#### Step 17: Environment for Production

Create production .env:

```
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,api.yourdomain.com
SECRET_KEY=your-long-random-secret-key
DB_ENGINE=django.contrib.gis.db.backends.postgis
DB_NAME=ypf_db_prod
DB_USER=ypf_user
DB_PASSWORD=strong-random-password
DB_HOST=your-db-host
DB_PORT=5432
CELERY_BROKER_URL=redis://your-redis-host:6379/0
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_STORAGE_BUCKET_NAME=ypf-assets
```

#### Step 18: Deploy to Server

```bash
# Using AWS EC2, DigitalOcean, Heroku, or similar
# 1. Push code to Git
# 2. Configure CI/CD (GitHub Actions, GitLab CI)
# 3. Deploy with: docker-compose up -d on production server
# 4. Configure Nginx reverse proxy
# 5. Setup SSL with Let's Encrypt
```

---

## Key Features Summary

### 🔐 Security

- JWT authentication with refresh tokens
- CSRF protection
- CORS configured for frontend
- Environment variables for secrets
- Production settings with DEBUG=False

### 📊 Data Models

- Comprehensive agricultural data tracking
- Geospatial support (GPS coordinates, field boundaries)
- Historical weather data
- Yield analytics & predictions

### 🤖 AI/ML

- Yield prediction model trained on historical data
- Weather-based forecasting
- Soil quality analysis
- Automated recommendations

### 🔄 Automation

- Celery background tasks
- Redis caching
- Scheduled weather updates
- Email notifications
- SMS alerts

### 🌐 APIs

- RESTful design
- Pagination & filtering
- Search capabilities
- Detailed error handling
- API documentation ready for Swagger/ReDoc

### 🚀 DevOps

- Docker containerization
- Docker Compose for local dev
- Gunicorn for production
- Database backup strategies
- Logging & monitoring ready

---

## Testing the Complete Flow

1. **Register a user** via `/api/users/register/`
2. **Get JWT token** via `/api/auth/token/`
3. **Create a farm** with GPS coordinates
4. **Add fields** to the farm
5. **Plant crops** on fields
6. **Weather data** auto-updates via Celery
7. **Yield predictions** generated nightly
8. **Recommendations** generated based on conditions
9. **Record yield** when harvested
10. **View analytics** in dashboard

---

## Troubleshooting

### Issue: PostGIS extension not found

```bash
psql -U postgres ypf_db -c "CREATE EXTENSION postgis;"
```

### Issue: Celery tasks not running

```bash
# Clear Redis cache
redis-cli FLUSHALL

# Restart celery worker
celery -A ypf_backend worker -l info --purge
```

### Issue: Weather API errors

- Check API key is correct
- Verify farm has GPS coordinates
- Check rate limits on OpenWeatherMap

### Issue: ML model errors

- Ensure >20 historical yield records per crop
- Check weather data during growing period
- Verify field coordinates

---

## Next Steps

1. ✅ Clone/pull this backend code
2. ✅ Follow setup steps above
3. ✅ Connect React frontend to `/api/` endpoints
4. ✅ Configure external APIs
5. ✅ Test end-to-end flow
6. ✅ Deploy to production server

You now have a production-ready Django backend! 🎉
