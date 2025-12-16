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
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

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

    socket.on('answer_call', (data) => {
        const { to, answer } = data;
        console.log(`✅ Call answered by ${socket.id} to ${to}`);
        io.to(to).emit('call_answered', { answer });
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

const PORT = process.env.PORT || 3000;

if (require.main === module) {
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
