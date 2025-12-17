const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // Keeping string ID to match frontend UUIDs for now
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['elder', 'caregiver', 'organization'], required: true },
    profilePic: { type: String },
    phone: { type: String },
    age: { type: Number },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    height: { type: Number }, // in cm
    weight: { type: Number }, // in kg
    bloodGroup: { type: String },
    // Caregiver specific fields
    rating: { type: Number, default: 0 },
    ratingsCount: { type: Number, default: 0 },
    feedbacks: [{
        elderId: String,
        elderName: String,
        rating: Number,
        comment: String,
        date: { type: Date, default: Date.now }
    }],
    experience: { type: String }, // e.g. "5 years"
    location: { type: String },
    specialization: { type: String },
    // Status
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: Date.now },
    emergencyContacts: [{
        name: String,
        phone: String,
        relation: String
    }],
    assignedCaregiverId: { type: String },
    status: { type: String, enum: ['active', 'pending'], default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
