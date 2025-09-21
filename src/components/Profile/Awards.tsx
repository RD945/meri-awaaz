import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { BADGES } from '@/utils/constants';
import { ArrowLeft, Award, Target, Star, Trophy } from 'lucide-react';

const Awards: React.FC = () => {
  const navigate = useNavigate();
  const { user, isGuest } = useAuth();

  // Mock user progress data
  const userProgress = {
    issuesReported: 12,
    issuesResolved: 8,
    totalVotes: 45,
    daysActive: 28
  };

  const getBadgeProgress = (badgeId: string) => {
    switch (badgeId) {
      case 'reporter':
        return { current: userProgress.issuesReported, required: 1, completed: true };
      case 'community-helper':
        return { current: userProgress.issuesReported, required: 10, completed: userProgress.issuesReported >= 10 };
      case 'super-citizen':
        return { current: userProgress.issuesReported, required: 50, completed: userProgress.issuesReported >= 50 };
      case 'problem-solver':
        return { current: userProgress.issuesResolved, required: 5, completed: userProgress.issuesResolved >= 5 };
      case 'engagement-champion':
        return { current: userProgress.totalVotes, required: 100, completed: userProgress.totalVotes >= 100 };
      default:
        return { current: 0, required: 1, completed: false };
    }
  };

  const earnedBadges = BADGES.filter(badge => {
    const progress = getBadgeProgress(badge.id);
    return progress.completed;
  });

  const availableBadges = BADGES.filter(badge => {
    const progress = getBadgeProgress(badge.id);
    return !progress.completed;
  });

  if (isGuest) {
    return (
      <div className="space-y-6 pb-20">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/profile')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Awards & Badges</h1>
            <p className="text-muted-foreground">Track your achievements</p>
          </div>
        </div>

        <Card className="shadow-card">
          <CardContent className="text-center py-12">
            <div className="mb-4">
              <Award className="h-16 w-16 text-muted-foreground mx-auto" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Sign in to view awards</h3>
            <p className="text-muted-foreground mb-4">
              Create an account to earn badges and track your civic contributions.
            </p>
            <Button onClick={() => navigate('/signin')}>
              Sign In Now
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/profile')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Awards & Badges</h1>
          <p className="text-muted-foreground">
            {earnedBadges.length} of {BADGES.length} badges earned
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4 text-center">
            <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center mx-auto mb-2">
              <Target className="h-6 w-6 text-white" />
            </div>
            <p className="text-2xl font-bold">{userProgress.issuesReported}</p>
            <p className="text-sm text-muted-foreground">Issues Reported</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-4 text-center">
            <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-2">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <p className="text-2xl font-bold">{userProgress.issuesResolved}</p>
            <p className="text-sm text-muted-foreground">Issues Resolved</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-4 text-center">
            <div className="h-12 w-12 rounded-full bg-yellow-500 flex items-center justify-center mx-auto mb-2">
              <Star className="h-6 w-6 text-white" />
            </div>
            <p className="text-2xl font-bold">{userProgress.totalVotes}</p>
            <p className="text-sm text-muted-foreground">Total Votes</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-4 text-center">
            <div className="h-12 w-12 rounded-full bg-purple-500 flex items-center justify-center mx-auto mb-2">
              <Award className="h-6 w-6 text-white" />
            </div>
            <p className="text-2xl font-bold">{earnedBadges.length}</p>
            <p className="text-sm text-muted-foreground">Badges Earned</p>
          </CardContent>
        </Card>
      </div>

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              <span>Earned Badges</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {earnedBadges.map((badge) => (
                <div
                  key={badge.id}
                  className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg"
                >
                  <div className="text-center mb-3">
                    <div className="text-4xl mb-2">{badge.icon}</div>
                    <h3 className="font-semibold text-yellow-800">{badge.name}</h3>
                  </div>
                  <p className="text-sm text-yellow-700 text-center mb-2">
                    {badge.description}
                  </p>
                  <div className="text-center">
                    <Badge className="bg-yellow-600 text-white">
                      Completed
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Badges */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-600" />
            <span>Available Badges</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {availableBadges.map((badge) => {
              const progress = getBadgeProgress(badge.id);
              const progressPercentage = Math.min((progress.current / progress.required) * 100, 100);
              
              return (
                <div
                  key={badge.id}
                  className="p-4 bg-muted/50 rounded-lg border"
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl opacity-50">{badge.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{badge.name}</h3>
                        <Badge variant="outline">
                          {progress.current}/{progress.required}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {badge.description}
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{badge.condition}</span>
                          <span className="font-medium">{Math.round(progressPercentage)}%</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Motivational Section */}
      <Card className="shadow-card gradient-primary text-white">
        <CardContent className="p-6 text-center">
          <Award className="h-12 w-12 mx-auto mb-4 opacity-90" />
          <h3 className="text-xl font-bold mb-2">Keep Making a Difference!</h3>
          <p className="text-white/90 mb-4">
            Every issue you report helps build a better community. Continue your civic journey and earn more badges!
          </p>
          <Button
            variant="secondary"
            onClick={() => navigate('/upload')}
            className="bg-white text-primary hover:bg-white/90"
          >
            Report New Issue
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Awards;