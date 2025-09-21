import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ArrowUp, 
  ArrowDown, 
  MapPin, 
  Clock, 
  User, 
  Share, 
  Flag,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Camera,
  Calendar,
  Building,
  Phone,
  Mail,
  ExternalLink,
  Download,
  X,
  Trash2
} from 'lucide-react';
import { Issue } from '@/types';
import { ISSUE_CATEGORIES, STATUS_COLORS } from '@/utils/constants';
import { issueService } from '@/lib/apiService';
import { useAuth } from '@/contexts/AuthContext';

// Map icon names to Lucide components (reuse from parent)
const iconMap: { [key: string]: React.ComponentType<any> } = {
  Car: () => <span>🚗</span>,
  Droplets: () => <span>💧</span>,
  Zap: () => <span>⚡</span>,
  Trash2: () => <span>🗑️</span>,
  Trees: () => <span>🌳</span>,
  Hospital: () => <span>🏥</span>,
  GraduationCap: () => <span>🎓</span>,
  Shield: () => <span>🛡️</span>,
  Globe: () => <span>🌍</span>,
  FileText: () => <span>📝</span>
};

const renderIcon = (iconName: string, className?: string) => {
  const IconComponent = iconMap[iconName] || (() => <span>📝</span>);
  return <IconComponent />;
};

interface IssueDetailModalProps {
  issue: Issue | null;
  isOpen: boolean;
  onClose: () => void;
  onVote: (issueId: string, voteType: 'up' | 'down') => Promise<void>;
  userVote: string | null;
}

export const IssueDetailModal: React.FC<IssueDetailModalProps> = ({
  issue,
  isOpen,
  onClose,
  onVote,
  userVote
}) => {
  const { user, isGuest } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!issue) return null;

  const category = ISSUE_CATEGORIES.find(cat => cat.id === issue.category) || ISSUE_CATEGORIES[0];
  
  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: issue.title,
          text: issue.description,
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      const shareText = `${issue.title}\n${issue.description}\n${window.location.href}`;
      navigator.clipboard.writeText(shareText);
    }
  };

  const openImageViewer = (index: number) => {
    setSelectedImageIndex(index);
    setImageViewerOpen(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[95vw] max-w-2xl h-[95vh] max-h-screen p-0 m-2 overflow-hidden" 
                       onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader className="p-4 pb-0 shrink-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2 flex-wrap">
                  <div 
                    className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium"
                    style={{ 
                      backgroundColor: category.color + '15',
                      color: category.color 
                    }}
                  >
                    {renderIcon(category.icon)}
                    <span className="hidden sm:inline">r/{category.name.toLowerCase().replace(/\s+/g, '')}</span>
                    <span className="sm:hidden">{category.name}</span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className="text-xs"
                    style={{ borderColor: STATUS_COLORS[issue.status] }}
                  >
                    {issue.status}
                  </Badge>
                </div>
                <DialogTitle className="text-lg sm:text-xl font-bold leading-tight mb-2 pr-8">
                  {issue.title}
                </DialogTitle>
                <DialogDescription className="text-xs sm:text-sm text-gray-600 mb-2">
                  Issue details and community discussion
                </DialogDescription>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-xs sm:text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <User className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>u/{issue.authorName || 'anonymous'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{formatTimeAgo(issue.createdAt)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="truncate max-w-32 sm:max-w-xs">
                      {issue.location.address || `${issue.location.latitude?.toFixed(4)}, ${issue.location.longitude?.toFixed(4)}`}
                    </span>
                  </div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose} 
                className="shrink-0 h-8 w-8 hover:bg-gray-100 rounded-full"
                title="Close"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
          </DialogHeader>

          <ScrollArea className="flex-1 min-h-0">
            <div className="p-4 pt-2">
              {/* Voting Section */}
              <div className="flex items-start space-x-3 sm:space-x-4 mb-4 sm:mb-6">
                <div className="flex flex-col items-center space-y-2 shrink-0 bg-gray-50 rounded-lg p-2">
                  <Button
                    variant={userVote === 'up' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onVote(issue.issueId, 'up')}
                    disabled={isGuest || loading}
                    className={`p-2 h-8 w-8 transition-all duration-200 ${
                      userVote === 'up' 
                        ? 'text-orange-500 bg-orange-100 hover:bg-orange-200 border-orange-300' 
                        : 'hover:text-orange-500 hover:bg-orange-50 hover:border-orange-300'
                    }`}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                  <span className={`text-sm sm:text-base font-bold px-2 py-1 rounded transition-colors ${
                    userVote === 'up' ? 'text-orange-500 bg-orange-100' : 
                    userVote === 'down' ? 'text-blue-500 bg-blue-100' : 'text-gray-600 bg-gray-100'
                  }`}>
                    {issue.upvotes || 0}
                  </span>
                  <Button
                    variant={userVote === 'down' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onVote(issue.issueId, 'down')}
                    disabled={isGuest || loading}
                    className={`p-2 h-8 w-8 transition-all duration-200 ${
                      userVote === 'down' 
                        ? 'text-blue-500 bg-blue-100 hover:bg-blue-200 border-blue-300' 
                        : 'hover:text-blue-500 hover:bg-blue-50 hover:border-blue-300'
                    }`}
                  >
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 min-w-0">
                  {/* Description Card */}
                  <Card className="mb-4">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-sm sm:text-base mb-2 text-gray-800">Description</h3>
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {issue.description}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShare}
                      className="flex items-center space-x-1 text-xs sm:text-sm"
                    >
                      <Share className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Share</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-1 text-xs sm:text-sm"
                    >
                      <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Comment</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-1 text-xs sm:text-sm"
                    >
                      <Flag className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Report</span>
                    </Button>
                    {/* Delete/Cancel button - only show for issue author */}
                    {(user && user.userId === issue.authorId) && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this issue?')) {
                            // TODO: Implement delete functionality
                            console.log('Delete issue:', issue.issueId);
                            onClose();
                          }
                        }}
                        className="flex items-center space-x-1 text-xs sm:text-sm ml-auto"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Delete</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Images */}
              {issue.imageUrls && issue.imageUrls.length > 0 && (
                <div className="mb-4 sm:mb-6">
                  <h4 className="font-semibold mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
                    <Camera className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    Images ({issue.imageUrls.length})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                    {issue.imageUrls.map((url, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-md sm:rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => openImageViewer(index)}
                      >
                        <img
                          src={url}
                          alt={`Issue image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Issue Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <Card>
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <h4 className="font-semibold text-sm">Location</h4>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {issue.location.address || `${issue.location.latitude?.toFixed(4)}, ${issue.location.longitude?.toFixed(4)}`}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <h4 className="font-semibold text-sm">Reported</h4>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {formatTimeAgo(issue.createdAt)} by u/{issue.authorName || 'anonymous'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Building className="w-4 h-4 text-gray-500" />
                      <h4 className="font-semibold text-sm">Priority</h4>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        issue.priority === 'Critical' ? 'border-red-300 text-red-700' :
                        issue.priority === 'High' ? 'border-orange-300 text-orange-700' :
                        issue.priority === 'Medium' ? 'border-yellow-300 text-yellow-700' :
                        'border-green-300 text-green-700'
                      }`}
                    >
                      {issue.priority}
                    </Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-gray-500" />
                      <h4 className="font-semibold text-sm">Status</h4>
                    </div>
                    <Badge 
                      variant="outline" 
                      className="text-xs"
                      style={{ borderColor: STATUS_COLORS[issue.status] }}
                    >
                      {issue.status}
                    </Badge>
                  </CardContent>
                </Card>
              </div>

              {/* AI Summary */}
              {issue.aiSummary && (
                <Card className="mb-4 sm:mb-6">
                  <CardContent className="p-3 sm:p-4">
                    <h4 className="font-semibold mb-2 text-green-800 text-sm sm:text-base">Resolution Summary</h4>
                    <p className="text-xs sm:text-sm text-green-700">{issue.aiSummary}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Image Viewer Modal */}
      {imageViewerOpen && issue.imageUrls && (
        <Dialog open={imageViewerOpen} onOpenChange={setImageViewerOpen}>
          <DialogContent className="w-[98vw] h-[98vh] max-w-none max-h-none p-1 sm:p-2">
            <DialogTitle className="sr-only">
              Image {selectedImageIndex + 1} of {issue.imageUrls.length}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Viewing issue image in full screen
            </DialogDescription>
            <div className="relative w-full h-full">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1 right-1 sm:top-2 sm:right-2 z-10 bg-black/50 text-white hover:bg-black/70"
                onClick={() => setImageViewerOpen(false)}
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <img
                src={issue.imageUrls[selectedImageIndex]}
                alt={`Issue image ${selectedImageIndex + 1}`}
                className="w-full h-full object-contain rounded-md sm:rounded-lg"
              />
              {issue.imageUrls.length > 1 && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex justify-center space-x-1 sm:space-x-2">
                  {issue.imageUrls.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${
                        index === selectedImageIndex ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                      onClick={() => setSelectedImageIndex(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};