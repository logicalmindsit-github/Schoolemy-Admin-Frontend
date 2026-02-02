import axios from "axios";
import { secureStorage } from "./security";

// =============================================================================
// PRODUCTION-READY API CONFIGURATION
// =============================================================================
// NO PROXY NEEDED - Works identically in development and production
// Uses environment variables for flexibility
// =============================================================================

// API Base URL from environment variable
// Development: https://w4jpp7oi02.execute-api.ap-south-1.amazonaws.com/dev (set in .env.development)
// Production: https://your-api.com (set in .env.production)
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://w4jpp7oi02.execute-api.ap-south-1.amazonaws.com/dev';
  
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
console.log('🌐 [API Config] Environment:', process.env.NODE_ENV);
console.log('🌐 [API Config] Base URL:', API_BASE_URL);
console.log('🌐 [API Config] Full API endpoint example:', `${API_BASE_URL}/api/courses/getcoursesname`);

// =============================================================================
// SOCKET.IO CONFIGURATION
// =============================================================================
export const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || null;
export const SOCKET_ENABLED = !!SOCKET_URL;

// Create axios instance with base URL pointing directly to backend
const api = axios.create({
  baseURL: API_BASE_URL,  // Points to backend, NOT /api
  timeout: 120000,
  maxContentLength: 100 * 1024 * 1024,
  maxBodyLength: 100 * 1024 * 1024,
  withCredentials: true,  // Send cookies with requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add token and security headers
api.interceptors.request.use(
  (config) => {
    // Log full request URL for debugging
    const fullUrl = `${API_BASE_URL}${config.url}`;
    console.log(`[API] ${config.method?.toUpperCase()} ${fullUrl}`);

    // Skip auth for specific endpoints
    if (config.noAuth) {
      delete config.noAuth;
      return config;
    }

    // Get token from secure storage
    const token = secureStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Security headers
    config.headers["X-Requested-With"] = "XMLHttpRequest";
    
    // Cache control for mutations
    if (["post", "put", "delete", "patch"].includes(config.method)) {
      config.headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle token expiration and errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Enhanced error logging for debugging
    const requestUrl = error.config?.url || 'unknown';
    const fullUrl = `${API_BASE_URL}${requestUrl}`;
    
    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response?.status === 401) {
      console.error(`[API] 401 Unauthorized - ${fullUrl}`);
      // Clear all auth data using secure storage
      secureStorage.removeItem("token");
      secureStorage.removeItem("_id");
      secureStorage.removeItem("role");
      secureStorage.removeItem("name");
      secureStorage.removeItem("isApproved");
      
      // Redirect to login page
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }

    // Handle 403 Forbidden - Access denied
    else if (error.response?.status === 403) {
      console.error(`[API] 403 Forbidden - ${fullUrl}`, error.response?.data);
    }

    // Handle 413 Payload Too Large
    else if (error.response?.status === 413) {
      console.error(
        `[API] 413 Payload Too Large - ${fullUrl}\n` +
        `The request payload is too large for the server to process.\n` +
        `\n🔴 POSSIBLE SOLUTIONS:\n` +
        `1. ✓ Reduce file sizes before uploading\n` +
        `2. ✓ Upload fewer files at once\n` +
        `3. ✓ Compress images/videos before upload\n` +
        `4. ✓ Check AWS API Gateway payload limits (default: 10MB)\n` +
        `5. ✓ Consider implementing chunked upload for large files`
      );
      error.userMessage = `File(s) too large. Please reduce file size or upload fewer files at once.`;
    }

    // Handle CORS errors
    else if (error.code === 'ERR_NETWORK' || error.message?.includes('CORS')) {
      console.error(
        `[API] CORS/Network Error - ${fullUrl}\n` +
        `Error: ${error.message}\n` +
        `\n🔴 TROUBLESHOOTING STEPS:\n` +
        `1. ✓ Check if backend server is running at: ${API_BASE_URL}\n` +
        `2. ✓ Verify CORS is configured for origin: ${window.location.origin}\n` +
        `3. ✓ Current API_URL: ${API_BASE_URL}\n` +
        `4. ✓ Update .env.development file if backend is on different URL\n` +
        `5. ✓ Restart frontend after changing .env file (npm start)\n` +
        `\n💡 Quick Fix: If backend is local, ensure it's running on port 5000`
      );
      
      // Enhanced error object for better debugging
      error.userMessage = `Cannot connect to backend server at ${API_BASE_URL}. Please check if the backend is running.`;
    }

    // Handle timeout errors
    else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      console.error(
        `[API] Request Timeout - ${fullUrl}\n` +
        `Server took longer than 30 seconds to respond`
      );
    }

    // Handle other network errors
    else if (!error.response) {
      console.error(
        `[API] Network Error - ${fullUrl}\n` +
        `Error Code: ${error.code || 'unknown'}\n` +
        `Error Message: ${error.message || 'Unable to reach server'}\n` +
        `API URL: ${API_BASE_URL}\n` +
        `Check if backend server is running and accessible`
      );
    }

    // Handle other HTTP errors
    else {
      console.error(
        `[API] HTTP Error ${error.response.status} - ${fullUrl}\n` +
        `Response:`, error.response?.data
      );
    }

    return Promise.reject(error);
  }
);

// Health check function to test backend connectivity
export const checkBackendHealth = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`, { 
      timeout: 5000,
      validateStatus: () => true // Accept any status
    });
    console.log(`[API] Backend health check: OK (${API_BASE_URL})`);
    return { success: true, url: API_BASE_URL, status: response.status };
  } catch (error) {
    console.error(`[API] Backend health check: FAILED (${API_BASE_URL})`, error.message);
    return { 
      success: false, 
      url: API_BASE_URL, 
      error: error.message,
      suggestion: "Please ensure backend server is running and accessible"
    };
  }
};

// Export API_BASE_URL for debugging purposes (backward compatible export as API_URL)
export { API_BASE_URL as API_URL };

export default api;
