// Twilio service for phone verification
// Note: For production, this should be moved to a backend server for security

export interface PhoneVerificationService {
  sendVerificationCode: (phoneNumber: string) => Promise<{ success: boolean; message: string }>;
  verifyCode: (phoneNumber: string, code: string) => Promise<{ success: boolean; message: string }>;
}

// Format phone number to international format with +91 default
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // If it starts with 91, add +
  if (digits.startsWith('91') && digits.length === 12) {
    return `+${digits}`;
  }
  
  // If it's 10 digits (Indian mobile), add +91
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  
  // If it starts with 0, remove it and add +91 (landline format)
  if (digits.startsWith('0') && digits.length === 11) {
    return `+91${digits.substring(1)}`;
  }
  
  // If already has country code, return as is
  if (digits.length > 10) {
    return `+${digits}`;
  }
  
  // Default case - assume Indian number
  return `+91${digits}`;
};

// Validate Indian phone number
export const validatePhoneNumber = (phone: string): boolean => {
  const formatted = formatPhoneNumber(phone);
  // Indian mobile numbers: +91 followed by 10 digits starting with 6,7,8,9
  const indianMobileRegex = /^\+91[6-9]\d{9}$/;
  return indianMobileRegex.test(formatted);
};

// Backend API service (you'll need to implement this on your server)
class TwilioAPIService implements PhoneVerificationService {
  private baseUrl: string;
  
  constructor() {
    // Use the same base URL as the main API client
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
  }
  
  async sendVerificationCode(phoneNumber: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/verify/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber: formatPhoneNumber(phoneNumber) }),
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending verification code:', error);
      return { success: false, message: 'Failed to send verification code' };
    }
  }
  
  async verifyCode(phoneNumber: string, code: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/verify/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          phoneNumber: formatPhoneNumber(phoneNumber), 
          code 
        }),
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error verifying code:', error);
      return { success: false, message: 'Failed to verify code' };
    }
  }
}

// Mock service for development/testing
class MockTwilioService implements PhoneVerificationService {
  private sentCodes: Map<string, string> = new Map();
  
  async sendVerificationCode(phoneNumber: string): Promise<{ success: boolean; message: string }> {
    const formatted = formatPhoneNumber(phoneNumber);
    
    if (!validatePhoneNumber(phoneNumber)) {
      return { success: false, message: 'Invalid phone number format' };
    }
    
    // Generate a random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    this.sentCodes.set(formatted, code);
    
    // In development, log the code to console
    console.log(`📱 Verification code for ${formatted}: ${code}`);
    
    return { 
      success: true, 
      message: `Verification code sent to ${formatted}. Check console for code in development.` 
    };
  }
  
  async verifyCode(phoneNumber: string, code: string): Promise<{ success: boolean; message: string }> {
    const formatted = formatPhoneNumber(phoneNumber);
    const storedCode = this.sentCodes.get(formatted);
    
    if (!storedCode) {
      return { success: false, message: 'No verification code sent to this number' };
    }
    
    if (storedCode === code) {
      this.sentCodes.delete(formatted); // Code can only be used once
      return { success: true, message: 'Phone number verified successfully' };
    }
    
    return { success: false, message: 'Invalid verification code' };
  }
}

// Export the appropriate service based on environment
// Use real API if backend URL is available, otherwise use mock
export const twilioService: PhoneVerificationService = 
  import.meta.env.VITE_API_BASE_URL
    ? new TwilioAPIService() 
    : new MockTwilioService();
