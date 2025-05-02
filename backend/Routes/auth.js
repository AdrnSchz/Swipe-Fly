const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();
const saltRounds = 10;

// Registration
router.post('/register', async (req, res, next) => {
    const { name, email, password, location, interests } = req.body;

    // Validate inputs

    try {
        // TODO: Check if user already exists, hash password and insert into db

        console.log(`User registered: ${newUser.email} (Role: ${newUser.role}, Verified: ${newUser.verified})`);
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