export interface Issue {
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