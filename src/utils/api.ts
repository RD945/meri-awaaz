import { Issue } from '@/types';

// Mock API utility functions
export const api = {
  // Issues
  getIssues: async (): Promise<Issue[]> => {
    return mockIssues;
  },

  getUserIssues: async (userId: string): Promise<Issue[]> => {
    return mockIssues.filter(issue => issue.submittedBy === userId);
  },

  createIssue: async (issueData: Omit<Issue, 'id' | 'submittedAt' | 'updatedAt' | 'votes'>): Promise<Issue> => {
    const newIssue: Issue = {
      ...issueData,
      id: Date.now().toString(),
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      votes: 0
    };
    return newIssue;
  },

  updateIssue: async (id: string, updates: Partial<Issue>): Promise<Issue> => {
    const issue = mockIssues.find(i => i.id === id);
    if (!issue) throw new Error('Issue not found');
    return { ...issue, ...updates, updatedAt: new Date().toISOString() };
  },

  // User location
  getCurrentLocation: (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          (error) => {
            // Fallback to Delhi coordinates
            resolve({ lat: 28.6139, lng: 77.2090 });
          }
        );
      } else {
        resolve({ lat: 28.6139, lng: 77.2090 });
      }
    });
  }
};

// Mock data
const mockIssues: Issue[] = [
  {
    id: '1',
    title: 'Pothole on Main Street',
    description: 'Large pothole causing traffic issues near the market area',
    category: 'roads',
    priority: 'high',
    status: 'pending',
    location: {
      lat: 28.6139,
      lng: 77.2090,
      address: 'Main Street, Connaught Place, New Delhi'
    },
    photos: [],
    submittedBy: '1',
    submittedAt: '2024-01-20T10:30:00Z',
    updatedAt: '2024-01-20T10:30:00Z',
    votes: 15
  },
  {
    id: '2',
    title: 'Water Leakage Issue',
    description: 'Continuous water leakage from the main pipeline affecting the road',
    category: 'water',
    priority: 'medium',
    status: 'in-progress',
    location: {
      lat: 28.6289,
      lng: 77.2065,
      address: 'Rajouri Garden, New Delhi'
    },
    photos: [],
    submittedBy: '2',
    submittedAt: '2024-01-19T14:15:00Z',
    updatedAt: '2024-01-21T09:00:00Z',
    votes: 8
  },
  {
    id: '3',
    title: 'Broken Streetlight',
    description: 'Streetlight not working for the past week, creating safety concerns',
    category: 'electricity',
    priority: 'medium',
    status: 'resolved',
    location: {
      lat: 28.5355,
      lng: 77.3910,
      address: 'Sector 18, Noida'
    },
    photos: [],
    submittedBy: '1',
    submittedAt: '2024-01-18T20:45:00Z',
    updatedAt: '2024-01-22T11:30:00Z',
    resolution: 'Streetlight has been repaired and is now functioning properly.',
    votes: 12
  }
];