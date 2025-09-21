"""
Alternative main.py to test different import approach
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from dotenv import load_dotenv

# Load environment variables first
load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager for startup and shutdown events"""
    # Startup
    try:
        print("✅ Firestore database ready for connections")
    except Exception as e:
        print(f"❌ Application startup error: {e}")
    
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

# Configure CORS
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
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Import and include routers AFTER app creation
try:
    print("Importing routers...")
    from routers import users, issues, verification
    print("✓ Basic routers imported")
    
    from routers import ai_agents
    print("✓ AI agents router imported")
    
    # Include routers
    app.include_router(users.router, prefix="/api", tags=["users"])
    app.include_router(issues.router, prefix="/api", tags=["issues"])
    app.include_router(verification.router, prefix="/api", tags=["verification"])
    app.include_router(ai_agents.router, prefix="/api", tags=["ai-agents", "admin"])
    
    print(f"✓ All routers included. Total routes: {len(app.routes)}")
    admin_routes = [r.path for r in app.routes if hasattr(r, 'path') and 'admin' in r.path]
    print(f"✓ Admin routes: {len(admin_routes)}")
    
except Exception as e:
    print(f"❌ Router import error: {e}")
    import traceback
    traceback.print_exc()

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

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 3001))
    print(f"🚀 Starting Meri Awaaz API on port {port}")
    uvicorn.run(
        "main_debug:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        access_log=True,
        log_level="info"
    )