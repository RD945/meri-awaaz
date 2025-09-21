import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Lock, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, continueAsGuest, user, isGuest } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signIn(email, password);
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Sign in failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGuestContinue = () => {
    continueAsGuest();
    toast({
      title: "Welcome!",
      description: "You are continuing as a guest with limited features.",
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center">
      <div className={`${isSignUp ? 'bg-white' : 'bg-green-600'} rounded-[2rem] pt-4 pb-4 shadow-lg mx-4`}>
      <div className="mx-4">
        <Card className={`w-full rounded-2xl shadow-xl border-0 ${isSignUp ? 'bg-green-600' : 'bg-white'}`}>
          <CardHeader className="text-center pt-4 pb-3">
            {/* Toggle Bar */}
            <div className={`relative flex rounded-xl p-1 mb-4 transition-colors duration-500 ${isSignUp ? 'bg-green-700' : 'bg-gray-100'}`}>
              {/* Sliding Background */}
              <div 
                className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-all duration-500 ease-out ${
                  isSignUp ? 'translate-x-[calc(100%+2px)]' : 'translate-x-0'
                }`}
              />
              
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className={`relative z-10 flex-1 py-2 px-4 text-sm font-medium transition-colors duration-500 ${
                  !isSignUp 
                    ? 'text-green-600' 
                    : 'text-white hover:text-green-100'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className={`relative z-10 flex-1 py-2 px-4 text-sm font-medium transition-colors duration-500 ${
                  isSignUp 
                    ? 'text-green-600' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Sign Up
              </button>
            </div>
            
            <CardTitle className={`text-xl font-bold ${isSignUp ? 'text-white' : 'text-gray-900'}`}>
              {isSignUp ? 'Create Account' : 'Sign In'}
            </CardTitle>
            <p className={`text-sm pt-1 ${isSignUp ? 'text-green-100' : 'text-muted-foreground'}`}>
              {isSignUp ? 'Join the civic community!' : 'Welcome back to Meri Awaaz!'}
            </p>
          </CardHeader>
          
          <CardContent className="space-y-3 px-4 pb-6">
            <form onSubmit={handleSignIn} className="space-y-3">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="name" className={`text-xs ${isSignUp ? 'text-white' : ''}`}>Full Name</Label>
                  <div className="relative">
                    <User className={`absolute left-3 top-4 h-4 w-4 ${isSignUp ? 'text-green-200' : 'text-muted-foreground'}`} />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      className={`pl-10 text-xs h-12 ${isSignUp ? 'bg-green-500 border-green-400 text-white placeholder:text-green-200' : ''}`}
                      required
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email" className={`text-xs ${isSignUp ? 'text-white' : ''}`}>Email Address</Label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-4 h-4 w-4 ${isSignUp ? 'text-green-200' : 'text-muted-foreground'}`} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`pl-10 text-xs h-12 ${isSignUp ? 'bg-green-500 border-green-400 text-white placeholder:text-green-200' : ''}`}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className={`text-xs ${isSignUp ? 'text-white' : ''}`}>Password</Label>
                <div className="relative">
                  <Lock className={`absolute left-3 top-4 h-4 w-4 ${isSignUp ? 'text-green-200' : 'text-muted-foreground'}`} />
                  <Input
                    id="password"
                    type="password"
                    placeholder={isSignUp ? "Create a strong password" : "Enter your password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`pl-10 text-xs h-12 ${isSignUp ? 'bg-green-500 border-green-400 text-white placeholder:text-green-200' : ''}`}
                    required
                  />
                </div>
              </div>

              <div className={isSignUp ? 'pt-3' : ''}>
                <Button 
                  type="submit" 
                  className={`w-full shadow-lg text-xs ${
                    isSignUp 
                      ? 'bg-white text-green-600 hover:bg-gray-100' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                  disabled={loading}
                >
                  {loading ? (isSignUp ? 'Creating Account...' : 'Signing In...') : (isSignUp ? 'Create Account' : 'Sign In')}
                </Button>
              </div>
            </form>

            {!isSignUp && (
              <>
                <div className="relative pt-2">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className={isSignUp ? 'border-green-300' : ''} />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className={`px-2 ${isSignUp ? 'bg-green-600 text-green-100' : 'bg-white text-muted-foreground'}`}>Or</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={handleGuestContinue}
                  className={`w-full text-xs ${
                    isSignUp 
                      ? 'border-green-300 text-white hover:bg-green-500' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <User className="mr-2 h-4 w-4" />
                  Continue as Guest
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
};

export default SignIn;