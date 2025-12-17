const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    elderId: { type: String, required: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    time: { type: String, required: true },
    status: { type: String, enum: ['active', 'resolved'], default: 'active' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Alert', alertSchema);
