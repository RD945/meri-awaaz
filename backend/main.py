"""
Main FastAPI application instance and router configuration
Updated to use Firestore database instead of PostgreSQL
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv

# Load environment variables first
load_dotenv()

# Import routers (Firestore will initialize when imported)
from routers import users, issues, verification, ai_agents_working as ai_agents

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager for startup and shutdown events"""
    # Startup
    try:
        print("✅ Firestore database ready for connections")
    except Exception as e:
        print(f"❌ Application startup error: {e}")
        # Don't raise here to allow the app to start in degraded mode
    
    yield
    
    # Shutdown
    print("🔄 Application shutting down")

app = FastAPI(
    title="Meri Awaaz API",
    description="Civic Voice Platform Backend API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Configure CORS - Allow frontend development server and production origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "http://localhost:3000", 
        "http://localhost:3002",  # Admin dashboard
        "http://localhost:5174",
        "http://localhost:8080",  # Vite dev server alternate port
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3002",  # Admin dashboard
        "http://127.0.0.1:8080", 
        "https://localhost:5173",  # HTTPS versions
        "https://localhost:3002",  # Admin dashboard HTTPS
        "https://localhost:8080",
        "https://meri-awaaz.vercel.app",  # Production domain
        "https://*.vercel.app",  # All Vercel deployments
        "https://*.ngrok-free.app",  # Ngrok free tier
        "https://*.ngrok.io",  # Ngrok tunnels
        "https://*.ngrok.app",  # Ngrok app domains
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router, prefix="/api", tags=["users"])
app.include_router(issues.router, prefix="/api", tags=["issues"])
app.include_router(verification.router, prefix="/api", tags=["verification"])
app.include_router(ai_agents.router, prefix="/api", tags=["ai-agents", "admin"])

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Meri Awaaz API is running"}

# Test endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to Meri Awaaz API",
        "version": "1.0.0",
        "status": "running"
    }

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Internal server error",
            "data": None
        }
    )

if __name__ == "__main__":
    import uvicorn
    
    # Get port from environment, default to 3001 to match frontend expectations
    port = int(os.getenv("PORT", 3001))
    
    # Determine if we're in development mode
    is_development = os.getenv("ENV", "production") == "development"
    
    print(f"🚀 Starting Meri Awaaz API on port {port}")
    print(f"📝 Environment: {'development' if is_development else 'production'}")
    print(f"📊 Docs available at: http://localhost:{port}/docs")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=is_development,
        access_log=is_development,
        log_level="info" if is_development else "warning"
    )