import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/utils/api';
import { Issue } from '@/types';
import { ISSUE_CATEGORIES, STATUS_COLORS } from '@/utils/constants';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, MapPin, Navigation, Filter } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const InteractiveMap: React.FC = () => {
  const navigate = useNavigate();
  const { user, isGuest } = useAuth();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [center, setCenter] = useState<[number, number]>([28.6139, 77.2090]); // Default to Delhi
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Get user's current location
      const location = await api.getCurrentLocation();
      setCenter([location.lat, location.lng]);
      
      // Load issues only for authenticated users
      if (!isGuest) {
        const allIssues = await api.getIssues();
        setIssues(allIssues);
      } else {
        setIssues([]); // No issues for guest users
      }
    } catch (error) {
      console.error('Failed to load map data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryInfo = (categoryId: string) => {
    return ISSUE_CATEGORIES.find(cat => cat.id === categoryId) || ISSUE_CATEGORIES[0];
  };

  const getMarkerIcon = (issue: Issue) => {
    const category = getCategoryInfo(issue.category);
    const color = issue.status === 'resolved' ? '#22c55e' : 
                  issue.status === 'in-progress' ? '#3b82f6' : 
                  issue.priority === 'urgent' ? '#ef4444' : '#f59e0b';
    
    return L.divIcon({
      html: `
        <div style="
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
        ">
          ${category.icon}
        </div>
      `,
      className: '',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short'
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const goToCurrentLocation = async () => {
    try {
      const location = await api.getCurrentLocation();
      setCenter([location.lat, location.lng]);
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
            <h1 className="text-2xl font-bold">Interactive Map</h1>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
        <Card className="shadow-card h-96">
          <CardContent className="p-4 h-full flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading map data...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold">Interactive Map</h1>
            <p className="text-muted-foreground">{issues.length} issues in your area</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={goToCurrentLocation}
            title="Go to current location"
          >
            <Navigation className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Legend */}
      <Card className="shadow-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Map Legend</h3>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
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
      <Card className="shadow-card overflow-hidden">
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
          
          <MapContainer
            center={center}
            zoom={isExpanded ? 13 : 12}
            style={{ height: '100%', width: '100%', zIndex: 1 }}
            whenReady={() => {
              // Map is ready
            }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {!isGuest && issues.map((issue) => (
              <Marker
                key={issue.id}
                position={[issue.location.lat, issue.location.lng]}
                icon={getMarkerIcon(issue)}
                eventHandlers={{
                  click: () => setSelectedIssue(issue),
                }}
              >
                <Popup>
                  <div className="p-2 min-w-[250px]">
                    <div className="flex items-center space-x-2 mb-2">
                      <span>{getCategoryInfo(issue.category).icon}</span>
                      <Badge className={getStatusColor(issue.status)}>
                        {issue.status.replace('-', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    <h3 className="font-semibold mb-1">{issue.title}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {issue.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{formatDate(issue.submittedAt)}</span>
                      <span>{issue.votes} votes</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          
          {/* Click to Expand Overlay (only when not expanded) */}
          {!isExpanded && (
            <div 
              className="absolute inset-0 bg-black/20 flex items-center justify-center cursor-pointer z-10"
              onClick={() => setIsExpanded(true)}
            >
              <div className="bg-white/90 px-4 py-2 rounded-lg shadow-lg">
                <span className="text-sm font-medium text-gray-700">Click to Expand Map</span>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Selected Issue Details */}
      {selectedIssue && (
        <Card className="shadow-card border-primary">
          <CardContent className="p-4">
            <div className="flex items-start justify-between space-x-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg">{getCategoryInfo(selectedIssue.category).icon}</span>
                  <Badge className={getStatusColor(selectedIssue.status)}>
                    {selectedIssue.status.replace('-', ' ').toUpperCase()}
                  </Badge>
                </div>
                <h3 className="font-semibold text-lg mb-1">{selectedIssue.title}</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  {selectedIssue.description}
                </p>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{selectedIssue.location.address}</span>
                  </div>
                  <span>•</span>
                  <span>{formatDate(selectedIssue.submittedAt)}</span>
                  <span>•</span>
                  <span>{selectedIssue.votes} votes</span>
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
            
            {selectedIssue.resolution && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800 mb-1">Resolution</h4>
                <p className="text-sm text-green-700">{selectedIssue.resolution}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="fixed bottom-24 right-4 space-y-2" style={{ zIndex: 100 }}>
        <Button
          onClick={() => navigate('/upload')}
          className="h-12 w-12 rounded-full shadow-button"
          size="icon"
        >
          +
        </Button>
      </div>
    </div>
  );
};

export default InteractiveMap;