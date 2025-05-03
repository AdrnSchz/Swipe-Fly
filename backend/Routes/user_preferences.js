const express = require('express');
const router = express.Router();
const db = require('../db');

// Add or update a user preference
router.post('/add', async (req, res) => {
  const { userId, preferenceType, preferenceValue } = req.body;

  if (!userId || isNaN(userId)) {
    return res.status(400).json({ error: 'Valid userId is required' });
  }

  if (!preferenceType || typeof preferenceType !== 'string') {
    return res.status(400).json({ error: 'preferenceType must be a string' });
  }

  if (preferenceValue === undefined) {
    return res.status(400).json({ error: 'preferenceValue is required' });
  }

  try {
    const jsonValue = JSON.stringify(preferenceValue);

    await db.query(
      `INSERT INTO user_preferences (user_id, preference_type, preference_value)
       VALUES (?, ?, ?)
       ON CONFLICT(user_id, preference_type)
       DO UPDATE SET preference_value = excluded.preference_value`,
      [userId, preferenceType, jsonValue]
    );

    res.status(200).json({ 
      success: true, 
      message: 'Preference saved successfully',
      preference: { userId, preferenceType, preferenceValue }
    });

  } catch (err) {
    console.error('Save preference error:', err);
    res.status(500).json({ error: 'Failed to save preference' });
  }
});

// Delete a user preference
router.delete('/:userId/:preferenceType', async (req, res) => {
  const { userId, preferenceType } = req.params;

  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid userId' });
  }

  try {
    const result = await db.query(
      `DELETE FROM user_preferences 
       WHERE user_id = ? AND preference_type = ?`,
      [userId, preferenceType]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Preference not found' });
    }

    res.status(200).json({ success: true, message: 'Preference deleted' });

  } catch (err) {
    console.error('Delete preference error:', err);
    res.status(500).json({ error: 'Failed to delete preference' });
  }
});

module.exports = router;
