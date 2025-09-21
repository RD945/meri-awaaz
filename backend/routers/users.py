"""
User-related API endpoints
Updated to use Firestore database
"""
from fastapi import APIRouter, Depends, HTTPException, status
from typing import Dict, Any

from models.schemas import UserProfile, UserProfileUpdate, ApiResponse, UserStats
from core.auth import get_current_user
from core.firestore_db import (
    get_user, 
    create_user,
    update_user,
    get_user_statistics
)

router = APIRouter()

@router.get("/users/me", response_model=ApiResponse)
async def get_user_profile(
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> ApiResponse:
    """
    Get current user's profile
    """
    try:
        user_id = current_user["uid"]
        user_data = await get_user(user_id)
        
        if not user_data:
            # Create user profile if it doesn't exist
            default_user = {
                "id": user_id,
                "email": current_user.get("email", ""),
                "name": current_user.get("name", current_user.get("email", "").split("@")[0]),
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
            if created_user_id:
                user_data = await get_user(created_user_id)
            
            if not user_data:
                # Database is not available, return a minimal profile
                return ApiResponse(
                    success=True,
                    data={
                        "uid": user_id,
                        "name": current_user.get("name", "User"),
                        "email": current_user.get("email", ""),
                        "phoneNumber": current_user.get("phone", ""),
                        "phoneVerified": current_user.get("phone_verified", False),
                        "city": "",
                        "state": "",
                        "pincode": "",
                        "isVerified": current_user.get("email_verified", False),
                        "points": 0,
                        "badges": []
                    },
                    message="User profile retrieved from auth (database unavailable)"
                )
        
        # Add ID from auth if not present
        if user_data and "uid" not in user_data:
            user_data["uid"] = user_id
        
        return ApiResponse(
            success=True,
            data=user_data,
            message="User profile retrieved successfully"
        )
        
    except Exception as e:
        # Return minimal profile if there's an error
        return ApiResponse(
            success=True,
            data={
                "uid": current_user.get("uid", ""),
                "name": current_user.get("name", "User"),
                "email": current_user.get("email", ""),
                "phoneNumber": current_user.get("phone", ""),
                "phoneVerified": current_user.get("phone_verified", False),
                "city": "",
                "state": "",
                "pincode": "",
                "isVerified": current_user.get("email_verified", False),
                "points": 0,
                "badges": []
            },
            message=f"Profile retrieved with limited data: {str(e)}"
        )

@router.put("/users/me", response_model=ApiResponse)
async def update_user_profile(
    profile_update: UserProfileUpdate,
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> ApiResponse:
    """
    Update current user's profile
    """
    try:
        user_id = current_user["uid"]
        
        # Convert update data to dict, excluding None values
        update_data = {
            k: v for k, v in profile_update.dict().items() 
            if v is not None
        }
        
        success = await update_user(user_id, update_data)
        
        if success:
            # Get updated user data
            updated_user = await get_user(user_id)
            return ApiResponse(
                success=True,
                data=updated_user,
                message="Profile updated successfully"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to update profile"
            )
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update profile: {str(e)}"
        )

@router.get("/users/me/stats", response_model=ApiResponse)
async def get_user_stats(
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> ApiResponse:
    """
    Get current user's statistics
    """
    try:
        user_id = current_user["uid"]
        stats = await get_user_statistics(user_id)
        
        return ApiResponse(
            success=True,
            data=stats,
            message="User statistics retrieved successfully"
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve statistics: {str(e)}"
        )

@router.post("/users/create-profile", response_model=ApiResponse)
async def create_user_profile(
    current_user: Dict[str, Any] = Depends(get_current_user)
) -> ApiResponse:
    """
    Create user profile in Firestore after Firebase Auth signup
    """
    try:
        user_id = current_user["uid"]
        
        # Check if user already exists
        existing_user = await get_user(user_id)
        if existing_user:
            return ApiResponse(
                success=True,
                data=existing_user,
                message="User profile already exists"
            )
        
        # Create new user profile
        user_data = {
            "id": user_id,
            "email": current_user.get("email", ""),
            "name": current_user.get("name", current_user.get("email", "").split("@")[0]),
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
        
        created_user_id = await create_user(user_data)
        
        if created_user_id:
            # Get the created user to return
            new_user = await get_user(created_user_id)
            return ApiResponse(
                success=True,
                data=new_user,
                message="User profile created successfully"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create user profile"
            )
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create user profile: {str(e)}"
        )