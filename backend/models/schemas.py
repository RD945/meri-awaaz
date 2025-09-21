"""
Pydantic models mirroring the TypeScript interfaces
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

# Enums matching TypeScript types
class IssueStatus(str, Enum):
    SUBMITTED = "Submitted"
    IN_PROGRESS = "In Progress" 
    RESOLVED = "Resolved"

class IssueCategory(str, Enum):
    SANITATION = "Sanitation"
    PUBLIC_WORKS = "Public Works"
    ELECTRICAL = "Electrical"
    GENERAL = "General"
    INFRASTRUCTURE = "Infrastructure"  # Add Infrastructure
    WATER = "Water"  # Common category
    ROADS = "Roads"  # Common category
    WASTE = "Waste"  # Common category

class IssuePriority(str, Enum):
    CRITICAL = "Critical"
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"

# Location schema
class Location(BaseModel):
    latitude: float
    longitude: float
    address: Optional[str] = None

# User Profile schema - exact match to TypeScript interface
class UserProfile(BaseModel):
    userId: str
    name: str
    email: str
    phone: str
    avatar: Optional[str] = None
    aadhaarNumber: Optional[str] = None
    address: Optional[str] = None
    city: str
    state: str
    pincode: str
    occupation: Optional[str] = None
    dateOfBirth: Optional[str] = None
    joinedDate: str
    phoneVerified: bool
    points: int = 0
    badges: List[str] = []

class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    avatar: Optional[str] = None
    aadhaarNumber: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    occupation: Optional[str] = None
    dateOfBirth: Optional[str] = None

# Issue schema - exact match to TypeScript interface
class Issue(BaseModel):
    issueId: str
    authorId: str
    authorName: str  # Denormalized for easy display
    authorProfileImageUrl: Optional[str] = None
    title: str
    description: str
    aiSummary: Optional[str] = None
    imageUrl: str
    imageUrls: Optional[List[str]] = []
    audioUrl: Optional[str] = None
    location: Location
    status: IssueStatus = IssueStatus.SUBMITTED
    category: IssueCategory
    priority: IssuePriority
    upvotes: int = 0
    createdAt: str  # ISO 8601 date string

class IssueCreate(BaseModel):
    title: str
    description: str
    category: str  # Will be mapped to IssueCategory
    priority: str  # Will be mapped to IssuePriority
    imageUrls: Optional[List[str]] = []
    audioUrl: Optional[str] = None
    location: Location

class IssueUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    aiSummary: Optional[str] = None
    status: Optional[IssueStatus] = None
    category: Optional[IssueCategory] = None
    priority: Optional[IssuePriority] = None

# Response schemas
class ApiResponse(BaseModel):
    success: bool
    data: Optional[dict] = None
    message: Optional[str] = None

class PaginationInfo(BaseModel):
    page: int
    limit: int
    total: int
    hasNext: bool
    hasPrev: bool

class PaginatedResponse(BaseModel):
    success: bool
    data: List[dict]
    pagination: PaginationInfo
    message: Optional[str] = None

# User stats schema
class UserStats(BaseModel):
    issuesReported: int
    issuesResolved: int
    totalVotes: int
    communityRank: int

# File upload response
class FileUploadResponse(BaseModel):
    imageUrl: Optional[str] = None
    audioUrl: Optional[str] = None