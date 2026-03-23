const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const jwt = require('jsonwebtoken');

// Login endpoint
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Find user
        const user = await User.findOne({ username });

        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role, name: user.name, email: user.email },
            process.env.SESSION_SECRET || 'student-analytics-mvp-secret-2024',
            { expiresIn: '24h' }
        );

        // Cookie options for cross-domain support in production
        const cookieOptions = {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            secure: process.env.NODE_ENV === 'production'
        };

        // Set cookie
        res.cookie('sessionId', token, {
            ...cookieOptions,
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
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
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// Logout endpoint
router.post('/logout', (req, res) => {
    const cookieOptions = {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production'
    };
    res.clearCookie('sessionId', cookieOptions);
    res.json({ success: true, message: 'Logged out successfully' });
});

// Get current user
router.get('/me', (req, res) => {
    const token = req.cookies.sessionId;

    if (!token) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SESSION_SECRET || 'student-analytics-mvp-secret-2024');
        res.json({ user: decoded });
    } catch (error) {
        const cookieOptions = {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            secure: process.env.NODE_ENV === 'production'
        };
        res.clearCookie('sessionId', cookieOptions);
        res.status(401).json({ error: 'Session expired or invalid' });
    }
});

module.exports = router;
