require('dotenv').config();
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const facultyRoutes = require('./routes/faculty.routes');
const studentRoutes = require('./routes/student.routes');
const { authenticate, requireAdmin, requireFaculty, requireStudent } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxies (required for Render to successfully set 'secure' cookies)
app.set('trust proxy', 1);

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Student Performance Analytics API is running' });
});

// Public routes
app.use('/api/auth', authRoutes);

// Protected routes - Admin
app.use('/api/admin', authenticate, requireAdmin, adminRoutes);

// Protected routes - Faculty
app.use('/api/faculty', authenticate, requireFaculty, facultyRoutes);

// Protected routes - Student
app.use('/api/student', authenticate, requireStudent, studentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 Student Performance Analytics API`);
    console.log(`📡 Server running on http://localhost:${PORT}`);
    console.log(`🌍 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
    console.log(`\n📌 API Endpoints:`);
    console.log(`   Public: /api/auth/login, /api/auth/logout`);
    console.log(`   Admin: /api/admin/*`);
    console.log(`   Faculty: /api/faculty/*`);
    console.log(`   Student: /api/student/*`);
    console.log(`\n✨ Ready to accept requests!\n`);
});
