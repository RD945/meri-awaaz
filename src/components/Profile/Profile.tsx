import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { userService, fileService } from '@/lib/apiService';
import type { UserProfile } from '@/types';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Award,
  Settings,
  LogOut,
  Shield,
  Camera,
  MapPin,
  CreditCard,
  Home,
  Users,
  FileText
} from 'lucide-react';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, isGuest, signOut } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user || isGuest) {
        setLoading(false);
        return;
      }

      try {
        const profile = await userService.getProfile();
        setUserProfile(profile);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user, isGuest]);

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadedImageUrl = await fileService.uploadImage(file);
      await userService.updateProfile({ avatar: uploadedImageUrl });
      
      // Update local state
      if (userProfile) {
        setUserProfile({ ...userProfile, avatar: uploadedImageUrl });
      }
    } catch (error) {
      console.error('Failed to upload profile image:', error);
      // Could add toast notification here
    } finally {
      setUploading(false);
    }
  };

  const menuItems = [
    {
      title: 'Awards & Badges',
      description: 'View your achievements',
      icon: Award,
      path: '/awards',
      color: 'text-yellow-600'
    },
    {
      title: 'Settings',
      description: 'App preferences and notifications',
      icon: Settings,
      path: '/settings',
      color: 'text-gray-600'
    }
  ];

  if (isGuest) {
    return (
      <div className="space-y-6 pb-20 -mt-9 container-safe">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Profile</h1>
            <p className="text-muted-foreground text-sm">Manage your account</p>
          </div>
        </div>

        {/* Guest Card */}
        <Card 
          className="shadow-card bg-white/80 border border-white/30 backdrop-blur-lg"
          style={{
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          }}
        >
          <CardContent className="text-center py-12">
            <div className="mb-4">
              <Avatar className="h-16 w-16 mx-auto ring-4 ring-primary/20">
                <AvatarImage src="/profile.png" alt="Guest User" />
                <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xl font-bold">
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
            </div>
            <h3 className="text-lg font-semibold mb-2">Guest User</h3>
            <p className="text-muted-foreground mb-4">
              Sign in to access your profile, track issues, and earn rewards.
            </p>
            <div className="space-y-2">
              <Button onClick={() => navigate('/signin')} className="w-full">
                Sign In / Create Account
              </Button>
              <Button variant="outline" onClick={() => { signOut(); navigate('/'); }} className="w-full">
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6 pb-20 -mt-9 container-safe">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Profile</h1>
            <p className="text-muted-foreground text-sm">Loading...</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="h-40 bg-gray-200 animate-pulse rounded-lg"></div>
          <div className="h-32 bg-gray-200 animate-pulse rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 -mt-9 container-safe">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/dashboard')}
          className="hover:bg-primary/10 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-gradient">Profile</h1>
          <p className="text-muted-foreground text-sm">Manage your account</p>
        </div>
      </div>

      {/* Profile Hero Card */}
      <Card 
        className="shadow-card bg-gradient-to-br from-white/90 to-white/70 border border-white/40 backdrop-blur-lg hover:shadow-primary/20 transition-all duration-300"
        style={{
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        }}
      >
        <CardContent className="p-6">
          <div className="flex items-start space-x-4 gap-3">
            <div className="relative">
              <Avatar className="h-20 w-20 flex-shrink-0 ring-4 ring-primary/20 cursor-pointer hover:ring-primary/40 transition-all duration-300">
                <AvatarImage src={userProfile?.avatar || "/profile.png"} alt={userProfile?.name} />
                <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xl font-bold">
                  {userProfile?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="avatar-upload"
                disabled={uploading}
              />
              <label 
                htmlFor="avatar-upload"
                className={`absolute -bottom-1 -right-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={uploading ? "Uploading..." : "Upload profile picture"}
              >
                <Camera className="h-3 w-3" />
              </label>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-gradient truncate">{userProfile?.name}</h2>
              <p className="text-muted-foreground text-sm mb-3">Civic Contributor</p>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="bg-gradient-to-r from-primary/20 to-primary/10 text-primary border-primary/30 hover:shadow-sm transition-all whitespace-nowrap text-xs font-medium">
                  ✨ {userProfile?.points || 0} Points
                </Badge>
                <Badge variant="secondary" className="bg-gradient-to-r from-blue-500/20 to-blue-500/10 text-blue-700 border-blue-300 hover:shadow-sm transition-all whitespace-nowrap text-xs font-medium">
                  🏆 {userProfile?.badges?.length || 0} Badges
                </Badge>
                {userProfile?.phoneVerified && (
                  <Badge variant="secondary" className="bg-gradient-to-r from-green-500/20 to-green-500/10 text-green-700 border-green-300 hover:shadow-sm transition-all whitespace-nowrap text-xs font-medium">
                    <Shield className="h-3 w-3 mr-1" />
                    ✓ Verified
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Account Information */}
        <Card 
          className="shadow-card bg-gradient-to-br from-white/90 to-white/70 border border-white/40 backdrop-blur-lg hover:shadow-primary/20 transition-all duration-300"
          style={{
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          }}
        >
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gradient">
              <User className="h-5 w-5" />
              <span>Account Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <User className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium">{userProfile?.name || 'Not provided'}</p>
                <p className="text-sm text-muted-foreground">Full Name</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium">{userProfile?.email || 'Not provided'}</p>
                <p className="text-sm text-muted-foreground">Email Address</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium">{userProfile?.phone || 'Not provided'}</p>
                <p className="text-sm text-muted-foreground">Phone Number</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium">{userProfile?.aadhaarNumber || 'Not provided'}</p>
                <p className="text-sm text-muted-foreground">Aadhaar Number</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <Home className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium">{userProfile?.address || 'Not provided'}</p>
                <p className="text-sm text-muted-foreground">Home Address</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium">{userProfile?.city || 'Not provided'}</p>
                <p className="text-sm text-muted-foreground">City</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium">{userProfile?.state || 'Not provided'}</p>
                <p className="text-sm text-muted-foreground">State</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium">{userProfile?.pincode || 'Not provided'}</p>
                <p className="text-sm text-muted-foreground">PIN Code</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium">{userProfile?.occupation || 'Not provided'}</p>
                <p className="text-sm text-muted-foreground">Occupation</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium">
                  {userProfile?.dateOfBirth ? new Date(userProfile.dateOfBirth).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  }) : 'Not provided'}
                </p>
                <p className="text-sm text-muted-foreground">Date of Birth</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium">
                  {userProfile?.joinedDate ? new Date(userProfile.joinedDate).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  }) : 'Not provided'}
                </p>
                <p className="text-sm text-muted-foreground">Joined Date</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card 
          className="shadow-card bg-gradient-to-br from-white/90 to-white/70 border border-white/40 backdrop-blur-lg hover:shadow-primary/20 transition-all duration-300"
          style={{
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          }}
        >
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gradient">
              <Settings className="h-5 w-5" />
              <span>More Options</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Button
                  key={index}
                  variant="ghost"
                  onClick={() => navigate(item.path)}
                  className="w-full justify-start h-auto p-4 hover:bg-primary/10 hover:shadow-sm transition-all duration-300 rounded-lg"
                >
                  <Icon className={`mr-3 h-5 w-5 ${item.color}`} />
                  <div className="text-left">
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </Button>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Recent Badges */}
      {userProfile?.badges && userProfile.badges.length > 0 && (
        <Card 
          className="shadow-card bg-gradient-to-br from-white/90 to-white/70 border border-white/40 backdrop-blur-lg hover:shadow-primary/20 transition-all duration-300"
          style={{
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          }}
        >
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-gradient">
              <Award className="h-5 w-5" />
              <span>Recent Badges</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {userProfile.badges.map((badge, index) => (
                <div key={index} className="text-center p-3 bg-gradient-to-br from-yellow-50/80 to-yellow-50/60 border border-yellow-200/50 rounded-lg hover:shadow-sm transition-all duration-300">
                  <div className="text-2xl mb-2">🏆</div>
                  <h4 className="font-medium text-sm">{badge}</h4>
                </div>
              ))}
              <div className="text-center p-3 border-2 border-dashed border-primary/30 rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
                <div className="text-2xl mb-2 text-primary">+</div>
                <p className="text-xs text-primary/80 font-medium">Earn more badges</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Logout Button Section */}
      <Card 
        className="shadow-card bg-gradient-to-br from-red-50/80 to-red-50/60 border border-red-200/50 backdrop-blur-lg"
        style={{
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        }}
      >
        <CardContent className="p-4">
          <Button
            variant="destructive"
            onClick={handleSignOut}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-button transition-all duration-300 font-medium"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;