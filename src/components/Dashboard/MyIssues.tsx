import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/utils/api';
import { Issue } from '@/types';
import { ISSUE_CATEGORIES, STATUS_COLORS, PRIORITY_COLORS } from '@/utils/constants';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Calendar,
  MapPin,
  Eye,
  MessageSquare,
  ThumbsUp
} from 'lucide-react';

const MyIssues: React.FC = () => {
  const navigate = useNavigate();
  const { user, isGuest } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIssues();
  }, [user]);

  useEffect(() => {
    filterIssues();
  }, [issues, searchTerm, statusFilter]);

  const loadIssues = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const userIssues = await api.getUserIssues(user.id);
      setIssues(userIssues);
    } catch (error) {
      console.error('Failed to load issues:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterIssues = () => {
    let filtered = issues;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(issue =>
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(issue => issue.status === statusFilter);
    }

    setFilteredIssues(filtered);
  };

  const getCategoryInfo = (categoryId: string) => {
    return ISSUE_CATEGORIES.find(cat => cat.id === categoryId) || ISSUE_CATEGORIES[0];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
      resolved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

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
            <h1 className="text-2xl font-bold">My Issues</h1>
            <p className="text-muted-foreground">Track your submitted issues</p>
          </div>
        </div>

        <Card className="shadow-card">
          <CardContent className="text-center py-12">
            <div className="mb-4">
              <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Sign in to view your issues</h3>
            <p className="text-muted-foreground mb-4">
              Create an account to report and track civic issues in your area.
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
            <h1 className="text-2xl font-bold">My Issues</h1>
            <p className="text-muted-foreground">
              {filteredIssues.length} of {issues.length} issues
            </p>
          </div>
        </div>
        <Button onClick={() => navigate('/upload')} className="shadow-button">
          Report New Issue
        </Button>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search issues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Issues List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="shadow-card">
              <CardContent className="p-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredIssues.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="text-center py-12">
            <div className="mb-4">
              <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {issues.length === 0 ? 'No issues reported yet' : 'No issues found'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {issues.length === 0 
                ? 'Start by reporting your first civic issue to help improve your community.'
                : 'Try adjusting your search or filter criteria.'
              }
            </p>
            {issues.length === 0 && (
              <Button onClick={() => navigate('/upload')}>
                Report Your First Issue
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredIssues.map((issue) => {
            const category = getCategoryInfo(issue.category);
            return (
              <Card key={issue.id} className="shadow-card hover:shadow-primary transition-smooth">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between space-x-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg">{category.icon}</span>
                        <Badge className={getStatusColor(issue.status)}>
                          {issue.status.replace('-', ' ').toUpperCase()}
                        </Badge>
                        <Badge className={getPriorityColor(issue.priority)}>
                          {issue.priority.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <h3 className="font-semibold text-lg mb-1 truncate">
                        {issue.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {issue.description}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(issue.submittedAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span className="truncate max-w-32">
                            {issue.location.address}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{issue.votes}</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        // In a real app, navigate to issue details page
                        console.log('View issue:', issue.id);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>

                  {issue.resolution && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <div>
                          <h4 className="font-medium text-green-800 mb-1">Resolution</h4>
                          <p className="text-sm text-green-700">{issue.resolution}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyIssues;