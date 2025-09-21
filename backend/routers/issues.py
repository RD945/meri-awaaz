"""
Issue-related API endpoints with asynchronous AI processing
Updated to use Firestore database instead of PostgreSQL
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query, BackgroundTasks, UploadFile, File, Form
from typing import Dict, Any, Optional, List
import json
import uuid
import logging
from datetime import datetime

from models.schemas import (
    Issue, IssueCreate, IssueUpdate, ApiResponse, PaginatedResponse, 
    PaginationInfo, IssueCategory, IssuePriority, IssueStatus,
    FileUploadResponse
)
from core.auth import get_current_user, get_current_user_optional
from core.firestore_db import (
    get_user, create_issue, get_issue, get_issues, 
    get_nearby_issues, update_issue, vote_on_issue, get_user_vote,
    add_issue_update, get_issue_updates
)
from core.firebase_storage import get_storage_manager

# Import background tasks - make optional for development
try:
    from workers.tasks import process_new_issue
    BACKGROUND_TASKS_AVAILABLE = True
except ImportError:
    BACKGROUND_TASKS_AVAILABLE = False
    print("⚠️  Background tasks not available - will process synchronously")
    
    # Define a dummy function for when Celery is not available
    async def process_new_issue(issue_id: str):
        print(f"🔄 Would process issue {issue_id} in background (Celery not available)")
        return None

# Configure logging
logger = logging.getLogger(__name__)

# Status mapping for legacy compatibility
STATUS_MAPPING = {
    # Legacy status -> New status
    'pending': 'Submitted',
    'in-progress': 'In Progress', 
    'resolved': 'Resolved',
    'rejected': 'Resolved',  # Map rejected to resolved for now
    'open': 'Submitted',  # Legacy 'open' -> 'Submitted'
    # Current status (ensure they pass through)
    'Submitted': 'Submitted',
    'In Progress': 'In Progress',
    'Resolved': 'Resolved'
}

def normalize_status(status: str) -> str:
    """Convert legacy status values to current format"""
    return STATUS_MAPPING.get(status, 'Submitted')  # Default to Submitted if unknown

# Category mapping for legacy compatibility
CATEGORY_MAPPING = {
    # Legacy/alternative categories -> Current categories
    'infrastructure': 'Infrastructure',
    'public-works': 'Public Works',
    'public_works': 'Public Works',
    'sanitation': 'Sanitation',
    'electrical': 'Electrical',
    'general': 'General',
    'roads': 'Roads',
    'water': 'Water',
    'waste': 'Waste',
    # Current categories (ensure they pass through)
    'Sanitation': 'Sanitation',
    'Public Works': 'Public Works',
    'Electrical': 'Electrical',
    'General': 'General',
    'Infrastructure': 'Infrastructure',
    'Water': 'Water',
    'Roads': 'Roads',
    'Waste': 'Waste'
}

def normalize_category(category: str) -> str:
    """Convert legacy category values to current format"""
    return CATEGORY_MAPPING.get(category, 'General')  # Default to General if unknown

# Priority mapping for legacy compatibility
PRIORITY_MAPPING = {
    # Legacy priority -> Current priority
    'low': 'Low',
    'medium': 'Medium', 
    'high': 'High',
    'urgent': 'Critical',
    'critical': 'Critical',
    # Current priorities (ensure they pass through)
    'Low': 'Low',
    'Medium': 'Medium',
    'High': 'High',
    'Critical': 'Critical'
}

def normalize_priority(priority: str) -> str:
    """Convert legacy priority values to current format"""
    return PRIORITY_MAPPING.get(priority, 'Medium')  # Default to Medium if unknown

def safe_get_author_name(issue_data: dict) -> str:
    """Safely get author name, handling None values"""
    return issue_data.get("authorName") or "Unknown User"

router = APIRouter()

# Category and priority mapping functions
def map_category(category: str) -> IssueCategory:
    """Map frontend category to backend enum"""
    mapping = {
        'sanitation': IssueCategory.SANITATION,
        'infrastructure': IssueCategory.PUBLIC_WORKS,
        'electrical': IssueCategory.ELECTRICAL,
        'general': IssueCategory.GENERAL,
        'water': IssueCategory.PUBLIC_WORKS,
        'transport': IssueCategory.PUBLIC_WORKS,
        'safety': IssueCategory.GENERAL
    }
    return mapping.get(category.lower(), IssueCategory.GENERAL)

def map_priority(priority: str) -> IssuePriority:
    """Map frontend priority to backend enum"""
    mapping = {
        'low': IssuePriority.LOW,
        'medium': IssuePriority.MEDIUM,
        'high': IssuePriority.HIGH,
        'urgent': IssuePriority.CRITICAL
    }
    return mapping.get(priority.lower(), IssuePriority.MEDIUM)

@router.get("/issues", response_model=PaginatedResponse)
async def get_issues_route(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    category: Optional[str] = Query(None),
    issue_status: Optional[str] = Query(None, alias="status"),
    priority: Optional[str] = Query(None),
    current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional)
) -> PaginatedResponse:
    """
    Get paginated list of issues with optional filtering
    """
    print(f"🔍 GET /api/issues called with params:")
    print(f"  📄 page: {page}, limit: {limit}")
    print(f"  🏷️ category: {category}, status: {issue_status}, priority: {priority}")
    print(f"  👤 user: {current_user.get('uid') if current_user else 'anonymous'}")
    
    try:
        # Map frontend categories to backend categories
        mapped_category = None
        if category:
            mapped_category = map_category(category).value
            print(f"  🗂️ mapped category: {mapped_category}")
        
        mapped_priority = None
        if priority:
            mapped_priority = map_priority(priority).value
            print(f"  ⚡ mapped priority: {mapped_priority}")
        
        print(f"📋 Calling get_issues with filters:")
        print(f"  limit={limit * 3}, category={mapped_category}, status={issue_status}, priority={mapped_priority}")
        
        # Get issues from Firestore
        all_issues = await get_issues(
            limit=limit * 3,  # Get more to handle filtering and pagination
            category=mapped_category,
            status=issue_status,
            priority=mapped_priority
        )
        
        print(f"📊 Raw issues retrieved from Firestore: {len(all_issues)}")
        if all_issues:
            print(f"📝 First issue sample: {all_issues[0]}")
        else:
            print("⚠️ No issues found in Firestore!")
        
        # Convert Firestore format to API format
        issues = []
        print(f"🔄 Converting {len(all_issues)} issues from Firestore to API format...")
        for i, issue_data in enumerate(all_issues):
            try:
                print(f"  📋 Processing issue {i+1}/{len(all_issues)}: ID={issue_data.get('id', 'NO_ID')}")
                print(f"      Title: {issue_data.get('title', 'NO_TITLE')}")
                print(f"      Status: {issue_data.get('status', 'NO_STATUS')}")
                print(f"      Category: {issue_data.get('category', 'NO_CATEGORY')}")
                
                # Create location object
                location = {
                    "latitude": issue_data.get("latitude"),
                    "longitude": issue_data.get("longitude"),
                    "address": issue_data.get("address", "")
                }
                
                # Parse imageUrls
                image_urls = issue_data.get("imageUrls", [])
                if isinstance(image_urls, str):
                    try:
                        image_urls = json.loads(image_urls)
                    except:
                        image_urls = [image_urls] if image_urls else []
                
                # Handle createdAt safely
                created_at = issue_data.get("createdAt")
                if created_at:
                    if hasattr(created_at, 'isoformat'):
                        created_at_str = created_at.isoformat()
                    else:
                        created_at_str = str(created_at)
                else:
                    created_at_str = ""
                
                issue = Issue(
                    issueId=issue_data["id"],
                    authorId=issue_data.get("userId", ""),
                    authorName=safe_get_author_name(issue_data),
                    authorProfileImageUrl=issue_data.get("authorProfileImageUrl", ""),
                    title=issue_data["title"],
                    description=issue_data["description"],
                    aiSummary=issue_data.get("aiSummary", ""),
                    imageUrl=image_urls[0] if image_urls else "",
                    imageUrls=image_urls,
                    audioUrl=issue_data.get("audioUrl", ""),
                    location=location,
                    status=IssueStatus(normalize_status(issue_data.get("status", "Submitted"))),
                    category=IssueCategory(normalize_category(issue_data.get("category", "General"))),
                    priority=IssuePriority(normalize_priority(issue_data.get("priority", "Medium"))),
                    upvotes=issue_data.get("voteCount", 0),
                    createdAt=created_at_str
                )
                issues.append(issue.dict())
            except Exception as issue_error:
                print(f"❌ Error processing issue {issue_data.get('id', 'unknown')}: {issue_error}")
                continue
        
        # Handle pagination
        total = len(issues)
        start_idx = (page - 1) * limit
        end_idx = start_idx + limit
        paginated_issues = issues[start_idx:end_idx]
        
        # Calculate pagination info
        has_next = end_idx < total
        has_prev = page > 1
        
        pagination = PaginationInfo(
            page=page,
            limit=limit,
            total=total,
            hasNext=has_next,
            hasPrev=has_prev
        )
        
        return PaginatedResponse(
            success=True,
            data=paginated_issues,
            pagination=pagination,
            message="Issues retrieved successfully"
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve issues: {str(e)}"
        )

@router.get("/users/me/issues", response_model=PaginatedResponse)
async def get_user_issues(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    issue_status: Optional[str] = Query(None, alias="status"),
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> PaginatedResponse:
    """
    Get current user's issues
    """
    try:
        user_id = current_user["uid"]
        
        # Get user's issues from Firestore
        user_issues = await get_issues(
            limit=limit * 3,  # Get more to handle filtering and pagination
            user_id=user_id,
            status=issue_status
        )
        
        # Convert Firestore format to API format
        issues = []
        for issue_data in user_issues:
            try:
                # Create location object
                location = {
                    "latitude": issue_data.get("latitude"),
                    "longitude": issue_data.get("longitude"),
                    "address": issue_data.get("address", "")
                }
                
                # Parse imageUrls
                image_urls = issue_data.get("imageUrls", [])
                if isinstance(image_urls, str):
                    try:
                        image_urls = json.loads(image_urls)
                    except:
                        image_urls = [image_urls] if image_urls else []
                
                # Handle createdAt safely
                created_at = issue_data.get("createdAt")
                if created_at:
                    if hasattr(created_at, 'isoformat'):
                        created_at_str = created_at.isoformat()
                    else:
                        created_at_str = str(created_at)
                else:
                    created_at_str = ""
                
                issue = Issue(
                    issueId=issue_data["id"],
                    authorId=issue_data.get("userId", ""),
                    authorName=safe_get_author_name(issue_data),
                    authorProfileImageUrl=issue_data.get("authorProfileImageUrl", ""),
                    title=issue_data["title"],
                    description=issue_data["description"],
                    aiSummary=issue_data.get("aiSummary", ""),
                    imageUrl=image_urls[0] if image_urls else "",
                    imageUrls=image_urls,
                    audioUrl=issue_data.get("audioUrl", ""),
                    location=location,
                    status=IssueStatus(normalize_status(issue_data.get("status", "Submitted"))),
                    category=IssueCategory(normalize_category(issue_data.get("category", "General"))),
                    priority=IssuePriority(normalize_priority(issue_data.get("priority", "Medium"))),
                    upvotes=issue_data.get("voteCount", 0),
                    createdAt=created_at_str
                )
                issues.append(issue.dict())
            except Exception as issue_error:
                print(f"❌ Error processing issue {issue_data.get('id', 'unknown')}: {issue_error}")
                continue
        
        # Handle pagination
        total = len(issues)
        start_idx = (page - 1) * limit
        end_idx = start_idx + limit
        paginated_issues = issues[start_idx:end_idx]
        
        pagination = PaginationInfo(
            page=page,
            limit=limit,
            total=total,
            hasNext=end_idx < total,
            hasPrev=page > 1
        )
        
        return PaginatedResponse(
            success=True,
            data=paginated_issues,
            pagination=pagination,
            message="User issues retrieved successfully"
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve user issues: {str(e)}"
        )

@router.options("/issues")
async def options_issues():
    """Handle CORS preflight requests for issues endpoint"""
    return {}

@router.post("/issues", status_code=202, response_model=ApiResponse)
async def create_issue_route(
    background_tasks: BackgroundTasks,
    issue_data: IssueCreate,
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> ApiResponse:
    """
    Create new issue and trigger asynchronous AI processing
    Returns 202 Accepted for immediate response
    """
    print(f"🚀 POST /api/issues called with user: {current_user.get('uid', 'unknown')}")
    print(f"📝 Issue data received: {issue_data}")
    try:
        user_id = current_user["uid"]
        print(f"🔍 Getting user data for: {user_id}")
        
        # Get user data for author information
        user_data = await get_user(user_id)
        print(f"👤 User data retrieved: {user_data}")
        if not user_data:
            print("❌ User profile not found - creating new profile")
            # Try to create user profile if it doesn't exist
            try:
                from core.firestore_db import create_user
                default_user = {
                    "id": user_id,
                    "email": current_user.get("email", ""),
                    "name": current_user.get("name") or current_user.get("email", "").split("@")[0] or "Unknown User",
                    "phoneNumber": current_user.get("phone", ""),
                    "phoneVerified": current_user.get("phone_verified", False),
                    "city": "",
                    "state": "",
                    "pincode": "",
                    "isVerified": current_user.get("email_verified", False),
                    "points": 0,
                    "badges": [],
                    "profileImage": current_user.get("picture", ""),
                    "createdAt": current_user.get("created_at", ""),
                    "lastLogin": current_user.get("last_sign_in_time", "")
                }
                
                created_user_id = await create_user(default_user)
                print(f"✅ Created user profile with ID: {created_user_id}")
                
                if created_user_id:
                    user_data = await get_user(created_user_id)
                    print(f"✅ Retrieved newly created user: {user_data}")
                
            except Exception as create_error:
                print(f"❌ Failed to create user profile: {create_error}")
            
            if not user_data:
                print("❌ Still no user profile after creation attempt")
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="User profile not found and could not be created"
                )
        
        # Map category and priority
        print(f"🏷️ Mapping category: {issue_data.category}")
        category = map_category(issue_data.category)
        print(f"🏷️ Mapped category: {category}")
        
        print(f"⚡ Mapping priority: {issue_data.priority}")
        priority = map_priority(issue_data.priority)
        print(f"⚡ Mapped priority: {priority}")
        
        # Prepare issue data for Firestore
        firestore_issue_data = {
            "title": issue_data.title,
            "description": issue_data.description,
            "category": category.value,
            "priority": priority.value,
            "status": IssueStatus.SUBMITTED.value,
            "userId": user_id,
            "authorName": user_data.get("name") or "Unknown User",
            "authorProfileImageUrl": user_data.get("avatar") or user_data.get("profileImage"),
            "latitude": issue_data.location.latitude,
            "longitude": issue_data.location.longitude,
            "address": issue_data.location.address,
            "imageUrls": issue_data.imageUrls or [],
            "audioUrl": issue_data.audioUrl,
            "processingStatus": "processing"
        }
        print(f"💾 Prepared Firestore data: {firestore_issue_data}")
        
        # Create issue in Firestore
        print("📝 Creating issue in Firestore...")
        issue_id = await create_issue(firestore_issue_data)
        print(f"✅ Issue created with ID: {issue_id}")
        if not issue_id:
            print("❌ Failed to create issue - no ID returned")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create issue"
            )
        
        # Queue background AI processing task
        print("🔄 Scheduling background task...")
        try:
            # Try to use Celery task if available
            if hasattr(process_new_issue, 'delay'):
                background_tasks.add_task(lambda: process_new_issue.delay(issue_id))
                print("📋 Celery task scheduled")
            else:
                # Fallback to direct function call
                background_tasks.add_task(process_new_issue, issue_id)
                print("📋 Direct function task scheduled")
        except Exception as e:
            logger.warning(f"⚠️  Background task scheduling failed: {e}")
            print(f"⚠️  Background task scheduling failed: {e}")
            # Could implement immediate processing here if needed
        
        print("🎉 Returning success response")
        return ApiResponse(
            success=True,
            data={"issueId": issue_id, "status": "processing"},
            message="Issue submitted successfully and is being processed"
        )
        
    except HTTPException as he:
        print(f"❌ HTTP Exception: {he}")
        raise
    except Exception as e:
        print(f"❌ Unexpected Exception: {e}")
        print(f"❌ Exception type: {type(e)}")
        import traceback
        print(f"❌ Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create issue: {str(e)}"
        )

# Map endpoint MUST come before {issue_id} to avoid route conflicts
@router.get("/issues/map", response_model=ApiResponse)
async def get_issues_for_map(
    current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional)
) -> ApiResponse:
    """
    Get all issues with location data for map display
    """
    try:
        # Get all issues from Firestore
        issues = await get_issues()
        
        # Filter and format issues for map display
        map_issues = []
        for issue in issues:
            try:
                if issue.get("latitude") and issue.get("longitude"):
                    # Build location object
                    location = {
                        "latitude": float(issue["latitude"]),
                        "longitude": float(issue["longitude"]),
                        "address": issue.get("locationAddress", "")
                    }
                    
                    # Parse image URLs
                    image_urls = issue.get("imageUrls", [])
                    if isinstance(image_urls, str):
                        try:
                            image_urls = json.loads(image_urls)
                        except (json.JSONDecodeError, TypeError):
                            image_urls = []
                    
                    # Handle createdAt safely
                    created_at = issue.get("createdAt")
                    if created_at:
                        if hasattr(created_at, 'isoformat'):
                            created_at_str = created_at.isoformat()
                        else:
                            created_at_str = str(created_at)
                    else:
                        created_at_str = ""
                    
                    # Create Issue object using our schema
                    issue_obj = Issue(
                        issueId=issue["id"],
                        authorId=issue.get("authorId", ""),
                        authorName=safe_get_author_name(issue),
                        authorProfileImageUrl=issue.get("authorProfileImageUrl", ""),
                        title=issue.get("title", ""),
                        description=issue.get("description", ""),
                        aiSummary=issue.get("aiSummary", ""),
                        imageUrl=issue.get("imageUrl", ""),
                        imageUrls=image_urls,
                        audioUrl=issue.get("audioUrl", ""),
                        location=location,
                        status=IssueStatus(normalize_status(issue.get("status", "Submitted"))),
                        category=IssueCategory(normalize_category(issue.get("category", "General"))),
                        priority=IssuePriority(normalize_priority(issue.get("priority", "Medium"))),
                        upvotes=issue.get("voteCount", 0),
                        createdAt=created_at_str
                    )
                    map_issues.append(issue_obj.dict())
            except Exception as issue_error:
                print(f"❌ Error processing map issue {issue.get('id', 'unknown')}: {issue_error}")
                continue
        
        return ApiResponse(
            success=True,
            data={"issues": map_issues},
            message="Issues for map retrieved successfully"
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve issues for map: {str(e)}"
        )

@router.get("/issues/{issue_id}", response_model=ApiResponse)
async def get_issue_route(
    issue_id: str,
    current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional)
) -> ApiResponse:
    """
    Get single issue by ID
    """
    try:
        issue_data = await get_issue(issue_id)
        if not issue_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Issue not found"
            )
        
        # Create location object
        location = {
            "latitude": issue_data.get("latitude"),
            "longitude": issue_data.get("longitude"),
            "address": issue_data.get("address", "")
        }
        
        # Parse imageUrls
        image_urls = issue_data.get("imageUrls", [])
        if isinstance(image_urls, str):
            try:
                image_urls = json.loads(image_urls)
            except:
                image_urls = [image_urls] if image_urls else []
        
        # Handle createdAt safely
        created_at = issue_data.get("createdAt")
        if created_at:
            if hasattr(created_at, 'isoformat'):
                created_at_str = created_at.isoformat()
            else:
                created_at_str = str(created_at)
        else:
            created_at_str = ""
        
        issue = Issue(
            issueId=issue_data["id"],
            authorId=issue_data.get("userId", ""),
            authorName=safe_get_author_name(issue_data),
            authorProfileImageUrl=issue_data.get("authorProfileImageUrl", ""),
            title=issue_data["title"],
            description=issue_data["description"],
            aiSummary=issue_data.get("aiSummary", ""),
            imageUrl=image_urls[0] if image_urls else "",
            imageUrls=image_urls,
            audioUrl=issue_data.get("audioUrl", ""),
            location=location,
            status=IssueStatus(normalize_status(issue_data.get("status", "Submitted"))),
            category=IssueCategory(normalize_category(issue_data.get("category", "General"))),
            priority=IssuePriority(normalize_priority(issue_data.get("priority", "Medium"))),
            upvotes=issue_data.get("voteCount", 0),
            createdAt=created_at_str
        )
        
        return ApiResponse(
            success=True,
            data=issue.dict(),
            message="Issue retrieved successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve issue: {str(e)}"
        )

@router.post("/issues/{issue_id}/upvote", response_model=ApiResponse)
async def upvote_issue(
    issue_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> ApiResponse:
    """
    Upvote an issue (toggle functionality)
    """
    try:
        user_id = current_user["uid"]
        
        # Check current user's vote
        current_vote = await get_user_vote(issue_id, user_id)
        
        if current_vote == "upvote":
            # User already upvoted, remove the vote
            success = await vote_on_issue(issue_id, user_id, "remove")
            if not success:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to remove vote"
                )
            message = "Upvote removed"
        elif current_vote == "downvote":
            # Change from downvote to upvote
            success = await vote_on_issue(issue_id, user_id, "upvote")
            if not success:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to update vote"
                )
            message = "Changed to upvote"
        else:
            # Add new upvote
            success = await vote_on_issue(issue_id, user_id, "upvote")
            if not success:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to add upvote"
                )
            message = "Issue upvoted"
        
        # Get updated issue to return current vote count
        updated_issue = await get_issue(issue_id)
        upvotes = updated_issue.get("voteCount", 0) if updated_issue else 0
        new_user_vote = await get_user_vote(issue_id, user_id)
        
        return ApiResponse(
            success=True,
            data={
                "upvotes": upvotes,
                "userVote": new_user_vote
            },
            message=message
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upvote issue: {str(e)}"
        )

@router.post("/issues/{issue_id}/downvote", response_model=ApiResponse)
async def downvote_issue(
    issue_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> ApiResponse:
    """
    Downvote an issue (toggle functionality)
    """
    try:
        user_id = current_user["uid"]
        
        # Check current user's vote
        current_vote = await get_user_vote(issue_id, user_id)
        
        if current_vote == "downvote":
            # User already downvoted, remove the vote
            success = await vote_on_issue(issue_id, user_id, "remove")
            if not success:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to remove vote"
                )
            message = "Downvote removed"
        elif current_vote == "upvote":
            # Change from upvote to downvote
            success = await vote_on_issue(issue_id, user_id, "downvote")
            if not success:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to update vote"
                )
            message = "Changed to downvote"
        else:
            # Add new downvote
            success = await vote_on_issue(issue_id, user_id, "downvote")
            if not success:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to add downvote"
                )
            message = "Issue downvoted"
        
        # Get updated issue to return current vote count
        updated_issue = await get_issue(issue_id)
        upvotes = updated_issue.get("voteCount", 0) if updated_issue else 0
        new_user_vote = await get_user_vote(issue_id, user_id)
        
        return ApiResponse(
            success=True,
            data={
                "upvotes": upvotes,
                "userVote": new_user_vote
            },
            message=message
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to downvote issue: {str(e)}"
        )

# File upload endpoints
@router.post("/files/upload", response_model=ApiResponse)
async def upload_image(
    image: UploadFile = File(...),
    current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional)
):
    """
    Upload image file (placeholder implementation)
    """
    try:
        # Placeholder implementation - would integrate with Firebase Storage
        # For now, return a mock URL
        image_url = f"https://storage.googleapis.com/meri-awaaz/{uuid.uuid4()}.jpg"
        
        return ApiResponse(
            success=True,
            data={"imageUrl": image_url},
            message="Image uploaded successfully"
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload image: {str(e)}"
        )

@router.post("/files/upload-audio", response_model=ApiResponse)
async def upload_audio(
    audio: UploadFile = File(...),
    current_user: Optional[Dict[str, Any]] = Depends(get_current_user_optional)
):
    """
    Upload audio file (placeholder implementation)
    """
    try:
        # Placeholder implementation - would integrate with Firebase Storage
        audio_url = f"https://storage.googleapis.com/meri-awaaz/{uuid.uuid4()}.webm"
        
        return ApiResponse(
            success=True,
            data={"audioUrl": audio_url},
            message="Audio uploaded successfully"
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload audio: {str(e)}"
        )
