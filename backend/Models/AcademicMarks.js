const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    marks: { type: Number, required: true },
    maxMarks: { type: Number, required: true }
});

const academicMarksSchema = new mongoose.Schema({
    studentId: { type: String, required: true, ref: 'User' },
    semester: { type: Number, required: true },
    subjects: [subjectSchema],
    average: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('AcademicMarks', academicMarksSchema);
