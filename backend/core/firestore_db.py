"""
Firestore Database Manager for Meri Awaaz
Handles all database operations using Firestore
"""

import os
import math
from typing import Optional, List, Dict, Any, Tuple
from datetime import datetime, timedelta
import firebase_admin
from firebase_admin import credentials, firestore
from google.cloud.firestore_v1 import FieldFilter, Query
from google.cloud.firestore import GeoPoint
import logging

logger = logging.getLogger(__name__)

# Status mapping for legacy compatibility
STATUS_MAPPING = {
    # Legacy status -> New status
    'pending': 'Submitted',
    'in-progress': 'In Progress', 
    'resolved': 'Resolved',
    'rejected': 'Resolved',  # Map rejected to resolved for now
    # Current status (ensure they pass through)
    'Submitted': 'Submitted',
    'In Progress': 'In Progress',
    'Resolved': 'Resolved'
}

def normalize_status(status: str) -> str:
    """Convert legacy status values to current format"""
    return STATUS_MAPPING.get(status, 'Submitted')  # Default to Submitted if unknown

class FirestoreManager:
    """Manages all Firestore database operations for Meri Awaaz"""
    
    def __init__(self):
        self.db = None
        self._initialize_firestore()
    
    def _initialize_firestore(self):
        """Initialize Firestore client"""
        try:
            # Check if Firebase is already initialized
            firebase_admin.get_app()
            logger.info("Firebase app already initialized")
        except ValueError:
            # Initialize Firebase with service account credentials
            try:
                cred_dict = {
                    "type": "service_account",
                    "project_id": os.getenv('FIREBASE_PROJECT_ID'),
                    "private_key_id": os.getenv('FIREBASE_PRIVATE_KEY_ID'),
                    "private_key": os.getenv('FIREBASE_PRIVATE_KEY', '').replace('\\n', '\n'),
                    "client_email": os.getenv('FIREBASE_CLIENT_EMAIL'),
                    "client_id": os.getenv('FIREBASE_CLIENT_ID'),
                    "auth_uri": os.getenv('FIREBASE_AUTH_URI', 'https://accounts.google.com/o/oauth2/auth'),
                    "token_uri": os.getenv('FIREBASE_TOKEN_URI', 'https://oauth2.googleapis.com/token'),
                    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                    "client_x509_cert_url": f"https://www.googleapis.com/robot/v1/metadata/x509/{os.getenv('FIREBASE_CLIENT_EMAIL')}"
                }
                
                # Validate required fields
                required_fields = ['project_id', 'private_key', 'client_email']
                missing_fields = [field for field in required_fields if not cred_dict.get(field)]
                
                if missing_fields:
                    raise ValueError(f"Missing Firebase credentials: {missing_fields}")
                
                cred = credentials.Certificate(cred_dict)
                firebase_admin.initialize_app(cred)
                logger.info("Firebase app initialized successfully")
                
            except Exception as e:
                logger.error(f"Failed to initialize Firebase: {e}")
                raise
        
        # Get Firestore client
        try:
            self.db = firestore.client()
            logger.info("Firestore client initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Firestore client: {e}")
            raise
    
    # ==================== User Management ====================
    
    async def create_user(self, user_data: Dict[str, Any]) -> Optional[str]:
        """Create a new user document"""
        try:
            # Add timestamps
            user_data['createdAt'] = datetime.utcnow()
            user_data['updatedAt'] = datetime.utcnow()
            user_data['isVerified'] = user_data.get('isVerified', False)
            
            # Create document with auto-generated ID
            doc_ref = self.db.collection('users').document()
            doc_ref.set(user_data)
            
            logger.info(f"User created with ID: {doc_ref.id}")
            return doc_ref.id
            
        except Exception as e:
            logger.error(f"Failed to create user: {e}")
            return None
    
    async def get_user(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get user by ID"""
        try:
            doc = self.db.collection('users').document(user_id).get()
            if doc.exists:
                user_data = doc.to_dict()
                user_data['id'] = doc.id
                return user_data
            return None
            
        except Exception as e:
            logger.error(f"Failed to get user {user_id}: {e}")
            return None
    
    async def get_user_by_phone(self, phone_number: str) -> Optional[Dict[str, Any]]:
        """Get user by phone number"""
        try:
            query = self.db.collection('users').where(
                filter=FieldFilter('phoneNumber', '==', phone_number)
            ).limit(1)
            
            docs = list(query.stream())
            if docs:
                doc = docs[0]
                user_data = doc.to_dict()
                user_data['id'] = doc.id
                return user_data
            return None
            
        except Exception as e:
            logger.error(f"Failed to get user by phone {phone_number}: {e}")
            return None
    
    async def update_user(self, user_id: str, update_data: Dict[str, Any]) -> bool:
        """Update user document, creating it if it doesn't exist"""
        try:
            update_data['updatedAt'] = datetime.utcnow()
            
            # Use set with merge=True to create document if it doesn't exist
            self.db.collection('users').document(user_id).set(update_data, merge=True)
            logger.info(f"User updated: {user_id}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to update user {user_id}: {e}")
            return False
    
    async def delete_user(self, user_id: str) -> bool:
        """Delete user document"""
        try:
            self.db.collection('users').document(user_id).delete()
            logger.info(f"User deleted: {user_id}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to delete user {user_id}: {e}")
            return False
    
    # ==================== Issue Management ====================
    
    async def create_issue(self, issue_data: Dict[str, Any]) -> Optional[str]:
        """Create a new civic issue"""
        try:
            # Add timestamps and default values
            issue_data['createdAt'] = datetime.utcnow()
            issue_data['updatedAt'] = datetime.utcnow()
            issue_data['status'] = normalize_status(issue_data.get('status', 'Submitted'))
            issue_data['priority'] = issue_data.get('priority', 'medium')
            issue_data['voteCount'] = 0
            issue_data['upvotes'] = 0
            issue_data['downvotes'] = 0
            
            # Convert latitude/longitude to Firestore GeoPoint
            if 'latitude' in issue_data and 'longitude' in issue_data:
                latitude = float(issue_data.pop('latitude'))
                longitude = float(issue_data.pop('longitude'))
                issue_data['location'] = GeoPoint(latitude, longitude)
            
            # Ensure arrays are properly formatted
            if 'imageUrls' not in issue_data:
                issue_data['imageUrls'] = []
            
            # Create document
            doc_ref = self.db.collection('issues').document()
            doc_ref.set(issue_data)
            
            logger.info(f"Issue created with ID: {doc_ref.id}")
            return doc_ref.id
            
        except Exception as e:
            logger.error(f"Failed to create issue: {e}")
            return None
    
    async def get_issue(self, issue_id: str) -> Optional[Dict[str, Any]]:
        """Get issue by ID"""
        try:
            doc = self.db.collection('issues').document(issue_id).get()
            if doc.exists:
                issue_data = doc.to_dict()
                issue_data['id'] = doc.id
                
                # Convert GeoPoint back to latitude/longitude
                if 'location' in issue_data and issue_data['location']:
                    geopoint = issue_data['location']
                    issue_data['latitude'] = geopoint.latitude
                    issue_data['longitude'] = geopoint.longitude
                
                return issue_data
            return None
            
        except Exception as e:
            logger.error(f"Failed to get issue {issue_id}: {e}")
            return None
    
    async def get_issues(self, 
                        limit: int = 50, 
                        category: str = None,
                        status: str = None,
                        user_id: str = None,
                        priority: str = None) -> List[Dict[str, Any]]:
        """Get issues with optional filters"""
        try:
            query = self.db.collection('issues')
            
            # Apply filters
            if category:
                query = query.where(filter=FieldFilter('category', '==', category))
            if status:
                # Normalize status to handle legacy values
                normalized_status = normalize_status(status)
                query = query.where(filter=FieldFilter('status', '==', normalized_status))
            if user_id:
                query = query.where(filter=FieldFilter('userId', '==', user_id))
            if priority:
                query = query.where(filter=FieldFilter('priority', '==', priority))
            
            # Order by creation date (newest first) and limit
            query = query.order_by('createdAt', direction=Query.DESCENDING).limit(limit)
            
            issues = []
            for doc in query.stream():
                issue_data = doc.to_dict()
                issue_data['id'] = doc.id
                
                # Convert GeoPoint to latitude/longitude
                if 'location' in issue_data and issue_data['location']:
                    geopoint = issue_data['location']
                    issue_data['latitude'] = geopoint.latitude
                    issue_data['longitude'] = geopoint.longitude
                
                issues.append(issue_data)
            
            logger.info(f"Retrieved {len(issues)} issues")
            return issues
            
        except Exception as e:
            logger.error(f"Failed to get issues: {e}")
            return []
    
    async def get_nearby_issues(self, 
                               latitude: float, 
                               longitude: float, 
                               radius_km: float = 10.0,
                               limit: int = 50) -> List[Dict[str, Any]]:
        """Get issues near a specific location"""
        try:
            # Get all issues with location data
            # Note: Firestore doesn't support native radius queries
            # For production, consider using a geospatial library or service
            query = self.db.collection('issues').where(
                filter=FieldFilter('location', '!=', None)
            ).limit(limit * 3)  # Get more to filter by distance
            
            issues_with_distance = []
            
            for doc in query.stream():
                issue_data = doc.to_dict()
                issue_data['id'] = doc.id
                
                if 'location' in issue_data and issue_data['location']:
                    geopoint = issue_data['location']
                    issue_lat = geopoint.latitude
                    issue_lng = geopoint.longitude
                    
                    # Calculate distance
                    distance = self._calculate_distance(latitude, longitude, issue_lat, issue_lng)
                    
                    if distance <= radius_km:
                        issue_data['latitude'] = issue_lat
                        issue_data['longitude'] = issue_lng
                        issue_data['distance'] = round(distance, 2)
                        issues_with_distance.append(issue_data)
            
            # Sort by distance and limit
            issues_with_distance.sort(key=lambda x: x.get('distance', float('inf')))
            nearby_issues = issues_with_distance[:limit]
            
            logger.info(f"Found {len(nearby_issues)} issues within {radius_km}km")
            return nearby_issues
            
        except Exception as e:
            logger.error(f"Failed to get nearby issues: {e}")
            return []
    
    async def update_issue(self, issue_id: str, update_data: Dict[str, Any]) -> bool:
        """Update issue document"""
        try:
            update_data['updatedAt'] = datetime.utcnow()
            
            # Handle location updates
            if 'latitude' in update_data and 'longitude' in update_data:
                latitude = float(update_data.pop('latitude'))
                longitude = float(update_data.pop('longitude'))
                update_data['location'] = GeoPoint(latitude, longitude)
            
            self.db.collection('issues').document(issue_id).update(update_data)
            logger.info(f"Issue updated: {issue_id}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to update issue {issue_id}: {e}")
            return False
    
    async def delete_issue(self, issue_id: str) -> bool:
        """Delete issue and related data"""
        try:
            # Delete issue document
            self.db.collection('issues').document(issue_id).delete()
            
            # Delete related votes
            votes_query = self.db.collection('votes').where(
                filter=FieldFilter('issueId', '==', issue_id)
            )
            
            for vote_doc in votes_query.stream():
                vote_doc.reference.delete()
            
            logger.info(f"Issue and related data deleted: {issue_id}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to delete issue {issue_id}: {e}")
            return False
    
    # ==================== Issue Updates/Comments ====================
    
    async def add_issue_update(self, issue_id: str, update_data: Dict[str, Any]) -> Optional[str]:
        """Add an update/comment to an issue"""
        try:
            update_data['createdAt'] = datetime.utcnow()
            
            # Add to subcollection
            doc_ref = self.db.collection('issues').document(issue_id).collection('updates').document()
            doc_ref.set(update_data)
            
            # Update the main issue's updatedAt timestamp
            self.db.collection('issues').document(issue_id).update({
                'updatedAt': datetime.utcnow()
            })
            
            logger.info(f"Update added to issue {issue_id}: {doc_ref.id}")
            return doc_ref.id
            
        except Exception as e:
            logger.error(f"Failed to add update to issue {issue_id}: {e}")
            return None
    
    async def get_issue_updates(self, issue_id: str, limit: int = 50) -> List[Dict[str, Any]]:
        """Get updates for an issue"""
        try:
            query = self.db.collection('issues').document(issue_id).collection('updates').order_by(
                'createdAt', direction=Query.DESCENDING
            ).limit(limit)
            
            updates = []
            for doc in query.stream():
                update_data = doc.to_dict()
                update_data['id'] = doc.id
                updates.append(update_data)
            
            return updates
            
        except Exception as e:
            logger.error(f"Failed to get updates for issue {issue_id}: {e}")
            return []
    
    # ==================== Verification Codes ====================
    
    async def create_verification_code(self, phone_number: str, code: str, expires_minutes: int = 10) -> Optional[str]:
        """Create a verification code"""
        try:
            # Clean up old codes for this phone number
            await self._cleanup_old_verification_codes(phone_number)
            
            code_data = {
                'phoneNumber': phone_number,
                'code': code,
                'expiresAt': datetime.utcnow() + timedelta(minutes=expires_minutes),
                'verified': False,
                'createdAt': datetime.utcnow()
            }
            
            doc_ref = self.db.collection('verification_codes').document()
            doc_ref.set(code_data)
            
            logger.info(f"Verification code created for {phone_number}")
            return doc_ref.id
            
        except Exception as e:
            logger.error(f"Failed to create verification code for {phone_number}: {e}")
            return None
    
    async def verify_code(self, phone_number: str, code: str) -> bool:
        """Verify a code"""
        try:
            # Find valid, unverified code
            query = self.db.collection('verification_codes').where(
                filter=FieldFilter('phoneNumber', '==', phone_number)
            ).where(
                filter=FieldFilter('code', '==', code)
            ).where(
                filter=FieldFilter('verified', '==', False)
            ).where(
                filter=FieldFilter('expiresAt', '>', datetime.utcnow())
            ).limit(1)
            
            docs = list(query.stream())
            if docs:
                # Mark as verified
                doc = docs[0]
                doc.reference.update({'verified': True})
                logger.info(f"Code verified for {phone_number}")
                return True
            
            logger.warning(f"Invalid or expired code for {phone_number}")
            return False
            
        except Exception as e:
            logger.error(f"Failed to verify code for {phone_number}: {e}")
            return False
    
    async def _cleanup_old_verification_codes(self, phone_number: str):
        """Clean up old verification codes for a phone number"""
        try:
            old_codes_query = self.db.collection('verification_codes').where(
                filter=FieldFilter('phoneNumber', '==', phone_number)
            )
            
            for doc in old_codes_query.stream():
                doc.reference.delete()
                
        except Exception as e:
            logger.error(f"Failed to cleanup old codes for {phone_number}: {e}")
    
    # ==================== Voting System ====================
    
    async def vote_on_issue(self, issue_id: str, user_id: str, vote_type: str) -> bool:
        """Vote on an issue (upvote/downvote) with toggle functionality"""
        try:
            # Validate vote type
            if vote_type not in ['upvote', 'downvote', 'remove']:
                logger.error(f"Invalid vote type: {vote_type}")
                return False
            
            # Check for existing vote
            existing_vote_query = self.db.collection('votes').where(
                filter=FieldFilter('issueId', '==', issue_id)
            ).where(
                filter=FieldFilter('userId', '==', user_id)
            ).limit(1)
            
            existing_votes = list(existing_vote_query.stream())
            
            if vote_type == 'remove' and existing_votes:
                # Remove the vote
                existing_votes[0].reference.delete()
                logger.info(f"Vote removed: {user_id} -> {issue_id}")
            elif existing_votes:
                # Update existing vote
                existing_vote = existing_votes[0]
                existing_vote.reference.update({
                    'voteType': vote_type,
                    'updatedAt': datetime.utcnow()
                })
                logger.info(f"Vote updated: {user_id} -> {issue_id} ({vote_type})")
            elif vote_type != 'remove':
                # Create new vote (only if not removing)
                vote_data = {
                    'issueId': issue_id,
                    'userId': user_id,
                    'voteType': vote_type,
                    'createdAt': datetime.utcnow()
                }
                self.db.collection('votes').document().set(vote_data)
                logger.info(f"New vote created: {user_id} -> {issue_id} ({vote_type})")
            
            # Update issue vote counts
            await self._update_issue_vote_count(issue_id)
            return True
            
        except Exception as e:
            logger.error(f"Failed to vote on issue {issue_id}: {e}")
            return False
    
    async def get_user_vote(self, issue_id: str, user_id: str) -> Optional[str]:
        """Get user's vote on an issue"""
        try:
            vote_query = self.db.collection('votes').where(
                filter=FieldFilter('issueId', '==', issue_id)
            ).where(
                filter=FieldFilter('userId', '==', user_id)
            ).limit(1)
            
            votes = list(vote_query.stream())
            if votes:
                vote_data = votes[0].to_dict()
                return vote_data.get('voteType')
            
            return None
            
        except Exception as e:
            logger.error(f"Failed to get user vote for issue {issue_id}: {e}")
            return None
    
    async def _update_issue_vote_count(self, issue_id: str):
        """Update vote counts for an issue"""
        try:
            votes_query = self.db.collection('votes').where(
                filter=FieldFilter('issueId', '==', issue_id)
            )
            
            upvotes = downvotes = 0
            for vote_doc in votes_query.stream():
                vote_data = vote_doc.to_dict()
                if vote_data.get('voteType') == 'upvote':
                    upvotes += 1
                elif vote_data.get('voteType') == 'downvote':
                    downvotes += 1
            
            # Use upvotes as the main vote count (positive only)
            # Store both upvotes and downvotes for analytics, but display only upvotes
            vote_count = upvotes  # Changed from net_votes to only upvotes
            
            # Update issue document
            self.db.collection('issues').document(issue_id).update({
                'voteCount': vote_count,
                'upvotes': upvotes,
                'downvotes': downvotes,
                'updatedAt': datetime.utcnow()
            })
            
            logger.info(f"Vote count updated for issue {issue_id}: +{upvotes}, -{downvotes}, display: {vote_count}")
            
        except Exception as e:
            logger.error(f"Failed to update vote count for issue {issue_id}: {e}")
    
    # ==================== Analytics and Statistics ====================
    
    async def get_issue_statistics(self) -> Dict[str, Any]:
        """Get overall issue statistics"""
        try:
            stats = {
                'total_issues': 0,
                'open_issues': 0,
                'resolved_issues': 0,
                'categories': {},
                'priorities': {}
            }
            
            # Get all issues (you might want to limit this for large datasets)
            issues_query = self.db.collection('issues')
            
            for doc in issues_query.stream():
                issue_data = doc.to_dict()
                
                stats['total_issues'] += 1
                
                status = issue_data.get('status', 'open')
                if status == 'open':
                    stats['open_issues'] += 1
                elif status in ['resolved', 'closed']:
                    stats['resolved_issues'] += 1
                
                # Category stats
                category = issue_data.get('category', 'General')
                stats['categories'][category] = stats['categories'].get(category, 0) + 1
                
                # Priority stats
                priority = issue_data.get('priority', 'medium')
                stats['priorities'][priority] = stats['priorities'].get(priority, 0) + 1
            
            return stats
            
        except Exception as e:
            logger.error(f"Failed to get issue statistics: {e}")
            return {}
    
    async def get_user_statistics(self, user_id: str) -> Dict[str, Any]:
        """Get statistics for a specific user"""
        try:
            stats = {
                'issues_reported': 0,
                'votes_cast': 0,
                'issues_by_status': {},
                'issues_by_category': {}
            }
            
            # Count user's issues
            user_issues_query = self.db.collection('issues').where(
                filter=FieldFilter('userId', '==', user_id)
            )
            
            for doc in user_issues_query.stream():
                issue_data = doc.to_dict()
                stats['issues_reported'] += 1
                
                status = issue_data.get('status', 'open')
                stats['issues_by_status'][status] = stats['issues_by_status'].get(status, 0) + 1
                
                category = issue_data.get('category', 'General')
                stats['issues_by_category'][category] = stats['issues_by_category'].get(category, 0) + 1
            
            # Count user's votes
            user_votes_query = self.db.collection('votes').where(
                filter=FieldFilter('userId', '==', user_id)
            )
            
            stats['votes_cast'] = len(list(user_votes_query.stream()))
            
            return stats
            
        except Exception as e:
            logger.error(f"Failed to get user statistics for {user_id}: {e}")
            return {}
    
    # ==================== Utility Methods ====================
    
    def _calculate_distance(self, lat1: float, lng1: float, lat2: float, lng2: float) -> float:
        """Calculate distance between two points using Haversine formula"""
        R = 6371  # Earth's radius in kilometers
        
        # Convert latitude and longitude from degrees to radians
        lat1_rad = math.radians(lat1)
        lng1_rad = math.radians(lng1)
        lat2_rad = math.radians(lat2)
        lng2_rad = math.radians(lng2)
        
        # Calculate differences
        dlat = lat2_rad - lat1_rad
        dlng = lng2_rad - lng1_rad
        
        # Apply Haversine formula
        a = (math.sin(dlat / 2) * math.sin(dlat / 2) +
             math.cos(lat1_rad) * math.cos(lat2_rad) *
             math.sin(dlng / 2) * math.sin(dlng / 2))
        
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        distance = R * c
        
        return distance
    
    async def health_check(self) -> Dict[str, Any]:
        """Check Firestore connection health"""
        try:
            # Try to read from a collection
            test_query = self.db.collection('users').limit(1)
            list(test_query.stream())
            
            return {
                'firestore': 'healthy',
                'timestamp': datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Firestore health check failed: {e}")
            return {
                'firestore': 'unhealthy',
                'error': str(e),
                'timestamp': datetime.utcnow().isoformat()
            }

# Global database manager instance (will be initialized lazily)
db_manager = None

def get_db_manager():
    """Get or create the global database manager instance"""
    global db_manager
    if db_manager is None:
        db_manager = FirestoreManager()
    return db_manager

# Convenience functions for easy import
async def create_user(user_data: Dict[str, Any]) -> Optional[str]:
    """Create a new user"""
    return await get_db_manager().create_user(user_data)

async def get_user(user_id: str) -> Optional[Dict[str, Any]]:
    """Get user by ID"""
    return await get_db_manager().get_user(user_id)

async def get_user_by_phone(phone_number: str) -> Optional[Dict[str, Any]]:
    """Get user by phone number"""
    return await get_db_manager().get_user_by_phone(phone_number)

async def create_issue(issue_data: Dict[str, Any]) -> Optional[str]:
    """Create a new issue"""
    return await get_db_manager().create_issue(issue_data)

async def get_issue(issue_id: str) -> Optional[Dict[str, Any]]:
    """Get issue by ID"""
    return await get_db_manager().get_issue(issue_id)

async def get_issues(limit: int = 50, **filters) -> List[Dict[str, Any]]:
    """Get issues with filters"""
    return await get_db_manager().get_issues(limit=limit, **filters)

async def get_nearby_issues(latitude: float, longitude: float, radius_km: float = 10.0, limit: int = 50) -> List[Dict[str, Any]]:
    """Get issues near a location"""
    return await get_db_manager().get_nearby_issues(latitude, longitude, radius_km, limit)

async def vote_on_issue(issue_id: str, user_id: str, vote_type: str) -> bool:
    """Vote on an issue"""
    return await get_db_manager().vote_on_issue(issue_id, user_id, vote_type)

async def create_verification_code(phone_number: str, code: str, expires_minutes: int = 10) -> Optional[str]:
    """Create verification code"""
    return await get_db_manager().create_verification_code(phone_number, code, expires_minutes)

async def verify_code(phone_number: str, code: str) -> bool:
    """Verify a code"""
    return await get_db_manager().verify_code(phone_number, code)

async def get_user_issues(user_id: str, limit: int = 50) -> List[Dict[str, Any]]:
    """Get issues created by a specific user"""
    return await get_db_manager().get_user_issues(user_id, limit)

async def update_issue(issue_id: str, update_data: Dict[str, Any]) -> bool:
    """Update issue data"""
    return await get_db_manager().update_issue(issue_id, update_data)

async def get_user_vote(issue_id: str, user_id: str) -> Optional[str]:
    """Get user's vote on an issue"""
    return await get_db_manager().get_user_vote(issue_id, user_id)

async def update_user(user_id: str, update_data: Dict[str, Any]) -> bool:
    """Update user data"""
    return await get_db_manager().update_user(user_id, update_data)

async def add_issue_update(issue_id: str, update_data: Dict[str, Any]) -> bool:
    """Add an update to an issue"""
    return await get_db_manager().add_issue_update(issue_id, update_data)

async def get_issue_updates(issue_id: str) -> List[Dict[str, Any]]:
    """Get all updates for an issue"""
    return await get_db_manager().get_issue_updates(issue_id)

async def get_user_statistics(user_id: str) -> Dict[str, Any]:
    """Get user statistics including issues created, votes cast, etc."""
    return await get_db_manager().get_user_statistics(user_id)