const express = require('express');
const db = require('../db'); // asumiendo que usas db.execute o db.query

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        // 1. Obtener todos los usuarios
        const usersResult = await db.execute(`
      SELECT id, username, email, home_location, created_at
      FROM users
      ORDER BY id
      LIMIT 50
    `);

        // 2. Obtener todas las preferencias
        const prefsResult = await db.execute(`
      SELECT user_id, preference_type, preference_value
      FROM user_preferences
      ORDER BY user_id, preference_type
      LIMIT 100
    `);

        // 3. Obtener todos los grupos
        const groupsResult = await db.execute(`
      SELECT user_id, group_id
      FROM group_members
      ORDER BY group_id, user_id
      LIMIT 100
    `);

        // 4. Reorganizar por usuario
        const prefsMap = {};
        prefsResult.rows.forEach(pref => {
            if (!prefsMap[pref.user_id]) prefsMap[pref.user_id] = [];
            prefsMap[pref.user_id].push({
                type: pref.preference_type,
                value: pref.preference_value
            });
        });

        const groupsMap = {};
        groupsResult.rows.forEach(gm => {
            if (!groupsMap[gm.user_id]) groupsMap[gm.user_id] = [];
            groupsMap[gm.user_id].push(gm.group_id);
        });

        // 5. Construir respuesta combinada
        const users = usersResult.rows.map(user => ({
            ...user,
            preferences: prefsMap[user.id] || [],
            groups: groupsMap[user.id] || []
        }));

        res.status(200).json(users);

    } catch (err) {
        console.error("Error fetching users:", err);
        next(err);
    }
});

module.exports = router;
