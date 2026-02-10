const express = require('express');
const router = express.Router();
const {
    academicMarks,
    pSkills,
    activityRewardPoints,
    externalProfiles,
    users
} = require('../data/mockData');
const { getStudentRank, getStudentAnalytics } = require('../utils/analytics');

// Get student profile
router.get('/profile', (req, res) => {
    const studentId = req.user.id;
    const student = users.find(u => u.id === studentId);

    if (!student) {
        return res.status(404).json({ error: 'Student not found' });
    }

    res.json({
        profile: {
            id: student.id,
            name: student.name,
            email: student.email,
            rollNumber: student.rollNumber,
            department: student.department,
            semester: student.semester
        }
    });
});

// Get academic marks and trends
router.get('/marks', (req, res) => {
    const studentId = req.user.id;
    const marks = academicMarks.find(m => m.studentId === studentId);

    if (!marks) {
        return res.json({ marks: null, message: 'No marks data available' });
    }

    res.json({ marks });
});

// Get P-Skills
router.get('/pskills', (req, res) => {
    const studentId = req.user.id;
    const skills = pSkills.find(s => s.studentId === studentId);

    if (!skills) {
        return res.json({ skills: null, message: 'No P-Skills data available' });
    }

    res.json({ skills });
});

// Get activity and reward points
router.get('/points', (req, res) => {
    const studentId = req.user.id;
    const points = activityRewardPoints.find(p => p.studentId === studentId);

    if (!points) {
        return res.json({ points: null, message: 'No activity/reward points available' });
    }

    res.json({ points });
});

// Get privacy-aware rank
router.get('/rank', (req, res) => {
    const studentId = req.user.id;
    const rankInfo = getStudentRank(studentId);

    if (!rankInfo) {
        return res.status(404).json({ error: 'Ranking data not available' });
    }

    res.json({ rank: rankInfo });
});

// Connect external technical profiles (GitHub, LeetCode)
router.post('/profiles', (req, res) => {
    const studentId = req.user.id;
    const { github, leetcode } = req.body;

    // Find or create profile entry
    let profile = externalProfiles.find(p => p.studentId === studentId);

    if (profile) {
        // Update existing profile
        if (github) profile.github = github;
        if (leetcode) profile.leetcode = leetcode;
    } else {
        // Create new profile
        externalProfiles.push({
            studentId,
            github: github || null,
            leetcode: leetcode || null,
            githubScore: 0, // Will be calculated in future
            leetcodeScore: 0
        });
    }

    res.json({
        success: true,
        message: 'External profiles updated successfully',
        profiles: { github, leetcode }
    });
});

// Get external profiles
router.get('/profiles', (req, res) => {
    const studentId = req.user.id;
    const profile = externalProfiles.find(p => p.studentId === studentId);

    if (!profile) {
        return res.json({
            profiles: null,
            message: 'No external profiles connected'
        });
    }

    res.json({ profiles: profile });
});

// Get complete analytics
router.get('/analytics', (req, res) => {
    const studentId = req.user.id;
    const analytics = getStudentAnalytics(studentId);

    if (!analytics) {
        return res.status(404).json({ error: 'Analytics not available' });
    }

    res.json({ analytics });
});

module.exports = router;
