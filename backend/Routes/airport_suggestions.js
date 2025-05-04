const express = require('express');
const dotenv = require('dotenv');
const { suggestCities } = require('../services/suggestCities');
const db = require('../db');

dotenv.config();
const router = express.Router();

// POST crea airportSuggestions, con Gemini y guarda también las "tags"
router.post('/group/:groupId', async (req, res) => {
  const { groupId } = req.params;
  if (!groupId) {
    return res.status(400).json({ error: 'Group ID is required.' });
  }

  try {
    // 1. Obtener user_ids del grupo
    const membersResult = await db.query(
      `SELECT user_id FROM group_members WHERE group_id = ?`,
      [groupId]
    );
    const userIds = membersResult.rows.map(r => r.user_id);
    if (userIds.length === 0) {
      return res.status(404).json({ error: 'No users found for this group.' });
    }

    // 2. Obtener preferencias de esos usuarios
    const placeholders = userIds.map(() => '?').join(',');
    const prefsResult = await db.query(
      `SELECT preference_type, preference_value
       FROM user_preferences
       WHERE user_id IN (${placeholders})`,
      userIds
    );
    const allPrefs = prefsResult.rows.map(r => `${r.preference_type}: ${r.preference_value}`);
    const preferencesText = allPrefs.join(', ');

    // 3. Sugerir ciudades + tags con IA
    //    ahora suggestCities() devuelve [{ city, tags: [...] }, ...]
    const citiesWithTags = await suggestCities(preferencesText);

    if (!Array.isArray(citiesWithTags)) {
      return res.status(500).json({ error: 'AI response format invalid.' });
    }

    // 4. Buscar aeropuertos en esas ciudades
    const cityNames = citiesWithTags.map(c => c.city.toLowerCase());
    const airportPlaceholders = cityNames.map(() => '?').join(',');
    const airportResult = await db.query(
      `SELECT * FROM airport WHERE LOWER(city) IN (${airportPlaceholders}) LIMIT 10`,
      cityNames
    );

    // 5. Guardar en airport_suggestions incluyendo las tags (JSON)
    for (const row of airportResult.rows) {
      // buscar el objeto {city,tags} correspondiente
      const match = citiesWithTags.find(c => c.city.toLowerCase() === row.city.toLowerCase());
      const tagsJson = match ? JSON.stringify(match.tags) : JSON.stringify([]);
      await db.query(
        `INSERT INTO airport_suggestions (group_id, airport_id, tags) VALUES (?, ?, ?)`,
        [groupId, row.id, tagsJson]
      );
    }

    res.json({
      groupId,
      preferencesUsed: allPrefs,
      suggestions: citiesWithTags,
      matchedAirports: airportResult.rows
    });
  } catch (err) {
    console.error('Error in POST /group/:groupId:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// GET devuelve aeropuertos sugeridos con sus tags
router.get('/group/:groupId', async (req, res) => {
  const { groupId } = req.params;
  if (!groupId) {
    return res.status(400).json({ error: 'Group ID is required.' });
  }

  try {
    const result = await db.query(
      `SELECT a.*, s.tags
       FROM airport_suggestions s
       JOIN airport a ON a.id = s.airport_id
       WHERE s.group_id = ?`,
      [groupId]
    );
    res.json({
      groupId,
      suggestedAirports: result.rows.map(r => ({
        id: r.id,
        iata: r.iata,
        city: r.city,
        country: r.country,
        // ...
        tags: r.tags  // ya viene como JSON
      }))
    });
  } catch (err) {
    console.error('Error in GET /group/:groupId:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// DELETE todas las sugerencias de un grupo
router.delete('/group/:groupId', async (req, res) => {
  const { groupId } = req.params;
  if (!groupId) {
    return res.status(400).json({ error: 'Group ID is required.' });
  }

  try {
    await db.query(
      `DELETE FROM airport_suggestions WHERE group_id = ?`,
      [groupId]
    );
    res.json({ message: `Suggestions deleted for group ${groupId}` });
  } catch (err) {
    console.error('Error in DELETE /group/:groupId:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// DELETE una sugerencia por su ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Suggestion ID is required.' });
  }

  try {
    const select = await db.query(
      `SELECT * FROM airport_suggestions WHERE id = ?`,
      [id]
    );
    if (select.rows.length === 0) {
      return res.status(404).json({ error: `Suggestion with ID ${id} not found.` });
    }
    await db.query(
      `DELETE FROM airport_suggestions WHERE id = ?`,
      [id]
    );
    res.json({ message: `Suggestion ${id} deleted successfully.` });
  } catch (err) {
    console.error('Error in DELETE /:id:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
