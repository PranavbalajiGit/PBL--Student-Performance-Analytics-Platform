const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const FacultyStudentMapping = require('../Models/FacultyStudentMapping');
const { getCampusAnalytics, generateRankings } = require('../utils/analytics');
const { validateUsersExcel } = require('../utils/validation');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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
 *   name: Admin
 *   description: Administrative operations
 */

/**
 * @swagger
 * /api/admin/users:
 *   post:
 *     summary: Register a new user (student or faculty)
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - role
 *               - name
 *               - email
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [student, faculty]
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               department:
 *                 type: string
 *               rollNumber:
 *                 type: string
 *               semester:
 *                 type: number
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Missing required fields or invalid role
 *       409:
 *         description: Username already exists
 *       500:
 *         description: Server error
 */
// Register new user (student or faculty)
router.post('/users', async (req, res) => {
    try {
        const { username, password, role, name, email, department, rollNumber, semester } = req.body;

        // Validation
        if (!username || !password || !role || !name || !email) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (!['student', 'faculty'].includes(role)) {
            return res.status(400).json({ error: 'Role must be either student or faculty' });
        }

        // Check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ error: 'Username already exists' });
        }

        // Generate ID
        const count = await User.countDocuments({ role });
        const id = `${role}${count + 1}`;

        // Create new user
        const newUser = new User({
            id,
            username,
            password,
            role,
            name,
            email,
            department: department || null,
            rollNumber: role === 'student' ? rollNumber : undefined,
            semester: role === 'student' ? semester : undefined
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: `${role.charAt(0).toUpperCase() + role.slice(1)} registered successfully`,
            user: {
                id: newUser.id,
                username: newUser.username,
                name: newUser.name,
                role: newUser.role,
                email: newUser.email
            }
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

/**
 * @swagger
 * /api/admin/upload/users:
 *   post:
 *     summary: Bulk upload users via Excel file
 *     tags: [Admin]
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
 *       201:
 *         description: Users registered successfully
 *       400:
 *         description: No file uploaded or invalid data
 *       409:
 *         description: Usernames already exist in database
 *       500:
 *         description: Server error
 */
// Bulk upload users
router.post('/upload/users', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;

    try {
        const validation = validateUsersExcel(filePath);

        if (!validation.valid) {
            fs.unlinkSync(filePath);
            return res.status(400).json({ error: validation.error });
        }

        const data = validation.data;
        const usernames = data.map(u => u.username);

        // Check for duplicates in DB
        const existingUsers = await User.find({ username: { $in: usernames } });
        if (existingUsers.length > 0) {
            fs.unlinkSync(filePath);
            const duplicates = existingUsers.map(u => u.username).join(', ');
            return res.status(409).json({ error: `Usernames already exist in database: ${duplicates}` });
        }

        // Get current counts to generate IDs appropriately
        let studentCount = await User.countDocuments({ role: 'student' });
        let facultyCount = await User.countDocuments({ role: 'faculty' });

        const usersToInsert = data.map(user => {
            let id;
            if (user.role === 'student') {
                studentCount++;
                id = `student${studentCount}`;
            } else {
                facultyCount++;
                id = `faculty${facultyCount}`;
            }

            return {
                id,
                username: user.username,
                password: String(user.password),
                role: user.role,
                name: user.name,
                email: user.email,
                department: user.department || null,
                rollNumber: user.role === 'student' ? user.rollNumber : undefined,
                semester: user.role === 'student' ? user.semester : undefined
            };
        });

        await User.insertMany(usersToInsert);

        fs.unlinkSync(filePath);

        res.status(201).json({
            success: true,
            message: `${usersToInsert.length} users registered successfully`,
            usersProcessed: usersToInsert.length
        });

    } catch (error) {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        console.error('Error in bulk user upload:', error);
        res.status(500).json({ error: 'Server error during upload: ' + error.message });
    }
});

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [student, faculty]
 *         description: Filter users by role
 *     responses:
 *       200:
 *         description: List of users
 *       500:
 *         description: Server error
 */
// Get all users
router.get('/users', async (req, res) => {
    try {
        const { role } = req.query;

        let query = {};
        if (role) {
            query.role = role;
        }

        // Select specific fields that are safe to expose
        const users = await User.find(query)
            .select('id username name role email department rollNumber semester')
            .lean();

        res.json({ users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

/**
 * @swagger
 * /api/admin/mappings:
 *   post:
 *     summary: Create or update faculty-student mapping
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - facultyId
 *               - studentIds
 *             properties:
 *               facultyId:
 *                 type: string
 *               studentIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Mapping updated successfully
 *       400:
 *         description: Invalid input or missing fields
 *       404:
 *         description: Faculty or student not found
 *       500:
 *         description: Server error
 */
// Create faculty-student mapping
router.post('/mappings', async (req, res) => {
    try {
        const { facultyId, studentIds } = req.body;

        if (!facultyId || !studentIds || !Array.isArray(studentIds)) {
            return res.status(400).json({ error: 'facultyId and studentIds (array) are required' });
        }

        // Verify faculty exists
        const faculty = await User.findOne({ id: facultyId, role: 'faculty' });
        if (!faculty) {
            return res.status(404).json({ error: 'Faculty not found' });
        }

        // Verify all students exist
        const students = await User.find({ id: { $in: studentIds }, role: 'student' });
        if (students.length !== studentIds.length) {
            const foundIds = students.map(s => s.id);
            const invalidIds = studentIds.filter(id => !foundIds.includes(id));
            return res.status(404).json({ error: `Invalid student IDs: ${invalidIds.join(', ')}` });
        }

        // Check if mapping already exists
        let mapping = await FacultyStudentMapping.findOne({ facultyId });

        if (mapping) {
            // Update existing mapping
            mapping.studentIds = studentIds;
            await mapping.save();
        } else {
            // Create new mapping
            mapping = new FacultyStudentMapping({ facultyId, studentIds });
            await mapping.save();
        }

        res.json({
            success: true,
            message: 'Faculty-student mapping updated successfully',
            mapping: { facultyId, studentIds }
        });
    } catch (error) {
        console.error('Error updating mapping:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

/**
 * @swagger
 * /api/admin/mappings:
 *   get:
 *     summary: Get all faculty-student mappings
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of all mappings with details
 *       500:
 *         description: Server error
 */
// Get all mappings
router.get('/mappings', async (req, res) => {
    try {
        const mappings = await FacultyStudentMapping.find({}).lean();
        const facultyIds = mappings.map(m => m.facultyId);
        const allStudentIds = [...new Set(mappings.flatMap(m => m.studentIds))];

        const [faculties, students] = await Promise.all([
            User.find({ id: { $in: facultyIds }, role: 'faculty' }).lean(),
            User.find({ id: { $in: allStudentIds }, role: 'student' }).lean()
        ]);

        const mappingsWithDetails = mappings.map(mapping => {
            const faculty = faculties.find(f => f.id === mapping.facultyId);
            const mappedStudents = mapping.studentIds.map(id => {
                const student = students.find(s => s.id === id);
                return student ? {
                    id: student.id,
                    name: student.name,
                    rollNumber: student.rollNumber,
                    department: student.department
                } : null;
            }).filter(s => s !== null);

            return {
                faculty: faculty ? {
                    id: faculty.id,
                    name: faculty.name,
                    department: faculty.department
                } : null,
                students: mappedStudents
            };
        });

        res.json({ mappings: mappingsWithDetails });
    } catch (error) {
        console.error('Error fetching mappings:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

/**
 * @swagger
 * /api/admin/analytics:
 *   get:
 *     summary: Get campus-wide analytics
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Campus analytics data
 *       500:
 *         description: Server error
 */
// Get campus-wide analytics
router.get('/analytics', async (req, res) => {
    try {
        const analytics = await getCampusAnalytics();
        res.json({ analytics });
    } catch (error) {
        console.error('Error generating analytics:', error);
        res.status(500).json({ error: 'Server error generating analytics' });
    }
});

/**
 * @swagger
 * /api/admin/rankings:
 *   get:
 *     summary: Get full student rankings
 *     tags: [Admin]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Student rankings
 *       500:
 *         description: Server error
 */
// Get full rankings (admin only)
router.get('/rankings', async (req, res) => {
    try {
        const rankings = await generateRankings();
        res.json({ rankings });
    } catch (error) {
        console.error('Error generating rankings:', error);
        res.status(500).json({ error: 'Server error generating rankings' });
    }
});

module.exports = router;
