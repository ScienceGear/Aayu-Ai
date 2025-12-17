const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    assignedBy: { type: String, required: true }, // ID of caregiver
    name: { type: String, required: true },
    duration: { type: String },
    calories: { type: Number },
    completed: { type: Boolean, default: false },
    instructions: { type: String },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
    date: { type: Date, default: Date.now },
    videoLink: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Exercise', exerciseSchema);
