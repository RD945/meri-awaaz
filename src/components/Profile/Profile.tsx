import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  Award,
  Settings,
  LogOut,
  Star,
  TrendingUp,
  Target
} from 'lucide-react';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, isGuest, signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  const stats = [
    { label: 'Issues Reported', value: '12', icon: Target, color: 'bg-blue-500' },
    { label: 'Issues Resolved', value: '8', icon: Award, color: 'bg-green-500' },
    { label: 'Points Earned', value: user?.points || '0', icon: Star, color: 'bg-yellow-500' },
    { label: 'Community Rank', value: '#47', icon: TrendingUp, color: 'bg-purple-500' }
  ];

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
      <div className="space-y-6 pb-20">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Profile</h1>
            <p className="text-muted-foreground">Manage your account</p>
          </div>
        </div>

        <Card className="shadow-card">
          <CardContent className="text-center py-12">
            <div className="mb-4">
              <User className="h-16 w-16 text-muted-foreground mx-auto" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Guest User</h3>
            <p className="text-muted-foreground mb-4">
              Sign in to access your profile, track issues, and earn rewards.
            </p>
            <div className="space-y-2">
              <Button onClick={() => navigate('/signin')} className="w-full">
                Sign In
              </Button>
              <Button variant="outline" onClick={() => navigate('/signup')} className="w-full">
                Create Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Profile</h1>
            <p className="text-muted-foreground">Manage your account</p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={handleSignOut}
          className="text-destructive hover:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>

      {/* Profile Info */}
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{user?.name}</h2>
              <p className="text-muted-foreground">{user?.email}</p>
              {user?.phone && (
                <p className="text-muted-foreground">{user.phone}</p>
              )}
              <div className="flex items-center space-x-4 mt-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  {user?.points} Points
                </Badge>
                <Badge variant="secondary">
                  {user?.badges.length} Badges
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="shadow-card">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`h-10 w-10 rounded-full ${stat.color} flex items-center justify-center`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Badges */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5" />
            <span>Recent Badges</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {user?.badges.map((badge, index) => (
              <div key={index} className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl mb-2">🏆</div>
                <h4 className="font-medium text-sm">{badge}</h4>
              </div>
            ))}
            <div className="text-center p-3 border-2 border-dashed border-muted-foreground/30 rounded-lg">
              <div className="text-2xl mb-2 text-muted-foreground">+</div>
              <p className="text-xs text-muted-foreground">Earn more badges</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
            <User className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">{user?.name}</p>
              <p className="text-sm text-muted-foreground">Full Name</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">{user?.email}</p>
              <p className="text-sm text-muted-foreground">Email Address</p>
            </div>
          </div>
          {user?.phone && (
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{user.phone}</p>
                <p className="text-sm text-muted-foreground">Phone Number</p>
              </div>
            </div>
          )}
          <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium">
                {new Date(user?.joinedDate || '').toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
              <p className="text-sm text-muted-foreground">Joined Date</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Menu */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>More Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Button
                key={index}
                variant="ghost"
                onClick={() => navigate(item.path)}
                className="w-full justify-start h-auto p-4"
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
  );
};

export default Profile;