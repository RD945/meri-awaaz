import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import {
  Upload,
  FileText,
  Map,
  TrendingUp,
  Users
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isGuest } = useAuth();

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
    <div className="space-y-4 pb-20 -mt-9">
      {/* Welcome Section */}
      <div className="gradient-hero rounded-lg p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2">
              Welcome, {user ? user.name : 'Citizen'}!
            </h2>
            <p className="text-white/90 text-sm">
              {isGuest
                ? 'Limited access. Sign in for full features.'
                : 'Ready to make your community better?'
              }
            </p>
            {user && (
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                  {user.points} Points
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                  {user.badges.length} Badges
                </Badge>
              </div>
            )}
          </div>
          <TrendingUp className="h-8 w-8 text-white/70 flex-shrink-0" />
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-card">
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
      <Card className="shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Recent Activity</CardTitle>
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
          ) : (
            <div className="space-y-3">
              {[
                {
                  title: 'Pothole issue resolved',
                  description: 'Main Street issue has been fixed',
                  time: '2 hours ago',
                  status: 'resolved'
                },
                {
                  title: 'New water supply issue reported',
                  description: 'Rajouri Garden area needs attention',
                  time: '5 hours ago',
                  status: 'pending'
                },
                {
                  title: 'Streetlight repair in progress',
                  description: 'Sector 18 lighting issue being addressed',
                  time: '1 day ago',
                  status: 'progress'
                }
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                  <div className={`h-2 w-2 rounded-full mt-2 ${
                    activity.status === 'resolved' ? 'bg-green-500' :
                    activity.status === 'progress' ? 'bg-blue-500' : 'bg-yellow-500'
                  }`} />
                  <div>
                    <h4 className="font-medium text-sm">{activity.title}</h4>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;