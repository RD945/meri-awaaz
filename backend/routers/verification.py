"""
Phone verification endpoints using Twilio
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
import re
from typing import Dict

# Import Twilio SDK if available
try:
    from twilio.rest import Client
    TWILIO_AVAILABLE = True
except ImportError:
    TWILIO_AVAILABLE = False
    print("Warning: Twilio SDK not installed. Using mock verification service.")

router = APIRouter()

class PhoneVerificationRequest(BaseModel):
    phoneNumber: str

class PhoneVerificationCheckRequest(BaseModel):
    phoneNumber: str
    code: str

class VerificationResponse(BaseModel):
    success: bool
    message: str

# Mock storage for development
mock_codes: Dict[str, str] = {}

def format_phone_number(phone: str) -> str:
    """Format phone number to international format with +91 default"""
    # Remove all non-digit characters
    digits = re.sub(r'\D', '', phone)
    
    # If it starts with 91, add +
    if digits.startswith('91') and len(digits) == 12:
        return f"+{digits}"
    
    # If it's 10 digits (Indian mobile), add +91
    if len(digits) == 10:
        return f"+91{digits}"
    
    # If it starts with 0, remove it and add +91 (landline format)
    if digits.startswith('0') and len(digits) == 11:
        return f"+91{digits[1:]}"
    
    # If already has country code, return as is
    if len(digits) > 10:
        return f"+{digits}"
    
    # Default case - assume Indian number
    return f"+91{digits}"

def validate_phone_number(phone: str) -> bool:
    """Validate Indian phone number"""
    formatted = format_phone_number(phone)
    # Indian mobile numbers: +91 followed by 10 digits starting with 6,7,8,9
    indian_mobile_regex = r'^\+91[6-9]\d{9}$'
    return bool(re.match(indian_mobile_regex, formatted))

class TwilioService:
    def __init__(self):
        if TWILIO_AVAILABLE:
            self.account_sid = os.getenv('TWILIO_ACCOUNT_SID')
            self.auth_token = os.getenv('TWILIO_AUTH_TOKEN')
            self.verify_service_sid = os.getenv('TWILIO_VERIFY_SERVICE_SID')
            
            if all([self.account_sid, self.auth_token, self.verify_service_sid]):
                self.client = Client(self.account_sid, self.auth_token)
                self.use_real_twilio = True
            else:
                self.use_real_twilio = False
                print("Warning: Twilio credentials not found. Using mock service.")
        else:
            self.use_real_twilio = False
    
    async def send_verification_code(self, phone_number: str) -> VerificationResponse:
        formatted_phone = format_phone_number(phone_number)
        
        if not validate_phone_number(phone_number):
            return VerificationResponse(
                success=False,
                message="Invalid phone number format"
            )
        
        if self.use_real_twilio:
            try:
                verification = self.client.verify.v2.services(
                    self.verify_service_sid
                ).verifications.create(
                    to=formatted_phone,
                    channel='sms'
                )
                return VerificationResponse(
                    success=True,
                    message=f"Verification code sent to {formatted_phone}"
                )
            except Exception as e:
                print(f"Twilio error: {e}")
                return VerificationResponse(
                    success=False,
                    message="Failed to send verification code"
                )
        else:
            # Mock service for development
            import random
            code = str(random.randint(100000, 999999))
            mock_codes[formatted_phone] = code
            print(f"📱 Mock verification code for {formatted_phone}: {code}")
            return VerificationResponse(
                success=True,
                message=f"Verification code sent to {formatted_phone}. Check console for code in development."
            )
    
    async def verify_code(self, phone_number: str, code: str) -> VerificationResponse:
        formatted_phone = format_phone_number(phone_number)
        
        if self.use_real_twilio:
            try:
                verification_check = self.client.verify.v2.services(
                    self.verify_service_sid
                ).verification_checks.create(
                    to=formatted_phone,
                    code=code
                )
                
                if verification_check.status == 'approved':
                    return VerificationResponse(
                        success=True,
                        message="Phone number verified successfully"
                    )
                else:
                    return VerificationResponse(
                        success=False,
                        message="Invalid verification code"
                    )
            except Exception as e:
                print(f"Twilio verification error: {e}")
                return VerificationResponse(
                    success=False,
                    message="Failed to verify code"
                )
        else:
            # Mock service for development
            stored_code = mock_codes.get(formatted_phone)
            if not stored_code:
                return VerificationResponse(
                    success=False,
                    message="No verification code sent to this number"
                )
            
            if stored_code == code:
                del mock_codes[formatted_phone]  # Code can only be used once
                return VerificationResponse(
                    success=True,
                    message="Phone number verified successfully"
                )
            else:
                return VerificationResponse(
                    success=False,
                    message="Invalid verification code"
                )

# Initialize service
twilio_service = TwilioService()

@router.post("/verify/send", response_model=VerificationResponse)
async def send_verification_code(request: PhoneVerificationRequest):
    """Send SMS verification code to phone number"""
    try:
        result = await twilio_service.send_verification_code(request.phoneNumber)
        return result
    except Exception as e:
        print(f"Error in send_verification_code: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/verify/check", response_model=VerificationResponse)
async def verify_code(request: PhoneVerificationCheckRequest):
    """Verify SMS code for phone number"""
    try:
        result = await twilio_service.verify_code(request.phoneNumber, request.code)
        return result
    except Exception as e:
        print(f"Error in verify_code: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")