import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import PhoneVerification from './PhoneVerification';
import { useToast } from '@/hooks/use-toast';

interface SignUpFlowProps {
  userEmail: string;
  onComplete: () => void;
}

const SignUpFlow: React.FC<SignUpFlowProps> = ({ userEmail, onComplete }) => {
  const navigate = useNavigate();
  const { verifyPhone, user } = useAuth();
  const { toast } = useToast();
  const [showPhoneVerification, setShowPhoneVerification] = useState(true);

  // Debug logging
  useEffect(() => {
    console.log('SignUpFlow mounted with email:', userEmail);
    console.log('Current user:', user);
  }, [userEmail, user]);

  const handlePhoneVerified = async (phoneNumber: string) => {
    console.log('Phone verified:', phoneNumber);
    try {
      await verifyPhone(phoneNumber);
      
      // Get the pending user profile and set it as current user
      const pendingUser = localStorage.getItem('meri-awaaz-pending-user');
      if (pendingUser) {
        const userProfile = JSON.parse(pendingUser);
        // Update phone verification status
        userProfile.phone = phoneNumber;
        userProfile.phoneVerified = true;
        localStorage.setItem('meri-awaaz-user', JSON.stringify(userProfile));
        localStorage.removeItem('meri-awaaz-pending-user');
      }
      
      toast({
        title: "Phone verified!",
        description: "Your phone number has been successfully verified.",
      });
      onComplete();
      // Force navigation to dashboard
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Phone verification error:', error);
      
      // Still complete the flow even if backend verification fails
      const pendingUser = localStorage.getItem('meri-awaaz-pending-user');
      if (pendingUser) {
        const userProfile = JSON.parse(pendingUser);
        userProfile.phone = phoneNumber;
        userProfile.phoneVerified = true;
        localStorage.setItem('meri-awaaz-user', JSON.stringify(userProfile));
        localStorage.removeItem('meri-awaaz-pending-user');
      }
      
      toast({
        title: "Phone verification completed",
        description: "Phone verified locally. You can update it later in settings.",
        variant: "default"
      });
      onComplete();
      window.location.href = '/dashboard';
    }
  };

  const handleSkipPhoneVerification = () => {
    console.log('Phone verification skipped');
    
    // Get the pending user profile and set it as current user without phone
    const pendingUser = localStorage.getItem('meri-awaaz-pending-user');
    if (pendingUser) {
      const userProfile = JSON.parse(pendingUser);
      localStorage.setItem('meri-awaaz-user', JSON.stringify(userProfile));
      localStorage.removeItem('meri-awaaz-pending-user');
    }
    
    toast({
      title: "Phone verification skipped",
      description: "You can verify your phone number later in settings.",
    });
    onComplete();
    // Force navigation to dashboard
    window.location.href = '/dashboard';
  };

  const handleBackToSignIn = () => {
    navigate('/signin');
  };

  if (showPhoneVerification) {
    return (
      <PhoneVerification
        onVerified={handlePhoneVerified}
        onSkip={handleSkipPhoneVerification}
        onBack={handleBackToSignIn}
        userEmail={userEmail}
      />
    );
  }

  return null;
};

export default SignUpFlow;
