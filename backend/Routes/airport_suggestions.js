const express = require('express');
const dotenv = require('dotenv');
const { suggestCities } = require('../services/suggestCities');
const db = require('../db');

dotenv.config();
const router = express.Router();
//Post crea airportSuggestions, con gemini
router.post('/group/:groupId', async (req, res) => {
  const { groupId } = req.params;

  if (!groupId) {
    return res.status(400).json({ error: 'Group ID is required.' });
  }

  try {
    // 1. Obtener los user_ids del grupo
    const membersResult = await db.query(
      `SELECT user_id FROM group_members WHERE group_id = ?`,
      [groupId]
    );

    const userIds = membersResult.rows.map(row => row.user_id);
    if (userIds.length === 0) {
      return res.status(404).json({ error: 'No users found for this group.' });
    }

    // 2. Obtener las preferencias de esos usuarios
    const placeholders = userIds.map(() => '?').join(',');
    const prefsResult = await db.query(
      `SELECT preference_type, preference_value FROM user_preferences WHERE user_id IN (${placeholders})`,
      userIds
    );
    const allPrefs = prefsResult.rows.map(row => {
      return `${row.preference_type}: ${row.preference_value}`;
    });
    const preferencesText = allPrefs.join(', ');

    // 3. Sugerir ciudades con IA
    const cities = await suggestCities(preferencesText);

    if (!Array.isArray(cities)) {
      return res.status(500).json({ error: 'AI response format invalid.' });
    }

    // 4. Buscar aeropuertos en esas ciudades
    const airportPlaceholders = cities.map(() => '?').join(',');
    const airportResult = await db.query(
      `SELECT * FROM airport WHERE LOWER(city) IN (${airportPlaceholders}) limit 10`,
      cities.map(c => c.toLowerCase())
    );

    for (const airport of airportResult.rows) {
      await db.query(
        `INSERT INTO airport_suggestions (group_id, airport_id) VALUES (?, ?)`,
        [groupId, airport.id]
      );
    }

    res.json({
      groupId,
      preferencesUsed: allPrefs,
      suggestions: cities,
      matchedAirports: airportResult.rows
    });

  } catch (err) {
    console.error('Error in /groups/:groupId/suggestions:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/group/:groupId', async (req, res) => {
  const { groupId } = req.params;

  if (!groupId) {
    return res.status(400).json({ error: 'Group ID is required.' });
  }

  try {
    const result = await db.query(
      `SELECT a.* FROM airport_suggestions s
       JOIN airport a ON a.id = s.airport_id
       WHERE s.group_id = ?`,
      [groupId]
    );

    res.json({
      groupId,
      suggestedAirports: result.rows
    });

  } catch (err) {
    console.error('Error fetching suggestions:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/group/:groupId', async (req, res) => {
  const { groupId } = req.params;

  if (!groupId) {
    return res.status(400).json({ error: 'Group ID is required.' });
  }

  try {
    const result = await db.query(
      `DELETE FROM airport_suggestions WHERE group_id = ?`,
      [groupId]
    );

    res.json({ message: `Suggestions deleted for group ${groupId}` });

  } catch (err) {
    console.error('Error deleting suggestions:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'Suggestion ID is required.' });
  }

  try {
    const select=  await db.query(
      `SELECT * FROM airport_suggestions WHERE id = ?`,
      [id]
    );
    if (select.rows.length === 0) {
      return res.status(404).json({ error: `Suggestion with ID ${id} not found.` });
    }
    const result = await db.query(
      `DELETE FROM airport_suggestions WHERE id = ?`,
      [id]
    );


    res.json({ message: `Suggestion ${id} deleted successfully.` });

  } catch (err) {
    console.error('Error deleting suggestion by ID:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;