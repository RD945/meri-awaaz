# 🗣️ Meri Awaaz - Civic Voice Platform

**Empowering citizens to report issues and improve their communities**

Meri Awaaz is a production-ready, modern civic engagement platform built with React 18 and TypeScript that enables citizens to report municipal issues, track their resolution, engage with their community, and participate in civic improvement through a sophisticated, mobile-first interface.

## 🎯 Project Overview

### Mission Statement
To bridge the gap between citizens and local governance by providing a transparent, accessible, and engaging platform for civic participation and community issue resolution.

### Target Audience
- **Citizens**: Report and track civic issues in their community
- **Local Government**: Monitor and respond to community concerns
- **Community Leaders**: Facilitate civic engagement and awareness

### Key Value Propositions
- **Transparency**: Real-time tracking of issue resolution status
- **Accessibility**: Mobile-first design with guest mode support
- **Engagement**: Gamification system to encourage active participation
- **Efficiency**: Streamlined reporting with location, photo, and audio capture

## ✨ Comprehensive Feature Set

### 🔐 **Advanced Authentication System**
- **Multi-Provider Authentication**: 
  - Firebase Google OAuth integration
  - Email/password authentication with secure validation
  - Guest mode for anonymous browsing and exploration
- **Phone Verification**: 
  - Twilio SMS-based verification for account security
  - Optional verification with skip functionality
  - International phone number support
- **Session Management**: 
  - Persistent login across browser sessions
  - Automatic token refresh and secure logout
  - Profile synchronization with backend API

### 📱 **Sophisticated Issue Reporting System**
- **Multi-Media Reporting**: 
  - Photo upload (up to 5 images per issue)
  - Voice recording with playback functionality
  - Rich text descriptions with category tagging
- **Smart Location Services**: 
  - GPS-based automatic location detection
  - Manual location selection with address lookup
  - Geofencing for relevant issue discovery
- **Priority Classification**: 
  - Four-tier priority system (low, medium, high, urgent)
  - Visual priority indicators with color coding
  - Admin-configurable priority workflows

### 🗺️ **Interactive Mapping & Visualization**
- **Google Maps Integration**: 
  - Custom markers for different issue categories
  - Real-time issue clustering for performance optimization
  - Zoom-based detail levels and marker aggregation
- **Community Engagement**: 
  - Upvote/downvote system for issue validation
  - Real-time vote updates without page refresh
  - Community consensus tracking and reporting
- **Advanced Filtering**: 
  - Category-based issue filtering
  - Status-based views (pending, in-progress, resolved)
  - Date range and location radius filtering

### 🏆 **Comprehensive Gamification System**
- **Achievement Badges**: 
  - Progressive badge system for user engagement
  - Tiered achievements (Reporter → Community Helper → Super Citizen)
  - Special recognition for problem solvers and engagement champions
- **Point System**: 
  - Points for issue reporting, community engagement, and resolutions
  - Level progression based on cumulative points
  - Leaderboard rankings for community recognition
- **Social Features**: 
  - User profiles with achievement showcases
  - Community statistics and engagement metrics
  - Social sharing capabilities for issue awareness

### � **Administrative & Management Features**
- **Issue Lifecycle Management**: 
  - Complete status tracking from submission to resolution
  - Admin notes and update capabilities
  - Resolution confirmation and feedback collection
- **User Management**: 
  - Comprehensive user profiles with statistics
  - Role-based access control preparation
  - Community moderation tools integration-ready

### � **Modern UI/UX Design System**
- **Design Philosophy**: 
  - Mobile-first responsive design principles
  - Glass morphism with subtle backdrop blur effects
  - Consistent design tokens and theming system
- **Accessibility Features**: 
  - WCAG 2.1 AA compliance with shadcn/ui components
  - Keyboard navigation support throughout
  - Screen reader optimization and ARIA labels
- **Performance Optimization**: 
  - Component lazy loading and code splitting
  - Image optimization and progressive loading
  - Efficient state management with React Query

## 🏗️ Technical Architecture

### Core Technology Stack

#### **Frontend Framework & Tools**
- **React 18.3.1**: Modern React with concurrent features, hooks, and Suspense
- **TypeScript 5.5.3**: Strict type safety with comprehensive interface definitions
- **Vite 5.4.1**: Lightning-fast build tool with HMR and optimized production builds
- **React Router DOM 6.26.1**: Declarative client-side routing with protection guards

#### **Styling & UI Components**
- **Tailwind CSS 3.4.10**: Utility-first CSS framework with custom design tokens
- **shadcn/ui**: High-quality, accessible React component library built on Radix UI
- **Radix UI**: Unstyled, accessible primitives for complex UI components
- **Lucide React**: Beautiful, customizable SVG icons with tree-shaking support

#### **State Management & Data Fetching**
- **TanStack React Query 5.51.23**: Powerful server state management with caching
- **React Context API**: Global state management for authentication and user data
- **Axios 1.7.4**: Promise-based HTTP client with interceptors and error handling

#### **External Services Integration**
- **Firebase 10.13.0**: Authentication, Firestore database, and cloud storage
- **Twilio**: SMS verification service for secure phone number validation
- **Google Maps**: Interactive mapping with custom markers and geolocation

#### **Development & Build Tools**
- **ESLint**: Code quality and consistency enforcement
- **PostCSS**: CSS processing with future CSS features
- **TypeScript Compiler**: Strict type checking and compilation

### Project Architecture Pattern

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
├─────────────────────────────────────────────────────────────┤
│  Components (Auth, Dashboard, Profile, Layout)             │
│  Pages (GetStarted, Dashboard, UploadIssue, etc.)         │
│  UI Library (shadcn/ui components)                        │
├─────────────────────────────────────────────────────────────┤
│                    Application Layer                        │
├─────────────────────────────────────────────────────────────┤
│  Contexts (AuthContext for global state)                  │
│  Hooks (Custom hooks for reusable logic)                  │
│  Utils (Helper functions and constants)                   │
├─────────────────────────────────────────────────────────────┤
│                    Service Layer                           │
├─────────────────────────────────────────────────────────────┤
│  API Client (Axios instance with interceptors)            │
│  API Services (User, Issue, File services)                │
│  External Services (Firebase, Twilio, Google Maps)        │
├─────────────────────────────────────────────────────────────┤
│                    Data Layer                              │
├─────────────────────────────────────────────────────────────┤
│  TypeScript Interfaces (Type definitions)                 │
│  Constants (Categories, badges, configurations)           │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start & Installation

### System Requirements
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher (or yarn/pnpm equivalent)
- **Modern Browser**: Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+
- **Python 3.8+**: For backend (optional for frontend development)

### 1. Repository Setup
```bash
# Clone the repository
git clone https://github.com/your-username/meri-awaaz-civic-voice.git
cd meri-awaaz-civic-voice-main

# Install frontend dependencies
npm install

# Verify installation
npm audit
```

### 2. Environment Configuration

Copy and configure environment variables:

```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` with your configuration:

```bash
# Firebase Configuration (Required for authentication)
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id

# Backend API Configuration (optional for development)
VITE_API_BASE_URL=http://localhost:8000/api

# External Services (optional)
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### 3. Development Modes

#### Option A: Frontend Only (Recommended for UI Development)
Perfect for getting started quickly:

```bash
# Start the development server
npm run dev

# The application will be available at:
# Local:   http://localhost:5173/
```

**Features available:**
- ✅ Firebase authentication
- ✅ Mock data for testing
- ✅ All UI components
- ✅ Responsive design testing
- ✅ Guest mode functionality

#### Option B: Full Stack Development

For complete feature testing including backend API:

1. **Set up backend:**
   ```bash
   cd backend
   pip install -r requirements.txt
   
   # Create backend environment (optional)
   cp .env.example .env
   
   # Start backend
   python main.py
   ```

2. **Start frontend:**
   ```bash
   npm run dev
   ```

**Additional features:**
- ✅ Real API endpoints
- ✅ Data persistence (if database configured)
- ✅ SMS verification (if Twilio configured)
- ✅ Background processing

### 4. Firebase Project Setup (Required)

#### 4.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enable Google Analytics (recommended)
4. Wait for project creation to complete

#### 4.2 Configure Authentication
```bash
# In Firebase Console:
1. Navigate to Authentication > Sign-in method
2. Enable Email/Password provider
3. Enable Google provider (optional)
4. Configure authorized domains for your app
```

#### 4.3 Get Configuration Keys
```javascript
// In Firebase Console > Project Settings > General
// Copy the firebaseConfig object values to your .env file
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

### 5. Production Build
```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview

# Build output will be in the 'dist' directory
```

## 🔧 Development Guide

For detailed development instructions, troubleshooting, and architecture information, see [DEVELOPMENT.md](./DEVELOPMENT.md).

## 🐛 Troubleshooting

### Common Issues

1. **"Network Error" in console:**
   - Backend is not running or wrong URL
   - Check `VITE_API_BASE_URL` in `.env`
   - App will work in frontend-only mode

2. **Authentication not working:**
   - Check Firebase configuration in `.env`
   - Verify Firebase project settings
   - Check browser console for specific errors

3. **Build errors:**
   - Ensure all required environment variables are set
   - Check Node.js version compatibility
   - Clear npm cache: `npm cache clean --force`

### Getting Help

- 📖 Read [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed setup
- 🔍 Check [CODE_REVIEW_FIXES.md](./CODE_REVIEW_FIXES.md) for recent improvements
- 🐛 Search existing issues or create a new one
- 💬 Check the console logs for error details

## 🔄 Comprehensive User Workflows

### 🌟 **New User Onboarding Journey**

#### Step 1: Welcome & Initial Choice
```typescript
// Users land on GetStarted component
interface UserChoices {
  signUp: () => void;           // Create new account
  signIn: () => void;           // Login to existing account  
  continueAsGuest: () => void;  // Explore without account
}
```

**Features:**
- Clean, welcoming interface with clear value proposition
- Three distinct paths to accommodate different user preferences
- Responsive design that works across all device sizes

#### Step 2: Account Creation Process
```typescript
// SignUp flow with comprehensive validation
interface SignUpData {
  email: string;        // Email validation with format checking
  password: string;     // Strong password requirements
  confirmPassword: string; // Password confirmation matching
  acceptTerms: boolean; // Terms and conditions acceptance
}
```

**Security Features:**
- Real-time email format validation
- Password strength indicator with requirements
- Secure password hashing via Firebase Authentication
- GDPR-compliant terms and privacy policy acceptance

#### Step 3: Phone Verification (Optional)
```typescript
// Twilio-powered SMS verification
interface PhoneVerificationFlow {
  phoneNumber: string;     // International format support
  verificationCode: string; // 6-digit SMS code
  skipOption: boolean;     // Allow users to skip if needed
}
```

**Implementation Details:**
- International phone number format validation
- Rate limiting to prevent SMS spam
- Graceful fallback if verification fails
- Option to complete verification later from settings

### 🏠 **Dashboard Experience & Navigation**

#### Main Dashboard Features
```typescript
interface DashboardData {
  recentIssues: Issue[];        // Latest community issues
  userStats: UserStatistics;   // Personal engagement metrics
  quickActions: QuickAction[]; // Fast access to common tasks
  notifications: Notification[]; // Real-time updates
}

interface UserStatistics {
  issuesReported: number;    // Total issues submitted
  issuesResolved: number;    // Issues marked as resolved
  totalUpvotes: number;      // Community validation received
  currentLevel: number;      // Gamification level
  nextLevelProgress: number; // Progress to next level (%)
}
```

**Dashboard Sections:**
1. **Hero Section**: Welcome message with user's name and quick stats
2. **Quick Actions Grid**: 
   - Report New Issue (primary CTA)
   - View My Issues (personal tracking)
   - Explore Map (community overview)
   - Profile Management (account settings)
3. **Recent Activity Feed**: Latest issues from the community
4. **Achievement Highlights**: Latest badges and milestones

### 📍 **Detailed Issue Reporting Process**

#### Multi-Step Issue Creation
```typescript
interface IssueCreationForm {
  // Basic Information
  title: string;              // Clear, descriptive title
  description: string;        // Detailed problem description
  category: string;           // Predefined category selection
  priority: Priority;         // User-assessed priority level
  
  // Location Data
  location: {
    latitude: number;         // GPS coordinates
    longitude: number;        // GPS coordinates  
    address: string;          // Human-readable address
    manuallySet: boolean;     // Whether user manually set location
  };
  
  // Media Attachments
  photos: File[];            // Up to 5 images (max 10MB each)
  audioRecording?: Blob;     // Optional voice description
  
  // Metadata
  reportedAt: string;        // ISO timestamp
  reportedBy: string;        // User ID reference
}
```

#### Step-by-Step Process
1. **Issue Details Entry**:
   - Rich text editor for description
   - Category selection from predefined list
   - Priority assessment with visual indicators

2. **Location Capture**:
   ```javascript
   // Automatic GPS detection
   navigator.geolocation.getCurrentPosition(
     (position) => {
       const { latitude, longitude } = position.coords;
       // Reverse geocoding for address lookup
       reverseGeocode(latitude, longitude);
     },
     (error) => handleLocationError(error),
     { enableHighAccuracy: true, timeout: 10000 }
   );
   ```

3. **Media Upload System**:
   - Drag-and-drop photo upload interface
   - Real-time image preview with crop suggestions
   - Voice recording with playback functionality
   - Progress indicators for upload status

4. **Review & Submit**:
   - Summary preview of all entered data
   - Final validation checks
   - Submission with loading state and success confirmation

### 👤 **Profile Management & Settings**

#### Comprehensive Profile System
```typescript
interface UserProfile {
  // Basic Information
  uid: string;              // Unique user identifier
  email: string;            // Primary email address
  displayName: string;      // Public display name
  photoURL?: string;        // Profile picture URL
  phoneNumber?: string;     // Verified phone number
  
  // Location & Preferences  
  location?: string;        // Primary location/city
  notificationPreferences: {
    emailUpdates: boolean;
    smsUpdates: boolean;
    pushNotifications: boolean;
    issueStatusUpdates: boolean;
    communityDigest: boolean;
  };
  
  // Engagement Metrics
  joinedDate: string;       // Account creation date
  issuesReported: number;   // Total issues submitted
  issuesResolved: number;   // Issues marked as resolved
  totalUpvotes: number;     // Community validation received
  badges: string[];         // Earned achievement badges
  level: number;            // Current gamification level
  points: number;           // Total engagement points
  
  // Privacy Settings
  profileVisibility: 'public' | 'community' | 'private';
  showRealName: boolean;
  showLocation: boolean;
  showStatistics: boolean;
}
```

#### Profile Features
- **Avatar Management**: Upload and crop profile pictures
- **Achievement Gallery**: Display earned badges with descriptions
- **Statistics Dashboard**: Visual representation of engagement metrics
- **Privacy Controls**: Granular control over information visibility
- **Account Security**: Password change, two-factor authentication setup

## � Detailed Code Architecture & Implementation

### 🏗️ Core Application Structure

```
src/
├── components/                 # Feature-organized components
│   ├── Auth/                  # Authentication flow components
│   │   ├── GetStarted.tsx     # Landing page with sign-up options
│   │   ├── SignIn.tsx         # Email/password login form
│   │   ├── SignUpFlow.tsx     # Multi-step registration process
│   │   └── PhoneVerification.tsx # SMS verification component
│   ├── Dashboard/             # Core application features
│   │   ├── Dashboard.tsx      # Main dashboard with recent issues
│   │   ├── UploadIssue.tsx    # Issue creation form with media upload
│   │   ├── MyIssues.tsx       # Personal issue tracking interface
│   │   └── InteractiveMap.tsx # Google Maps integration with markers
│   ├── Layout/                # Application layout components
│   │   ├── Header.tsx         # Top navigation with user actions
│   │   └── Navigation.tsx     # Bottom navigation for mobile
│   ├── Profile/               # User profile and gamification
│   │   ├── Profile.tsx        # User profile display and editing
│   │   ├── Awards.tsx         # Achievement and badge showcase
│   │   └── Settings.tsx       # User preferences and account settings
│   └── ui/                    # Reusable UI component library (shadcn/ui)
├── contexts/                  # React Context providers
│   └── AuthContext.tsx        # Global authentication state management
├── hooks/                     # Custom React hooks
│   ├── use-mobile.tsx         # Mobile device detection hook
│   └── use-toast.ts           # Toast notification management
├── lib/                       # Core utilities and service integrations
│   ├── apiClient.ts           # Axios HTTP client with interceptors
│   ├── apiService.ts          # Backend API service layer
│   ├── firebase.ts            # Firebase configuration and initialization
│   ├── twilio.ts              # Twilio service integration
│   └── utils.ts               # General utility functions
├── pages/                     # Page-level components
│   └── NotFound.tsx           # 404 error page
├── types/                     # TypeScript type definitions
│   └── index.ts               # Centralized interface definitions
├── utils/                     # Helper functions and constants
│   ├── api.ts                 # API helper functions
│   └── constants.ts           # Application constants and enums
├── App.tsx                    # Main application component with routing
├── main.tsx                   # Application entry point
└── index.css                  # Global styles and Tailwind imports
```

### 🔒 Authentication System Implementation

#### AuthContext Provider
```typescript
// src/contexts/AuthContext.tsx
interface AuthContextType {
  user: User | null;                    // Firebase user object
  userProfile: UserProfile | null;     // Extended profile from backend
  isGuest: boolean;                     // Guest mode state
  loading: boolean;                     // Authentication loading state
  
  // Authentication methods
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  
  // User state management
  continueAsGuest: () => void;
  verifyPhone: (phoneNumber: string) => void;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  // Firebase authentication state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Sync user profile with backend
        try {
          const profile = await userService.getProfile();
          setUserProfile(profile);
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Implementation of authentication methods...
};
```

#### Firebase Configuration
```typescript
// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Environment validation
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN', 
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !import.meta.env[envVar]);
if (missingEnvVars.length > 0) {
  console.error('Missing Firebase environment variables:', missingEnvVars);
  throw new Error('Firebase configuration incomplete');
}

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

### 🌐 API Service Layer Architecture

#### HTTP Client Configuration
```typescript
// src/lib/apiClient.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { auth } from './firebase';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for Firebase JWT tokens
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Failed to get auth token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      auth.signOut();
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

#### Service Layer Implementation
```typescript
// src/lib/apiService.ts
import apiClient from './apiClient';
import { UserProfile, Issue, CreateIssueRequest, IssueFilters, PaginatedResponse, ApiResponse } from '@/types';

// User management service
export const userService = {
  getProfile: (): Promise<UserProfile> =>
    apiClient.get('/users/profile').then(res => res.data),
    
  updateProfile: (data: Partial<UserProfile>): Promise<UserProfile> =>
    apiClient.put('/users/profile', data).then(res => res.data),
    
  uploadAvatar: (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('avatar', file);
    return apiClient.post('/users/upload-avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data.url);
  },
};

// Issue management service
export const issueService = {
  getIssues: (params: IssueFilters): Promise<PaginatedResponse<Issue>> =>
    apiClient.get('/issues', { params }).then(res => res.data),
    
  getIssueById: (id: string): Promise<Issue> =>
    apiClient.get(`/issues/${id}`).then(res => res.data),
    
  createIssue: (data: CreateIssueRequest): Promise<Issue> =>
    apiClient.post('/issues', data).then(res => res.data),
    
  updateIssue: (id: string, data: Partial<Issue>): Promise<Issue> =>
    apiClient.put(`/issues/${id}`, data).then(res => res.data),
    
  deleteIssue: (id: string): Promise<void> =>
    apiClient.delete(`/issues/${id}`).then(() => undefined),
    
  upvoteIssue: (id: string): Promise<{ upvotes: number; hasUserUpvoted: boolean }> =>
    apiClient.post(`/issues/${id}/upvote`).then(res => res.data),
    
  downvoteIssue: (id: string): Promise<{ downvotes: number; hasUserDownvoted: boolean }> =>
    apiClient.post(`/issues/${id}/downvote`).then(res => res.data),
};

// File upload service
export const fileService = {
  uploadImage: (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    return apiClient.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data.url);
  },
  
  uploadAudio: (blob: Blob): Promise<string> => {
    const formData = new FormData();
    formData.append('audio', blob, 'recording.webm');
    return apiClient.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => res.data.url);
  },
};

// Centralized error handling
export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred. Please try again.';
};
```

### 📱 Component Implementation Examples

#### Dashboard Component
```typescript
// src/components/Dashboard/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { issueService, handleApiError } from '@/lib/apiService';
import { Issue } from '@/types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, isGuest } = useAuth();
  const [recentIssues, setRecentIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isGuest) {
      fetchRecentIssues();
    }
  }, [isGuest]);

  const fetchRecentIssues = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await issueService.getIssues({ 
        page: 1, 
        limit: 3 
      });
      setRecentIssues(response.data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
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
    // Additional quick actions...
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">
          Welcome{user?.displayName ? `, ${user.displayName}` : ''}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Make your voice heard in your community
        </p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-4">
        {quickActions.map((action, index) => (
          <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(action.path)}>
            <CardContent className="flex flex-col items-center p-6">
              <div className={`${action.color} rounded-full p-3 mb-3`}>
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-center">{action.title}</h3>
              <p className="text-sm text-muted-foreground text-center mt-1">
                {action.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Issues Section */}
      {!isGuest && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Community Issues</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <p className="text-red-600 text-center">{error}</p>
            ) : recentIssues.length > 0 ? (
              <div className="space-y-4">
                {recentIssues.map((issue) => (
                  <div key={issue.id} className="border rounded-lg p-3">
                    <h4 className="font-medium">{issue.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {issue.description.substring(0, 100)}...
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge variant="outline">{issue.category}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(issue.reportedAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">
                No recent issues to display
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
```

### 🎯 TypeScript Type System

#### Core Data Models
```typescript
// src/types/index.ts

// User Profile Interface
export interface UserProfile {
  uid: string;                    // Firebase user ID
  email: string;                  // Primary email address
  displayName: string;            // User's display name
  photoURL?: string;              // Profile picture URL
  phoneNumber?: string;           // Verified phone number
  isPhoneVerified: boolean;       // Phone verification status
  location?: string;              // User's location/city
  joinedDate: string;             // Account creation date (ISO string)
  issuesReported: number;         // Total issues submitted by user
  issuesResolved: number;         // Issues resolved for this user
  totalUpvotes: number;           // Total upvotes received across all issues
  badges: string[];               // Array of earned badge IDs
  level: number;                  // Current gamification level
  points: number;                 // Total engagement points earned
}

// Issue Management Interface
export interface Issue {
  id: string;                     // Unique issue identifier
  title: string;                  // Issue title (max 100 chars)
  description: string;            // Detailed description (max 1000 chars)
  category: string;               // Category ID from ISSUE_CATEGORIES
  priority: 'low' | 'medium' | 'high' | 'urgent'; // Priority level
  status: 'pending' | 'in-progress' | 'resolved' | 'rejected'; // Current status
  
  // Location Information
  location: {
    latitude: number;             // GPS latitude coordinate
    longitude: number;            // GPS longitude coordinate
    address: string;              // Human-readable address
  };
  
  // Ownership and Timestamps
  reportedBy: string;             // User ID of reporter
  reportedAt: string;             // Creation timestamp (ISO string)
  updatedAt: string;              // Last update timestamp (ISO string)
  
  // Media Attachments
  photos: string[];               // Array of photo URLs (max 5)
  audioUrl?: string;              // Optional audio recording URL
  
  // Community Engagement
  upvotes: number;                // Total upvotes received
  downvotes: number;              // Total downvotes received
  hasUserUpvoted?: boolean;       // Current user's upvote status
  hasUserDownvoted?: boolean;     // Current user's downvote status
  
  // Administrative Fields
  adminNotes?: string;            // Admin comments on the issue
  resolvedAt?: string;            // Resolution timestamp (ISO string)
  resolvedBy?: string;            // Admin/User ID who resolved issue
}

// Legacy Issue Support for Migration
export interface LegacyIssue {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  date: string;
  image?: string;
  location?: string;
  votes: number;
  hasVoted: boolean;
}

// Category Definition
export interface Category {
  id: string;                     // Unique category identifier
  name: string;                   // Display name for category
  icon: string;                   // Unicode emoji or icon identifier
  color: string;                  // Hex color code for theming
}

// Achievement Badge System
export interface Badge {
  id: string;                     // Unique badge identifier
  name: string;                   // Badge display name
  description: string;            // Badge description
  icon: string;                   // Unicode emoji or icon identifier
  condition: string;              // Human-readable earning condition
}

// Notification System
export interface Notification {
  id: string;                     // Unique notification ID
  userId: string;                 // Target user ID
  title: string;                  // Notification title
  message: string;                // Notification body
  type: 'info' | 'success' | 'warning' | 'error'; // Notification type
  isRead: boolean;                // Read status
  createdAt: string;              // Creation timestamp (ISO string)
  relatedIssueId?: string;        // Optional related issue ID
  actionUrl?: string;             // Optional action URL
}

// API Response Wrapper
export interface ApiResponse<T> {
  success: boolean;               // Request success status
  data: T;                        // Response payload
  message?: string;               // Optional message
  error?: string;                 // Optional error message
}

// Paginated Response
export interface PaginatedResponse<T> {
  data: T[];                      // Array of items
  pagination: {
    page: number;                 // Current page number
    limit: number;                // Items per page
    total: number;                // Total item count
    totalPages: number;           // Total page count
    hasNext: boolean;             // Has next page flag
    hasPrev: boolean;             // Has previous page flag
  };
}

// Issue Filtering and Search
export interface IssueFilters {
  page?: number;                  // Page number (default: 1)
  limit?: number;                 // Items per page (default: 10)
  category?: string;              // Filter by category
  status?: string;                // Filter by status
  priority?: string;              // Filter by priority
  reportedBy?: string;            // Filter by reporter user ID
  dateFrom?: string;              // Filter by date range start
  dateTo?: string;                // Filter by date range end
  search?: string;                // Search in title/description
  sortBy?: 'date' | 'upvotes' | 'priority'; // Sort criteria
  sortOrder?: 'asc' | 'desc';     // Sort direction
}

// Issue Creation Request
export interface CreateIssueRequest {
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  photos: string[];               // URLs of uploaded photos
  audioUrl?: string;              // URL of uploaded audio
}

// User Statistics for Dashboard
export interface UserStatistics {
  issuesReported: number;
  issuesResolved: number;
  totalUpvotes: number;
  currentLevel: number;
  pointsToNextLevel: number;
  recentBadges: Badge[];
  weeklyActivity: {
    issuesThisWeek: number;
    upvotesThisWeek: number;
  };
}
```

### 🎨 UI Component System (shadcn/ui Integration)

#### Component Library Structure
```typescript
// Core UI Components from shadcn/ui
import { Button } from '@/components/ui/button';              // Accessible button component
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Card layouts
import { Input } from '@/components/ui/input';                // Form input fields
import { Label } from '@/components/ui/label';                // Form labels
import { Textarea } from '@/components/ui/textarea';          // Multi-line text input
import { Badge } from '@/components/ui/badge';                // Status indicators
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // User avatars
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'; // Modal dialogs
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Dropdown selects
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'; // Tab navigation
import { toast } from '@/components/ui/use-toast';           // Toast notifications

// Custom Component Examples
interface ButtonVariants {
  variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size: 'default' | 'sm' | 'lg' | 'icon';
}

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

// Usage Examples in Components
const ExampleUsage = () => (
  <div className="space-y-4">
    <Card>
      <CardHeader>
        <CardTitle>Issue Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Issue Title</Label>
            <Input 
              id="title" 
              placeholder="Describe the issue briefly"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description"
              placeholder="Provide detailed description"
              className="mt-1"
              rows={4}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="default">Submit Issue</Button>
            <Button variant="outline">Save Draft</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);
```

### 🗺️ Google Maps Integration

#### Interactive Map Implementation
```typescript
// src/components/Dashboard/InteractiveMap.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { issueService } from '@/lib/apiService';
import { Issue } from '@/types';
import { ISSUE_CATEGORIES, STATUS_COLORS } from '@/utils/constants';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

interface GoogleMapProps {
  center: { lat: number; lng: number };
  zoom: number;
  issues: Issue[];
  onMarkerClick: (issue: Issue) => void;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ center, zoom, issues, onMarkerClick }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  // Initialize Google Map
  useEffect(() => {
    if (mapRef.current && !map) {
      const newMap = new google.maps.Map(mapRef.current, {
        center,
        zoom,
        styles: [
          // Custom map styling for better integration
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ],
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true
      });
      setMap(newMap);
    }
  }, [mapRef, map, center, zoom]);

  // Create markers for issues
  useEffect(() => {
    if (!map || !issues.length) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));

    const newMarkers = issues.map(issue => {
      const category = ISSUE_CATEGORIES.find(cat => cat.id === issue.category);
      
      // Create custom marker icon based on category and status
      const markerIcon = {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="14" fill="${category?.color || '#6b7280'}" stroke="white" stroke-width="2"/>
            <text x="16" y="20" text-anchor="middle" font-family="Arial" font-size="12" fill="white">
              ${category?.icon || '📝'}
            </text>
          </svg>
        `)}`,
        scaledSize: new google.maps.Size(32, 32),
        anchor: new google.maps.Point(16, 16)
      };

      const marker = new google.maps.Marker({
        position: { lat: issue.location.latitude, lng: issue.location.longitude },
        map,
        icon: markerIcon,
        title: issue.title,
        animation: google.maps.Animation.DROP
      });

      // Add click listener for marker
      marker.addListener('click', () => {
        onMarkerClick(issue);
      });

      return marker;
    });

    setMarkers(newMarkers);
  }, [map, issues, onMarkerClick]);

  return <div ref={mapRef} className="w-full h-full rounded-lg" />;
};

// Map loading component
const MapLoader = ({ status }: { status: Status }) => {
  if (status === Status.LOADING) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  if (status === Status.FAILURE) {
    return (
      <div className="w-full h-64 bg-red-50 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Failed to load map</p>
          <p className="text-sm text-red-500 mt-1">Please check your internet connection</p>
        </div>
      </div>
    );
  }

  return null;
};

// Main Interactive Map Component
const InteractiveMap: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>({
    lat: 40.7128, lng: -74.0060 // Default to NYC
  });
  const [loading, setLoading] = useState(false);

  // Fetch issues on component mount
  useEffect(() => {
    fetchIssues();
    getCurrentLocation();
  }, []);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const response = await issueService.getIssues({ 
        limit: 100, // Get all issues for map display
        status: 'pending,in-progress' // Only show active issues
      });
      setIssues(response.data);
    } catch (error) {
      console.error('Failed to fetch issues:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    }
  };

  const handleMarkerClick = (issue: Issue) => {
    setSelectedIssue(issue);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Community Issues Map</h1>
        <Button onClick={fetchIssues} disabled={loading} size="sm">
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      <div className="h-96 rounded-lg overflow-hidden border">
        <Wrapper apiKey={GOOGLE_MAPS_API_KEY} render={MapLoader}>
          <GoogleMap
            center={userLocation}
            zoom={13}
            issues={issues}
            onMarkerClick={handleMarkerClick}
          />
        </Wrapper>
      </div>

      {/* Issue Details Modal */}
      {selectedIssue && (
        <Dialog open={!!selectedIssue} onOpenChange={() => setSelectedIssue(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedIssue.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {selectedIssue.description}
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{selectedIssue.category}</Badge>
                <Badge variant={selectedIssue.priority === 'urgent' ? 'destructive' : 'secondary'}>
                  {selectedIssue.priority}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                📍 {selectedIssue.location.address}
              </p>
              {selectedIssue.photos.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {selectedIssue.photos.slice(0, 4).map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`Issue photo ${index + 1}`}
                      className="w-full h-20 object-cover rounded"
                    />
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default InteractiveMap;
```

### 📱 Mobile-First Design Implementation

#### Responsive Design Strategy
```css
/* src/index.css - Mobile-first utility classes */

/* Glass morphism effects */
.glass-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.glass-dark {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Mobile navigation optimizations */
.mobile-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 50;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

/* Touch-friendly interactions */
.touch-target {
  min-height: 44px;
  min-width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Content spacing for mobile */
.main-content {
  padding-bottom: 6rem; /* Space for bottom navigation */
  min-height: calc(100vh - 4rem); /* Account for header */
}

/* Responsive typography */
@media (max-width: 768px) {
  .responsive-text {
    font-size: 0.875rem;
    line-height: 1.25rem;
  }
  
  .responsive-heading {
    font-size: 1.25rem;
    line-height: 1.75rem;
  }
}

/* Image optimization for mobile */
.mobile-image {
  max-width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 0.5rem;
}

/* Form optimizations */
.mobile-form {
  padding: 1rem;
  margin: 0 auto;
  max-width: 28rem;
}

.mobile-input {
  font-size: 16px; /* Prevents zoom on iOS */
  padding: 0.75rem;
  border-radius: 0.5rem;
}
```

#### Layout Components
```typescript
// src/components/Layout/Header.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, Menu, LogOut } from 'lucide-react';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, userProfile, isGuest, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">MA</span>
            </div>
            <span className="font-bold text-lg text-gray-900">Meri Awaaz</span>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-2">
            {!isGuest && (
              <>
                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/notifications')}
                  className="relative"
                >
                  <Bell className="h-5 w-5" />
                  {/* Notification badge */}
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    3
                  </span>
                </Button>

                {/* User Profile */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/profile')}
                  className="p-0"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userProfile?.photoURL || user?.photoURL || ''} />
                    <AvatarFallback>
                      {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </>
            )}

            {/* Sign Out for authenticated users */}
            {(user || isGuest) && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                title="Sign Out"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
```

```typescript
// src/components/Layout/Navigation.tsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Home, Upload, FileText, Map, User } from 'lucide-react';

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
  requiresAuth?: boolean;
}

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isGuest } = useAuth();

  const navItems: NavItem[] = [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: Upload, label: 'Report', path: '/upload' },
    { icon: FileText, label: 'My Issues', path: '/my-issues', requiresAuth: true },
    { icon: Map, label: 'Map', path: '/map' },
    { icon: User, label: 'Profile', path: '/profile', requiresAuth: true },
  ];

  const filteredNavItems = navItems.filter(item => {
    if (item.requiresAuth && isGuest) {
      return false;
    }
    return true;
  });

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200">
      <div className="max-w-md mx-auto px-2 py-2">
        <div className="flex justify-around">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Button
                key={item.path}
                variant="ghost"
                size="sm"
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center h-12 min-w-0 px-2 ${
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-600 hover:text-primary hover:bg-primary/5'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-primary' : ''}`} />
                <span className={`text-xs mt-1 truncate ${isActive ? 'text-primary font-medium' : ''}`}>
                  {item.label}
                </span>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
```

## 🚀 Deployment & Production Setup

### Frontend Deployment Options

#### Vercel Deployment (Recommended)
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy from project root
vercel

# 4. Set environment variables in Vercel dashboard
# Navigate to Project Settings > Environment Variables
# Add all VITE_* environment variables
```

**Vercel Configuration (vercel.json)**:
```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_FIREBASE_API_KEY": "@firebase-api-key",
    "VITE_FIREBASE_AUTH_DOMAIN": "@firebase-auth-domain",
    "VITE_FIREBASE_PROJECT_ID": "@firebase-project-id",
    "VITE_FIREBASE_STORAGE_BUCKET": "@firebase-storage-bucket",
    "VITE_FIREBASE_MESSAGING_SENDER_ID": "@firebase-messaging-sender-id",
    "VITE_FIREBASE_APP_ID": "@firebase-app-id",
    "VITE_API_BASE_URL": "@api-base-url",
    "VITE_GOOGLE_MAPS_API_KEY": "@google-maps-api-key"
  }
}
```

#### Netlify Deployment
```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Build the project
npm run build

# 3. Deploy to Netlify
netlify deploy --prod --dir=dist

# 4. Set environment variables in Netlify dashboard
# Site settings > Environment variables
```

**Netlify Configuration (_redirects file in public/)**:
```
/*    /index.html   200
```

#### Firebase Hosting
```bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login to Firebase
firebase login

# 3. Initialize Firebase hosting
firebase init hosting

# 4. Build and deploy
npm run build
firebase deploy
```

**Firebase Configuration (firebase.json)**:
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp|js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

### Backend API Deployment

#### Express.js Backend Setup
```javascript
// backend/server.js
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const twilio = require('twilio');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
});

// Initialize Twilio
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Authentication middleware
const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// User routes
app.get('/api/users/profile', authenticateUser, async (req, res) => {
  try {
    const userRecord = await admin.auth().getUser(req.user.uid);
    // Fetch additional profile data from Firestore
    const profileDoc = await admin.firestore()
      .collection('userProfiles')
      .doc(req.user.uid)
      .get();
    
    const profile = {
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL,
      phoneNumber: userRecord.phoneNumber,
      isPhoneVerified: !!userRecord.phoneNumber,
      ...profileDoc.data()
    };

    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Issue routes
app.get('/api/issues', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, status } = req.query;
    
    let query = admin.firestore().collection('issues');
    
    if (category) {
      query = query.where('category', '==', category);
    }
    
    if (status) {
      query = query.where('status', 'in', status.split(','));
    }
    
    query = query.orderBy('reportedAt', 'desc');
    
    const snapshot = await query.limit(parseInt(limit)).get();
    const issues = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.json({
      data: issues,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: snapshot.size,
        hasNext: snapshot.size === parseInt(limit),
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch issues' });
  }
});

app.post('/api/issues', authenticateUser, async (req, res) => {
  try {
    const issueData = {
      ...req.body,
      reportedBy: req.user.uid,
      reportedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      status: 'pending'
    };
    
    const docRef = await admin.firestore()
      .collection('issues')
      .add(issueData);
    
    const newIssue = {
      id: docRef.id,
      ...issueData
    };
    
    res.status(201).json(newIssue);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create issue' });
  }
});

// File upload route (using multer and cloud storage)
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE,
});

const bucket = storage.bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

app.post('/api/files/upload', authenticateUser, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileName = `${Date.now()}-${req.file.originalname}`;
    const file = bucket.file(fileName);
    
    const stream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    stream.on('error', (error) => {
      res.status(500).json({ error: 'Upload failed' });
    });

    stream.on('finish', async () => {
      await file.makePublic();
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      res.json({ url: publicUrl });
    });

    stream.end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

#### Railway Deployment
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login to Railway
railway login

# 3. Initialize project
railway init

# 4. Deploy
railway up

# 5. Set environment variables
railway variables set FIREBASE_PROJECT_ID=your-project-id
railway variables set TWILIO_ACCOUNT_SID=your-twilio-sid
# ... set all required environment variables
```

#### Heroku Deployment
```bash
# 1. Install Heroku CLI
# 2. Login to Heroku
heroku login

# 3. Create Heroku app
heroku create meri-awaaz-api

# 4. Set environment variables
heroku config:set FIREBASE_PROJECT_ID=your-project-id
heroku config:set TWILIO_ACCOUNT_SID=your-twilio-sid
# ... set all required environment variables

# 5. Deploy
git push heroku main
```

### Environment Variables Checklist

**Frontend (.env)**:
```env
# Firebase Configuration (Required)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# API Configuration
VITE_API_BASE_URL=https://your-api-domain.com/api

# External Services
VITE_GOOGLE_MAPS_API_KEY=
```

**Backend (.env)**:
```env
# Server Configuration
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com

# Firebase Admin SDK
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# Twilio Configuration
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_VERIFY_SERVICE_SID=

# Cloud Storage (Google Cloud)
GOOGLE_CLOUD_PROJECT_ID=
GOOGLE_CLOUD_KEY_FILE=
GOOGLE_CLOUD_STORAGE_BUCKET=

# Database (if using external database)
DATABASE_URL=
```

### Performance Optimization

#### Build Optimization
```javascript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-select'],
          maps: ['@googlemaps/react-wrapper'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 5173,
    open: true,
  },
});
```

#### Image Optimization
```typescript
// src/utils/imageOptimization.ts
export const compressImage = (file: File, maxWidth = 1200, quality = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();

    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        const compressedFile = new File([blob!], file.name, {
          type: 'image/jpeg',
          lastModified: Date.now(),
        });
        resolve(compressedFile);
      }, 'image/jpeg', quality);
    };

    img.src = URL.createObjectURL(file);
  });
};
```

## 🔧 Configuration Files & Documentation

### Core Configuration Files

#### Package.json Dependencies
```json
{
  "name": "meri-awaaz-civic-voice",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@googlemaps/react-wrapper": "^1.1.42",
    "@hookform/resolvers": "^3.9.0",
    "@radix-ui/react-accordion": "^1.2.0",
    "@radix-ui/react-alert-dialog": "^1.1.1",
    "@radix-ui/react-aspect-ratio": "^1.1.0",
    "@radix-ui/react-avatar": "^1.1.0",
    "@radix-ui/react-checkbox": "^1.1.1",
    "@radix-ui/react-collapsible": "^1.1.0",
    "@radix-ui/react-dialog": "^1.1.1",
    "@radix-ui/react-dropdown-menu": "^2.1.1",
    "@radix-ui/react-hover-card": "^1.1.1",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-menubar": "^1.1.1",
    "@radix-ui/react-navigation-menu": "^1.2.0",
    "@radix-ui/react-popover": "^1.1.1",
    "@radix-ui/react-progress": "^1.1.0",
    "@radix-ui/react-radio-group": "^1.2.0",
    "@radix-ui/react-scroll-area": "^1.1.0",
    "@radix-ui/react-select": "^2.1.1",
    "@radix-ui/react-separator": "^1.1.0",
    "@radix-ui/react-sheet": "^1.1.0",
    "@radix-ui/react-slider": "^1.2.0",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-switch": "^1.1.0",
    "@radix-ui/react-tabs": "^1.1.0",
    "@radix-ui/react-toast": "^1.2.1",
    "@radix-ui/react-toggle": "^1.1.0",
    "@radix-ui/react-toggle-group": "^1.1.0",
    "@radix-ui/react-tooltip": "^1.1.2",
    "@tanstack/react-query": "^5.51.23",
    "axios": "^1.7.4",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "cmdk": "1.0.0",
    "date-fns": "^3.6.0",
    "embla-carousel-react": "^8.1.8",
    "firebase": "^10.13.0",
    "input-otp": "^1.2.4",
    "lucide-react": "^0.427.0",
    "react": "^18.3.1",
    "react-day-picker": "8.10.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.52.2",
    "react-resizable-panels": "^2.0.20",
    "react-router-dom": "^6.26.1",
    "recharts": "^2.12.7",
    "sonner": "^1.5.0",
    "tailwind-merge": "^2.5.2",
    "tailwindcss-animate": "^1.0.7",
    "vaul": "^0.9.1",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@eslint/js": "^9.9.0",
    "@types/node": "^22.4.1",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.9.0",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.9",
    "globals": "^15.9.0",
    "postcss": "^8.4.41",
    "tailwindcss": "^3.4.10",
    "typescript": "^5.5.3",
    "typescript-eslint": "^8.0.1",
    "vite": "^5.4.1"
  }
}
```

#### TypeScript Configuration (tsconfig.json)
```json
{
  "files": [],
  "references": [
    {
      "path": "./tsconfig.app.json"
    },
    {
      "path": "./tsconfig.node.json"
    }
  ],
  "compilerOptions": {
    "types": ["google.maps", "@types/geojson", "@types/leaflet"]
  }
}
```

#### Tailwind CSS Configuration (tailwind.config.ts)
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
```

#### ESLint Configuration (eslint.config.js)
```javascript
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
)
```

### Documentation Files

#### Firebase Setup Guide (FIREBASE_SETUP.md)
```markdown
# Firebase Setup Guide for Meri Awaaz

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `meri-awaaz-production`
4. Enable Google Analytics (recommended)
5. Wait for project creation

## 2. Enable Authentication

1. Navigate to Authentication > Sign-in method
2. Enable providers:
   - Email/Password ✅
   - Google ✅
3. Configure authorized domains:
   - localhost (for development)
   - your-production-domain.com

## 3. Create Firestore Database

1. Go to Firestore Database
2. Create database in production mode
3. Set up security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /userProfiles/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Issues are readable by all authenticated users
    match /issues/{issueId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
        request.auth.uid == resource.data.reportedBy;
      allow update: if request.auth != null && 
        (request.auth.uid == resource.data.reportedBy || 
         request.auth.token.admin == true);
    }
  }
}
```

## 4. Get Configuration Keys

1. Go to Project Settings > General
2. Scroll to "Your apps" section
3. Click "Web app" icon to create web app
4. Copy configuration object:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

## 5. Environment Variables

Add these to your `.env` file:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

## 6. Cloud Storage Setup (Optional)

1. Go to Storage in Firebase Console
2. Get started with default rules
3. Update rules for authenticated uploads:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null 
        && request.resource.size < 10 * 1024 * 1024;
    }
  }
}
```
```

#### Twilio Setup Guide (TWILIO_SETUP.md)
```markdown
# Twilio SMS Verification Setup

## 1. Create Twilio Account

1. Go to [Twilio Console](https://www.twilio.com/console)
2. Sign up for a new account
3. Verify your phone number
4. Get $15 free trial credit

## 2. Create Verify Service

1. Navigate to Verify > Services
2. Click "Create new Service"
3. Service Name: "Meri Awaaz Verification"
4. Copy the Service SID

## 3. Get Account Credentials

From Twilio Console Dashboard:
- Account SID
- Auth Token

## 4. Environment Variables

Backend `.env`:
```env
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_VERIFY_SERVICE_SID=your-verify-service-sid
```

## 5. Implementation Example

```javascript
// Send verification code
const verification = await client.verify.v2
  .services(process.env.TWILIO_VERIFY_SERVICE_SID)
  .verifications
  .create({ to: phoneNumber, channel: 'sms' });

// Check verification code
const verificationCheck = await client.verify.v2
  .services(process.env.TWILIO_VERIFY_SERVICE_SID)
  .verificationChecks
  .create({ to: phoneNumber, code: userEnteredCode });
```

## 6. Rate Limiting & Security

- Implement rate limiting (max 5 SMS per hour per number)
- Validate phone number format
- Use international format validation
- Store verification status in database
```

#### API Documentation (API_DOCS.md)
```markdown
# Meri Awaaz API Documentation

## Base URL
```
Production: https://api.meri-awaaz.com
Development: http://localhost:3000/api
```

## Authentication
All protected routes require Firebase JWT token in Authorization header:
```
Authorization: Bearer <firebase-jwt-token>
```

## User Endpoints

### GET /users/profile
Get current user profile

**Response:**
```json
{
  "uid": "user-id",
  "email": "user@example.com",
  "displayName": "John Doe",
  "phoneNumber": "+1234567890",
  "isPhoneVerified": true,
  "location": "New York, NY",
  "joinedDate": "2023-01-01T00:00:00.000Z",
  "issuesReported": 5,
  "issuesResolved": 2,
  "totalUpvotes": 15,
  "badges": ["reporter", "community-helper"],
  "level": 2,
  "points": 150
}
```

### PUT /users/profile
Update user profile

**Request:**
```json
{
  "displayName": "John Doe",
  "location": "San Francisco, CA"
}
```

## Issue Endpoints

### GET /issues
List issues with pagination and filtering

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `category` (string): Filter by category
- `status` (string): Filter by status (comma-separated)
- `priority` (string): Filter by priority
- `search` (string): Search in title/description

**Response:**
```json
{
  "data": [
    {
      "id": "issue-id",
      "title": "Pothole on Main Street",
      "description": "Large pothole causing traffic issues",
      "category": "roads",
      "priority": "medium",
      "status": "pending",
      "location": {
        "latitude": 40.7128,
        "longitude": -74.0060,
        "address": "123 Main St, New York, NY"
      },
      "reportedBy": "user-id",
      "reportedAt": "2023-01-01T00:00:00.000Z",
      "photos": ["https://storage.url/photo1.jpg"],
      "upvotes": 5,
      "downvotes": 1
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### POST /issues
Create new issue

**Request:**
```json
{
  "title": "Street light not working",
  "description": "Street light has been out for 3 days",
  "category": "electricity",
  "priority": "medium",
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "address": "456 Oak St, New York, NY"
  },
  "photos": ["https://storage.url/photo1.jpg"],
  "audioUrl": "https://storage.url/audio1.mp3"
}
```

### POST /issues/:id/upvote
Upvote an issue

**Response:**
```json
{
  "upvotes": 6,
  "hasUserUpvoted": true
}
```

## File Upload Endpoints

### POST /files/upload
Upload image or audio file

**Request:** FormData with file

**Response:**
```json
{
  "url": "https://storage.url/uploaded-file.jpg"
}
```

## Error Responses

All errors follow this format:
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": "Additional error details"
}
```

**Common HTTP Status Codes:**
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error
```

## 🔍 Troubleshooting & Common Issues

### Development Issues

#### TypeScript Errors
```bash
# Issue: Missing type definitions
Error: Cannot find module '@types/google.maps'

# Solution: Install missing types
npm install --save-dev @types/google.maps @types/geojson @types/leaflet

# Update tsconfig.json to include types
{
  "compilerOptions": {
    "types": ["google.maps", "@types/geojson", "@types/leaflet"]
  }
}
```

#### Firebase Authentication Issues
```javascript
// Issue: Firebase config not found
Error: Firebase: No Firebase App '[DEFAULT]' has been created

// Solution: Check environment variables
console.log('Firebase config:', {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  // ... other config values
});

// Ensure all required environment variables are set
```

#### API Connection Issues
```javascript
// Issue: CORS errors in development
Error: Access to XMLHttpRequest blocked by CORS policy

// Solution: Configure backend CORS
app.use(cors({
  origin: ['http://localhost:5173', 'https://your-frontend-domain.com'],
  credentials: true
}));
```

#### Google Maps Loading Issues
```javascript
// Issue: Google Maps API key invalid
Error: Google Maps JavaScript API error: InvalidKeyMapError

// Solution: Check API key and enable required services
// 1. Go to Google Cloud Console
// 2. Enable Maps JavaScript API
// 3. Enable Geocoding API (for address lookup)
// 4. Set up API key restrictions
```

### Production Issues

#### Environment Variables Not Working
```bash
# Issue: Environment variables undefined in production
console.log(import.meta.env.VITE_FIREBASE_API_KEY); // undefined

# Solution: Check deployment platform configuration
# Vercel: Add variables in Project Settings > Environment Variables
# Netlify: Add variables in Site Settings > Environment variables
# Make sure all variables start with VITE_ prefix
```

#### Firebase Hosting Issues
```bash
# Issue: 404 errors on page refresh
Error: Page not found when refreshing /dashboard

# Solution: Add rewrite rules in firebase.json
{
  "hosting": {
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

#### Performance Issues
```typescript
// Issue: Large bundle size
// Solution: Implement code splitting

// Lazy load components
const Dashboard = lazy(() => import('./components/Dashboard/Dashboard'));
const UploadIssue = lazy(() => import('./components/Dashboard/UploadIssue'));

// Use React.Suspense for loading states
<Suspense fallback={<div>Loading...</div>}>
  <Dashboard />
</Suspense>
```

### Mobile-Specific Issues

#### iOS Safari Issues
```css
/* Issue: Input zoom on focus */
/* Solution: Set font-size to 16px minimum */
.mobile-input {
  font-size: 16px; /* Prevents zoom on iOS */
}

/* Issue: Safe area issues */
/* Solution: Use safe area insets */
.mobile-nav {
  padding-bottom: calc(0.75rem + env(safe-area-inset-bottom));
}
```

#### Android Chrome Issues
```javascript
// Issue: Back button navigation
// Solution: Handle browser back button
useEffect(() => {
  const handlePopState = (event) => {
    // Handle back button logic
    if (window.location.pathname === '/') {
      // Prevent going back to auth pages
      event.preventDefault();
    }
  };

  window.addEventListener('popstate', handlePopState);
  return () => window.removeEventListener('popstate', handlePopState);
}, []);
```

### API Integration Issues

#### Firebase Token Refresh
```typescript
// Issue: Token expiration errors
// Solution: Implement automatic token refresh

const apiClient = axios.create({...});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const user = auth.currentUser;
        if (user) {
          await user.getIdToken(true); // Force refresh
          // Retry the original request
          return apiClient.request(error.config);
        }
      } catch (refreshError) {
        // Redirect to sign-in
        window.location.href = '/signin';
      }
    }
    return Promise.reject(error);
  }
);
```

## 📋 Maintenance & Updates

### Regular Maintenance Tasks

#### Dependency Updates
```bash
# Check for outdated packages
npm outdated

# Update packages safely
npm update

# Update major versions (check breaking changes)
npm install react@latest react-dom@latest

# Audit for security vulnerabilities
npm audit
npm audit fix
```

#### Firebase Security Rules Review
```javascript
// Monthly review of Firestore security rules
// Check for any data leaks or excessive permissions

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Review and tighten rules regularly
    match /issues/{issueId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
        validateIssueData(request.resource.data);
      allow update: if request.auth != null && 
        (request.auth.uid == resource.data.reportedBy || 
         hasAdminRole(request.auth));
    }
  }
}

function validateIssueData(data) {
  return data.keys().hasAll(['title', 'description', 'category']) &&
         data.title is string &&
         data.title.size() > 0 &&
         data.title.size() <= 100;
}
```

#### Performance Monitoring
```typescript
// Add performance monitoring to track Core Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

const sendToAnalytics = (metric) => {
  // Send to your analytics service
  console.log(metric);
};

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### Backup & Recovery

#### Data Backup Strategy
```bash
# Firebase Firestore backup (using Firebase CLI)
firebase firestore:export gs://your-project-backup-bucket/$(date +%Y-%m-%d)

# Automated backup script
#!/bin/bash
DATE=$(date +%Y-%m-%d)
firebase firestore:export gs://your-project-backup-bucket/$DATE
echo "Backup completed for $DATE"
```

#### Environment Backup
```bash
# Create environment template for easy restoration
# .env.template
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
# ... other variables

# Document all required environment variables
# Keep secure backup of production values
```

## 🤝 Contributing Guidelines

### Development Workflow

#### Setting Up Development Environment
```bash
# 1. Fork the repository
# 2. Clone your fork
git clone https://github.com/your-username/meri-awaaz-civic-voice.git
cd meri-awaaz-civic-voice

# 3. Install dependencies
npm install

# 4. Create feature branch
git checkout -b feature/your-feature-name

# 5. Set up environment variables
cp .env.example .env
# Fill in your development environment variables

# 6. Start development server
npm run dev
```

#### Code Standards
```typescript
// Follow these coding standards:

// 1. Use TypeScript interfaces for all data structures
interface ComponentProps {
  title: string;
  onClick: () => void;
  disabled?: boolean;
}

// 2. Use meaningful variable and function names
const handleSubmitIssue = async (issueData: CreateIssueRequest) => {
  // Implementation
};

// 3. Add JSDoc comments for complex functions
/**
 * Compresses an image file to reduce size while maintaining quality
 * @param file - The original image file
 * @param maxWidth - Maximum width in pixels (default: 1200)
 * @param quality - Compression quality 0-1 (default: 0.8)
 * @returns Promise resolving to compressed file
 */
const compressImage = async (file: File, maxWidth = 1200, quality = 0.8): Promise<File> => {
  // Implementation
};

// 4. Use proper error handling
try {
  const result = await apiCall();
  return result;
} catch (error) {
  console.error('API call failed:', error);
  throw new Error('Failed to process request');
}
```

#### Commit Message Format
```bash
# Use conventional commit format
feat: add voice recording feature to issue reporting
fix: resolve Firebase authentication token refresh issue
docs: update API documentation with new endpoints
style: improve mobile navigation component styling
refactor: extract common form validation logic
test: add unit tests for issue creation component
chore: update dependencies to latest versions

# Examples of good commit messages:
git commit -m "feat(upload): add audio recording capability with playback"
git commit -m "fix(auth): handle expired JWT tokens in API requests"
git commit -m "docs: add comprehensive deployment guide"
```

#### Pull Request Guidelines
```markdown
## Pull Request Template

### Description
Brief description of what this PR does

### Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

### Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Cross-browser testing (if UI changes)
- [ ] Mobile testing (if applicable)

### Screenshots (if applicable)
Include before/after screenshots for UI changes

### Checklist
- [ ] Code follows project coding standards
- [ ] Self-review of code completed
- [ ] Code is properly commented
- [ ] Documentation updated (if needed)
- [ ] No console errors or warnings
- [ ] Accessibility requirements met
```

### Feature Request Process

#### New Feature Proposal
```markdown
## Feature Request Template

### Feature Description
Clear description of the proposed feature

### Problem Statement
What problem does this feature solve?

### Proposed Solution
Detailed description of how the feature should work

### Alternative Solutions
Other approaches considered

### Technical Considerations
- API changes required
- Database schema changes
- Third-party integrations needed
- Performance implications
- Security considerations

### User Stories
- As a [user type], I want [goal] so that [benefit]
- As a [user type], I want [goal] so that [benefit]

### Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

### Priority
- [ ] High (urgent, blocking other work)
- [ ] Medium (important, should be included in next release)
- [ ] Low (nice to have, can be postponed)
```

## 📞 Support & Community

### Getting Help

#### Documentation Resources
- **README.md**: Complete project overview and setup guide
- **FIREBASE_SETUP.md**: Firebase configuration instructions
- **TWILIO_SETUP.md**: SMS service setup guide
- **API_DOCS.md**: Backend API documentation
- **CONTRIBUTING.md**: Development workflow and standards

#### Community Support
- **GitHub Issues**: Report bugs and request features
- **GitHub Discussions**: Ask questions and share ideas
- **Discord Community**: Real-time chat and support (if available)
- **Stack Overflow**: Tag questions with `meri-awaaz` and `civic-engagement`

#### Professional Support
For enterprise deployments or custom features:
- Email: support@meri-awaaz.com
- Professional services available for:
  - Custom deployment and configuration
  - Integration with existing government systems
  - Multi-language localization
  - Custom branding and white-labeling
  - Advanced analytics and reporting

### Issue Reporting

#### Bug Report Template
```markdown
**Bug Description**
A clear description of what the bug is

**Steps to Reproduce**
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
What you expected to happen

**Actual Behavior**
What actually happened

**Screenshots**
Add screenshots to help explain the problem

**Environment**
- OS: [e.g. iOS 14, Windows 10, macOS Big Sur]
- Browser: [e.g. Chrome 95, Safari 15, Firefox 94]
- Device: [e.g. iPhone 12, Samsung Galaxy S21, Desktop]
- App Version: [e.g. 1.2.3]

**Additional Context**
Any other context about the problem

**Browser Console Logs**
```
Paste any relevant console errors here
```
```

---

## 🎯 Project Roadmap & Future Enhancements

### Version 2.0 Planned Features
- **Real-time Notifications**: WebSocket implementation for live updates
- **Advanced Analytics**: Community engagement metrics and insights
- **Multi-language Support**: Internationalization (i18n) implementation
- **Offline Support**: Progressive Web App (PWA) capabilities
- **AI-powered Categorization**: Automatic issue categorization using ML
- **Government Integration**: API connections to municipal systems
- **Advanced Mapping**: Heat maps and clustering analytics
- **Social Features**: User following, issue sharing, community groups

### Long-term Vision
- **Smart City Integration**: IoT sensor data integration
- **Predictive Analytics**: Issue pattern recognition and prevention
- **Blockchain Integration**: Transparent voting and resolution tracking
- **VR/AR Features**: Immersive issue reporting and visualization
- **API Marketplace**: Third-party integrations and extensions

---

**Built with ❤️ for civic engagement and community improvement**

**License**: MIT License  
**Version**: 1.0.0  
**Last Updated**: September 22, 2025  
**Maintainers**: Meri Awaaz Development Team  
**Repository**: https://github.com/RD945/meri-awaaz
