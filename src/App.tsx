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
      <main className={`${showNavigation ? 'pt-16' : ''} container mx-auto px-4 py-6`}>
        {children}
      </main>
      {showNavigation && <Navigation />}
    </div>
  );
};

// Main App Routes
const AppRoutes: React.FC = () => {
  const { user, isGuest } = useAuth();
  
  // If user is not authenticated and not a guest, show onboarding
  if (!user && !isGuest) {
    return (
      <Routes>
        <Route path="/" element={<GetStarted />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // Authenticated routes
  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
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