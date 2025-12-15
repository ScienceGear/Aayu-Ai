const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    assignedBy: { type: String, required: true },
    name: { type: String, required: true },
    dosage: { type: String },
    time: { type: String },
    stock: { type: Number },
    taken: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Medicine', medicineSchema);
