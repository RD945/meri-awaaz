# Meri Awaaz Backend API

This is the FastAPI backend for the Meri Awaaz civic voice platform, providing robust, scalable, and asynchronous APIs with Firebase authentication and AI-powered issue processing.

## Project Structure

```
backend/
├── main.py                 # Main FastAPI application
├── requirements.txt        # Python dependencies
├── .env                   # Environment variables
├── routers/
│   ├── users.py           # User profile endpoints
│   └── issues.py          # Issue CRUD and voting endpoints
├── models/
│   └── schemas.py         # Pydantic models matching TypeScript types
├── core/
│   ├── auth.py           # Firebase JWT authentication
│   └── database.py       # PostgreSQL with PostGIS setup
└── workers/
    ├── celery_app.py     # Celery configuration
    └── tasks.py          # AI processing pipeline
```

## Features

### 🔐 Authentication
- Firebase JWT token verification
- Protected endpoints with user context
- Optional authentication for guest users

### 👤 User Management
- `GET /api/users/me` - Get user profile
- `PUT /api/users/me` - Update user profile  
- `GET /api/users/me/stats` - Get user statistics

### 📋 Issue Management
- `GET /api/issues` - Get paginated issues with filtering
- `POST /api/issues` - Create new issue (async AI processing)
- `GET /api/issues/{id}` - Get single issue
- `POST /api/issues/{id}/upvote` - Vote on issues
- `GET /api/issues/map` - Get issues for map display
- `GET /api/users/me/issues` - Get user's issues

### � File Upload
- `POST /api/files/upload` - Upload images
- `POST /api/files/upload-audio` - Upload audio recordings

### 🤖 AI Processing Pipeline
Asynchronous multi-agent AI workflow for new issues:

1. **Vision Agent (LLaVA)** - Analyzes uploaded images
2. **Analysis Agent** - Consolidates text and image data
3. **Triage Agent** - Assigns priority and category

## Setup Instructions

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Database Setup

Install PostgreSQL with PostGIS extension:

```bash
# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib postgis

# Create database
sudo -u postgres createdb meri_awaaz
sudo -u postgres psql -d meri_awaaz -c "CREATE EXTENSION postgis;"
```

### 3. Redis Setup

Install Redis for Celery task queue:

```bash
# Ubuntu/Debian
sudo apt install redis-server

# Start Redis
sudo systemctl start redis-server
```

### 4. Firebase Setup

1. Download Firebase service account key
2. Update `.env` with the key path
3. Set up Firebase authentication in your frontend

### 5. Environment Variables

Update `.env` file with your configuration:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/meri_awaaz
FIREBASE_SERVICE_ACCOUNT_KEY=path/to/firebase-key.json
REDIS_URL=redis://localhost:6379/0
```

### 6. Run the Application

```bash
# Start the FastAPI server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Start Celery worker (separate terminal)
celery -A workers.celery_app worker --loglevel=info

# Optional: Start Celery monitoring
celery -A workers.celery_app flower
```

## API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Database Schema

### Users Table
- Firebase UID as primary key
- Profile information matching frontend TypeScript interface
- Points and badges for gamification

### Issues Table
- PostGIS POINT geometry for location data
- JSON fields for image URLs and metadata
- Processing status tracking for AI pipeline
- Vote tracking with separate user_votes table

### User Votes Table
- Tracks upvotes/downvotes per user per issue
- Prevents duplicate voting
- Supports vote changes

## AI Processing Details

### Asynchronous Processing
1. `POST /api/issues` immediately returns 202 Accepted
2. Issue saved with status "processing"
3. Background Celery task processes through AI pipeline
4. Issue updated with AI results and status "triaged"

### AI Agent Placeholders
- `call_llava_service()` - Vision analysis placeholder
- `call_analysis_agent()` - Text consolidation placeholder  
- `call_triage_agent()` - Priority/category assignment placeholder

Replace these with actual AI service integrations.

## Security Features

- Firebase JWT verification on all protected endpoints
- CORS configuration for frontend integration
- Input validation with Pydantic models
- SQL injection prevention with parameterized queries

## Performance Optimizations

- Database connection pooling with asyncpg
- Spatial indexing for location queries
- Pagination for large datasets
- Asynchronous processing for AI tasks
- Caching strategy with Redis

## Development

### Run Tests
```bash
pytest
```

### Code Formatting
```bash
black .
flake8 .
```

### Type Checking
```bash
mypy .
```

## Deployment

### Docker (Recommended)
```dockerfile
FROM python:3.11-slim
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Variables for Production
- Set `ENV=production`
- Use proper database URLs
- Configure Firebase credentials
- Set up monitoring with Sentry

## Monitoring

- Health check endpoint: `GET /health`
- Celery monitoring with Flower
- Structured logging with correlation IDs
- Performance metrics collection

## Contributing

1. Follow PEP 8 style guidelines
2. Add type hints to all functions
3. Write tests for new endpoints
4. Update documentation for API changes
5. Use proper commit message format
