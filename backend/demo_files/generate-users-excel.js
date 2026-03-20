const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const usersData = [];

// Generate 20 students
for (let i = 1; i <= 20; i++) {
    usersData.push({
        'username': `student${i}`,
        'password': `pass@${i}`,
        'role': 'student',
        'name': `Student Name ${i}`,
        'email': `student${i}@example.com`,
        'department': 'Computer Science',
        'rollNumber': `CS24-10${i.toString().padStart(2, '0')}`,
        'semester': 4
    });
}

// Generate 5 faculties
for (let i = 1; i <= 5; i++) {
    usersData.push({
        'username': `faculty${i}`,
        'password': `facpass@${i}`,
        'role': 'faculty',
        'name': `Faculty Name ${i}`,
        'email': `faculty${i}@example.com`,
        'department': 'Computer Science',
        'rollNumber': '',
        'semester': ''
    });
}

const usersSheet = XLSX.utils.json_to_sheet(usersData);
const usersWorkbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(usersWorkbook, usersSheet, 'Users');

const outPath = path.join(__dirname, 'demo_bulk_users.xlsx');
XLSX.writeFile(usersWorkbook, outPath);

console.log(`Successfully generated demo_bulk_users.xlsx at: ${outPath}`);
