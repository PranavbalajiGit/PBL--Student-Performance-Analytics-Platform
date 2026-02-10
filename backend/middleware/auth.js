const { sessions } = require('../data/mockData');

// Middleware to verify user session
const authenticate = (req, res, next) => {
    const sessionId = req.cookies.sessionId;

    if (!sessionId || !sessions.has(sessionId)) {
        return res.status(401).json({ error: 'Unauthorized. Please login.' });
    }

    const userSession = sessions.get(sessionId);
    req.user = userSession;
    next();
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
