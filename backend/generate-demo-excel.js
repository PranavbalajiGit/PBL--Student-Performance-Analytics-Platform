const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Output directory
const outDir = path.join(__dirname, 'demo_files');
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

// 1. Marks Excel
// Expected columns: Student ID, Subject, Marks, Max Marks
const marksData = [
    { 'Student ID': 'student1', 'Subject': 'Machine Learning', 'Marks': 88, 'Max Marks': 100 },
    { 'Student ID': 'student1', 'Subject': 'Cloud Computing', 'Marks': 92, 'Max Marks': 100 },
    { 'Student ID': 'student2', 'Subject': 'Machine Learning', 'Marks': 95, 'Max Marks': 100 },
    { 'Student ID': 'student4', 'Subject': 'Machine Learning', 'Marks': 85, 'Max Marks': 100 }
];

const marksSheet = XLSX.utils.json_to_sheet(marksData);
const marksWorkbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(marksWorkbook, marksSheet, 'Marks');
XLSX.writeFile(marksWorkbook, path.join(outDir, 'demo_marks.xlsx'));

// 2. PSkills Excel
// Expected columns: Student ID, Skill Name, Level, Completion Date
// Valid Levels: Beginner, Intermediate, Advanced
const pskillsData = [
    { 'Student ID': 'student1', 'Skill Name': 'Docker', 'Level': 'Intermediate', 'Completion Date': '2024-04-10' },
    { 'Student ID': 'student2', 'Skill Name': 'Kubernetes', 'Level': 'Beginner', 'Completion Date': '2024-04-12' },
    { 'Student ID': 'student4', 'Skill Name': 'Node.js', 'Level': 'Advanced', 'Completion Date': '2024-04-15' }
];

const pskillsSheet = XLSX.utils.json_to_sheet(pskillsData);
const pskillsWorkbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(pskillsWorkbook, pskillsSheet, 'PSkills');
XLSX.writeFile(pskillsWorkbook, path.join(outDir, 'demo_pskills.xlsx'));

// 3. Points Excel
// Expected columns: Student ID, Type, Description, Points, Date
// Valid Types: Activity, Reward
const pointsData = [
    { 'Student ID': 'student1', 'Type': 'Activity', 'Description': 'Attended AI Seminar', 'Points': 20, 'Date': '2024-04-01' },
    { 'Student ID': 'student2', 'Type': 'Reward', 'Description': 'Top Scorer in Quiz', 'Points': 50, 'Date': '2024-04-05' },
    { 'Student ID': 'student4', 'Type': 'Activity', 'Description': 'Open Source Contribution', 'Points': 30, 'Date': '2024-04-08' }
];

const pointsSheet = XLSX.utils.json_to_sheet(pointsData);
const pointsWorkbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(pointsWorkbook, pointsSheet, 'Points');
XLSX.writeFile(pointsWorkbook, path.join(outDir, 'demo_points.xlsx'));

console.log('Demo Excel files generated in backend/demo_files/');
