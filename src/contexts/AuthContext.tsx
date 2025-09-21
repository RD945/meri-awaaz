import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  points: number;
  badges: string[];
  joinedDate: string;
}

export interface AuthContextType {
  user: User | null;
  isGuest: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  continueAsGuest: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);

  const signIn = async (email: string, password: string) => {
    // Mock API call
    const mockUser: User = {
      id: '1',
      name: 'John Doe',
      email,
      phone: '+91 9876543210',
      avatar: '',
      points: 150,
      badges: ['Reporter', 'Community Helper'],
      joinedDate: '2024-01-15'
    };
    setUser(mockUser);
    setIsGuest(false);
  };

  const signOut = () => {
    setUser(null);
    setIsGuest(false);
  };

  const continueAsGuest = () => {
    setIsGuest(true);
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isGuest,
      signIn,
      signOut,
      continueAsGuest,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};