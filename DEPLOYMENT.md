# Deployment Guide

## Architecture

Your app requires TWO separate deployments:

1. **Frontend** (React/Vite) → Vercel
2. **Backend** (Express/Socket.IO) → Render/Railway/Heroku

## Why Separate Deployments?

Vercel uses serverless functions that don't support:
- Persistent WebSocket connections (Socket.IO)
- Long-running processes
- Stateful servers

## Deployment Steps

### 1. Deploy Backend (Choose One Platform)

#### Option A: Render.com (Recommended - Free Tier)

1. Go to https://render.com
2. Sign up and create a new "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
   - **Environment Variables**:
     - `MONGODB_URI`: Your MongoDB connection string
     - `PORT`: 3000
     - `NODE_ENV`: production

5. Deploy and copy your backend URL (e.g., `https://aayu-backend.onrender.com`)

#### Option B: Railway.app

1. Go to https://railway.app
2. Create new project from GitHub
3. Add environment variables
4. Deploy

#### Option C: Heroku

1. Install Heroku CLI
2. Run:
```bash
cd server
heroku create aayu-backend
heroku config:set MONGODB_URI=your_mongodb_uri
git push heroku main
```

### 2. Deploy Frontend to Vercel

1. Update `.env.production`:
```
VITE_API_URL=https://your-backend-url.onrender.com
```

2. Push to GitHub:
```bash
git add .
git commit -m "Configure for production deployment"
git push origin main
```

3. Vercel will auto-deploy from GitHub

### 3. Configure CORS on Backend

Update `server/index.js` CORS settings:
```javascript
const io = new Server(server, {
    cors: {
        origin: "https://your-vercel-app.vercel.app",
        methods: ["GET", "POST"]
    }
});

app.use(cors({ 
    origin: 'https://your-vercel-app.vercel.app' 
}));
```

## Environment Variables

### Backend (Render/Railway/Heroku)
- `MONGODB_URI`
- `PORT`
- `NODE_ENV=production`

### Frontend (Vercel)
- `VITE_GEMINI_API_KEY`
- `VITE_API_URL` (your backend URL)

## Testing Production

1. Visit your Vercel URL
2. Check browser console for connection logs
3. Test login/signup functionality
4. Verify Socket.IO connection

## Troubleshooting

### Backend not responding
- Check backend logs on Render/Railway
- Verify MongoDB connection
- Ensure backend is running

### CORS errors
- Update CORS origin in backend
- Redeploy backend after changes

### Socket.IO not connecting
- Verify VITE_API_URL is correct
- Check backend WebSocket support
- Review backend logs
