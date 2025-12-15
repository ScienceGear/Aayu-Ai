require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const messageRoutes = require('./routes/messages');
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

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/care', careRoutes);

// Socket.io Logic
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_room', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined their room`);
    });

    socket.on('send_message', (data) => {
        // data: { senderId, receiverId, content, ... }
        io.to(data.receiverId).emit('receive_message', data);
    });

    // WebRTC Signaling
    socket.on('call_user', (data) => {
        const { userToCall, signalData, from, name } = data;
        io.to(userToCall).emit('call_user', { signal: signalData, from, name });
    });

    socket.on('answer_call', (data) => {
        io.to(data.to).emit('call_accepted', data.signal);
    });

    socket.on('end_call', ({ to }) => {
        io.to(to).emit('call_ended');
    });

    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
