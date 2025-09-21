"""
Working admin login test
"""
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class AdminLogin(BaseModel):
    username: str
    password: str

@app.get("/")
async def root():
    return {"message": "Working test server"}

@app.post("/api/admin/auth/login")
async def admin_login(credentials: AdminLogin):
    if credentials.username == "admin" and credentials.password == "demo123":
        return {
            "success": True,
            "message": "Admin login successful",
            "data": {"token": "demo-token-123"}
        }
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/api/admin/stats")
async def admin_stats():
    return {
        "success": True,
        "data": {
            "total_issues": 42,
            "total_users": 123,
            "active_agents": 3
        }
    }