const jwt = require('jsonwebtoken');

// Middleware to verify user session (now a JWT)
const authenticate = (req, res, next) => {
    const token = req.cookies.sessionId;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized. Please login.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SESSION_SECRET || 'student-analytics-mvp-secret-2024');
        req.user = decoded;
        next();
    } catch (error) {
        res.clearCookie('sessionId');
        return res.status(401).json({ error: 'Session expired or invalid. Please login again.' });
    }
};

// Middleware to require admin role
const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden. Admin access required.' });
    }
    next();
};

// Middleware to require faculty role
const requireFaculty = (req, res, next) => {
    if (req.user.role !== 'faculty') {
        return res.status(403).json({ error: 'Forbidden. Faculty access required.' });
    }
    next();
};

// Middleware to require student role
const requireStudent = (req, res, next) => {
    if (req.user.role !== 'student') {
        return res.status(403).json({ error: 'Forbidden. Student access required.' });
    }
    next();
};

module.exports = {
    authenticate,
    requireAdmin,
    requireFaculty,
    requireStudent
};
