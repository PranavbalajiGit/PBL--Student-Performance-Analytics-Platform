const express = require('express');
const router = express.Router();
const { users, facultyStudentMappings } = require('../data/mockData');
const { getCampusAnalytics, generateRankings } = require('../utils/analytics');

// Register new user (student or faculty)
router.post('/users', (req, res) => {
    const { username, password, role, name, email, department, rollNumber, semester } = req.body;

    // Validation
    if (!username || !password || !role || !name || !email) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!['student', 'faculty'].includes(role)) {
        return res.status(400).json({ error: 'Role must be either student or faculty' });
    }

    // Check if username already exists
    if (users.find(u => u.username === username)) {
        return res.status(409).json({ error: 'Username already exists' });
    }

    // Create new user
    const newUser = {
        id: `${role}${users.filter(u => u.role === role).length + 1}`,
        username,
        password,
        role,
        name,
        email,
        department: department || null,
        rollNumber: role === 'student' ? rollNumber : undefined,
        semester: role === 'student' ? semester : undefined
    };

    users.push(newUser);

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
});

// Get all users
router.get('/users', (req, res) => {
    const { role } = req.query;

    let filteredUsers = users;
    if (role) {
        filteredUsers = users.filter(u => u.role === role);
    }

    // Don't send passwords
    const safeUsers = filteredUsers.map(u => ({
        id: u.id,
        username: u.username,
        name: u.name,
        role: u.role,
        email: u.email,
        department: u.department,
        rollNumber: u.rollNumber,
        semester: u.semester
    }));

    res.json({ users: safeUsers });
});

// Create faculty-student mapping
router.post('/mappings', (req, res) => {
    const { facultyId, studentIds } = req.body;

    if (!facultyId || !studentIds || !Array.isArray(studentIds)) {
        return res.status(400).json({ error: 'facultyId and studentIds (array) are required' });
    }

    // Verify faculty exists
    const faculty = users.find(u => u.id === facultyId && u.role === 'faculty');
    if (!faculty) {
        return res.status(404).json({ error: 'Faculty not found' });
    }

    // Verify all students exist
    const invalidStudents = studentIds.filter(id => !users.find(u => u.id === id && u.role === 'student'));
    if (invalidStudents.length > 0) {
        return res.status(404).json({ error: `Invalid student IDs: ${invalidStudents.join(', ')}` });
    }

    // Check if mapping already exists
    const existingMapping = facultyStudentMappings.find(m => m.facultyId === facultyId);

    if (existingMapping) {
        // Update existing mapping
        existingMapping.studentIds = studentIds;
    } else {
        // Create new mapping
        facultyStudentMappings.push({ facultyId, studentIds });
    }

    res.json({
        success: true,
        message: 'Faculty-student mapping updated successfully',
        mapping: { facultyId, studentIds }
    });
});

// Get all mappings
router.get('/mappings', (req, res) => {
    const mappingsWithDetails = facultyStudentMappings.map(mapping => {
        const faculty = users.find(u => u.id === mapping.facultyId);
        const students = mapping.studentIds.map(id => {
            const student = users.find(u => u.id === id);
            return student ? {
                id: student.id,
                name: student.name,
                rollNumber: student.rollNumber,
                department: student.department
            } : null;
        }).filter(s => s !== null);

        return {
            faculty: {
                id: faculty.id,
                name: faculty.name,
                department: faculty.department
            },
            students
        };
    });

    res.json({ mappings: mappingsWithDetails });
});

// Get campus-wide analytics
router.get('/analytics', (req, res) => {
    const analytics = getCampusAnalytics();
    res.json({ analytics });
});

// Get full rankings (admin only)
router.get('/rankings', (req, res) => {
    const rankings = generateRankings();
    res.json({ rankings });
});

module.exports = router;
