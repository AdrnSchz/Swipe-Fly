// Routes/users.js
const router = require('express').Router();
const db = require('../db');

// Register user
router.post('/register', async (req, res) => {
  
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