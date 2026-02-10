const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // Manually managed ID to match legacy/mock data
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['admin', 'faculty', 'student'] },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    department: { type: String },
    rollNumber: { type: String },
    semester: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
