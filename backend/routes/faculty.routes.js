const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const User = require('../Models/User');
const FacultyStudentMapping = require('../Models/FacultyStudentMapping');
const AcademicMarks = require('../Models/AcademicMarks');
const PSkills = require('../Models/PSkills');
const ActivityRewardPoints = require('../Models/ActivityRewardPoints');

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

/**
 * @swagger
 * tags:
 *   name: Faculty
 *   description: Faculty operations
 */

/**
 * @swagger
 * /api/faculty/students:
 *   get:
 *     summary: Get mapped students for current faculty
 *     tags: [Faculty]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of mapped students
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /api/faculty/upload/marks:
 *   post:
 *     summary: Upload academic marks via Excel file
 *     tags: [Faculty]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Marks uploaded successfully
 *       400:
 *         description: Invalid file or data
 *       403:
 *         description: Unauthorized or generic mapping error
 *       500:
 *         description: Server error
 */
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

        // Process and save marks to database
        const studentMarks = {};
        validation.data.forEach(row => {
            const sId = row['Student ID'];
            if (!studentMarks[sId]) studentMarks[sId] = [];
            studentMarks[sId].push({
                name: row['Subject'],
                marks: row['Marks'],
                maxMarks: row['Max Marks']
            });
        });

        for (const [sId, subjects] of Object.entries(studentMarks)) {
            const student = await User.findOne({ id: sId, role: 'student' });
            const semester = student && student.semester ? student.semester : 1;

            let record = await AcademicMarks.findOne({ studentId: sId, semester });
            if (!record) {
                record = new AcademicMarks({ studentId: sId, semester, subjects: [] });
            }

            subjects.forEach(newSub => {
                const existingIndex = record.subjects.findIndex(s => s.name === newSub.name);
                if (existingIndex >= 0) {
                    record.subjects[existingIndex].marks = newSub.marks;
                    record.subjects[existingIndex].maxMarks = newSub.maxMarks;
                } else {
                    record.subjects.push(newSub);
                }
            });

            if (record.subjects.length > 0) {
                const totalMarks = record.subjects.reduce((sum, s) => sum + s.marks, 0);
                const totalMax = record.subjects.reduce((sum, s) => sum + s.maxMarks, 0);
                record.average = (totalMarks / totalMax) * 100;
            }

            await record.save();
        }
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

/**
 * @swagger
 * /api/faculty/upload/pskills:
 *   post:
 *     summary: Upload P-Skills via Excel file
 *     tags: [Faculty]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: P-Skills uploaded successfully
 *       400:
 *         description: Invalid file or data
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
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

        // Process and save P-Skills to database
        const studentSkills = {};
        validation.data.forEach(row => {
            const sId = row['Student ID'];
            if (!studentSkills[sId]) studentSkills[sId] = [];
            studentSkills[sId].push({
                name: row['Skill Name'],
                level: row['Level'],
                completionDate: new Date(row['Completion Date'] || Date.now())
            });
        });

        for (const [sId, newSkills] of Object.entries(studentSkills)) {
            let record = await PSkills.findOne({ studentId: sId });
            if (!record) {
                record = new PSkills({ studentId: sId, skills: [], totalCompleted: 0 });
            }

            newSkills.forEach(ns => {
                const existingIndex = record.skills.findIndex(s => s.name === ns.name);
                if (existingIndex >= 0) {
                    record.skills[existingIndex].level = ns.level;
                    record.skills[existingIndex].completionDate = ns.completionDate;
                } else {
                    record.skills.push(ns);
                }
            });

            record.totalCompleted = record.skills.length;
            await record.save();
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

/**
 * @swagger
 * /api/faculty/upload/points:
 *   post:
 *     summary: Upload activity/reward points via Excel file
 *     tags: [Faculty]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Points uploaded successfully
 *       400:
 *         description: Invalid file or data
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
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

        // Process and save Points to database
        const studentPoints = {};
        validation.data.forEach(row => {
            const sId = row['Student ID'];
            if (!studentPoints[sId]) studentPoints[sId] = [];
            studentPoints[sId].push({
                type: row['Type'],
                name: row['Description'],
                points: row['Points'],
                date: new Date(row['Date'] || Date.now())
            });
        });

        for (const [sId, items] of Object.entries(studentPoints)) {
            let record = await ActivityRewardPoints.findOne({ studentId: sId });
            if (!record) {
                record = new ActivityRewardPoints({ studentId: sId, activityPoints: 0, rewardPoints: 0, activities: [], rewards: [] });
            }

            items.forEach(item => {
                if (item.type === 'Activity') {
                    record.activities.push({ name: item.name, points: item.points, date: item.date });
                    record.activityPoints += item.points;
                } else {
                    record.rewards.push({ name: item.name, points: item.points, date: item.date });
                    record.rewardPoints += item.points;
                }
            });

            await record.save();
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

/**
 * @swagger
 * /api/faculty/analytics/{studentId}:
 *   get:
 *     summary: Get analytics for a specific student
 *     tags: [Faculty]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the student
 *     responses:
 *       200:
 *         description: Analytics data for the student
 *       403:
 *         description: Access denied to this student
 *       404:
 *         description: Student not found
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /api/faculty/rankings:
 *   get:
 *     summary: Get rankings for mapped students only
 *     tags: [Faculty]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Rankings of mapped students
 *       500:
 *         description: Server error
 */
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
