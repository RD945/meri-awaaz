import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/utils/api';
import { ISSUE_CATEGORIES } from '@/utils/constants';
import { useToast } from '@/hooks/use-toast';
import { 
  Camera, 
  MapPin, 
  Upload, 
  X, 
  AlertCircle,
  ArrowLeft
} from 'lucide-react';

const UploadIssue: React.FC = () => {
  const navigate = useNavigate();
  const { user, isGuest } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent'
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [location, setLocation] = useState<{lat: number; lng: number; address: string} | null>(null);
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (photos.length + files.length > 5) {
      toast({
        title: "Too many photos",
        description: "You can upload maximum 5 photos per issue.",
        variant: "destructive"
      });
      return;
    }
    setPhotos(prev => [...prev, ...files]);
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const getCurrentLocation = async () => {
    setGettingLocation(true);
    try {
      const coords = await api.getCurrentLocation();
      setLocation({
        lat: coords.lat,
        lng: coords.lng,
        address: 'Current Location' // In real app, reverse geocode this
      });
      toast({
        title: "Location captured",
        description: "Current location has been added to your report."
      });
    } catch (error) {
      toast({
        title: "Location error",
        description: "Could not get your location. Please try again.",
        variant: "destructive"
      });
    } finally {
      setGettingLocation(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isGuest) {
      toast({
        title: "Sign in required",
        description: "Please sign in to report issues.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.title || !formData.description || !formData.category) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await api.createIssue({
        ...formData,
        location: location || {
          lat: 28.6139,
          lng: 77.2090,
          address: 'Location not specified'
        },
        photos: [], // In real app, upload photos to server
        submittedBy: user?.id || '',
        status: 'pending'
      });

      toast({
        title: "Issue reported successfully!",
        description: "Your issue has been submitted and will be reviewed."
      });

      // Award points to user
      if (user) {
        const updatedUser = { ...user, points: user.points + 10 };
        // In real app, update user in backend
      }

      navigate('/my-issues');
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Could not submit your issue. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800'
  };

  return (
    <div className="space-y-6 pb-20">
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
          <h1 className="text-2xl font-bold">Report Issue</h1>
          <p className="text-muted-foreground">Help improve your community</p>
        </div>
      </div>

      {isGuest && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-orange-800">Limited Access</h3>
                <p className="text-sm text-orange-700">
                  Sign in to report issues and track their progress.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => navigate('/signin')}
                >
                  Sign In Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Issue Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Issue Title *</Label>
              <Input
                id="title"
                placeholder="Brief description of the issue"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                disabled={isGuest}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Detailed Description *</Label>
              <Textarea
                id="description"
                placeholder="Provide more details about the issue, its impact, and any relevant information"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="min-h-[100px]"
                disabled={isGuest}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => handleInputChange('category', value)}
                  disabled={isGuest}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {ISSUE_CATEGORIES.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center space-x-2">
                          <span>{category.icon}</span>
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(value) => handleInputChange('priority', value as any)}
                  disabled={isGuest}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end">
              <Badge className={priorityColors[formData.priority]}>
                {formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1)} Priority
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Photos */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Photos</CardTitle>
            <p className="text-sm text-muted-foreground">
              Add up to 5 photos to help illustrate the issue
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={photos.length >= 5 || isGuest}
              className="w-full h-20 border-dashed"
            >
              <div className="flex flex-col items-center space-y-2">
                <Camera className="h-6 w-6" />
                <span>Add Photos ({photos.length}/5)</span>
              </div>
            </Button>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />

            {photos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={() => removePhoto(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Location */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Location</CardTitle>
            <p className="text-sm text-muted-foreground">
              Add location to help authorities locate the issue
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              type="button"
              variant="outline"
              onClick={getCurrentLocation}
              disabled={gettingLocation || isGuest}
              className="w-full"
            >
              <MapPin className="mr-2 h-4 w-4" />
              {gettingLocation ? 'Getting Location...' : 'Use Current Location'}
            </Button>

            {location && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Location Captured</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {location.address}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading || isGuest}
            className="flex-1 shadow-button transition-bounce"
          >
            {loading ? 'Submitting...' : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Submit Issue
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UploadIssue;