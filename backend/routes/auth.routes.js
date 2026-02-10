const express = require('express');
const router = express.Router();
const { users, sessions } = require('../data/mockData');
const crypto = require('crypto');

// Login endpoint
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find user
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Create session
    const sessionId = crypto.randomBytes(32).toString('hex');
    sessions.set(sessionId, {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name,
        email: user.email
    });

    // Set cookie
    res.cookie('sessionId', sessionId, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'lax'
    });

    res.json({
        success: true,
        user: {
            id: user.id,
            username: user.username,
            name: user.name,
            role: user.role,
            email: user.email
        },
        redirectTo: `/${user.role}`
    });
});

// Logout endpoint
router.post('/logout', (req, res) => {
    const sessionId = req.cookies.sessionId;

    if (sessionId && sessions.has(sessionId)) {
        sessions.delete(sessionId);
    }

    res.clearCookie('sessionId');
    res.json({ success: true, message: 'Logged out successfully' });
});

// Get current user
router.get('/me', (req, res) => {
    const sessionId = req.cookies.sessionId;

    if (!sessionId || !sessions.has(sessionId)) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = sessions.get(sessionId);
    res.json({ user });
});

module.exports = router;
