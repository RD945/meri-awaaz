"""
Test server with fixed AI agents router
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    print("✅ Application startup complete")
    yield
    print("🔄 Application shutting down")

app = FastAPI(
    title="Meri Awaaz API - Fixed",
    description="Civic Voice Platform Backend API with Fixed Router",
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
        "http://localhost:8080",
        "http://127.0.0.1:3002",
        "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Meri Awaaz API is running"}

@app.get("/")
async def root():
    return {
        "message": "Meri Awaaz API - Fixed Version",
        "version": "1.0.0",
        "status": "running"
    }

# Import and include the fixed router
try:
    print("Importing fixed AI agents router...")
    from routers import ai_agents_fixed
    print(f"✓ Fixed router imported with {len(ai_agents_fixed.router.routes)} routes")
    
    # Include the fixed router
    app.include_router(ai_agents_fixed.router, prefix="/api", tags=["admin"])
    print(f"✓ Fixed router included. Total app routes: {len(app.routes)}")
    
    # Check admin routes
    admin_routes = [r.path for r in app.routes if hasattr(r, 'path') and 'admin' in r.path]
    print(f"✓ Admin routes: {len(admin_routes)}")
    print(f"✓ Login route present: {'/api/admin/auth/login' in admin_routes}")
    
except Exception as e:
    print(f"❌ Error importing fixed router: {e}")
    import traceback
    traceback.print_exc()

# Debug route
@app.get("/debug/routes")
async def debug_routes():
    routes = []
    for route in app.routes:
        if hasattr(route, 'path') and hasattr(route, 'methods'):
            routes.append({
                "path": route.path,
                "methods": list(route.methods),
                "name": getattr(route, 'name', 'unknown')
            })
    return {
        "total_routes": len(routes),
        "admin_routes": [r for r in routes if 'admin' in r['path']],
        "all_routes": routes
    }