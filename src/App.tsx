import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Layout Components
import Header from "./components/Layout/Header";
import Navigation from "./components/Layout/Navigation";

// Auth Components
import GetStarted from "./components/Auth/GetStarted";
import SignIn from "./components/Auth/SignIn";
import SignUpFlow from "./components/Auth/SignUpFlow";

// Dashboard Components
import Dashboard from "./components/Dashboard/Dashboard";
import UploadIssue from "./components/Dashboard/UploadIssue";
import MyIssues from "./components/Dashboard/MyIssues";
import InteractiveMap from "./components/Dashboard/InteractiveMap";

// Profile Components
import Profile from "./components/Profile/Profile";
import Awards from "./components/Profile/Awards";
import Settings from "./components/Profile/Settings";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();
  
  if (!user && !isGuest) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// App Layout Component
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth();
  const showNavigation = user || isGuest;

  return (
    <div className="min-h-screen bg-background">
      {showNavigation && <Header />}
      <main className={`${showNavigation ? 'pt-16' : ''} px-3 sm:px-6 py-6 main-content`}>
        <div className="max-w-sm sm:max-w-lg lg:max-w-4xl mx-auto w-full" style={{ touchAction: 'pan-y', overscrollBehaviorX: 'none' }}>
          {children}
        </div>
      </main>
      {showNavigation && <Navigation />}
    </div>
  );
};

// Main App Routes
const AppRoutes: React.FC = () => {
  const { user, isGuest, loading } = useAuth();

  // Show loading spinner while checking authentication state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  // If user is not authenticated and not a guest, show onboarding
  if (!user && !isGuest) {
    return (
      <Routes>
        <Route path="/" element={<GetStarted />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/verify-phone" element={
          <SignUpFlow 
            userEmail={new URLSearchParams(window.location.search).get('email') || ''} 
            onComplete={() => {
              // Force navigation after completion
              window.location.href = '/dashboard';
            }} 
          />
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // Authenticated routes
  return (
    <Routes>
      <Route path="/signin" element={<Navigate to="/dashboard" replace />} />
      <Route path="/verify-phone" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={
        <AppLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/upload" element={
              <ProtectedRoute>
                <UploadIssue />
              </ProtectedRoute>
            } />
            <Route path="/my-issues" element={
              <ProtectedRoute>
                <MyIssues />
              </ProtectedRoute>
            } />
            <Route path="/map" element={
              <ProtectedRoute>
                <InteractiveMap />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/awards" element={
              <ProtectedRoute>
                <Awards />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      } />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;