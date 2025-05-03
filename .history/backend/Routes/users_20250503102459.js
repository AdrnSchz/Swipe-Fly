// Routes/users.js
const router = require('express').Router();
const db = require('../db');

// Register user
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  // Add validation + hashing
  const result = await db.query(
    'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?) RETURNING *',
    [username, email, hashedPassword]
  );
  res.json(result.rows[0]);
});

// Get user preferences
router.get('/:id/preferences', async (req, res) => {
  const result = await db.query(
    'SELECT * FROM user_preferences WHERE user_id = ?',
    [req.params.id]
  );
  res.json(result.rows);
});

module.exports = router;