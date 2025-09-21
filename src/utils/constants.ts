import { Category, Badge } from '@/types';

export const ISSUE_CATEGORIES: Category[] = [
  { id: 'roads', name: 'Roads & Traffic', icon: '🚗', color: '#ef4444' },
  { id: 'water', name: 'Water Supply', icon: '💧', color: '#3b82f6' },
  { id: 'electricity', name: 'Electricity', icon: '⚡', color: '#f59e0b' },
  { id: 'sanitation', name: 'Sanitation', icon: '🧹', color: '#10b981' },
  { id: 'parks', name: 'Parks & Recreation', icon: '🌳', color: '#22c55e' },
  { id: 'healthcare', name: 'Healthcare', icon: '🏥', color: '#ec4899' },
  { id: 'education', name: 'Education', icon: '🎓', color: '#8b5cf6' },
  { id: 'safety', name: 'Public Safety', icon: '🛡️', color: '#f97316' },
  { id: 'environment', name: 'Environment', icon: '🌍', color: '#06b6d4' },
  { id: 'other', name: 'Other', icon: '📝', color: '#6b7280' }
];

export const BADGES: Badge[] = [
  {
    id: 'reporter',
    name: 'Issue Reporter',
    description: 'Reported your first civic issue',
    icon: '📝',
    condition: 'Report 1 issue'
  },
  {
    id: 'community-helper',
    name: 'Community Helper',
    description: 'Reported 10+ civic issues',
    icon: '🤝',
    condition: 'Report 10 issues'
  },
  {
    id: 'super-citizen',
    name: 'Super Citizen',
    description: 'Reported 50+ civic issues',
    icon: '🦸',
    condition: 'Report 50 issues'
  },
  {
    id: 'problem-solver',
    name: 'Problem Solver',
    description: 'Had 5+ issues resolved',
    icon: '✅',
    condition: 'Get 5 issues resolved'
  },
  {
    id: 'engagement-champion',
    name: 'Engagement Champion',
    description: 'Received 100+ votes on your issues',
    icon: '🏆',
    condition: 'Get 100 votes'
  }
];

export const PRIORITY_COLORS = {
  low: '#22c55e',
  medium: '#f59e0b',
  high: '#ef4444',
  urgent: '#dc2626'
};

export const STATUS_COLORS = {
  pending: '#f59e0b',
  'in-progress': '#3b82f6',
  resolved: '#22c55e',
  rejected: '#ef4444'
};