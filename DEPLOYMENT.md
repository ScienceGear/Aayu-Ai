# Aayu AI - Deployment Notes

## Railway Deployment

This application automatically deploys to Railway when pushed to the repository.

### Environment Variables Required on Railway:

1. **MONGODB_URI** - Your MongoDB connection string
2. **GEMINI_API_KEY** (optional) - For AI features
3. **PORT** - Automatically set by Railway (do not manually configure)

### The app will automatically:
- Build the frontend (npm run build)
- Serve static files from the `dist` folder
- Run the backend server on the Railway-assigned PORT
- Handle WebSocket connections for real-time features

### Local Development:
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your local MongoDB URI

# Run in development mode (frontend + backend)
npm run dev

# Or run production build locally
npm run build
npm start
```

### Important: 
- The app uses relative URLs and environment variables
- No hardcoded URLs or ports
- WebRTC permissions are now optional (app works even if denied)
