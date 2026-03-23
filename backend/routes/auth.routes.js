const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const jwt = require('jsonwebtoken');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication API
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: "123"
 *     responses:
 *       200:
 *         description: Successful login
 *       400:
 *         description: Missing credentials
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
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

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: User logout
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
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

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current logged in user
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Current user information
 *       401:
 *         description: Not authenticated or session expired
 */
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
