const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    issue: { type: String, required: true },
    painLevel: { type: Number, default: 0 },
    description: { type: String },
    date: { type: String },
    status: { type: String, enum: ['sent', 'delivered', 'seen'], default: 'sent' }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
