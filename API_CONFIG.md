# API Configuration Guide

## Quick Setup

### 1. Configure Backend URL

**For Development (Local Backend):**

```env
# .env.development
REACT_APP_API_URL=https://w4jpp7oi02.execute-api.ap-south-1.amazonaws.com/dev
```

**For Production:**

```env
# .env.production
REACT_APP_API_URL=https://learnly-admin-backend.onrender.com
```

### 2. Start Your Application

```bash
# Development mode
npm start

# Production build
npm run build
```

## Troubleshooting CORS/Network Errors

### Error: "CORS/Network Error - http://65.0.109.192:5000/adminlogin"

**Solutions:**

1. **Check if backend is running:**
   - Verify backend server is started
   - Test backend URL in browser or Postman

2. **Update .env.development file:**

   ```env
   # Use local backend
   REACT_APP_API_URL=https://w4jpp7oi02.execute-api.ap-south-1.amazonaws.com/dev

   # OR if backend is on specific IP/port
   REACT_APP_API_URL=http://65.0.109.192:5000
   ```

3. **Restart frontend after .env changes:**

   ```bash
   # Stop the dev server (Ctrl+C)
   npm start
   ```

4. **Verify CORS on Backend:**
   Backend must allow requests from `http://localhost:3001` or your frontend URL

5. **Check network connectivity:**
   ```bash
   # Test if backend is reachable
   curl http://65.0.109.192:5000/health
   ```

## Testing Backend Connection

You can test the backend connection in your browser console:

```javascript
import { checkBackendHealth } from "./Utils/api";

// Test connection
const health = await checkBackendHealth();
console.log(health);
```

## Environment Variables

| Variable          | Description          | Default                                                     |
| ----------------- | -------------------- | ----------------------------------------------------------- |
| REACT_APP_API_URL | Backend API base URL | https://w4jpp7oi02.execute-api.ap-south-1.amazonaws.com/dev |

## Common Issues

### Issue 1: "Network Error" on login

- **Cause:** Backend not running or wrong URL
- **Fix:** Update `.env.development` with correct backend URL and restart

### Issue 2: "401 Unauthorized"

- **Cause:** Token expired or invalid
- **Fix:** Automatically handled - redirects to login

### Issue 3: "403 Forbidden"

- **Cause:** User lacks permission for the resource
- **Fix:** Check user role and permissions on backend

### Issue 4: Backend on Render.com sleeping

- **Cause:** Free tier backends sleep after inactivity
- **Fix:** First request may take 30-60 seconds to wake up server
