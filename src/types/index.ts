// Core data models for the dynamic backend-driven application

export interface UserProfile {
  userId: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  aadhaarNumber?: string;
  address?: string;
  city: string;
  state: string;
  pincode: string;
  occupation?: string;
  dateOfBirth?: string;
  joinedDate: string;
  phoneVerified: boolean;
  points: number;
  badges: string[];
}

export interface Issue {
  issueId: string;
  authorId: string;
  authorName: string; // Denormalized for easy display
  authorProfileImageUrl?: string;
  title: string;
  description: string;
  aiSummary?: string;
  imageUrl: string;
  imageUrls?: string[]; // Support for multiple images
  audioUrl?: string; // Support for audio recordings
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  status: 'Submitted' | 'In Progress' | 'Resolved';
  category: 'Sanitation' | 'Public Works' | 'Electrical' | 'General';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  upvotes: number;
  createdAt: string; // ISO 8601 date string
}

// Legacy interfaces for backward compatibility during transition
export interface LegacyIssue {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'resolved' | 'rejected';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  photos: string[];
  submittedBy: string;
  submittedAt: string;
  updatedAt: string;
  assignedTo?: string;
  resolution?: string;
  votes: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  message?: string;
}