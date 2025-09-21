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
import { issueService, fileService } from '@/lib/apiService';
import { ISSUE_CATEGORIES } from '@/utils/constants';
import { useToast } from '@/hooks/use-toast';
import type { Issue } from '@/types';
import { 
  Camera, 
  MapPin, 
  Upload, 
  X, 
  AlertCircle,
  ArrowLeft,
  Mic,
  Square,
  Play,
  Pause,
  Zap, 
  Droplets, 
  Car, 
  Trash2, 
  Trees, 
  Hospital, 
  GraduationCap, 
  Shield, 
  Globe, 
  FileText
} from 'lucide-react';

// Map icon names to Lucide components
const iconMap: { [key: string]: React.ComponentType<any> } = {
  Car,
  Droplets,
  Zap,
  Trash2,
  Trees,
  Hospital,
  GraduationCap,
  Shield,
  Globe,
  FileText
};

// Render icon helper function
const renderIcon = (iconName: string, className?: string) => {
  const IconComponent = iconMap[iconName];
  return IconComponent ? React.createElement(IconComponent, { className }) : React.createElement(FileText, { className });
};

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
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [location, setLocation] = useState<{latitude: number; longitude: number; address: string} | null>(null);
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  
  // Voice recording states
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (photos.length + files.length > 5) {
      toast({
        title: "Too many photos",
        description: "You can upload maximum 5 photos per issue.",
        variant: "destructive"
      });
      return;
    }

    setUploadingImages(true);
    try {
      const uploadPromises = files.map(file => fileService.uploadImage(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      
      setPhotos(prev => [...prev, ...files]);
      setUploadedImageUrls(prev => [...prev, ...uploadedUrls]);
      
      toast({
        title: "Photos uploaded",
        description: `${files.length} photo(s) uploaded successfully.`
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload some photos. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploadingImages(false);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setUploadedImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const getCurrentLocation = async () => {
    setGettingLocation(true);
    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser.');
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        });
      });

      // Create a more descriptive address with coordinates
      const address = `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`;

      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        address: address
      });
      
      toast({
        title: "Location captured",
        description: `Location: ${address}`
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

  // Voice recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
      
      toast({
        title: "Recording started",
        description: "Speak clearly to describe your issue."
      });
    } catch (error) {
      toast({
        title: "Recording failed",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
      
      toast({
        title: "Recording completed",
        description: "Your voice note has been saved."
      });
    }
  };

  const playAudio = () => {
    if (audioRef.current && audioUrl) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const deleteRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setIsPlaying(false);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
  };

  // Map form priority to backend priority format
  const mapPriority = (priority: string): 'Critical' | 'High' | 'Medium' | 'Low' => {
    switch (priority) {
      case 'urgent': return 'Critical';
      case 'high': return 'High';
      case 'medium': return 'Medium';
      case 'low': return 'Low';
      default: return 'Medium';
    }
  };

  // Map form category to backend category format
  const mapCategory = (category: string): 'Sanitation' | 'Public Works' | 'Electrical' | 'General' => {
    const categoryMapping: { [key: string]: 'Sanitation' | 'Public Works' | 'Electrical' | 'General' } = {
      'sanitation': 'Sanitation',
      'infrastructure': 'Public Works',
      'electrical': 'Electrical',
      'general': 'General',
      'water': 'Public Works',
      'transport': 'Public Works',
      'safety': 'General'
    };
    return categoryMapping[category] || 'General';
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
      const newIssue: Omit<Issue, 'issueId' | 'authorId' | 'authorName' | 'authorProfileImageUrl' | 'status' | 'createdAt' | 'upvotes'> = {
        title: formData.title,
        description: formData.description,
        category: mapCategory(formData.category),
        priority: mapPriority(formData.priority),
        location: location || {
          latitude: 28.6139,
          longitude: 77.2090,
          address: 'Location not specified'
        },
        imageUrl: uploadedImageUrls[0] || '', // Primary image
        imageUrls: uploadedImageUrls, // All uploaded images
        audioUrl: audioBlob ? await fileService.uploadAudio(audioBlob) : undefined
      };

      await issueService.createIssue(newIssue);

      toast({
        title: "Issue reported successfully!",
        description: "Your issue has been submitted and will be reviewed."
      });

      navigate('/my-issues');
    } catch (error) {
      console.error('Error creating issue:', error);
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
    <div className="space-y-3 pb-20 -mt-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold">Report Issue</h1>
          <p className="text-sm text-muted-foreground">Help improve your community</p>
        </div>
      </div>

      {isGuest && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-xs text-orange-800">Limited Access</h3>
                <p className="text-xs text-orange-700">
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
        <Card 
          className="shadow-card bg-white/80 border border-white/30 backdrop-blur-lg"
          style={{
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          }}
        >
          <CardHeader>
            <CardTitle className="text-base">Issue Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-xs">Issue Title *</Label>
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
              <Label htmlFor="description" className="text-xs">Detailed Description *</Label>
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
                <Label className="text-xs">Category *</Label>
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
                          <div className="p-1 rounded" style={{ backgroundColor: category.color + '20' }}>
                            {renderIcon(category.icon, "w-4 h-4")}
                          </div>
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Priority</Label>
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
        <Card 
          className="shadow-card bg-white/80 border border-white/30 backdrop-blur-lg"
          style={{
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          }}
        >
          <CardHeader>
            <CardTitle className="text-base">Photos</CardTitle>
            <p className="text-xs text-muted-foreground">
              Add up to 5 photos to help illustrate the issue
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={photos.length >= 5 || isGuest || uploadingImages}
              className="w-full h-20 border-dashed"
            >
              <div className="flex flex-col items-center space-y-2">
                <Camera className="h-6 w-6" />
                <span>
                  {uploadingImages ? 'Uploading...' : `Add Photos (${photos.length}/5)`}
                </span>
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

        {/* Voice Recording */}
        <Card 
          className="shadow-card bg-white/80 border border-white/30 backdrop-blur-lg"
          style={{
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          }}
        >
          <CardHeader>
            <CardTitle className="text-base">Voice Note</CardTitle>
            <p className="text-xs text-muted-foreground">
              Record a voice description of the issue (optional)
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {!audioBlob ? (
              <div className="flex flex-col items-center space-y-4">
                <Button
                  type="button"
                  variant={isRecording ? "destructive" : "outline"}
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isGuest}
                  className="w-full h-20 border-dashed"
                >
                  <div className="flex flex-col items-center space-y-2">
                    {isRecording ? (
                      <>
                        <Square className="h-6 w-6" />
                        <span>Stop Recording</span>
                      </>
                    ) : (
                      <>
                        <Mic className="h-6 w-6" />
                        <span>Start Voice Recording</span>
                      </>
                    )}
                  </div>
                </Button>
                {isRecording && (
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span>Recording in progress...</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                      <Mic className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-xs">Voice Recording</p>
                      <p className="text-xs text-muted-foreground">Tap to play/pause</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={playAudio}
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={deleteRecording}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {audioUrl && (
                  <audio
                    ref={audioRef}
                    src={audioUrl}
                    onEnded={() => setIsPlaying(false)}
                    className="hidden"
                  />
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Location */}
        <Card 
          className="shadow-card bg-white/80 border border-white/30 backdrop-blur-lg"
          style={{
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          }}
        >
          <CardHeader>
            <CardTitle className="text-base">Location</CardTitle>
            <p className="text-xs text-muted-foreground">
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
                  <span className="text-xs font-medium">Location Captured</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
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