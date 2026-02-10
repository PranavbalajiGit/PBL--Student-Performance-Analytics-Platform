const mongoose = require('mongoose');

const externalProfileSchema = new mongoose.Schema({
    studentId: { type: String, required: true, ref: 'User' },
    github: { type: String },
    leetcode: { type: String },
    githubScore: { type: Number, default: 0 },
    leetcodeScore: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('ExternalProfile', externalProfileSchema);
