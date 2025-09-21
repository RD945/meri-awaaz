// Centralized API client with Firebase JWT authentication

import axios from 'axios';
import { auth } from './firebase'; // Firebase auth instance

const apiClient = axios.create({
  // Backend runs on port 3001, frontend on various ports
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Use an Axios interceptor to add the auth token to every request
apiClient.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    try {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Added auth token to request:', config.url);
    } catch (error) {
      console.error("Failed to get auth token:", error);
    }
  } else {
    console.log('👤 No user authenticated for request:', config.url);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Enhanced error handling
    if (error.code === 'ERR_NETWORK') {
      console.error('❌ Network Error: Cannot connect to backend server');
      console.error('💡 Make sure the backend is running on the correct port');
      console.error(`💡 Expected backend URL: ${apiClient.defaults.baseURL}`);
    } else if (error.response?.status === 401) {
      // Handle unauthorized access - could redirect to login
      console.error('❌ Unauthorized access - token may be expired');
    } else if (error.response?.status >= 500) {
      console.error('❌ Server error:', error.response.data);
    } else if (error.code === 'ECONNABORTED') {
      console.error('❌ Request timeout');
    }
    return Promise.reject(error);
  }
);

export default apiClient;