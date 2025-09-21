"""
Minimal test to isolate the routing issue
"""
from fastapi import FastAPI

app = FastAPI()

@app.get("/test")
async def test_route():
    return {"message": "test route works"}

@app.get("/api/test")  
async def api_test_route():
    return {"message": "api test route works"}

# Try to import and include just the ai_agents router
try:
    print("Importing ai_agents router...")
    from routers import ai_agents
    print(f"Router has {len(ai_agents.router.routes)} routes")
    
    app.include_router(ai_agents.router, prefix="/api", tags=["admin"])
    print(f"After including router, app has {len(app.routes)} routes")
    
    # Check for admin routes
    admin_routes = [r.path for r in app.routes if hasattr(r, 'path') and 'admin' in r.path]
    print(f"Admin routes: {admin_routes}")
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()

@app.get("/debug")
async def debug():
    routes = []
    for route in app.routes:
        if hasattr(route, 'path') and hasattr(route, 'methods'):
            routes.append({"path": route.path, "methods": list(route.methods)})
    return {"routes": routes}