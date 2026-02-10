const mongoose = require('mongoose');

const facultyStudentMappingSchema = new mongoose.Schema({
    facultyId: { type: String, required: true, ref: 'User' },
    studentIds: [{ type: String, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('FacultyStudentMapping', facultyStudentMappingSchema);
