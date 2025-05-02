const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ error: 'Authentication token required.' });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        console.error("JWT_SECRET is not defined!");
        return res.status(500).json({ error: "Server configuration error." });
    }

    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) {
            console.error("JWT Verification Error:", err.message);
            return res.status(403).json({ error: 'Invalid or expired token.' });
        }
        
        req.user = user;
        next();
    });
}

module.exports = {
    authenticateToken,
    isAdmin
};