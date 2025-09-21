"""
AI Agents Router - Administrative endpoints for AI agent management
Handles AI agent status, activities, configuration, and monitoring
"""
from fastapi import APIRouter, HTTPException, Depends, Query, status
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import json
import asyncio
from pydantic import BaseModel

from models.schemas import ApiResponse
from core.auth import verify_admin_token, DEMO_ADMIN_CREDENTIALS

router = APIRouter()

# AI Agent Models
class AIAgentStatus(BaseModel):
    agent_id: str
    name: str
    status: str  # active, inactive, error, maintenance
    last_activity: datetime
    total_actions: int
    success_rate: float
    enabled: bool

class AIAgentActivity(BaseModel):
    id: str
    agent_id: str
    agent_name: str
    action: str
    target_id: Optional[str] = None
    details: str
    confidence: float
    timestamp: datetime
    status: str  # success, failed, pending

class AIAgentConfig(BaseModel):
    agent_id: str
    config: Dict[str, Any]
    enabled: bool
    priority: int

class AIAgentStats(BaseModel):
    total_agents: int
    active_agents: int
    total_actions_today: int
    average_confidence: float
    success_rate: float
    issues_processed: int
    categories_classified: int
    duplicates_detected: int

# Mock AI agent data for development
MOCK_AI_AGENTS = [
    {
        "agent_id": "classification-agent",
        "name": "Classification Agent",
        "status": "active",
        "last_activity": datetime.now() - timedelta(minutes=2),
        "total_actions": 1247,
        "success_rate": 94.5,
        "enabled": True
    },
    {
        "agent_id": "priority-scoring-agent", 
        "name": "Priority Scoring Agent",
        "status": "active",
        "last_activity": datetime.now() - timedelta(minutes=1),
        "total_actions": 1189,
        "success_rate": 96.2,
        "enabled": True
    },
    {
        "agent_id": "sentiment-analysis-agent",
        "name": "Sentiment Analysis Agent", 
        "status": "active",
        "last_activity": datetime.now() - timedelta(minutes=3),
        "total_actions": 1334,
        "success_rate": 89.3,
        "enabled": True
    },
    {
        "agent_id": "duplicate-detection-agent",
        "name": "Duplicate Detection Agent",
        "status": "active", 
        "last_activity": datetime.now() - timedelta(minutes=15),
        "total_actions": 456,
        "success_rate": 92.1,
        "enabled": True
    },
    {
        "agent_id": "location-validation-agent",
        "name": "Location Validation Agent",
        "status": "inactive",
        "last_activity": datetime.now() - timedelta(hours=2),
        "total_actions": 234,
        "success_rate": 87.8,
        "enabled": False
    }
]

MOCK_AI_ACTIVITIES = [
    {
        "id": "act-001",
        "agent_id": "classification-agent",
        "agent_name": "Classification Agent",
        "action": "Categorized issue as 'Infrastructure'",
        "target_id": "issue-123",
        "details": "Street light repair request in Sector 12",
        "confidence": 94.5,
        "timestamp": datetime.now() - timedelta(minutes=2),
        "status": "success"
    },
    {
        "id": "act-002", 
        "agent_id": "priority-scoring-agent",
        "agent_name": "Priority Scoring Agent",
        "action": "Assigned priority score: High (8.7/10)",
        "target_id": "issue-124",
        "details": "Water main break affecting 200+ households",
        "confidence": 96.2,
        "timestamp": datetime.now() - timedelta(minutes=3),
        "status": "success"
    },
    {
        "id": "act-003",
        "agent_id": "sentiment-analysis-agent", 
        "agent_name": "Sentiment Analysis Agent",
        "action": "Detected negative sentiment (concern)",
        "target_id": "issue-125",
        "details": "Citizen expressing frustration about delayed response",
        "confidence": 89.3,
        "timestamp": datetime.now() - timedelta(minutes=5),
        "status": "success"
    },
    {
        "id": "act-004",
        "agent_id": "duplicate-detection-agent",
        "agent_name": "Duplicate Detection Agent", 
        "action": "Flagged potential duplicate",
        "target_id": "issue-126",
        "details": "Similar issue reported 2 blocks away yesterday",
        "confidence": 92.1,
        "timestamp": datetime.now() - timedelta(minutes=15),
        "status": "success"
    },
    {
        "id": "act-005",
        "agent_id": "classification-agent",
        "agent_name": "Classification Agent",
        "action": "Failed to classify issue",
        "target_id": "issue-127", 
        "details": "Insufficient data in issue description",
        "confidence": 32.1,
        "timestamp": datetime.now() - timedelta(minutes=25),
        "status": "failed"
    }
]

@router.get("/admin/ai-agents", response_model=ApiResponse)
async def get_ai_agents(
    admin_user=Depends(verify_admin_token)
):
    """Get all AI agents with their current status"""
    try:
        # Convert datetime objects to ISO format strings for JSON serialization
        agents_data = []
        for agent in MOCK_AI_AGENTS:
            agent_copy = agent.copy()
            agent_copy["last_activity"] = agent_copy["last_activity"].isoformat()
            agents_data.append(agent_copy)
            
        return ApiResponse(
            success=True,
            message="AI agents retrieved successfully",
            data=agents_data
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve AI agents: {str(e)}")

@router.get("/admin/ai-agents/activities", response_model=ApiResponse)
async def get_ai_agent_activities(
    limit: int = Query(20, description="Number of activities to retrieve"),
    agent_id: Optional[str] = Query(None, description="Filter by specific agent ID"),
    admin_user=Depends(verify_admin_token)
):
    """Get recent AI agent activities"""
    try:
        activities = MOCK_AI_ACTIVITIES.copy()
        
        # Filter by agent_id if provided
        if agent_id:
            activities = [a for a in activities if a["agent_id"] == agent_id]
        
        # Limit results
        activities = activities[:limit]
        
        # Convert datetime objects to ISO format strings
        activities_data = []
        for activity in activities:
            activity_copy = activity.copy()
            activity_copy["timestamp"] = activity_copy["timestamp"].isoformat()
            activities_data.append(activity_copy)
        
        return ApiResponse(
            success=True,
            message="AI agent activities retrieved successfully",
            data=activities_data
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve AI activities: {str(e)}")

@router.get("/admin/ai-agents/stats", response_model=ApiResponse)
async def get_ai_agent_stats(
    admin_user=Depends(verify_admin_token)
):
    """Get comprehensive AI agent statistics"""
    try:
        active_agents = len([a for a in MOCK_AI_AGENTS if a["status"] == "active"])
        today_activities = len([a for a in MOCK_AI_ACTIVITIES if a["timestamp"].date() == datetime.now().date()])
        avg_confidence = sum(a["confidence"] for a in MOCK_AI_ACTIVITIES) / len(MOCK_AI_ACTIVITIES)
        success_rate = len([a for a in MOCK_AI_ACTIVITIES if a["status"] == "success"]) / len(MOCK_AI_ACTIVITIES) * 100
        
        stats = {
            "total_agents": len(MOCK_AI_AGENTS),
            "active_agents": active_agents,
            "total_actions_today": today_activities,
            "average_confidence": round(avg_confidence, 2),
            "success_rate": round(success_rate, 2),
            "issues_processed": 1247,
            "categories_classified": 834,
            "duplicates_detected": 23
        }
        
        return ApiResponse(
            success=True,
            message="AI agent statistics retrieved successfully",
            data=stats
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve AI stats: {str(e)}")

@router.put("/admin/ai-agents/{agent_id}/toggle", response_model=ApiResponse)
async def toggle_ai_agent(
    agent_id: str,
    enabled: bool,
    admin_user=Depends(verify_admin_token)
):
    """Enable or disable an AI agent"""
    try:
        # Find the agent
        agent = next((a for a in MOCK_AI_AGENTS if a["agent_id"] == agent_id), None)
        if not agent:
            raise HTTPException(status_code=404, detail="AI agent not found")
        
        # Update the agent status
        agent["enabled"] = enabled
        agent["status"] = "active" if enabled else "inactive"
        agent["last_activity"] = datetime.now()
        
        return ApiResponse(
            success=True,
            message=f"AI agent {'enabled' if enabled else 'disabled'} successfully",
            data={"agent_id": agent_id, "enabled": enabled}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to toggle AI agent: {str(e)}")

@router.post("/admin/ai-agents/{agent_id}/restart", response_model=ApiResponse)
async def restart_ai_agent(
    agent_id: str,
    admin_user=Depends(verify_admin_token)
):
    """Restart an AI agent"""
    try:
        # Find the agent
        agent = next((a for a in MOCK_AI_AGENTS if a["agent_id"] == agent_id), None)
        if not agent:
            raise HTTPException(status_code=404, detail="AI agent not found")
        
        # Simulate restart process
        agent["status"] = "maintenance"
        await asyncio.sleep(0.1)  # Simulate restart time
        agent["status"] = "active" if agent["enabled"] else "inactive"
        agent["last_activity"] = datetime.now()
        
        # Add restart activity
        restart_activity = {
            "id": f"restart-{datetime.now().timestamp()}",
            "agent_id": agent_id,
            "agent_name": agent["name"],
            "action": "Agent restarted",
            "target_id": None,
            "details": f"Manual restart initiated by admin",
            "confidence": 100.0,
            "timestamp": datetime.now(),
            "status": "success"
        }
        MOCK_AI_ACTIVITIES.insert(0, restart_activity)
        
        return ApiResponse(
            success=True,
            message="AI agent restarted successfully",
            data={"agent_id": agent_id, "status": agent["status"]}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to restart AI agent: {str(e)}")

@router.get("/admin/ai-agents/{agent_id}/config", response_model=ApiResponse)
async def get_ai_agent_config(
    agent_id: str,
    admin_user=Depends(verify_admin_token)
):
    """Get AI agent configuration"""
    try:
        # Find the agent
        agent = next((a for a in MOCK_AI_AGENTS if a["agent_id"] == agent_id), None)
        if not agent:
            raise HTTPException(status_code=404, detail="AI agent not found")
        
        # Mock configuration based on agent type
        configs = {
            "classification-agent": {
                "confidence_threshold": 0.85,
                "categories": ["Infrastructure", "Sanitation", "Transportation", "Utilities", "Safety", "Environment"],
                "max_retries": 3,
                "timeout_seconds": 30
            },
            "priority-scoring-agent": {
                "scoring_model": "weighted_factors",
                "factors": {
                    "urgency": 0.4,
                    "impact": 0.3,
                    "location": 0.2,
                    "sentiment": 0.1
                },
                "score_range": [1, 10]
            },
            "sentiment-analysis-agent": {
                "model": "bert-sentiment-v2",
                "confidence_threshold": 0.7,
                "sentiment_categories": ["positive", "neutral", "negative", "urgent", "frustrated"]
            },
            "duplicate-detection-agent": {
                "similarity_threshold": 0.85,
                "location_radius_km": 1.0,
                "time_window_hours": 72,
                "text_similarity_weight": 0.6,
                "location_similarity_weight": 0.4
            }
        }
        
        config = configs.get(agent_id, {"message": "No specific configuration available"})
        
        return ApiResponse(
            success=True,
            message="AI agent configuration retrieved successfully",
            data={
                "agent_id": agent_id,
                "config": config,
                "enabled": agent["enabled"],
                "priority": 1
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve AI agent config: {str(e)}")

@router.put("/admin/ai-agents/{agent_id}/config", response_model=ApiResponse)
async def update_ai_agent_config(
    agent_id: str,
    config: Dict[str, Any],
    admin_user=Depends(verify_admin_token)
):
    """Update AI agent configuration"""
    try:
        # Find the agent
        agent = next((a for a in MOCK_AI_AGENTS if a["agent_id"] == agent_id), None)
        if not agent:
            raise HTTPException(status_code=404, detail="AI agent not found")
        
        # In a real implementation, this would validate and update the agent's configuration
        # For now, we'll just simulate the update
        
        # Add configuration update activity
        config_activity = {
            "id": f"config-{datetime.now().timestamp()}",
            "agent_id": agent_id,
            "agent_name": agent["name"],
            "action": "Configuration updated",
            "target_id": None,
            "details": f"Configuration modified by admin: {list(config.keys())}",
            "confidence": 100.0,
            "timestamp": datetime.now(),
            "status": "success"
        }
        MOCK_AI_ACTIVITIES.insert(0, config_activity)
        
        return ApiResponse(
            success=True,
            message="AI agent configuration updated successfully",
            data={"agent_id": agent_id, "updated_config": config}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update AI agent config: {str(e)}")

@router.post("/admin/ai-agents/process-issue", response_model=ApiResponse)
async def process_issue_with_ai(
    issue_id: str,
    force_reprocess: bool = False,
    admin_user=Depends(verify_admin_token)
):
    """Manually trigger AI processing for a specific issue"""
    try:
        # Simulate AI processing
        processing_steps = [
            ("classification-agent", "Analyzing issue category", 92.5),
            ("priority-scoring-agent", "Calculating priority score", 88.3),
            ("sentiment-analysis-agent", "Analyzing sentiment", 94.1),
            ("duplicate-detection-agent", "Checking for duplicates", 96.7)
        ]
        
        results = []
        for agent_id, action, confidence in processing_steps:
            # Add processing activity
            activity = {
                "id": f"proc-{datetime.now().timestamp()}-{agent_id}",
                "agent_id": agent_id,
                "agent_name": next(a["name"] for a in MOCK_AI_AGENTS if a["agent_id"] == agent_id),
                "action": action,
                "target_id": issue_id,
                "details": f"Manual processing triggered for issue {issue_id}",
                "confidence": confidence,
                "timestamp": datetime.now(),
                "status": "success"
            }
            MOCK_AI_ACTIVITIES.insert(0, activity)
            results.append({
                "agent": agent_id,
                "action": action,
                "confidence": confidence,
                "status": "completed"
            })
            
            # Small delay to simulate processing time
            await asyncio.sleep(0.05)
        
        return ApiResponse(
            success=True,
            message=f"Issue {issue_id} processed by AI agents successfully",
            data={
                "issue_id": issue_id,
                "processing_results": results,
                "total_agents": len(results)
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process issue with AI: {str(e)}")

@router.get("/admin/analytics", response_model=ApiResponse)
async def get_analytics_data(
    range: str = Query("30", description="Date range in days"),
    admin_user=Depends(verify_admin_token)
):
    """Get analytics data for the analytics dashboard"""
    try:
        # Mock analytics data that matches the frontend structure
        analytics_data = {
            "issuesByCategory": [
                {"name": "Infrastructure", "count": 456, "color": "#8884d8"},
                {"name": "Sanitation", "count": 342, "color": "#82ca9d"},
                {"name": "Transportation", "count": 234, "color": "#ffc658"},
                {"name": "Utilities", "count": 189, "color": "#ff7c7c"},
                {"name": "Safety", "count": 123, "color": "#8dd1e1"},
                {"name": "Environment", "count": 98, "color": "#d084d0"}
            ],
            "issuesTrend": [
                {"date": "2024-01-01", "new": 45, "resolved": 32, "total": 234},
                {"date": "2024-01-02", "new": 52, "resolved": 38, "total": 248},
                {"date": "2024-01-03", "new": 38, "resolved": 45, "total": 241},
                {"date": "2024-01-04", "new": 61, "resolved": 42, "total": 260},
                {"date": "2024-01-05", "new": 55, "resolved": 48, "total": 267},
                {"date": "2024-01-06", "new": 49, "resolved": 52, "total": 264},
                {"date": "2024-01-07", "new": 67, "resolved": 43, "total": 288}
            ],
            "userActivity": [
                {"date": "2024-01-01", "active": 1234, "new": 23},
                {"date": "2024-01-02", "active": 1267, "new": 34},
                {"date": "2024-01-03", "active": 1298, "new": 31},
                {"date": "2024-01-04", "active": 1345, "new": 47},
                {"date": "2024-01-05", "active": 1389, "new": 44},
                {"date": "2024-01-06", "active": 1412, "new": 23},
                {"date": "2024-01-07", "active": 1456, "new": 44}
            ],
            "priorityDistribution": [
                {"name": "High", "value": 25, "color": "#ff4444"},
                {"name": "Medium", "value": 45, "color": "#ffaa44"},
                {"name": "Low", "value": 30, "color": "#44ff44"}
            ],
            "responseTime": [
                {"category": "Infrastructure", "avgHours": 24},
                {"category": "Sanitation", "avgHours": 18},
                {"category": "Transportation", "avgHours": 36},
                {"category": "Utilities", "avgHours": 12},
                {"category": "Safety", "avgHours": 6},
                {"category": "Environment", "avgHours": 48}
            ],
            "resolutionRate": [
                {"month": "Jan", "rate": 78},
                {"month": "Feb", "rate": 82},
                {"month": "Mar", "rate": 85},
                {"month": "Apr", "rate": 89},
                {"month": "May", "rate": 92},
                {"month": "Jun", "rate": 88}
            ]
        }
        
        return ApiResponse(
            success=True,
            message="Analytics data retrieved successfully",
            data=analytics_data
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve analytics: {str(e)}")

# Additional admin endpoints for the dashboard

@router.get("/admin/stats", response_model=ApiResponse)
async def get_admin_stats(
    admin_user=Depends(verify_admin_token)
):
    """Get admin dashboard statistics"""
    try:
        stats = {
            "totalIssues": 1234,
            "activeUsers": 8456,
            "resolvedIssues": 892,
            "pendingIssues": 342,
            "issueChangePercent": "+12%",
            "userChangePercent": "+8%",
            "resolvedChangePercent": "+15%",
            "pendingChangePercent": "-5%"
        }
        
        return ApiResponse(
            success=True,
            message="Admin statistics retrieved successfully", 
            data=stats
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve admin stats: {str(e)}")

@router.get("/admin/issues", response_model=ApiResponse)
async def get_admin_issues(
    page: int = Query(1, description="Page number"),
    limit: int = Query(10, description="Items per page"),
    filter: Optional[str] = Query(None, description="Search filter"),
    admin_user=Depends(verify_admin_token)
):
    """Get issues for admin management"""
    try:
        # Mock issues data for admin
        mock_issues = [
            {
                "id": "1",
                "title": "Broken streetlight on Main Road",
                "description": "Multiple streetlights are not working, making the area unsafe at night.",
                "category": "Infrastructure",
                "status": "New",
                "priority": "High",
                "location": "Main Road, Sector 12",
                "submittedBy": "Rahul Kumar",
                "submittedAt": "2024-01-07T10:30:00Z",
                "upvotes": 23,
                "images": 3,
                "aiSentiment": "Concerned",
                "aiPriority": 8.7
            },
            {
                "id": "2", 
                "title": "Water leakage in Central Park",
                "description": "Large water leak near the main entrance causing flooding.",
                "category": "Utilities",
                "status": "In Progress",
                "priority": "Medium",
                "location": "Central Park, Sector 8",
                "submittedBy": "Priya Sharma",
                "submittedAt": "2024-01-07T08:15:00Z",
                "upvotes": 15,
                "images": 2,
                "aiSentiment": "Urgent",
                "aiPriority": 7.2
            },
            {
                "id": "3",
                "title": "Garbage collection missed",
                "description": "Garbage has not been collected for 3 days in residential area.",
                "category": "Sanitation", 
                "status": "Resolved",
                "priority": "Low",
                "location": "Residential Area, Sector 15",
                "submittedBy": "Amit Singh",
                "submittedAt": "2024-01-07T06:45:00Z",
                "upvotes": 8,
                "images": 1,
                "aiSentiment": "Frustrated",
                "aiPriority": 4.5
            }
        ]
        
        # Apply filter if provided
        if filter:
            mock_issues = [issue for issue in mock_issues if 
                          filter.lower() in issue["title"].lower() or 
                          filter.lower() in issue["description"].lower()]
        
        # Pagination
        start_idx = (page - 1) * limit
        end_idx = start_idx + limit
        paginated_issues = mock_issues[start_idx:end_idx]
        
        return ApiResponse(
            success=True,
            message="Issues retrieved successfully",
            data={
                "issues": paginated_issues,
                "total": len(mock_issues),
                "page": page,
                "limit": limit
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve issues: {str(e)}")

@router.put("/admin/issues/{issue_id}/status", response_model=ApiResponse)
async def update_issue_status(
    issue_id: str,
    status: str,
    admin_user=Depends(verify_admin_token)
):
    """Update issue status"""
    try:
        # In a real implementation, this would update the database
        return ApiResponse(
            success=True,
            message="Issue status updated successfully",
            data={"issue_id": issue_id, "new_status": status}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update issue status: {str(e)}")

@router.delete("/admin/issues/{issue_id}", response_model=ApiResponse)
async def delete_issue(
    issue_id: str,
    admin_user=Depends(verify_admin_token)
):
    """Delete an issue"""
    try:
        # In a real implementation, this would delete from the database
        return ApiResponse(
            success=True,
            message="Issue deleted successfully",
            data={"issue_id": issue_id}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete issue: {str(e)}")

@router.get("/admin/users", response_model=ApiResponse)
async def get_admin_users(
    page: int = Query(1, description="Page number"),
    limit: int = Query(10, description="Items per page"),
    admin_user=Depends(verify_admin_token)
):
    """Get users for admin management"""
    try:
        # Mock users data
        mock_users = [
            {
                "id": "user-1",
                "phone": "+91-9876543210",
                "fullName": "Rahul Kumar",
                "email": "rahul.kumar@email.com",
                "joinedAt": "2024-01-01T10:00:00Z",
                "issuesReported": 12,
                "lastActive": "2024-01-07T09:30:00Z",
                "status": "active"
            },
            {
                "id": "user-2",
                "phone": "+91-9876543211", 
                "fullName": "Priya Sharma",
                "email": "priya.sharma@email.com",
                "joinedAt": "2024-01-02T14:30:00Z",
                "issuesReported": 8,
                "lastActive": "2024-01-07T08:15:00Z",
                "status": "active"
            },
            {
                "id": "user-3",
                "phone": "+91-9876543212",
                "fullName": "Amit Singh", 
                "email": "amit.singh@email.com",
                "joinedAt": "2024-01-03T16:45:00Z",
                "issuesReported": 15,
                "lastActive": "2024-01-06T18:20:00Z",
                "status": "inactive"
            }
        ]
        
        # Pagination
        start_idx = (page - 1) * limit
        end_idx = start_idx + limit
        paginated_users = mock_users[start_idx:end_idx]
        
        return ApiResponse(
            success=True,
            message="Users retrieved successfully",
            data={
                "users": paginated_users,
                "total": len(mock_users),
                "page": page,
                "limit": limit
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve users: {str(e)}")

@router.put("/admin/users/{user_id}/status", response_model=ApiResponse)
async def update_user_status(
    user_id: str,
    status: str,
    admin_user=Depends(verify_admin_token)
):
    """Update user status"""
    try:
        # In a real implementation, this would update the database
        return ApiResponse(
            success=True,
            message="User status updated successfully",
            data={"user_id": user_id, "new_status": status}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update user status: {str(e)}")

@router.post("/admin/auth/login", response_model=ApiResponse)
async def admin_login(
    email: str,
    password: str
):
    """Admin login endpoint for demo credentials"""
    try:
        # Check demo credentials
        if email in DEMO_ADMIN_CREDENTIALS and DEMO_ADMIN_CREDENTIALS[email] == password:
            # Generate a simple demo token
            demo_token = f"demo-{email.replace('@', '-').replace('.', '-')}"
            
            return ApiResponse(
                success=True,
                message="Admin login successful",
                data={
                    "token": demo_token,
                    "user": {
                        "email": email,
                        "name": "Demo Admin",
                        "role": "admin"
                    }
                }
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid admin credentials"
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")

@router.post("/admin/auth/logout", response_model=ApiResponse)
async def admin_logout(
    admin_user=Depends(verify_admin_token)
):
    """Admin logout endpoint"""
    try:
        return ApiResponse(
            success=True,
            message="Admin logout successful",
            data={"success": True}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Logout failed: {str(e)}")
