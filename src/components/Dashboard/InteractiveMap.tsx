import React, { useState, useEffect, useCallback, useRef, memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { issueService } from '@/lib/apiService';
import { Issue } from '@/types';
import { ISSUE_CATEGORIES, STATUS_COLORS } from '@/utils/constants';
import { useAuth } from '@/contexts/AuthContext';
import { IssueDetailModal } from './IssueDetailModal';
import { ArrowLeft, MapPin, Navigation, Filter, Zap, Droplets, Car, Trash2, Trees, Hospital, GraduationCap, Shield, Globe, FileText, Users, Crown, CheckCircle, Trophy, ArrowUp, ArrowDown, MessageCircle, Share, MoreHorizontal, Clock, User } from 'lucide-react';

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

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
  FileText,
  Users,
  Crown,
  CheckCircle,
  Trophy
};

// Custom Upvote Arrow Component
const UpvoteArrow: React.FC<{ isUpvoted: boolean; onClick: () => void }> = ({ isUpvoted, onClick }) => (
  <button
    onClick={onClick}
    className={`p-1 rounded transition-all duration-200 hover:scale-110 ${
      isUpvoted 
        ? 'text-green-600 bg-green-100' 
        : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
    }`}
  >
    <svg
      width="16"
      height="16"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="transition-colors duration-200"
    >
      <path d="M10 1c.072 0 .145 0 .218.006A4.1 4.1 0 0 1 14 5.184V9h3.138a1.751 1.751 0 0 1 1.234 2.993L10.59 19.72a.836.836 0 0 1-1.18 0l-7.782-7.727A1.751 1.751 0 0 1 2.861 9H6V5.118a4.134 4.134 0 0 1 .854-2.592A3.99 3.99 0 0 1 10 1Zm0 17.193 7.315-7.264a.251.251 0 0 0-.177-.429H12.5V5.184A2.631 2.631 0 0 0 10.136 2.5a2.441 2.441 0 0 0-1.856.682A2.478 2.478 0 0 0 7.5 5v5.5H2.861a.251.251 0 0 0-.176.429L10 18.193Z" />
    </svg>
  </button>
);

// Custom Downvote Arrow Component  
const DownvoteArrow: React.FC<{ isDownvoted: boolean; onClick: () => void }> = ({ isDownvoted, onClick }) => (
  <button
    onClick={onClick}
    className={`p-1 rounded transition-all duration-200 hover:scale-110 ${
      isDownvoted 
        ? 'text-red-600 bg-red-100' 
        : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
    }`}
  >
    <svg
      width="16"
      height="16"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="transition-colors duration-200 rotate-180"
    >
      <path d="M10 1c.072 0 .145 0 .218.006A4.1 4.1 0 0 1 14 5.184V9h3.138a1.751 1.751 0 0 1 1.234 2.993L10.59 19.72a.836.836 0 0 1-1.18 0l-7.782-7.727A1.751 1.751 0 0 1 2.861 9H6V5.118a4.134 4.134 0 0 1 .854-2.592A3.99 3.99 0 0 1 10 1Zm0 17.193 7.315-7.264a.251.251 0 0 0-.177-.429H12.5V5.184A2.631 2.631 0 0 0 10.136 2.5a2.441 2.441 0 0 0-1.856.682A2.478 2.478 0 0 0 7.5 5v5.5H2.861a.251.251 0 0 0-.176.429L10 18.193Z" />
    </svg>
  </button>
);

// Google Maps Component
interface GoogleMapProps {
  center: { lat: number; lng: number };
  zoom: number;
  issues: Issue[];
  onMarkerClick: (issue: Issue) => void;
  onMapLoad?: (map: google.maps.Map) => void;
}

const GoogleMapComponent: React.FC<GoogleMapProps> = ({ center, zoom, issues, onMarkerClick, onMapLoad }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const markers = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const userLocationMarker = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);

  const getCategoryInfo = (categoryId: string) => {
    return ISSUE_CATEGORIES.find(cat => cat.id === categoryId) || ISSUE_CATEGORIES[0];
  };

  const getMarkerColor = (issue: Issue) => {
    return issue.status === 'Resolved' ? '#22c55e' : 
           issue.status === 'In Progress' ? '#3b82f6' : 
           issue.priority === 'Critical' ? '#ef4444' : '#f59e0b';
  };

  const createAdvancedMarkerElement = (issue: Issue) => {
    const category = getCategoryInfo(issue.category);
    const color = getMarkerColor(issue);
    
    const markerDiv = document.createElement('div');
    markerDiv.style.cssText = `
      background-color: ${color};
      border: 2px solid white;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      cursor: pointer;
      transition: transform 0.2s ease;
    `;
    markerDiv.innerHTML = `<div style="font-size: 18px; font-weight: bold; color: ${category.color};">●</div>`;
    
    markerDiv.addEventListener('mouseenter', () => {
      markerDiv.style.transform = 'scale(1.1)';
    });
    
    markerDiv.addEventListener('mouseleave', () => {
      markerDiv.style.transform = 'scale(1)';
    });
    
    return markerDiv;
  };

  const createUserLocationElement = () => {
    const markerDiv = document.createElement('div');
    markerDiv.style.cssText = `
      background: linear-gradient(135deg, #007bff, #0056b3);
      border: 3px solid white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      position: relative;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,123,255,0.4);
    `;
    
    // Add pulsing ring effect
    const pulseDiv = document.createElement('div');
    pulseDiv.style.cssText = `
      position: absolute;
      top: -8px;
      left: -8px;
      width: 32px;
      height: 32px;
      border: 2px solid #007bff;
      border-radius: 50%;
      opacity: 0.6;
      animation: pulse 2s infinite;
    `;
    
    markerDiv.appendChild(pulseDiv);
    
    // Add CSS animation if not already added
    if (!document.getElementById('pulse-animation')) {
      const style = document.createElement('style');
      style.id = 'pulse-animation';
      style.textContent = `
        @keyframes pulse {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
    
    return markerDiv;
  };

  useEffect(() => {
    if (mapRef.current && !map.current) {
      map.current = new google.maps.Map(mapRef.current, {
        center,
        zoom,
        mapId: 'MERI_AWAAZ_MAP', // Unique mapId for Advanced Markers
        disableDefaultUI: true, // Disable all default UI first
        zoomControl: true, // Re-enable only what we want
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true,
        gestureHandling: 'auto', // Allow normal map interactions
      });
      
      // Call onMapLoad callback if provided
      if (onMapLoad && map.current) {
        onMapLoad(map.current);
      }
    }
  }, [center, zoom, onMapLoad]);

  // Update map center when center prop changes
  useEffect(() => {
    if (map.current) {
      map.current.setCenter(center);
    }
  }, [center]);

  // Add/update user location marker
  useEffect(() => {
    if (map.current) {
      // Remove existing user location marker
      if (userLocationMarker.current) {
        userLocationMarker.current.map = null;
      }

      // Add new user location marker using AdvancedMarkerElement
      const userElement = createUserLocationElement();
      userLocationMarker.current = new google.maps.marker.AdvancedMarkerElement({
        position: center,
        map: map.current,
        title: 'Your Location',
        content: userElement
      });
    }
  }, [center]);

  useEffect(() => {
    if (map.current) {
      // Clear existing markers
      markers.current.forEach(marker => {
        marker.map = null;
      });
      markers.current = [];

      // Add new markers using AdvancedMarkerElement
      issues.forEach(issue => {
        const category = getCategoryInfo(issue.category);
        const markerElement = createAdvancedMarkerElement(issue);
        
        const marker = new google.maps.marker.AdvancedMarkerElement({
          position: { lat: issue.location.latitude, lng: issue.location.longitude },
          map: map.current,
          title: issue.title,
          content: markerElement
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="max-width: 200px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                <div style="background: ${category.color}20; color: ${category.color}; padding: 4px; border-radius: 4px; font-size: 12px; font-weight: bold;">
                  ${category.name}
                </div>
                <span style="background: ${getMarkerColor(issue)}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: bold;">
                  ${issue.status.replace(' ', '_').toUpperCase()}
                </span>
              </div>
              <h3 style="margin: 0 0 8px 0; font-weight: bold;">${issue.title}</h3>
              <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">${issue.description}</p>
              <div style="font-size: 12px; color: #888;">
                Location: ${issue.location.address || 'Location'}<br>
                Date: ${new Date(issue.createdAt).toLocaleDateString()}<br>
                Votes: ${issue.upvotes}
              </div>
            </div>
          `
        });

        marker.addListener('click', () => {
          onMarkerClick(issue);
          infoWindow.open(map.current, marker);
        });

        markers.current.push(marker);
      });
    }
  }, [issues, onMarkerClick]);

  return <div ref={mapRef} style={{ width: '100%', height: '100%' }} />;
};

// Map Status Component for loading and errors
const renderMapStatus = (status: Status): React.ReactElement => {
  if (status === Status.LOADING) return <div className="flex items-center justify-center h-full">
    <div className="text-center">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
      <p className="text-sm text-muted-foreground">Loading Google Maps...</p>
    </div>
  </div>;
  if (status === Status.FAILURE) return <div className="flex items-center justify-center h-full">
    <div className="text-center">
      <p className="text-sm text-red-600">Error loading Google Maps</p>
    </div>
  </div>;
  return <div />;
};

// Render icon helper function
const renderIcon = (iconName: string, className?: string) => {
  const IconComponent = iconMap[iconName];
  return IconComponent ? React.createElement(IconComponent, { className }) : React.createElement(FileText, { className });
};

// Custom Arrow Components using your provided SVG path
const CustomUpArrow: React.FC<{ className?: string; isActive?: boolean }> = ({ className = "", isActive = false }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    className={`${className} ${isActive ? 'text-orange-500' : 'text-gray-400 hover:text-orange-500'} transition-colors`}
  >
    <path
      d="M10 1c.072 0 .145 0 .218.006A4.1 4.1 0 0 1 14 5.184V9h3.138a1.751 1.751 0 0 1 1.234 2.993L10.59 19.72a.836.836 0 0 1-1.18 0l-7.782-7.727A1.751 1.751 0 0 1 2.861 9H6V5.118a4.134 4.134 0 0 1 .854-2.592A3.99 3.99 0 0 1 10 1Zm0 17.193 7.315-7.264a.251.251 0 0 0-.177-.429H12.5V5.184A2.631 2.631 0 0 0 10.136 2.5a2.441 2.441 0 0 0-1.856.682A2.478 2.478 0 0 0 7.5 5v5.5H2.861a.251.251 0 0 0-.176.429L10 18.193Z"
      fill="currentColor"
    />
  </svg>
);

const CustomDownArrow: React.FC<{ className?: string; isActive?: boolean }> = ({ className = "", isActive = false }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    className={`${className} ${isActive ? 'text-blue-500' : 'text-gray-400 hover:text-blue-500'} transition-colors transform rotate-180`}
  >
    <path
      d="M10 1c.072 0 .145 0 .218.006A4.1 4.1 0 0 1 14 5.184V9h3.138a1.751 1.751 0 0 1 1.234 2.993L10.59 19.72a.836.836 0 0 1-1.18 0l-7.782-7.727A1.751 1.751 0 0 1 2.861 9H6V5.118a4.134 4.134 0 0 1 .854-2.592A3.99 3.99 0 0 1 10 1Zm0 17.193 7.315-7.264a.251.251 0 0 0-.177-.429H12.5V5.184A2.631 2.631 0 0 0 10.136 2.5a2.441 2.441 0 0 0-1.856.682A2.478 2.478 0 0 0 7.5 5v5.5H2.861a.251.251 0 0 0-.176.429L10 18.193Z"
      fill="currentColor"
    />
  </svg>
);

// Optimized lazy loading image component
const LazyImage = memo(({ src, alt, className, onError, onClick }: {
  src: string;
  alt: string;
  className: string;
  onError: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  onClick: (e: React.MouseEvent) => void;
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  const handleLoad = () => setLoaded(true);
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setError(true);
    onError(e);
  };
  
  if (error) return null;
  
  return (
    <div className="relative">
      {!loaded && (
        <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
          <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
      )}
      <img 
        src={src}
        alt={alt}
        className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}
        onLoad={handleLoad}
        onError={handleError}
        onClick={onClick}
        loading="lazy"
      />
    </div>
  );
});

// Memoized issue card component for better performance
const IssueCard = memo(({ 
  issue, 
  onIssueClick, 
  onVote, 
  getCategoryInfo, 
  formatTimeAgo,
  user 
}: {
  issue: Issue;
  onIssueClick: (issue: Issue) => void;
  onVote: (issueId: string, voteType: 'upvote' | 'downvote') => Promise<void>;
  getCategoryInfo: (category: string) => { icon: React.ComponentType<any>; color: string; name: string };
  formatTimeAgo: (dateString: string) => string;
  user: any;
}) => {
  const category = getCategoryInfo(issue.category);
  const timeAgo = formatTimeAgo(issue.createdAt);
  
  const handleVote = useCallback(async (voteType: 'upvote' | 'downvote', e: React.MouseEvent) => {
    e.stopPropagation();
    await onVote(issue.issueId, voteType);
  }, [issue.issueId, onVote]);
  
  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).style.display = 'none';
  }, []);
  
  return (
    <div 
      className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 cursor-pointer overflow-hidden"
      onClick={() => onIssueClick(issue)}
    >
      {/* Reddit-style post layout with left voting column */}
      <div className="flex">
        {/* Left voting column */}
        <div className="flex flex-col items-center p-2 sm:p-3 bg-gray-50 border-r border-gray-100">
          <button 
            className="p-1 rounded hover:bg-orange-100 transition-colors"
            onClick={(e) => handleVote('upvote', e)}
            disabled={!user}
          >
            <CustomUpArrow isActive={false} />
          </button>
          <span className="text-sm font-bold text-gray-600 py-1">
            {issue.upvotes || 0}
          </span>
          <button 
            className="p-1 rounded hover:bg-blue-100 transition-colors"
            onClick={(e) => handleVote('downvote', e)}
            disabled={!user}
          >
            <CustomDownArrow isActive={false} />
          </button>
        </div>

        {/* Main content area */}
        <div className="flex-1 p-3 sm:p-4 min-w-0">
          {/* Post meta - mobile optimized */}
          <div className="mb-2">
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-1 sm:gap-2 text-xs">
              {/* First row on mobile: category and status */}
              <div className="flex items-center justify-between sm:contents">
                <div 
                  className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium shrink-0"
                  style={{ 
                    backgroundColor: category.color + '15',
                    color: category.color 
                  }}
                >
                  <category.icon className="w-3 h-3" />
                  <span className="hidden sm:inline">r/{category.name.toLowerCase().replace(/\s+/g, '')}</span>
                  <span className="sm:hidden">{category.name}</span>
                </div>
                
                <Badge 
                  variant="outline" 
                  className="text-xs shrink-0"
                  style={{ borderColor: STATUS_COLORS[issue.status] }}
                >
                  {issue.status}
                </Badge>
              </div>
              
              {/* Second row on mobile: author and time */}
              <div className="flex items-center gap-2 sm:contents">
                <span className="text-gray-300 hidden sm:inline">•</span>
                
                <div className="flex items-center gap-1 text-gray-500 shrink-0">
                  <User className="w-3 h-3" />
                  <span className="truncate max-w-20 sm:max-w-none">u/{issue.authorName}</span>
                </div>
                
                <span className="text-gray-300">•</span>
                
                <div className="flex items-center gap-1 text-gray-500 shrink-0">
                  <Clock className="w-3 h-3" />
                  <span>{timeAgo}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Post Title */}
          <h4 className="font-semibold text-sm sm:text-base mb-2 text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
            {issue.title}
          </h4>
          
          {/* Post Content */}
          <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">
            {issue.description}
          </p>
          
          {/* Post Image */}
          {issue.imageUrls && issue.imageUrls.length > 0 && (
            <div className="mb-3">
              <LazyImage
                src={issue.imageUrls[0]}
                alt="Issue"
                className="w-full max-h-48 sm:max-h-64 object-cover rounded-md border border-gray-200"
                onError={handleImageError}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
          
          {/* Location */}
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">
              {issue.location.address || `${issue.location.latitude?.toFixed(4)}, ${issue.location.longitude?.toFixed(4)}`}
            </span>
          </div>
        </div>
      </div>
      
      {/* Post Actions Footer */}
      <div className="flex items-center justify-between px-3 sm:px-4 py-2 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center gap-3 sm:gap-4">
          <button 
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onIssueClick(issue);
            }}
          >
            <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Comments</span>
          </button>
          
          <button 
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              // Handle share
            }}
          >
            <Share className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
        
        <button 
          className="text-xs text-gray-500 hover:text-gray-700 transition-colors p-1"
          onClick={(e) => {
            e.stopPropagation();
            // Handle more options
          }}
        >
          <MoreHorizontal className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
});

const InteractiveMap: React.FC = () => {
  const navigate = useNavigate();
  const { user, isGuest } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [center, setCenter] = useState<{ lat: number; lng: number }>({ lat: 28.6139, lng: 77.2090 }); // Default to Delhi
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailModalIssue, setDetailModalIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [userVotes, setUserVotes] = useState<{[issueId: string]: 'up' | 'down' | null}>({});
  const [nearbyIssues, setNearbyIssues] = useState<Issue[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);

  const getCurrentUserLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Geolocation error:', error.message);
          // Fallback to Delhi coordinates
          resolve({ lat: 28.6139, lng: 77.2090 });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  };

  const loadData = async () => {
    try {
      // Get user's current location with improved detection
      const location = await getCurrentUserLocation();
      setCenter(location);
      
      // Load issues only for authenticated users
      if (!isGuest) {
        const response = await issueService.getIssuesForMap();
        setIssues(response);
      } else {
        setIssues([]); // No issues for guest users
      }
    } catch (error) {
      console.error('Failed to load map data:', error);
      // Set default location if everything fails
      setCenter({ lat: 28.6139, lng: 77.2090 });
    } finally {
      setLoading(false);
    }
  };

  const getCategoryInfo = (categoryId: string) => {
    return ISSUE_CATEGORIES.find(cat => cat.id === categoryId) || ISSUE_CATEGORIES[0];
  };

  // Calculate distance between two points (in km)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Get issues within 5km radius
  useEffect(() => {
    if (issues.length > 0) {
      const nearby = issues.filter(issue => {
        const distance = calculateDistance(
          center.lat, center.lng,
          issue.location.latitude, issue.location.longitude
        );
        return distance <= 5; // 5km radius
      });
      setNearbyIssues(nearby);
    }
  }, [issues, center]);

  // Voting functions with optimistic updates (toggle-only logic)
  const handleVote = async (issueId: string, voteType: 'up' | 'down') => {
    if (isGuest) return;

    // Get current user vote for this issue
    const currentVote = userVotes[issueId];
    
    // Find the current issue to get current upvotes
    const currentIssue = nearbyIssues.find(issue => issue.issueId === issueId);
    if (!currentIssue) return;
    
    // Toggle logic: if clicking same vote, remove it; if clicking different vote, toggle to new vote
    let optimisticVote: 'up' | 'down' | null;
    let optimisticUpvotes = currentIssue.upvotes || 0;
    
    if (currentVote === voteType) {
      // Clicking the same vote - remove it (toggle off)
      optimisticVote = null;
      if (voteType === 'up') {
        optimisticUpvotes -= 1;
      }
      // For downvote removal, upvotes stay same
    } else {
      // Clicking different vote or no previous vote - toggle to new vote
      optimisticVote = voteType;
      if (currentVote === 'up' && voteType === 'down') {
        // Was upvote, now downvote
        optimisticUpvotes -= 1;
      } else if (currentVote === 'down' && voteType === 'up') {
        // Was downvote, now upvote
        optimisticUpvotes += 1;
      } else if (currentVote === null && voteType === 'up') {
        // No previous vote, now upvote
        optimisticUpvotes += 1;
      }
      // For new downvote from no vote, upvotes stay same
    }
    // Optimistic UI updates - update immediately
    setUserVotes(prev => ({
      ...prev,
      [issueId]: optimisticVote
    }));

    setNearbyIssues(prev => prev.map(issue => 
      issue.issueId === issueId 
        ? { ...issue, upvotes: optimisticUpvotes }
        : issue
    ));

    if (selectedIssue && selectedIssue.issueId === issueId) {
      setSelectedIssue(prev => prev ? { ...prev, upvotes: optimisticUpvotes } : null);
    }

    // Then make the API call
    try {
      let response;
      if (voteType === 'up') {
        response = await issueService.upvoteIssue(issueId);
      } else {
        response = await issueService.downvoteIssue(issueId);
      }
      
      // Update with actual server response (in case of discrepancy)
      setUserVotes(prev => ({
        ...prev,
        [issueId]: response.userVote
      }));

      setNearbyIssues(prev => prev.map(issue => 
        issue.issueId === issueId 
          ? { ...issue, upvotes: response.upvotes }
          : issue
      ));

      if (selectedIssue && selectedIssue.issueId === issueId) {
        setSelectedIssue(prev => prev ? { ...prev, upvotes: response.upvotes } : null);
      }
    } catch (error) {
      console.error('Failed to vote on issue:', error);
      
      // Revert optimistic updates on error
      setUserVotes(prev => ({
        ...prev,
        [issueId]: currentVote
      }));

      setNearbyIssues(prev => prev.map(issue => 
        issue.issueId === issueId 
          ? { ...issue, upvotes: currentIssue.upvotes }
          : issue
      ));

      if (selectedIssue && selectedIssue.issueId === issueId) {
        setSelectedIssue(prev => prev ? { ...prev, upvotes: currentIssue.upvotes } : null);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short'
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return formatDate(dateString);
  };

  const handleIssueClick = (issue: Issue) => {
    setDetailModalIssue(issue);
    setDetailModalOpen(true);
  };

  const handleShare = async (issue: Issue) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: issue.title,
          text: issue.description,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      const shareText = `${issue.title}\n${issue.description}\n${window.location.href}`;
      navigator.clipboard.writeText(shareText);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'Submitted': 'bg-yellow-100 text-yellow-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Resolved': 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors] || colors['Submitted'];
  };

  const goToCurrentLocation = async () => {
    try {
      const location = await getCurrentUserLocation();
      setCenter(location);
      
      // Also update the map center if map is already loaded
      if (mapInstance) {
        mapInstance.setCenter(location);
        mapInstance.setZoom(15); // Zoom in when going to current location
      }
    } catch (error) {
      console.error('Failed to get current location:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3 pb-20 -mt-6">
        <div className="flex items-center space-x-3 mb-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Interactive Map</h1>
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
        <Card 
          className="shadow-card h-96 bg-white/80 border border-white/30 backdrop-blur-lg"
          style={{
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          }}
        >
          <CardContent className="p-4 h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-sm text-muted-foreground">Loading map data...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Helper functions for IssueCard component
  const handleVoteAction = async (issueId: string, voteType: 'upvote' | 'downvote') => {
    if (voteType === 'upvote') {
      await handleVote(issueId, 'up');
    } else {
      await handleVote(issueId, 'down');
    }
  };

  const getCategoryAdapter = (category: string) => {
    const categoryInfo = getCategoryInfo(category);
    return {
      icon: iconMap[categoryInfo.icon] || FileText,
      color: categoryInfo.color,
      name: categoryInfo.name
    };
  };

  return (
    <div className="space-y-3 pb-20 -mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Interactive Map</h1>
            <p className="text-sm text-muted-foreground">{issues.length} issues in your area</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <Card 
        className="shadow-card bg-white/80 border border-white/30 backdrop-blur-lg"
        style={{
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        }}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Map Legend</h3>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
              <span>Pending</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-blue-500"></div>
              <span>In Progress</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span>Resolved</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span>Urgent</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map */}
      <Card 
        className="shadow-card overflow-hidden bg-white/80 border border-white/30 backdrop-blur-lg"
        style={{
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        }}
      >
        <div 
          style={{ 
            height: isExpanded ? '450px' : '200px', 
            width: '100%', 
            position: 'relative', 
            zIndex: 1,
            transition: 'height 0.3s ease-in-out'
          }}
        >
          {/* Expand/Collapse Controls */}
          <div className="absolute top-2 right-2 z-10 flex space-x-2">
            {isExpanded && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="bg-white/90 hover:bg-white text-gray-700"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            )}
          </div>
          
          <Wrapper 
            apiKey={GOOGLE_MAPS_API_KEY} 
            render={renderMapStatus}
            libraries={['marker']}
          >
            <GoogleMapComponent
              center={center}
              zoom={isExpanded ? 13 : 12}
              issues={!isGuest ? issues : []}
              onMarkerClick={setSelectedIssue}
              onMapLoad={setMapInstance}
            />
          </Wrapper>
        </div>
      </Card>

      {/* Selected Issue Details */}
      {selectedIssue && (
        <Card 
          className="shadow-card bg-white/80 border border-white/30 backdrop-blur-lg"
          style={{
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          }}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between space-x-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="p-1 rounded" style={{ backgroundColor: getCategoryInfo(selectedIssue.category).color + '20' }}>
                    {renderIcon(getCategoryInfo(selectedIssue.category).icon, "w-4 h-4")}
                  </div>
                  <Badge className={getStatusColor(selectedIssue.status)}>
                    {selectedIssue.status.replace('-', ' ').toUpperCase()}
                  </Badge>
                </div>
                <h3 className="font-semibold text-lg mb-1">{selectedIssue.title}</h3>
                
                {/* Image display */}
                {selectedIssue.imageUrls && selectedIssue.imageUrls.length > 0 && (
                  <div className="mb-3">
                    <img 
                      src={selectedIssue.imageUrls[0]} 
                      alt="Issue" 
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                <p className="text-muted-foreground text-sm mb-3">
                  {selectedIssue.description}
                </p>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{selectedIssue.location.address}</span>
                  </div>
                  <span>•</span>
                  <span>{formatDate(selectedIssue.createdAt)}</span>
                  <span>•</span>
                  <span>{selectedIssue.upvotes} votes</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedIssue(null)}
              >
                ×
              </Button>
            </div>
            
            {selectedIssue.aiSummary && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800 mb-1">Resolution Summary</h4>
                <p className="text-sm text-green-700">{selectedIssue.aiSummary}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Reddit-Style Issue Posts */}
      {nearbyIssues.length > 0 && !isGuest && (
        <Card 
          className="shadow-card bg-white/95 border border-white/40 backdrop-blur-lg"
          style={{
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-xl">Issues Near You</h3>
              <Badge variant="secondary" className="text-xs">
                {nearbyIssues.length} posts
              </Badge>
            </div>
            
            <div className="space-y-4">
              {nearbyIssues.slice(0, 10).map(issue => (
                <IssueCard
                  key={issue.issueId}
                  issue={issue}
                  onIssueClick={handleIssueClick}
                  onVote={handleVoteAction}
                  getCategoryInfo={getCategoryAdapter}
                  formatTimeAgo={formatTimeAgo}
                  user={user}
                />
              ))}
            </div>
            
            {nearbyIssues.length > 10 && (
              <div className="mt-6 text-center">
                <Button variant="outline" className="w-full">
                  View All {nearbyIssues.length} Issues
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="fixed bottom-24 right-4 space-y-2" style={{ zIndex: 100 }}>
        <Button
          onClick={goToCurrentLocation}
          className="h-12 w-12 rounded-full shadow-button bg-blue-500 hover:bg-blue-600"
          size="icon"
          title="Go to my location"
        >
          <Navigation className="h-5 w-5" />
        </Button>
      </div>

      {/* Issue Detail Modal */}
      <IssueDetailModal
        issue={detailModalIssue}
        isOpen={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setDetailModalIssue(null);
        }}
        onVote={handleVote}
        userVote={detailModalIssue ? userVotes[detailModalIssue.issueId] : null}
      />
    </div>
  );
};

export default memo(InteractiveMap);