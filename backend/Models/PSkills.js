const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    name: { type: String, required: true },
    level: { type: String, required: true },
    completionDate: { type: Date }
});

const pSkillsSchema = new mongoose.Schema({
    studentId: { type: String, required: true, ref: 'User' },
    skills: [skillSchema],
    totalCompleted: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('PSkills', pSkillsSchema);
