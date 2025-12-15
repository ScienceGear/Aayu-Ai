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
    bloodGroup: { type: String },
    emergencyContacts: [{
        name: String,
        phone: String,
        relation: String
    }],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
