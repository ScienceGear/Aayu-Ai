const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const messageRoutes = require('./routes/messages');
const uploadRoutes = require('./routes/upload');
const careRoutes = require('./routes/care');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins for local network testing
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
// Serve uploads statically
app.use('/uploads', express.static('uploads'));

// Database Connection
if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI is not set!');
    process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        env: process.env.NODE_ENV
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/care', careRoutes);
app.use('/api/upload', uploadRoutes);

// Serve Static Files from Frontend
app.use(express.static(path.join(__dirname, '../dist')));

// Handle React Routing, return all requests to React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

// Socket.io Logic
const User = require('./models/User'); // Import User model for status updates

// Store active users map: socketId -> userId
const activeUsers = new Map();

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_room', async (userId) => {
        socket.join(userId);
        activeUsers.set(socket.id, userId);
        console.log(`User ${userId} joined their room`);

        // Update user status to online
        try {
            await User.findOneAndUpdate({ id: userId }, { isOnline: true });
            io.emit('user_status_change', { userId, isOnline: true });
        } catch (err) {
            console.error('Error updating online status:', err);
        }
    });

    socket.on('send_message', (data) => {
        // data: { senderId, receiverId, content, type, fileUrl ... }
        console.log('Message from', data.senderId, 'to', data.receiverId);
        io.to(data.receiverId).emit('receive_message', data);
    });

    // WebRTC Signaling - Complete Implementation
    socket.on('call_user', (data) => {
        const { userToCall, from, name, type, offer } = data;
        console.log(`📞 Call from ${from} to ${userToCall} (${type})`);
        io.to(userToCall).emit('incoming_call', {
            from,
            name,
            type,
            offer
        });
    });

    socket.on('medicine_alert', (data) => {
        console.log('🚨 Medicine Alert:', data);
        // In a real app, find assigned caregiver. Here, broadcast to all others (likely caregivers)
        socket.broadcast.emit('receive_medicine_alert', data);
    });

    socket.on('sos_alert', async (data) => {
        console.log('🚨 SOS Alert:', data);

        // Save to Database
        try {
            const Alert = require('./models/Alert');
            const crypto = require('crypto');
            const newAlert = new Alert({
                id: crypto.randomUUID(),
                elderId: data.elderId,
                name: data.name,
                location: data.location,
                time: data.time,
                status: 'active'
            });
            await newAlert.save();
        } catch (e) {
            console.error("Error saving alert to DB:", e);
        }

        // Broadcast to all connected clients (especially caregivers)
        socket.broadcast.emit('sos_alert', data);
    });

    socket.on('answer_call', (data) => {
        const { to, answer } = data;
        console.log(`✅ Call answered by ${socket.id} to ${to}`);
        io.to(to).emit('call_answered', {
            from: socket.id,
            answer
        });
    });

    // --- Game Events ---
    socket.on('game_invite', (data) => {
        const { to, from, gameType, fromName } = data;
        console.log(`🎮 Game invite from ${fromName} to ${to}`);
        io.to(to).emit('receive_game_invite', { from, fromName, gameType, gameId: data.gameId });
    });

    socket.on('game_accept', (data) => {
        const { to, from, gameId } = data;
        console.log(`✅ Game accepted by ${from}`);
        io.to(to).emit('game_start', { opponent: from, gameId });
    });

    socket.on('game_move', (data) => {
        const { to, move, gameId } = data;
        io.to(to).emit('receive_game_move', { move, gameId });
    });

    // Generic Game Event Relay (allows flexible game logic)
    socket.on('game_event', (data) => {
        const { to, type, payload } = data;
        io.to(to).emit('receive_game_event', { type, payload, from: socket.id });
    });

    // --- Data Sync ---
    socket.on('sync_data', (data) => {
        console.log('🔄 Data Sync:', data.type, data.action, 'for', data.targetUserId || 'unknown');
        // Broadcast to everyone so caregivers and elders stay in sync
        io.emit('sync_data', data);
    });

    socket.on('ice_candidate', (data) => {
        const { to, candidate } = data;
        console.log(`🧊 ICE candidate from ${socket.id} to ${to}`);
        io.to(to).emit('ice_candidate', { candidate });
    });

    socket.on('end_call', ({ to }) => {
        console.log(`📴 Call ended, notifying ${to}`);
        io.to(to).emit('call_ended');
    });

    socket.on('disconnect', async () => {
        console.log('User disconnected', socket.id);
        const userId = activeUsers.get(socket.id);
        if (userId) {
            try {
                await User.findOneAndUpdate({ id: userId }, { isOnline: false, lastSeen: new Date() });
                io.emit('user_status_change', { userId, isOnline: false, lastSeen: new Date() });
                activeUsers.delete(socket.id);
            } catch (err) { console.error(err); }
        }
    });

    // Manual offline event if client sends it before closing
    socket.on('go_offline', async (userId) => {
        try {
            await User.findOneAndUpdate({ id: userId }, { isOnline: false, lastSeen: new Date() });
            io.emit('user_status_change', { userId, isOnline: false, lastSeen: new Date() });
        } catch (err) { console.error(err); }
    });
});

const PORT = 3000;

if (require.main === module) {
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Creating/Serving static files from ../dist`);
        console.log(`⚠️  NOTE: You are running in production mode. To see live code changes, stop this and run: npm run dev`);
    });
}

module.exports = app;
