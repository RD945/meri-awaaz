// Service layer for API communication
import apiClient from './apiClient';
import { UserProfile, Issue, ApiResponse, PaginatedResponse } from '@/types';

export const userService = {
  // Create user profile in Firestore after Firebase Auth signup
  createProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.post<ApiResponse<UserProfile>>('/users/create-profile');
    return response.data.data;
  },

  // Get current user profile
  getProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get<ApiResponse<UserProfile>>('/users/me');
    return response.data.data;
  },

  // Update user profile
  updateProfile: async (profileData: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await apiClient.put<ApiResponse<UserProfile>>('/users/me', profileData);
    return response.data.data;
  },

  // Get user statistics
  getStats: async (): Promise<{
    issuesReported: number;
    issuesResolved: number;
    totalVotes: number;
    communityRank: number;
  }> => {
    const response = await apiClient.get<ApiResponse<any>>('/users/me/stats');
    return response.data.data;
  },
};

export const issueService = {
  // Get all community issues
  getIssues: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    status?: string;
    priority?: string;
  }): Promise<PaginatedResponse<Issue>> => {
    const response = await apiClient.get<PaginatedResponse<Issue>>('/issues', { params });
    return response.data;
  },

  // Get issues by current user
  getUserIssues: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse<Issue>> => {
    const response = await apiClient.get<PaginatedResponse<Issue>>('/users/me/issues', { params });
    return response.data;
  },

  // Create new issue
  createIssue: async (issueData: {
    title: string;
    description: string;
    category: string;
    priority: string;
    imageUrls?: string[];
    audioUrl?: string;
    location: {
      latitude: number;
      longitude: number;
      address?: string;
    };
  }): Promise<Issue> => {
    const response = await apiClient.post<ApiResponse<Issue>>('/issues', issueData);
    return response.data.data;
  },

  // Get single issue
  getIssue: async (issueId: string): Promise<Issue> => {
    const response = await apiClient.get<ApiResponse<Issue>>(`/issues/${issueId}`);
    return response.data.data;
  },

  // Upvote an issue
  upvoteIssue: async (issueId: string): Promise<{upvotes: number, userVote: string | null}> => {
    const response = await apiClient.post<ApiResponse<{upvotes: number, userVote: string | null}>>(`/issues/${issueId}/upvote`);
    return response.data.data;
  },

  // Downvote an issue
  downvoteIssue: async (issueId: string): Promise<{upvotes: number, userVote: string | null}> => {
    const response = await apiClient.post<ApiResponse<{upvotes: number, userVote: string | null}>>(`/issues/${issueId}/downvote`);
    return response.data.data;
  },

  // Get issues for map (with location data)
  getIssuesForMap: async (): Promise<Issue[]> => {
    const response = await apiClient.get<ApiResponse<{issues: Issue[]}>>('/issues/map');
    return response.data.data.issues;
  },
};

export const fileService = {
  // Upload image to Firebase Storage and get URL
  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await apiClient.post<ApiResponse<{ imageUrl: string }>>('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.data.imageUrl;
  },

  // Upload audio to Firebase Storage and get URL
  uploadAudio: async (audioBlob: Blob): Promise<string> => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    
    const response = await apiClient.post<ApiResponse<{ audioUrl: string }>>('/files/upload-audio', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.data.audioUrl;
  },
};

// Helper function to handle API errors consistently
export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  } else if (error.message) {
    return error.message;
  } else {
    return 'An unexpected error occurred';
  }
};