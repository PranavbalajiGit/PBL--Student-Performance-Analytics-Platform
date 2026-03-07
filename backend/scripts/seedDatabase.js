require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

// Import Models
const User = require('../Models/User');
const FacultyStudentMapping = require('../Models/FacultyStudentMapping');
const AcademicMarks = require('../Models/AcademicMarks');
const PSkills = require('../Models/PSkills');
const ActivityRewardPoints = require('../Models/ActivityRewardPoints');
const ExternalProfile = require('../Models/ExternalProfile');

// Import Mock Data
const {
    users,
    facultyStudentMappings,
    academicMarks,
    pSkills,
    activityRewardPoints,
    externalProfiles
} = require('../data/mockData');

const seedDB = async () => {
    try {
        await connectDB();
        
        console.log('Clearing existing data...');
        
        // Clear collections
        await Promise.all([
            User.deleteMany({}),
            FacultyStudentMapping.deleteMany({}),
            AcademicMarks.deleteMany({}),
            PSkills.deleteMany({}),
            ActivityRewardPoints.deleteMany({}),
            ExternalProfile.deleteMany({})
        ]);
        
        console.log('Inserting mock data...');

        // Insert Users
        await User.insertMany(users);
        console.log(`Inserted ${users.length} users`);

        // Insert Faculty Mappings
        await FacultyStudentMapping.insertMany(facultyStudentMappings);
        console.log(`Inserted ${facultyStudentMappings.length} faculty-student mappings`);

        // Insert Academic Marks
        await AcademicMarks.insertMany(academicMarks);
        console.log(`Inserted ${academicMarks.length} academic mark records`);

        // Insert P-Skills
        await PSkills.insertMany(pSkills);
        console.log(`Inserted ${pSkills.length} P-Skills records`);

        // Insert Activity/Reward Points
        await ActivityRewardPoints.insertMany(activityRewardPoints);
        console.log(`Inserted ${activityRewardPoints.length} activity/reward points records`);

        // Insert External Profiles
        await ExternalProfile.insertMany(externalProfiles);
        console.log(`Inserted ${externalProfiles.length} external profiles`);

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();
