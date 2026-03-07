const express = require('express');
const router = express.Router();

const User = require('../Models/User');
const AcademicMarks = require('../Models/AcademicMarks');
const PSkills = require('../Models/PSkills');
const ActivityRewardPoints = require('../Models/ActivityRewardPoints');
const ExternalProfile = require('../Models/ExternalProfile');

const { getStudentRank, getStudentAnalytics, generateRankings } = require('../utils/analytics');

// Get Top 20 Leaderboard
router.get('/leaderboard', async (req, res) => {
    try {
        const rankings = await generateRankings();
        const top20 = rankings.slice(0, 20);
        res.json({ leaderboard: top20 });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get student profile
router.get('/profile', async (req, res) => {
    try {
        const studentId = req.user.id;
        const student = await User.findOne({ id: studentId });

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
    } catch (error) {
        console.error('Error fetching student profile:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get academic marks and trends
router.get('/marks', async (req, res) => {
    try {
        const studentId = req.user.id;
        const marks = await AcademicMarks.findOne({ studentId });

        if (!marks) {
            return res.json({ marks: null, message: 'No marks data available' });
        }

        res.json({ marks });
    } catch (error) {
        console.error('Error fetching marks:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get P-Skills
router.get('/pskills', async (req, res) => {
    try {
        const studentId = req.user.id;
        const skills = await PSkills.findOne({ studentId });

        if (!skills) {
            return res.json({ skills: null, message: 'No P-Skills data available' });
        }

        res.json({ skills });
    } catch (error) {
        console.error('Error fetching pskills:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get activity and reward points
router.get('/points', async (req, res) => {
    try {
        const studentId = req.user.id;
        const points = await ActivityRewardPoints.findOne({ studentId });

        if (!points) {
            return res.json({ points: null, message: 'No activity/reward points available' });
        }

        res.json({ points });
    } catch (error) {
        console.error('Error fetching points:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get privacy-aware rank
router.get('/rank', async (req, res) => {
    try {
        const studentId = req.user.id;
        const rankInfo = await getStudentRank(studentId);

        if (!rankInfo) {
            return res.status(404).json({ error: 'Ranking data not available' });
        }

        res.json({ rank: rankInfo });
    } catch (error) {
        console.error('Error generating rank:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Connect external technical profiles (GitHub, LeetCode)
router.post('/profiles', async (req, res) => {
    try {
        const studentId = req.user.id;
        const { github, leetcode } = req.body;

        // Find or create profile entry
        let profile = await ExternalProfile.findOne({ studentId });

        if (profile) {
            // Update existing profile
            if (github !== undefined) profile.github = github;
            if (leetcode !== undefined) profile.leetcode = leetcode;
            await profile.save();
        } else {
            // Create new profile
            profile = new ExternalProfile({
                studentId,
                github: github || null,
                leetcode: leetcode || null,
                githubScore: 0, // Will be calculated in future
                leetcodeScore: 0
            });
            await profile.save();
        }

        res.json({
            success: true,
            message: 'External profiles updated successfully',
            profiles: { github: profile.github, leetcode: profile.leetcode }
        });
    } catch (error) {
        console.error('Error updating profiles:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get external profiles
router.get('/profiles', async (req, res) => {
    try {
        const studentId = req.user.id;
        const profile = await ExternalProfile.findOne({ studentId });

        if (!profile) {
            return res.json({
                profiles: null,
                message: 'No external profiles connected'
            });
        }

        res.json({ profiles: profile });
    } catch (error) {
        console.error('Error fetching profiles:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get complete analytics
router.get('/analytics', async (req, res) => {
    try {
        const studentId = req.user.id;
        const analytics = await getStudentAnalytics(studentId);

        if (!analytics) {
            return res.status(404).json({ error: 'Analytics not available' });
        }

        res.json({ analytics });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
