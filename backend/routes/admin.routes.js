const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const FacultyStudentMapping = require('../Models/FacultyStudentMapping');
const { getCampusAnalytics, generateRankings } = require('../utils/analytics');

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
