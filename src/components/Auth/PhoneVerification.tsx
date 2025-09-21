import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useToast } from '@/hooks/use-toast';
import { twilioService, formatPhoneNumber, validatePhoneNumber } from '@/lib/twilio';
import { Phone, MessageSquare, CheckCircle, ArrowLeft } from 'lucide-react';

interface PhoneVerificationProps {
  onVerified: (phoneNumber: string) => void;
  onSkip?: () => void;
  onBack?: () => void;
  userEmail?: string;
}

const PhoneVerification: React.FC<PhoneVerificationProps> = ({ 
  onVerified, 
  onSkip, 
  onBack, 
  userEmail 
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'phone' | 'verify'>('phone');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const { toast } = useToast();

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Format phone number input in real-time
  const handlePhoneChange = (value: string) => {
    // Remove all non-digit characters for input
    const digits = value.replace(/\D/g, '');
    
    // Limit to 10 digits for Indian mobile numbers
    if (digits.length <= 10) {
      setPhoneNumber(digits);
    }
  };

  // Get display format for phone number
  const getDisplayPhoneNumber = () => {
    if (phoneNumber.length === 0) return '';
    if (phoneNumber.length <= 5) return phoneNumber;
    if (phoneNumber.length <= 10) {
      return `${phoneNumber.slice(0, 5)}-${phoneNumber.slice(5)}`;
    }
    return phoneNumber;
  };

  const handleSendCode = async () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Phone number required",
        description: "Please enter your phone number",
        variant: "destructive",
      });
      return;
    }

    const fullPhoneNumber = `+91${phoneNumber}`;
    
    if (!validatePhoneNumber(fullPhoneNumber)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid 10-digit Indian mobile number",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await twilioService.sendVerificationCode(fullPhoneNumber);
      
      if (result.success) {
        setStep('verify');
        setResendCooldown(60); // 60 second cooldown
        toast({
          title: "Code sent!",
          description: result.message,
        });
      } else {
        toast({
          title: "Failed to send code",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      toast({
        title: "Invalid code",
        description: "Please enter the complete 6-digit code",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const fullPhoneNumber = `+91${phoneNumber}`;
      const result = await twilioService.verifyCode(fullPhoneNumber, verificationCode);
      
      if (result.success) {
        toast({
          title: "Phone verified!",
          description: "Your phone number has been verified successfully",
        });
        onVerified(fullPhoneNumber);
      } else {
        toast({
          title: "Verification failed",
          description: result.message,
          variant: "destructive",
        });
        setVerificationCode('');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    await handleSendCode();
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-gradient-to-br from-green-50 to-green-100">
      <div className="mx-4">
        <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-white/90 backdrop-blur-lg"
              style={{
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              }}>
          <CardHeader className="text-center pt-6 pb-4">
            {onBack && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="absolute left-4 top-4"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            
            <div className="mx-auto h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
              {step === 'phone' ? (
                <Phone className="h-6 w-6 text-green-600" />
              ) : (
                <MessageSquare className="h-6 w-6 text-green-600" />
              )}
            </div>
            
            <CardTitle className="text-xl font-bold text-gray-900">
              {step === 'phone' ? 'Verify Phone Number' : 'Enter Verification Code'}
            </CardTitle>
            
            <p className="text-sm text-muted-foreground mt-2">
              {step === 'phone' 
                ? 'We\'ll send you a verification code to confirm your phone number'
                : `We sent a 6-digit code to +91${phoneNumber}`
              }
            </p>
          </CardHeader>
          
          <CardContent className="space-y-4 px-6 pb-6">
            {step === 'phone' ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-3 flex items-center text-sm text-muted-foreground">
                      +91
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="98765 43210"
                      value={getDisplayPhoneNumber()}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      className="pl-12 text-sm"
                      maxLength={11} // 10 digits + 1 dash
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter your 10-digit Indian mobile number
                  </p>
                </div>
                
                <Button 
                  onClick={handleSendCode}
                  disabled={loading || phoneNumber.length !== 10}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {loading ? 'Sending...' : 'Send Verification Code'}
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Verification Code</Label>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={verificationCode}
                      onChange={setVerificationCode}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>
                
                <Button 
                  onClick={handleVerifyCode}
                  disabled={loading || verificationCode.length !== 6}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {loading ? 'Verifying...' : 'Verify Phone Number'}
                </Button>
                
                <div className="text-center space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Didn't receive the code?
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResendCode}
                    disabled={resendCooldown > 0 || loading}
                    className="text-xs"
                  >
                    {resendCooldown > 0 
                      ? `Resend in ${resendCooldown}s` 
                      : 'Resend Code'
                    }
                  </Button>
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => setStep('phone')}
                  className="w-full text-xs"
                >
                  Change Phone Number
                </Button>
              </>
            )}
            
            {userEmail && (
              <div className="text-center pt-2 border-t">
                <p className="text-xs text-muted-foreground">
                  Verifying for: <span className="font-medium">{userEmail}</span>
                </p>
              </div>
            )}
            
            {onSkip && step === 'phone' && (
              <Button
                variant="ghost"
                onClick={onSkip}
                className="w-full text-xs text-muted-foreground"
              >
                Skip for now
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PhoneVerification;
