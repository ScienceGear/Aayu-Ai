const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    content: { type: String, required: true },
    type: { type: String, enum: ['text', 'image'], default: 'text' },
    timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
