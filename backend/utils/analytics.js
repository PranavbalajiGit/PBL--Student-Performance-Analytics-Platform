const User = require('../Models/User');
const AcademicMarks = require('../Models/AcademicMarks');
const PSkills = require('../Models/PSkills');
const ActivityRewardPoints = require('../Models/ActivityRewardPoints');
const ExternalProfile = require('../Models/ExternalProfile');

/**
 * Calculate overall performance score for a student
 * Weighted scoring:
 * - Academic Marks: 40%
 * - P-Skills: 20%
 * - Activity Points: 15%
 * - Reward Points: 15%
 * - External Profiles: 10%
 * 
 * Now takes data objects instead of just ID to avoid multiple DB calls.
 */
const calculateStudentScore = (marks, skills, points, profile) => {
    let totalScore = 0;

    // Academic marks (40%)
    if (marks) {
        totalScore += (marks.average / 100) * 40;
    }

    // P-Skills (20%) - based on number and level
    if (skills && skills.skills) {
        const skillScore = skills.skills.reduce((acc, skill) => {
            const levelScore = skill.level === 'Advanced' ? 30 : skill.level === 'Intermediate' ? 20 : 10;
            return acc + levelScore;
        }, 0);
        // Normalize to max 100 (assuming 4 advanced skills = 120 points max)
        const normalizedSkillScore = Math.min((skillScore / 120) * 100, 100);
        totalScore += (normalizedSkillScore / 100) * 20;
    }

    // Activity points (15%) - normalize to max 200 points
    if (points) {
        const activityScore = Math.min((points.activityPoints / 200) * 100, 100);
        totalScore += (activityScore / 100) * 15;
    }

    // Reward points (15%) - normalize to max 150 points
    if (points) {
        const rewardScore = Math.min((points.rewardPoints / 150) * 100, 100);
        totalScore += (rewardScore / 100) * 15;
    }

    // External profiles (10%)
    if (profile) {
        let externalScore = 0;
        let validProfiles = 0;
        if (profile.githubScore !== undefined && profile.githubScore !== null) { externalScore += profile.githubScore; validProfiles++; }
        if (profile.leetcodeScore !== undefined && profile.leetcodeScore !== null) { externalScore += profile.leetcodeScore; validProfiles++; }
        
        if (validProfiles > 0) {
            externalScore = externalScore / validProfiles;
            totalScore += (externalScore / 100) * 10;
        }
    }

    return parseFloat(totalScore.toFixed(2));
};

/**
 * Generate campus-wide rankings
 */
const generateRankings = async () => {
    const [students, allMarks, allSkills, allPoints, allProfiles] = await Promise.all([
        User.find({ role: 'student' }),
        AcademicMarks.find({}),
        PSkills.find({}),
        ActivityRewardPoints.find({}),
        ExternalProfile.find({})
    ]);

    const rankings = students.map(student => {
        const marks = allMarks.find(m => m.studentId === student.id);
        const skills = allSkills.find(s => s.studentId === student.id);
        const points = allPoints.find(p => p.studentId === student.id);
        const profile = allProfiles.find(p => p.studentId === student.id);

        return {
            studentId: student.id,
            name: student.name,
            rollNumber: student.rollNumber,
            department: student.department,
            score: calculateStudentScore(marks, skills, points, profile)
        };
    });

    // Sort by score descending
    rankings.sort((a, b) => b.score - a.score);

    // Assign ranks
    rankings.forEach((student, index) => {
        student.rank = index + 1;
        student.isTopTwenty = index < 20;
    });

    return rankings;
};

/**
 * Get privacy-aware rank for a student
 */
const getStudentRank = async (studentId) => {
    const rankings = await generateRankings();
    const studentRank = rankings.find(r => r.studentId === studentId);

    if (!studentRank) {
        return null;
    }

    return {
        rank: studentRank.rank,
        score: studentRank.score,
        totalStudents: rankings.length,
        isPublic: studentRank.isTopTwenty,
        message: studentRank.isTopTwenty
            ? 'Congratulations! Your rank is publicly visible (Top 20)'
            : 'Your rank is visible only to you'
    };
};

/**
 * Get campus-wide analytics for admin
 */
const getCampusAnalytics = async () => {
    const [students, allSkills] = await Promise.all([
        User.find({ role: 'student' }),
        PSkills.find({})
    ]);
    
    const rankings = await generateRankings();

    // Calculate average scores
    const averageScore = rankings.reduce((acc, r) => acc + r.score, 0) / (rankings.length || 1);

    // Skills distribution
    const totalSkills = allSkills.reduce((acc, ps) => acc + (ps.totalCompleted || 0), 0);
    const averageSkillsPerStudent = students.length ? totalSkills / students.length : 0;

    // Department-wise breakdown
    const departments = {};
    students.forEach(student => {
        if (!departments[student.department]) {
            departments[student.department] = {
                count: 0,
                totalScore: 0
            };
        }
        departments[student.department].count++;
        const studentRank = rankings.find(r => r.studentId === student.id);
        departments[student.department].totalScore += studentRank ? studentRank.score : 0;
    });

    const departmentStats = Object.keys(departments).map(dept => ({
        department: dept,
        studentCount: departments[dept].count,
        averageScore: (departments[dept].totalScore / (departments[dept].count || 1)).toFixed(2)
    }));

    return {
        totalStudents: students.length,
        averageScore: averageScore.toFixed(2),
        totalSkillsCompleted: totalSkills,
        averageSkillsPerStudent: averageSkillsPerStudent.toFixed(2),
        departmentStats,
        topPerformers: rankings.slice(0, 5)
    };
};

/**
 * Get analytics for a specific student
 */
const getStudentAnalytics = async (studentId) => {
    const student = await User.findOne({ id: studentId });
    if (!student) return null;

    const [marks, skills, points, profile, rankInfo] = await Promise.all([
        AcademicMarks.findOne({ studentId }),
        PSkills.findOne({ studentId }),
        ActivityRewardPoints.findOne({ studentId }),
        ExternalProfile.findOne({ studentId }),
        getStudentRank(studentId)
    ]);

    return {
        student: {
            id: student.id,
            name: student.name,
            rollNumber: student.rollNumber,
            department: student.department
        },
        academicPerformance: marks || null,
        skills: skills || null,
        activityRewardPoints: points || null,
        externalProfiles: profile || null,
        rank: rankInfo,
        overallScore: calculateStudentScore(marks, skills, points, profile)
    };
};

module.exports = {
    calculateStudentScore,
    generateRankings,
    getStudentRank,
    getCampusAnalytics,
    getStudentAnalytics
};
