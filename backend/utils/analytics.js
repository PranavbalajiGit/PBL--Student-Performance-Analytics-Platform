const {
    academicMarks,
    pSkills,
    activityRewardPoints,
    externalProfiles,
    users
} = require('../data/mockData');

/**
 * Calculate overall performance score for a student
 * Weighted scoring:
 * - Academic Marks: 40%
 * - P-Skills: 20%
 * - Activity Points: 15%
 * - Reward Points: 15%
 * - External Profiles: 10%
 */
const calculateStudentScore = (studentId) => {
    let totalScore = 0;

    // Academic marks (40%)
    const marks = academicMarks.find(m => m.studentId === studentId);
    if (marks) {
        totalScore += (marks.average / 100) * 40;
    }

    // P-Skills (20%) - based on number and level
    const skills = pSkills.find(s => s.studentId === studentId);
    if (skills) {
        const skillScore = skills.skills.reduce((acc, skill) => {
            const levelScore = skill.level === 'Advanced' ? 30 : skill.level === 'Intermediate' ? 20 : 10;
            return acc + levelScore;
        }, 0);
        // Normalize to max 100 (assuming 4 advanced skills = 120 points max)
        const normalizedSkillScore = Math.min((skillScore / 120) * 100, 100);
        totalScore += (normalizedSkillScore / 100) * 20;
    }

    // Activity points (15%) - normalize to max 200 points
    const points = activityRewardPoints.find(p => p.studentId === studentId);
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
    const profile = externalProfiles.find(p => p.studentId === studentId);
    if (profile) {
        const externalScore = (profile.githubScore + profile.leetcodeScore) / 2;
        totalScore += (externalScore / 100) * 10;
    }

    return parseFloat(totalScore.toFixed(2));
};

/**
 * Generate campus-wide rankings
 */
const generateRankings = () => {
    const students = users.filter(u => u.role === 'student');

    const rankings = students.map(student => ({
        studentId: student.id,
        name: student.name,
        rollNumber: student.rollNumber,
        department: student.department,
        score: calculateStudentScore(student.id)
    }));

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
const getStudentRank = (studentId) => {
    const rankings = generateRankings();
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
const getCampusAnalytics = () => {
    const students = users.filter(u => u.role === 'student');
    const rankings = generateRankings();

    // Calculate average scores
    const averageScore = rankings.reduce((acc, r) => acc + r.score, 0) / rankings.length;

    // Skills distribution
    const totalSkills = pSkills.reduce((acc, ps) => acc + ps.totalCompleted, 0);
    const averageSkillsPerStudent = totalSkills / students.length;

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
        averageScore: (departments[dept].totalScore / departments[dept].count).toFixed(2)
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
const getStudentAnalytics = (studentId) => {
    const student = users.find(u => u.id === studentId);
    if (!student) return null;

    const marks = academicMarks.find(m => m.studentId === studentId);
    const skills = pSkills.find(s => s.studentId === studentId);
    const points = activityRewardPoints.find(p => p.studentId === studentId);
    const profile = externalProfiles.find(p => p.studentId === studentId);
    const rankInfo = getStudentRank(studentId);

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
        overallScore: calculateStudentScore(studentId)
    };
};

module.exports = {
    calculateStudentScore,
    generateRankings,
    getStudentRank,
    getCampusAnalytics,
    getStudentAnalytics
};
