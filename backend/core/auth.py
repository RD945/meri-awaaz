"""
Firebase JWT authentication dependency for FastAPI
"""
from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import firebase_admin
from firebase_admin import credentials, auth
import os
from typing import Optional

# Initialize Firebase Admin SDK
def init_firebase():
    if not firebase_admin._apps:
        # Try to use environment variables first
        project_id = os.getenv("FIREBASE_PROJECT_ID")
        private_key_id = os.getenv("FIREBASE_PRIVATE_KEY_ID")
        private_key = os.getenv("FIREBASE_PRIVATE_KEY")
        client_email = os.getenv("FIREBASE_CLIENT_EMAIL")
        client_id = os.getenv("FIREBASE_CLIENT_ID")
        auth_uri = os.getenv("FIREBASE_AUTH_URI")
        token_uri = os.getenv("FIREBASE_TOKEN_URI")
        
        if all([project_id, private_key_id, private_key, client_email]):
            # Use environment variables to create credentials
            firebase_config = {
                "type": "service_account",
                "project_id": project_id,
                "private_key_id": private_key_id,
                "private_key": private_key.replace('\\n', '\n'),  # Handle escaped newlines
                "client_email": client_email,
                "client_id": client_id,
                "auth_uri": auth_uri or "https://accounts.google.com/o/oauth2/auth",
                "token_uri": token_uri or "https://oauth2.googleapis.com/token",
                "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                "client_x509_cert_url": f"https://www.googleapis.com/robot/v1/metadata/x509/{client_email}"
            }
            cred = credentials.Certificate(firebase_config)
            print("Firebase initialized with environment variables")
        else:
            # Fallback to service account key file
            firebase_key_path = os.getenv("FIREBASE_SERVICE_ACCOUNT_KEY")
            if firebase_key_path and os.path.exists(firebase_key_path):
                cred = credentials.Certificate(firebase_key_path)
                print("Firebase initialized with service account key file")
            else:
                # Last resort: use default credentials (for Google Cloud deployment)
                cred = credentials.ApplicationDefault()
                print("Firebase initialized with default credentials")
        
        firebase_admin.initialize_app(cred)

# Initialize Firebase on module import
init_firebase()

# Security scheme for JWT Bearer token
security = HTTPBearer()

async def verify_firebase_token(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    """
    Verify Firebase JWT token and return user information
    
    Args:
        credentials: JWT token from Authorization header
        
    Returns:
        dict: Decoded token with user information
        
    Raises:
        HTTPException: If token is invalid or expired
    """
    try:
        print(f"Received token: {credentials.credentials[:50]}..." if credentials.credentials else "No token received")
        
        # Verify the token
        decoded_token = auth.verify_id_token(credentials.credentials)
        
        # Return user information
        return {
            "uid": decoded_token["uid"],
            "email": decoded_token.get("email"),
            "name": decoded_token.get("name"),
            "phone": decoded_token.get("phone_number"),
            "email_verified": decoded_token.get("email_verified", False),
            "firebase_claims": decoded_token
        }
        
    except auth.InvalidIdTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except auth.ExpiredIdTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_current_user(
    user_data: dict = Depends(verify_firebase_token)
) -> dict:
    """
    Get current authenticated user information
    
    Args:
        user_data: Decoded Firebase token
        
    Returns:
        dict: Current user information
    """
    return user_data

# Optional authentication dependency (for endpoints that work with or without auth)
async def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False))
) -> Optional[dict]:
    """
    Optional authentication dependency for endpoints that work with guest users
    
    Args:
        credentials: Optional JWT token from Authorization header
        
    Returns:
        dict or None: User information if authenticated, None if guest
    """
    if not credentials:
        print("No credentials provided for optional auth")
        return None
        
    try:
        print(f"Optional auth - Received token: {credentials.credentials[:50]}..." if credentials.credentials else "No token in credentials")
        decoded_token = auth.verify_id_token(credentials.credentials)
        return {
            "uid": decoded_token["uid"],
            "email": decoded_token.get("email"),
            "name": decoded_token.get("name"),
            "phone": decoded_token.get("phone_number"),
            "email_verified": decoded_token.get("email_verified", False),
            "firebase_claims": decoded_token
        }
    except:
        # If token is invalid, treat as guest user
        return None

# Admin-specific authentication
ADMIN_EMAILS = [
    "admin@meri-awaaz.com",
    "superadmin@meri-awaaz.com", 
    "administrator@meri-awaaz.com"
]

# Demo admin credentials for development
DEMO_ADMIN_CREDENTIALS = {
    "admin@demo.com": "admin123",
    "superadmin@demo.com": "super123",
    "demo@admin.com": "demo123"
}

async def verify_admin_token(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    """
    Verify admin authentication - supports both Firebase tokens and demo credentials
    
    Args:
        credentials: JWT token or demo token from Authorization header
        
    Returns:
        dict: Admin user information
        
    Raises:
        HTTPException: If not authenticated as admin
    """
    try:
        token = credentials.credentials
        
        # Check if it's a demo token (for development)
        if token.startswith("demo-"):
            demo_email = token.replace("demo-", "").replace("-", "@")
            if demo_email in DEMO_ADMIN_CREDENTIALS:
                return {
                    "uid": f"demo-admin-{demo_email}",
                    "email": demo_email,
                    "name": "Demo Admin",
                    "is_admin": True,
                    "auth_type": "demo"
                }
            else:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid demo admin credentials"
                )
        
        # Otherwise verify as Firebase token
        decoded_token = auth.verify_id_token(token)
        user_email = decoded_token.get("email")
        
        # Check if user is an admin
        if user_email not in ADMIN_EMAILS:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin privileges required"
            )
        
        return {
            "uid": decoded_token["uid"],
            "email": user_email,
            "name": decoded_token.get("name"),
            "phone": decoded_token.get("phone_number"),
            "is_admin": True,
            "auth_type": "firebase",
            "firebase_claims": decoded_token
        }
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin authentication",
            headers={"WWW-Authenticate": "Bearer"},
        )