const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    dueTime: { type: String },
    priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' }
}, { timestamps: true });

module.exports = mongoose.model('Activity', activitySchema);
