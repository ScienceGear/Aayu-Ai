# Development Guide

## Quick Start

### Option 1: Use the Startup Script (Recommended for Windows)
Simply double-click `start-dev.bat` to start both servers automatically.

### Option 2: Manual Start

#### Step 1: Start Backend Server
```bash
cd server
npm install
npm start
```
The backend will run on http://localhost:3000

#### Step 2: Start Frontend (in a new terminal)
```bash
bun install
bun run dev
```
The frontend will run on http://localhost:8080

## Troubleshooting

### Issue: 404 Errors for API Calls
**Solution**: Make sure the backend server is running on port 3000 before starting the frontend.

### Issue: WebSocket Connection Failed
**Solution**: 
1. Ensure backend is running
2. Check that port 3000 is not blocked by firewall
3. Verify `.env` file has `VITE_API_URL=http://localhost:3000`

### Issue: MongoDB Connection Error
**Solution**: Check your MongoDB connection string in `.env` file

## Environment Variables

Create/verify `.env` file in the root directory:
```
VITE_GEMINI_API_KEY=your_gemini_key
MONGODB_URI=your_mongodb_connection_string
PORT=3000
VITE_API_URL=http://localhost:3000
```

## Architecture

- **Frontend**: React + Vite (Port 8080)
- **Backend**: Express + Socket.IO (Port 3000)
- **Database**: MongoDB Atlas
- **Real-time**: Socket.IO for messaging and calls

## API Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/users` - Get all users
- `GET /api/care/exercises` - Get exercises
- `GET /api/care/medicines` - Get medicines
- `POST /api/messages` - Send message
- `POST /api/upload` - Upload files

## Socket Events

- `join_room` - Join user's room
- `send_message` - Send chat message
- `call_user` - Initiate call
- `answer_call` - Answer incoming call
- `end_call` - End active call
