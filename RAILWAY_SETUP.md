# Railway Deployment Setup

## Environment Variables Required

Go to Railway Dashboard → Your Service → Variables and add:

```
MONGODB_URI=mongodb+srv://aayuai_db:9VPcfyVLgQH2si8u@cluster0.hxbgrpw.mongodb.net/?appName=Cluster0
NODE_ENV=production
PORT=3000
GEMINI_API_KEY=AIzaSyCF0GcKKCj6bUFR9gdTQOKF9iBk1_1DIxg
JWT_SECRET=aayu-ai-super-secret-jwt-key-2024
SESSION_SECRET=aayu-ai-session-secret-key-2024
```

## Verify Deployment

1. Check logs for: ✅ Connected to MongoDB
2. Visit: https://your-app.railway.app/api/health
3. Should return: `{"status":"ok","mongodb":"connected"}`

## If Still Getting 500 Errors

1. Check Railway logs for MongoDB connection errors
2. Verify MongoDB Atlas allows Railway IP addresses
3. Test health endpoint first
