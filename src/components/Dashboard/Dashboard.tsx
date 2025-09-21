import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { issueService, handleApiError } from '@/lib/apiService';
import { Issue } from '@/types';
import {
  Upload,
  FileText,
  Map,
  TrendingUp,
  Users,
  Loader2
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isGuest } = useAuth();
  const [recentIssues, setRecentIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch recent community issues on component mount
  useEffect(() => {
    if (!isGuest) {
      fetchRecentIssues();
    }
  }, [isGuest]);

  const fetchRecentIssues = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch user's recent issues with limit
      const response = await issueService.getUserIssues({ 
        page: 1, 
        limit: 3 // Only get the 3 most recent user issues for dashboard 
      });
      setRecentIssues(response.data);
    } catch (err) {
      setError(handleApiError(err));
      console.error('Failed to fetch user issues:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved': return 'bg-green-500';
      case 'in progress': return 'bg-blue-500';
      case 'submitted': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const quickActions = [
    {
      title: 'Report New Issue',
      description: 'Submit a civic issue in your area',
      icon: Upload,
      path: '/upload',
      color: 'bg-primary'
    },
    {
      title: 'My Issues',
      description: 'Track your submitted issues',
      icon: FileText,
      path: '/my-issues',
      color: 'bg-blue-500'
    },
    {
      title: 'Interactive Map',
      description: 'View issues in your area',
      icon: Map,
      path: '/map',
      color: 'bg-green-500'
    },
    {
      title: 'Community',
      description: 'Connect with other citizens',
      icon: Users,
      path: '/community',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="space-y-4 pb-20 -mt-9 container-safe">
      {/* Welcome Section */}
      <div className="gradient-hero rounded-lg p-4 text-white">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold mb-2 truncate">
              Welcome, {user ? user.name : 'Citizen'}!
            </h2>
            <p className="text-white/90 text-sm mb-3">
              {isGuest
                ? 'Limited access. Sign in for full features.'
                : 'Ready to make your community better?'
              }
            </p>
            {user && (
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs whitespace-nowrap">
                  {user.points} Points
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs whitespace-nowrap">
                  {user.badges?.length || 0} Badges
                </Badge>
              </div>
            )}
          </div>
          <TrendingUp className="h-8 w-8 text-white/70 flex-shrink-0 mt-1" />
        </div>
      </div>

      {/* Quick Actions */}
      <Card 
        className="shadow-card bg-white/80 border border-white/30 backdrop-blur-lg"
        style={{
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        }}
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => navigate(action.path)}
                  className="h-auto p-3 justify-start text-left hover:shadow-card transition-smooth w-full"
                >
                  <div className="flex items-center space-x-3 w-full">
                    <div className={`h-8 w-8 rounded-full ${action.color} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm mb-1 text-left">{action.title}</h3>
                      <p className="text-xs text-muted-foreground text-left">{action.description}</p>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card 
        className="shadow-card bg-white/80 border border-white/30 backdrop-blur-lg"
        style={{
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        }}
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">My Recent Issues</CardTitle>
        </CardHeader>
        <CardContent>
          {isGuest ? (
            <div className="text-center py-8">
              <div className="mb-4">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Track Your Impact</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Sign in to see your reported issues and their status updates
              </p>
              <Button 
                onClick={() => navigate('/signin')}
                className="shadow-button transition-bounce"
              >
                Sign In to View Activity
              </Button>
            </div>
          ) : loading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Loading recent activity...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="mb-4">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Unable to load activity</h3>
              <p className="text-muted-foreground text-sm mb-4">{error}</p>
              <Button 
                onClick={fetchRecentIssues}
                variant="outline"
                size="sm"
              >
                Try Again
              </Button>
            </div>
          ) : recentIssues.length === 0 ? (
            <div className="text-center py-8">
              <div className="mb-4">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
              </div>
              <h3 className="font-semibold text-lg mb-2">No recent activity</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Be the first to report an issue in your community
              </p>
              <Button 
                onClick={() => navigate('/upload')}
                className="shadow-button transition-bounce"
              >
                Report an Issue
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentIssues.map((issue) => (
                <div key={issue.issueId} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                  <div className={`h-2 w-2 rounded-full mt-2 ${getStatusColor(issue.status)}`} />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{issue.title}</h4>
                    <p className="text-xs text-muted-foreground truncate">{issue.description}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-muted-foreground">{formatTimeAgo(issue.createdAt)}</p>
                      <Badge variant="secondary" className="text-xs">
                        {issue.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
              <div className="text-center pt-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/my-issues')}
                  className="text-xs"
                >
                  View All Issues →
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;