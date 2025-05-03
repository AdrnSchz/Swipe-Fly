const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();
const saltRounds = 10;

// Registration
router.post('/register', async (req, res, next) => {
    const { username, email, password, location } = req.body;
    
    if (!username || !email || !password || !location) {
        return res.status(400).json({ error: 'Name, email, password and location are required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format.' });
    }

    if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long ' });
    }

    try {
        const userExists = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'Email already registered.' });
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const result = await db.query(
            'INSERT INTO users (username, email, password_hash, home_location) VALUES (?, ?, ?, ?) RETURNING *',
            [username, email, hashedPassword, location]
        );
        const newUser = result.rows[0];

        delete newUser.password_hash;

        console.log(`User registered: ${newUser.username} (Mail: ${newUser.email})`);
        res.status(201).json({ message: 'User registered successfully.', user: newUser });

    } catch (err) {
        console.error("Registration error:", err);
        next(err);
    }
});

router.post('/login', async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        // TODO: Check if user exist and check password

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error("JWT_SECRET is not defined in environment variables!");
            return res.status(500).json({ error: "Server configuration error." });
        }

        const tokenPayload = {
            userId: user.id,
            email: user.email,
            role: user.role,
            name: user.name
        };

        const token = jwt.sign(
            tokenPayload,
            jwtSecret,
            { expiresIn: '1h' }
        );

        console.log(`User logged in: ${user.email}`);
        
        res.status(200).json({
            message: 'Login successful.',
            token: token,
            user: user
        });

    } catch (err) {
        console.error("Login error:", err);
        next(err);
    }
});

module.exports = router;