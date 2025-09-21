import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin } from 'lucide-react';

const GetStarted: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-hero flex flex-col items-center justify-center p-3">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo and Title */}
        <div className="text-center space-y-3">
          <div className="mx-auto h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <MapPin className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Meri Awaaz</h1>
            <p className="text-white/90 text-center text-sm leading-relaxed px-2">
              The Civic Issue Report and Resolution app by Government of India
            </p>
          </div>
        </div>

        {/* Features List - Simple Text */}
        <div className="space-y-3 px-4">
          <div className="text-center space-y-2">
            <p className="text-white/90 text-sm">Report civic issues with photos and location</p>
            <p className="text-white/90 text-sm">Join thousands making communities better</p>
            <p className="text-white/90 text-sm">Official Government of India platform</p>
          </div>
        </div>

        {/* Get Started Button */}
        <div className="space-y-3 px-4">
          <Button
            onClick={() => navigate('/signin')}
            className="w-full bg-white text-primary hover:bg-white/90 shadow-button transition-bounce"
            size="lg"
          >
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <p className="text-center text-xs text-white/80">
            Join citizens making a difference
          </p>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;