"""
Firebase Storage Manager for Meri Awaaz
Handles file uploads, downloads, and management using Firebase Storage
"""

import os
import uuid
from typing import Optional, List, Tuple
import firebase_admin
from firebase_admin import credentials, storage
from datetime import datetime, timedelta
import logging
import urllib.parse

logger = logging.getLogger(__name__)

class FirebaseStorageManager:
    """Manages file operations with Firebase Storage"""
    
    def __init__(self):
        self.bucket = None
        self._initialize_firebase()
    
    def _initialize_firebase(self):
        """Initialize Firebase Admin SDK with service account credentials"""
        try:
            # Check if Firebase is already initialized
            firebase_admin.get_app()
            logger.info("Firebase app already initialized")
        except ValueError:
            # Initialize Firebase with service account credentials from environment
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
                firebase_admin.initialize_app(cred, {
                    'storageBucket': os.getenv('FIREBASE_STORAGE_BUCKET')
                })
                logger.info("Firebase app initialized successfully")
                
            except Exception as e:
                logger.error(f"Failed to initialize Firebase: {e}")
                raise
        
        # Get storage bucket
        try:
            self.bucket = storage.bucket()
            logger.info(f"Firebase Storage bucket connected: {self.bucket.name}")
        except Exception as e:
            logger.error(f"Failed to connect to Firebase Storage bucket: {e}")
            raise
    
    def _generate_unique_filename(self, original_filename: str) -> str:
        """Generate a unique filename while preserving the extension"""
        if '.' in original_filename:
            name, extension = original_filename.rsplit('.', 1)
            return f"{uuid.uuid4()}.{extension.lower()}"
        else:
            return str(uuid.uuid4())
    
    def _validate_file_type(self, filename: str, allowed_types: List[str] = None) -> bool:
        """Validate file type based on extension"""
        if allowed_types is None:
            allowed_types = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'doc', 'docx']
        
        if '.' not in filename:
            return False
        
        extension = filename.rsplit('.', 1)[1].lower()
        return extension in allowed_types
    
    async def upload_file(self, 
                         file_content: bytes, 
                         original_filename: str, 
                         user_id: str, 
                         folder: str = "issues",
                         make_public: bool = True) -> Optional[str]:
        """
        Upload a file to Firebase Storage
        
        Args:
            file_content: Binary content of the file
            original_filename: Original filename
            user_id: ID of the user uploading the file
            folder: Storage folder (issues, profiles, documents, etc.)
            make_public: Whether to make the file publicly accessible
        
        Returns:
            Public URL of the uploaded file, or None if upload failed
        """
        try:
            # Validate file type
            if not self._validate_file_type(original_filename):
                logger.warning(f"Invalid file type: {original_filename}")
                return None
            
            # Generate unique filename
            unique_filename = self._generate_unique_filename(original_filename)
            
            # Create blob path: folder/user_id/unique_filename
            blob_path = f"{folder}/{user_id}/{unique_filename}"
            blob = self.bucket.blob(blob_path)
            
            # Set metadata
            blob.metadata = {
                'original_name': original_filename,
                'uploaded_by': user_id,
                'uploaded_at': datetime.utcnow().isoformat(),
                'folder': folder,
                'file_size': str(len(file_content))
            }
            
            # Determine content type based on file extension
            content_type = self._get_content_type(original_filename)
            
            # Upload file with content type
            blob.upload_from_string(
                file_content,
                content_type=content_type
            )
            
            # Make blob publicly readable if requested
            if make_public:
                blob.make_public()
                public_url = blob.public_url
            else:
                # Generate a signed URL for private access
                public_url = self.get_signed_url(blob_path, expiration_hours=24)
            
            logger.info(f"File uploaded successfully: {blob_path}")
            return public_url
            
        except Exception as e:
            logger.error(f"Failed to upload file '{original_filename}': {e}")
            return None
    
    async def upload_multiple_files(self, 
                                  files: List[Tuple[bytes, str]], 
                                  user_id: str, 
                                  folder: str = "issues",
                                  make_public: bool = True) -> List[str]:
        """
        Upload multiple files to Firebase Storage
        
        Args:
            files: List of (file_content, filename) tuples
            user_id: ID of the user uploading files
            folder: Storage folder
            make_public: Whether to make files publicly accessible
        
        Returns:
            List of public URLs for successfully uploaded files
        """
        uploaded_urls = []
        
        for file_content, filename in files:
            url = await self.upload_file(file_content, filename, user_id, folder, make_public)
            if url:
                uploaded_urls.append(url)
            else:
                logger.warning(f"Failed to upload file: {filename}")
        
        logger.info(f"Uploaded {len(uploaded_urls)}/{len(files)} files successfully")
        return uploaded_urls
    
    async def delete_file(self, file_url: str) -> bool:
        """
        Delete a file from Firebase Storage using its public URL
        
        Args:
            file_url: Public URL of the file to delete
        
        Returns:
            True if file was deleted successfully, False otherwise
        """
        try:
            # Extract blob path from Firebase Storage URL
            blob_path = self._extract_blob_path_from_url(file_url)
            
            if not blob_path:
                logger.error(f"Could not extract blob path from URL: {file_url}")
                return False
            
            # Delete the blob
            blob = self.bucket.blob(blob_path)
            
            # Check if blob exists before deleting
            if blob.exists():
                blob.delete()
                logger.info(f"File deleted successfully: {blob_path}")
                return True
            else:
                logger.warning(f"File does not exist: {blob_path}")
                return False
            
        except Exception as e:
            logger.error(f"Failed to delete file '{file_url}': {e}")
            return False
    
    async def delete_multiple_files(self, file_urls: List[str]) -> int:
        """
        Delete multiple files from Firebase Storage
        
        Args:
            file_urls: List of public URLs of files to delete
        
        Returns:
            Number of files successfully deleted
        """
        deleted_count = 0
        
        for url in file_urls:
            if await self.delete_file(url):
                deleted_count += 1
        
        logger.info(f"Deleted {deleted_count}/{len(file_urls)} files successfully")
        return deleted_count
    
    def get_signed_url(self, blob_path: str, expiration_hours: int = 1) -> Optional[str]:
        """
        Generate a signed URL for private file access
        
        Args:
            blob_path: Path to the file in storage (e.g., "issues/user123/file.jpg")
            expiration_hours: Number of hours until the URL expires
        
        Returns:
            Signed URL for private access, or None if failed
        """
        try:
            blob = self.bucket.blob(blob_path)
            
            # Generate signed URL
            signed_url = blob.generate_signed_url(
                expiration=datetime.utcnow() + timedelta(hours=expiration_hours),
                method='GET'
            )
            
            logger.info(f"Generated signed URL for: {blob_path}")
            return signed_url
            
        except Exception as e:
            logger.error(f"Failed to generate signed URL for '{blob_path}': {e}")
            return None
    
    def list_user_files(self, user_id: str, folder: str = None) -> List[dict]:
        """
        List all files uploaded by a specific user
        
        Args:
            user_id: ID of the user
            folder: Optional folder to filter by
        
        Returns:
            List of file information dictionaries
        """
        try:
            if folder:
                prefix = f"{folder}/{user_id}/"
            else:
                prefix = f"{user_id}/"
            
            blobs = self.bucket.list_blobs(prefix=prefix)
            
            files = []
            for blob in blobs:
                file_info = {
                    'name': blob.name,
                    'public_url': blob.public_url if blob.public_url else None,
                    'size': blob.size,
                    'created': blob.time_created.isoformat() if blob.time_created else None,
                    'updated': blob.updated.isoformat() if blob.updated else None,
                    'metadata': blob.metadata or {}
                }
                files.append(file_info)
            
            logger.info(f"Found {len(files)} files for user {user_id}")
            return files
            
        except Exception as e:
            logger.error(f"Failed to list files for user '{user_id}': {e}")
            return []
    
    def _extract_blob_path_from_url(self, file_url: str) -> Optional[str]:
        """Extract the blob path from a Firebase Storage public URL"""
        try:
            # Firebase Storage URLs format:
            # https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{path}?alt=media&token={token}
            
            if 'firebasestorage.googleapis.com' not in file_url:
                logger.error(f"Not a Firebase Storage URL: {file_url}")
                return None
            
            parsed_url = urllib.parse.urlparse(file_url)
            
            # Extract path between '/o/' and '?'
            path_parts = parsed_url.path.split('/o/')
            if len(path_parts) < 2:
                logger.error(f"Invalid Firebase Storage URL format: {file_url}")
                return None
            
            encoded_path = path_parts[1].split('?')[0]
            blob_path = urllib.parse.unquote(encoded_path)
            
            return blob_path
            
        except Exception as e:
            logger.error(f"Failed to extract blob path from URL '{file_url}': {e}")
            return None
    
    def _get_content_type(self, filename: str) -> str:
        """Determine content type based on file extension"""
        if '.' not in filename:
            return 'application/octet-stream'
        
        extension = filename.rsplit('.', 1)[1].lower()
        
        content_types = {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'webp': 'image/webp',
            'pdf': 'application/pdf',
            'doc': 'application/msword',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'txt': 'text/plain',
            'csv': 'text/csv',
            'json': 'application/json'
        }
        
        return content_types.get(extension, 'application/octet-stream')

# Global storage manager instance (will be initialized lazily)
storage_manager = None

def get_storage_manager():
    """Get or create the global storage manager instance"""
    global storage_manager
    if storage_manager is None:
        storage_manager = FirebaseStorageManager()
    return storage_manager

# Convenience functions for easy import
async def upload_file(file_content: bytes, filename: str, user_id: str, folder: str = "issues") -> Optional[str]:
    """Upload a single file"""
    return await get_storage_manager().upload_file(file_content, filename, user_id, folder)

async def upload_files(files: List[Tuple[bytes, str]], user_id: str, folder: str = "issues") -> List[str]:
    """Upload multiple files"""
    return await get_storage_manager().upload_multiple_files(files, user_id, folder)

async def delete_file(file_url: str) -> bool:
    """Delete a single file"""
    return await get_storage_manager().delete_file(file_url)

async def delete_files(file_urls: List[str]) -> int:
    """Delete multiple files"""
    return await get_storage_manager().delete_multiple_files(file_urls)