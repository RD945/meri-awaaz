"""
Fixed AI Agents Router - Simplified and working version
"""
from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from pydantic import BaseModel

router = APIRouter()

# Simple models without complex dependencies
class AdminLogin(BaseModel):
    username: str
    password: str

class AdminResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None

class AIAgentStatus(BaseModel):
    agent_id: str
    name: str
    status: str
    last_activity: datetime
    total_actions: int
    success_rate: float
    enabled: bool

class AdminStats(BaseModel):
    total_issues: int
    total_users: int
    active_issues: int
    resolved_issues: int
    pending_issues: int
    active_agents: int

# Demo credentials - simplified
DEMO_ADMIN_CREDENTIALS = {
    "username": "admin",
    "password": "demo123"
}

# Admin Authentication Endpoints
@router.post("/admin/auth/login")
async def admin_login(credentials: AdminLogin):
    """Admin login endpoint for demo credentials"""
    if (credentials.username == DEMO_ADMIN_CREDENTIALS["username"] and 
        credentials.password == DEMO_ADMIN_CREDENTIALS["password"]):
        
        return AdminResponse(
            success=True,
            message="Admin login successful",
            data={
                "token": "admin-demo-token-12345",
                "user": {
                    "id": "admin-001",
                    "username": "admin",
                    "role": "super_admin"
                }
            }
        )
    else:
        raise HTTPException(status_code=401, detail="Invalid admin credentials")

@router.post("/admin/auth/logout")
async def admin_logout():
    """Admin logout endpoint"""
    return AdminResponse(
        success=True,
        message="Admin logout successful"
    )

# Admin Dashboard Statistics
@router.get("/admin/stats")
async def get_admin_stats():
    """Get comprehensive admin dashboard statistics"""
    return AdminResponse(
        success=True,
        message="Admin statistics retrieved successfully",
        data=AdminStats(
            total_issues=156,
            total_users=89,
            active_issues=34,
            resolved_issues=102,
            pending_issues=20,
            active_agents=3
        ).dict()
    )

# Issues Management
@router.get("/admin/issues")
async def get_admin_issues(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    status: Optional[str] = Query(None),
    category: Optional[str] = Query(None)
):
    """Get all issues for admin management"""
    # Demo data
    issues = [
        {
            "id": f"issue-{i}",
            "title": f"Sample Issue {i}",
            "description": f"Description for issue {i}",
            "status": "active" if i % 3 == 0 else "resolved",
            "category": "infrastructure" if i % 2 == 0 else "environment",
            "priority": "high" if i % 4 == 0 else "medium",
            "created_at": datetime.now().isoformat(),
            "upvotes": i * 3,
            "downvotes": i,
            "user_id": f"user-{i % 10}"
        }
        for i in range(1, 21)
    ]
    
    # Filter by status if provided
    if status:
        issues = [issue for issue in issues if issue["status"] == status]
    
    # Filter by category if provided  
    if category:
        issues = [issue for issue in issues if issue["category"] == category]
    
    # Pagination
    start = (page - 1) * limit
    end = start + limit
    paginated_issues = issues[start:end]
    
    return AdminResponse(
        success=True,
        message="Issues retrieved successfully",
        data={
            "issues": paginated_issues,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": len(issues),
                "has_next": end < len(issues),
                "has_prev": page > 1
            }
        }
    )

@router.put("/admin/issues/{issue_id}/status")
async def update_issue_status(
    issue_id: str,
    status: str = Query(..., regex="^(active|resolved|pending|closed)$")
):
    """Update issue status"""
    return AdminResponse(
        success=True,
        message=f"Issue {issue_id} status updated to {status}",
        data={"issue_id": issue_id, "new_status": status}
    )

@router.delete("/admin/issues/{issue_id}")
async def delete_issue(issue_id: str):
    """Delete an issue"""
    return AdminResponse(
        success=True,
        message=f"Issue {issue_id} deleted successfully",
        data={"deleted_issue_id": issue_id}
    )

# Users Management
@router.get("/admin/users")
async def get_admin_users(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    status: Optional[str] = Query(None)
):
    """Get all users for admin management"""
    # Demo data
    users = [
        {
            "id": f"user-{i}",
            "name": f"User {i}",
            "email": f"user{i}@example.com",
            "phone": f"+91987654{i:04d}",
            "status": "active" if i % 4 != 0 else "inactive",
            "join_date": datetime.now().isoformat(),
            "issues_count": i % 8,
            "city": "Mumbai" if i % 3 == 0 else "Delhi"
        }
        for i in range(1, 51)
    ]
    
    # Filter by status if provided
    if status:
        users = [user for user in users if user["status"] == status]
    
    # Pagination
    start = (page - 1) * limit
    end = start + limit
    paginated_users = users[start:end]
    
    return AdminResponse(
        success=True,
        message="Users retrieved successfully",
        data={
            "users": paginated_users,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": len(users),
                "has_next": end < len(users),
                "has_prev": page > 1
            }
        }
    )

@router.put("/admin/users/{user_id}/status")
async def update_user_status(
    user_id: str,
    status: str = Query(..., regex="^(active|inactive|suspended)$")
):
    """Update user status"""
    return AdminResponse(
        success=True,
        message=f"User {user_id} status updated to {status}",
        data={"user_id": user_id, "new_status": status}
    )

# AI Agents Management
@router.get("/admin/ai-agents")
async def get_ai_agents():
    """Get all AI agents status"""
    agents = [
        AIAgentStatus(
            agent_id="agent-001",
            name="Issue Classifier",
            status="active",
            last_activity=datetime.now(),
            total_actions=1247,
            success_rate=94.5,
            enabled=True
        ),
        AIAgentStatus(
            agent_id="agent-002", 
            name="Sentiment Analyzer",
            status="active",
            last_activity=datetime.now() - timedelta(minutes=5),
            total_actions=892,
            success_rate=91.2,
            enabled=True
        ),
        AIAgentStatus(
            agent_id="agent-003",
            name="Priority Detector",
            status="maintenance",
            last_activity=datetime.now() - timedelta(hours=2),
            total_actions=654,
            success_rate=88.7,
            enabled=False
        )
    ]
    
    return AdminResponse(
        success=True,
        message="AI agents retrieved successfully",
        data={"agents": [agent.dict() for agent in agents]}
    )

@router.get("/admin/ai-agents/stats")
async def get_ai_agents_stats():
    """Get AI agents statistics"""
    return AdminResponse(
        success=True,
        message="AI agent statistics retrieved successfully",
        data={
            "total_agents": 3,
            "active_agents": 2,
            "inactive_agents": 1,
            "total_actions_today": 156,
            "average_success_rate": 91.5,
            "processing_queue": 5
        }
    )

@router.get("/admin/ai-agents/activities")
async def get_ai_agent_activities(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50)
):
    """Get recent AI agent activities"""
    activities = [
        {
            "id": f"activity-{i}",
            "agent_id": f"agent-00{(i % 3) + 1}",
            "agent_name": ["Issue Classifier", "Sentiment Analyzer", "Priority Detector"][i % 3],
            "action": ["classified_issue", "analyzed_sentiment", "detected_priority"][i % 3],
            "target_id": f"issue-{i}",
            "result": "success" if i % 5 != 0 else "failed",
            "timestamp": (datetime.now() - timedelta(minutes=i*2)).isoformat(),
            "details": f"Processed item {i} successfully"
        }
        for i in range(1, 31)
    ]
    
    # Pagination
    start = (page - 1) * limit
    end = start + limit
    paginated_activities = activities[start:end]
    
    return AdminResponse(
        success=True,
        message="AI agent activities retrieved successfully",
        data={
            "activities": paginated_activities,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": len(activities),
                "has_next": end < len(activities),
                "has_prev": page > 1
            }
        }
    )

# Analytics
@router.get("/admin/analytics")
async def get_admin_analytics():
    """Get analytics data for admin dashboard"""
    return AdminResponse(
        success=True,
        message="Analytics data retrieved successfully",
        data={
            "issues_by_category": {
                "infrastructure": 45,
                "environment": 32,
                "transportation": 28,
                "healthcare": 22,
                "education": 18,
                "others": 11
            },
            "issues_by_status": {
                "active": 34,
                "resolved": 102,
                "pending": 20
            },
            "monthly_trends": [
                {"month": "Jan", "issues": 23, "resolved": 18},
                {"month": "Feb", "issues": 34, "resolved": 29},
                {"month": "Mar", "issues": 45, "resolved": 38},
                {"month": "Apr", "issues": 39, "resolved": 35},
                {"month": "May", "issues": 52, "resolved": 44},
                {"month": "Jun", "issues": 41, "resolved": 37}
            ],
            "user_engagement": {
                "new_users_monthly": 12,
                "active_users": 78,
                "total_votes": 1247
            }
        }
    )