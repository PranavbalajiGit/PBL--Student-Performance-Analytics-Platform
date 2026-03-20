const XLSX = require('xlsx');

/**
 * Validate Excel file structure for marks upload
 * Expected columns: Student ID, Subject, Marks, Max Marks
 */
const validateMarksExcel = (filePath) => {
    try {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);

        if (data.length === 0) {
            return { valid: false, error: 'Excel file is empty' };
        }

        // Check required columns
        const requiredColumns = ['Student ID', 'Subject', 'Marks', 'Max Marks'];
        const firstRow = data[0];
        const missingColumns = requiredColumns.filter(col => !(col in firstRow));

        if (missingColumns.length > 0) {
            return {
                valid: false,
                error: `Missing required columns: ${missingColumns.join(', ')}. Expected columns: ${requiredColumns.join(', ')}`
            };
        }

        // Validate data types
        for (let i = 0; i < data.length; i++) {
            const row = data[i];

            if (!row['Student ID'] || typeof row['Student ID'] !== 'string') {
                return { valid: false, error: `Invalid Student ID at row ${i + 2}` };
            }

            if (!row['Subject'] || typeof row['Subject'] !== 'string') {
                return { valid: false, error: `Invalid Subject name at row ${i + 2}` };
            }

            const marks = parseFloat(row['Marks']);
            const maxMarks = parseFloat(row['Max Marks']);

            if (isNaN(marks) || marks < 0) {
                return { valid: false, error: `Invalid Marks value at row ${i + 2}` };
            }

            if (isNaN(maxMarks) || maxMarks <= 0) {
                return { valid: false, error: `Invalid Max Marks value at row ${i + 2}` };
            }

            if (marks > maxMarks) {
                return { valid: false, error: `Marks exceed Max Marks at row ${i + 2}` };
            }
        }

        return { valid: true, data };
    } catch (error) {
        return { valid: false, error: `Failed to parse Excel file: ${error.message}` };
    }
};

/**
 * Validate Excel file structure for P-Skills upload
 * Expected columns: Student ID, Skill Name, Level, Completion Date
 */
const validatePSkillsExcel = (filePath) => {
    try {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);

        if (data.length === 0) {
            return { valid: false, error: 'Excel file is empty' };
        }

        const requiredColumns = ['Student ID', 'Skill Name', 'Level', 'Completion Date'];
        const firstRow = data[0];
        const missingColumns = requiredColumns.filter(col => !(col in firstRow));

        if (missingColumns.length > 0) {
            return {
                valid: false,
                error: `Missing required columns: ${missingColumns.join(', ')}. Expected columns: ${requiredColumns.join(', ')}`
            };
        }

        const validLevels = ['Beginner', 'Intermediate', 'Advanced'];

        for (let i = 0; i < data.length; i++) {
            const row = data[i];

            if (!row['Student ID'] || typeof row['Student ID'] !== 'string') {
                return { valid: false, error: `Invalid Student ID at row ${i + 2}` };
            }

            if (!row['Skill Name'] || typeof row['Skill Name'] !== 'string') {
                return { valid: false, error: `Invalid Skill Name at row ${i + 2}` };
            }

            if (!validLevels.includes(row['Level'])) {
                return {
                    valid: false,
                    error: `Invalid Level at row ${i + 2}. Must be one of: ${validLevels.join(', ')}`
                };
            }
        }

        return { valid: true, data };
    } catch (error) {
        return { valid: false, error: `Failed to parse Excel file: ${error.message}` };
    }
};

/**
 * Validate Excel file structure for Activity/Reward Points upload
 * Expected columns: Student ID, Type, Description, Points, Date
 */
const validatePointsExcel = (filePath) => {
    try {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);

        if (data.length === 0) {
            return { valid: false, error: 'Excel file is empty' };
        }

        const requiredColumns = ['Student ID', 'Type', 'Description', 'Points', 'Date'];
        const firstRow = data[0];
        const missingColumns = requiredColumns.filter(col => !(col in firstRow));

        if (missingColumns.length > 0) {
            return {
                valid: false,
                error: `Missing required columns: ${missingColumns.join(', ')}. Expected columns: ${requiredColumns.join(', ')}`
            };
        }

        const validTypes = ['Activity', 'Reward'];

        for (let i = 0; i < data.length; i++) {
            const row = data[i];

            if (!row['Student ID'] || typeof row['Student ID'] !== 'string') {
                return { valid: false, error: `Invalid Student ID at row ${i + 2}` };
            }

            if (!validTypes.includes(row['Type'])) {
                return {
                    valid: false,
                    error: `Invalid Type at row ${i + 2}. Must be either 'Activity' or 'Reward'`
                };
            }

            const points = parseFloat(row['Points']);
            if (isNaN(points) || points < 0) {
                return { valid: false, error: `Invalid Points value at row ${i + 2}` };
            }
        }

        return { valid: true, data };
    } catch (error) {
        return { valid: false, error: `Failed to parse Excel file: ${error.message}` };
    }
};

/**
 * Validate Excel file structure for bulk user upload
 * Expected columns: username, password, role, name, email (optional: department, rollNumber, semester)
 */
const validateUsersExcel = (filePath) => {
    try {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);

        if (data.length === 0) {
            return { valid: false, error: 'Excel file is empty' };
        }

        const requiredColumns = ['username', 'password', 'role', 'name', 'email'];
        const firstRow = data[0];
        const missingColumns = requiredColumns.filter(col => !(col in firstRow));

        if (missingColumns.length > 0) {
            return {
                valid: false,
                error: `Missing required columns: ${missingColumns.join(', ')}. Expected columns: ${requiredColumns.join(', ')}`
            };
        }

        const validRoles = ['student', 'faculty'];

        for (let i = 0; i < data.length; i++) {
            const row = data[i];

            if (!row['username'] || typeof row['username'] !== 'string') {
                return { valid: false, error: `Invalid username at row ${i + 2}` };
            }

            if (!row['password']) {
                return { valid: false, error: `Invalid password at row ${i + 2}` };
            }

            if (!row['role'] || !validRoles.includes(row['role'].toLowerCase())) {
                return {
                    valid: false,
                    error: `Invalid role at row ${i + 2}. Must be 'student' or 'faculty'`
                };
            }
            // Normalize role
            row['role'] = row['role'].toLowerCase();

            if (!row['name'] || typeof row['name'] !== 'string') {
                return { valid: false, error: `Invalid name at row ${i + 2}` };
            }

            if (!row['email'] || typeof row['email'] !== 'string') {
                return { valid: false, error: `Invalid email at row ${i + 2}` };
            }
        }

        return { valid: true, data };
    } catch (error) {
        return { valid: false, error: `Failed to parse Excel file: ${error.message}` };
    }
};

/**
 * Verify all students in Excel belong to the faculty's mapped students
 */
const verifyStudentMapping = (excelData, mappedStudentIds) => {
    const studentIdsInExcel = [...new Set(excelData.map(row => row['Student ID']))];
    const unmappedStudents = studentIdsInExcel.filter(id => !mappedStudentIds.includes(id));

    if (unmappedStudents.length > 0) {
        return {
            valid: false,
            error: `The following students are not mapped to you: ${unmappedStudents.join(', ')}. Upload rejected.`
        };
    }

    return { valid: true };
};

module.exports = {
    validateMarksExcel,
    validatePSkillsExcel,
    validatePointsExcel,
    verifyStudentMapping,
    validateUsersExcel
};
