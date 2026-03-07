const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const User = require('../Models/User');
const FacultyStudentMapping = require('../Models/FacultyStudentMapping');

const {
    validateMarksExcel,
    validatePSkillsExcel,
    validatePointsExcel,
    verifyStudentMapping
} = require('../utils/validation');
const { getStudentAnalytics, generateRankings } = require('../utils/analytics');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        if (ext !== '.xlsx' && ext !== '.xls') {
            return cb(new Error('Only Excel files are allowed'));
        }
        cb(null, true);
    }
});

// Get mapped students for current faculty
router.get('/students', async (req, res) => {
    try {
        const facultyId = req.user.id;
        const mapping = await FacultyStudentMapping.findOne({ facultyId });

        if (!mapping || !mapping.studentIds || mapping.studentIds.length === 0) {
            return res.json({ students: [] });
        }

        const studentsRaw = await User.find({ id: { $in: mapping.studentIds }, role: 'student' }).lean();
        
        const students = studentsRaw.map(student => ({
            id: student.id,
            name: student.name,
            rollNumber: student.rollNumber,
            department: student.department,
            email: student.email
        }));

        res.json({ students });
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: 'Server error fetching mapped students' });
    }
});

// Upload internal marks
router.post('/upload/marks', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const facultyId = req.user.id;

    try {
        // Validate Excel structure
        const validation = validateMarksExcel(filePath);

        if (!validation.valid) {
            fs.unlinkSync(filePath); // Clean up uploaded file
            return res.status(400).json({ error: validation.error });
        }

        // Get faculty's mapped students
        const mapping = await FacultyStudentMapping.findOne({ facultyId });
        if (!mapping || !mapping.studentIds) {
            fs.unlinkSync(filePath);
            return res.status(403).json({ error: 'You have no mapped students' });
        }

        // Verify all students in Excel are mapped to this faculty
        const mappingValidation = verifyStudentMapping(validation.data, mapping.studentIds);

        if (!mappingValidation.valid) {
            fs.unlinkSync(filePath);
            return res.status(403).json({ error: mappingValidation.error });
        }

        // Process and store data (in real app, save to database)
        // For MVP, just acknowledge success
        fs.unlinkSync(filePath); // Clean up after processing

        res.json({
            success: true,
            message: 'Marks uploaded successfully',
            recordsProcessed: validation.data.length
        });
    } catch (error) {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        res.status(500).json({ error: 'Failed to process file: ' + error.message });
    }
});

// Upload P-Skills
router.post('/upload/pskills', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const facultyId = req.user.id;

    try {
        const validation = validatePSkillsExcel(filePath);

        if (!validation.valid) {
            fs.unlinkSync(filePath);
            return res.status(400).json({ error: validation.error });
        }

        const mapping = await FacultyStudentMapping.findOne({ facultyId });
        if (!mapping || !mapping.studentIds) {
            fs.unlinkSync(filePath);
            return res.status(403).json({ error: 'You have no mapped students' });
        }

        const mappingValidation = verifyStudentMapping(validation.data, mapping.studentIds);

        if (!mappingValidation.valid) {
            fs.unlinkSync(filePath);
            return res.status(403).json({ error: mappingValidation.error });
        }

        fs.unlinkSync(filePath);

        res.json({
            success: true,
            message: 'P-Skills uploaded successfully',
            recordsProcessed: validation.data.length
        });
    } catch (error) {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        res.status(500).json({ error: 'Failed to process file: ' + error.message });
    }
});

// Upload activity/reward points
router.post('/upload/points', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const facultyId = req.user.id;

    try {
        const validation = validatePointsExcel(filePath);

        if (!validation.valid) {
            fs.unlinkSync(filePath);
            return res.status(400).json({ error: validation.error });
        }

        const mapping = await FacultyStudentMapping.findOne({ facultyId });
        if (!mapping || !mapping.studentIds) {
            fs.unlinkSync(filePath);
            return res.status(403).json({ error: 'You have no mapped students' });
        }

        const mappingValidation = verifyStudentMapping(validation.data, mapping.studentIds);

        if (!mappingValidation.valid) {
            fs.unlinkSync(filePath);
            return res.status(403).json({ error: mappingValidation.error });
        }

        fs.unlinkSync(filePath);

        res.json({
            success: true,
            message: 'Activity/Reward points uploaded successfully',
            recordsProcessed: validation.data.length
        });
    } catch (error) {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        res.status(500).json({ error: 'Failed to process file: ' + error.message });
    }
});

// Get analytics for a specific student
router.get('/analytics/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        const facultyId = req.user.id;

        // Verify student is mapped to this faculty
        const mapping = await FacultyStudentMapping.findOne({ facultyId });

        if (!mapping || !mapping.studentIds || !mapping.studentIds.includes(studentId)) {
            return res.status(403).json({ error: 'You do not have access to this student' });
        }

        const analytics = await getStudentAnalytics(studentId);

        if (!analytics) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json({ analytics });
    } catch (error) {
        console.error('Error fetching student analytics:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get rankings for mapped students only
router.get('/rankings', async (req, res) => {
    try {
        const facultyId = req.user.id;

        const mapping = await FacultyStudentMapping.findOne({ facultyId });

        if (!mapping || !mapping.studentIds || mapping.studentIds.length === 0) {
            return res.json({ rankings: [] });
        }

        const allRankings = await generateRankings();
        const facultyRankings = allRankings.filter(r => mapping.studentIds.includes(r.studentId));

        res.json({ rankings: facultyRankings });
    } catch (error) {
        console.error('Error fetching faculty rankings:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
