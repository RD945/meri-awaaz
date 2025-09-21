import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { userService } from '@/lib/apiService';
import type { UserProfile } from '@/types';

export interface AuthContextType {
  user: UserProfile | null;
  isGuest: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => void;
  continueAsGuest: () => void;
  updateUser: (updates: Partial<UserProfile>) => Promise<void>;
  verifyPhone: (phoneNumber: string) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
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
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  // Convert Firebase user to our UserProfile interface
  const convertFirebaseUser = (firebaseUser: FirebaseUser): Partial<UserProfile> => {
    return {
      userId: firebaseUser.uid,
      name: firebaseUser.displayName || 'User',
      email: firebaseUser.email || '',
      phone: '',
      phoneVerified: false,
      avatar: firebaseUser.photoURL || undefined,
      points: 0,
      badges: [],
      joinedDate: new Date().toISOString(),
      city: '',
      state: '',
      pincode: ''
    };
  };

  // Fetch user profile from backend with enhanced error handling
  const fetchUserProfile = async (firebaseUserId: string): Promise<UserProfile | null> => {
    try {
      const profile = await userService.getProfile();
      return profile;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      
      // Check if it's a network error (backend not running)
      if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        console.warn('⚠️  Backend API not available - continuing without profile sync');
        // Return a minimal profile from Firebase user data if available
        const firebaseUser = auth.currentUser;
        if (firebaseUser) {
          return {
            userId: firebaseUser.uid,
            name: firebaseUser.displayName || 'User',
            email: firebaseUser.email || '',
            phone: '',
            phoneVerified: false,
            avatar: firebaseUser.photoURL || undefined,
            points: 0,
            badges: [],
            joinedDate: new Date().toISOString(),
            city: 'Not specified',
            state: 'Not specified',
            pincode: '000000'
          };
        }
      }
      
      return null;
    }
  };

  // Refresh user profile from backend with error handling
  const refreshUserProfile = async (): Promise<void> => {
    if (!user) return;
    
    try {
      const profile = await userService.getProfile();
      setUser(profile);
      localStorage.setItem('meri-awaaz-user', JSON.stringify(profile));
    } catch (error) {
      console.error('Failed to refresh user profile:', error);
      // Don't throw error, just log it - profile refresh is not critical
    }
  };

  // Monitor authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Check if we're in the middle of signup flow (coming from verify-phone route)
          const isVerifyingPhone = window.location.pathname === '/verify-phone';
          
          // User is signed in, fetch full profile from backend
          let profile = await fetchUserProfile(firebaseUser.uid);
          
          if (!profile) {
            // If no profile exists in backend, create one using the new endpoint
            console.log('Creating user profile in Firestore...');
            try {
              profile = await userService.createProfile();
              console.log('User profile created successfully:', profile);
            } catch (createError) {
              console.error('Failed to create user profile:', createError);
              // If profile creation fails, create a minimal local profile
              profile = {
                userId: firebaseUser.uid,
                name: firebaseUser.displayName || 'User',
                email: firebaseUser.email || '',
                phone: '',
                phoneVerified: false,
                avatar: firebaseUser.photoURL || undefined,
                points: 0,
                badges: [],
                joinedDate: new Date().toISOString(),
                city: '',
                state: '',
                pincode: ''
              };
            }
          }
          
          // Only set user if we're not in the phone verification flow
          if (!isVerifyingPhone) {
            setUser(profile);
            localStorage.setItem('meri-awaaz-user', JSON.stringify(profile));
            setIsGuest(false);
            localStorage.removeItem('meri-awaaz-guest');
          } else {
            // Store profile temporarily but don't set as current user yet
            localStorage.setItem('meri-awaaz-pending-user', JSON.stringify(profile));
          }
        } catch (error) {
          console.error('Error setting up user profile:', error);
        }
      } else {
        // User is signed out
        const savedIsGuest = localStorage.getItem('meri-awaaz-guest') === 'true';
        if (savedIsGuest) {
          setIsGuest(true);
          setUser(null);
        } else {
          setUser(null);
          setIsGuest(false);
          localStorage.removeItem('meri-awaaz-user');
          localStorage.removeItem('meri-awaaz-guest');
          localStorage.removeItem('meri-awaaz-pending-user');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // User state will be updated by onAuthStateChanged
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Update the user's display name
      // Note: You might want to use updateProfile from firebase/auth here
      // User state will be updated by onAuthStateChanged
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setIsGuest(false);
      localStorage.removeItem('meri-awaaz-user');
      localStorage.removeItem('meri-awaaz-guest');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const continueAsGuest = () => {
    setIsGuest(true);
    setUser(null);
    localStorage.setItem('meri-awaaz-guest', 'true');
    localStorage.removeItem('meri-awaaz-user');
  };

  const updateUser = async (updates: Partial<UserProfile>): Promise<void> => {
    if (!user) {
      throw new Error('No user logged in');
    }

    try {
      const updatedProfile = await userService.updateProfile(updates);
      setUser(updatedProfile);
      localStorage.setItem('meri-awaaz-user', JSON.stringify(updatedProfile));
    } catch (error) {
      console.error('Failed to update user profile:', error);
      
      // Check if it's a network error
      if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        throw new Error('Cannot connect to server. Please check your internet connection and try again.');
      }
      
      throw error;
    }
  };

  const verifyPhone = async (phoneNumber: string): Promise<void> => {
    // Wait for user to be available if not yet loaded
    let currentUser = user;
    if (!currentUser && auth.currentUser) {
      // Give some time for the user profile to be created/loaded
      let attempts = 0;
      while (!currentUser && attempts < 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        currentUser = user;
        attempts++;
      }
    }

    if (!currentUser) {
      // If still no user, try to get Firebase user data
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        throw new Error('No user logged in');
      }
      
      // Create a minimal user profile for phone verification
      currentUser = {
        userId: firebaseUser.uid,
        name: firebaseUser.displayName || 'User',
        email: firebaseUser.email || '',
        phone: phoneNumber,
        phoneVerified: true,
        avatar: firebaseUser.photoURL || undefined,
        points: 0,
        badges: [],
        joinedDate: new Date().toISOString(),
        city: '',
        state: '',
        pincode: ''
      };
    }

    try {
      const updatedProfile = await userService.updateProfile({ 
        phone: phoneNumber, 
        phoneVerified: true 
      });
      setUser(updatedProfile);
      localStorage.setItem('meri-awaaz-user', JSON.stringify(updatedProfile));
    } catch (error) {
      console.error('Failed to verify phone:', error);
      
      // If backend update fails, at least update the local state
      if (currentUser) {
        const updatedUser = { ...currentUser, phone: phoneNumber, phoneVerified: true };
        setUser(updatedUser);
        localStorage.setItem('meri-awaaz-user', JSON.stringify(updatedUser));
      }
      
      // Check if it's a network error
      if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        throw new Error('Cannot connect to server. Please check your internet connection and try again.');
      }
      
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isGuest,
      loading,
      signIn,
      signUp,
      signOut,
      continueAsGuest,
      updateUser,
      verifyPhone,
      refreshUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};