const express = require('express');
const db = require('../db');

const router = express.Router();
//http://localhost:4000/api/users?group_id=3 
//obtienes el usuario con las preferencias y grupos al cual pertenece
router.get('/', async (req, res, next) => {
    try {
        const { group_id } = req.query;

        // 1. Obtener todos los usuarios (filtrados si hay group_id)
        let usersResult;
        if (group_id) {
            // Buscar usuarios por grupo
            usersResult = await db.query(`
        SELECT u.*
        FROM users u
        JOIN group_members gm ON gm.user_id = u.id
        WHERE gm.group_id = ?
        ORDER BY u.id
        LIMIT 50
      `, [group_id]);
        } else {
            usersResult = await db.query(`
        SELECT *
        FROM users
        ORDER BY id
        LIMIT 50
      `);
        }

        const userIds = usersResult.rows.map(u => u.id);
        if (userIds.length === 0) {
            return res.status(200).json([]);
        }

        // 2. Obtener preferencias solo para los usuarios seleccionados
        const prefsResult = await db.query(`
      SELECT *
      FROM user_preferences
      WHERE user_id IN (${userIds.map(() => '?').join(',')})
      ORDER BY user_id, preference_type
      LIMIT 100
    `, userIds);

        // 3. Obtener grupos solo para los usuarios seleccionados
        const groupsResult = await db.query(`
      SELECT *
      FROM group_members
      WHERE user_id IN (${userIds.map(() => '?').join(',')})
      ORDER BY group_id, user_id
      LIMIT 100
    `, userIds);

        // 4. Reorganizar
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

        // 5. Combinar
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

router.get('/:id', async (req, res, next) => {
    const { id } = req.params;

    try {
        // 1. Obtener el usuario
        const userResult = await db.query(`SELECT * FROM users WHERE id = ?`, [id]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = userResult.rows[0];

        // 2. Obtener sus preferencias
        const prefsResult = await db.query(`
        SELECT preference_type, preference_value
        FROM user_preferences
        WHERE user_id = ?
        ORDER BY preference_type
      `, [id]);

        const preferences = prefsResult.rows.map(p => ({
            type: p.preference_type,
            value: p.preference_value
        }));

        // 3. Obtener sus grupos
        const groupsResult = await db.query(`
        SELECT g.*
        FROM groups g
        JOIN group_members gm ON gm.group_id = g.id
        WHERE gm.user_id = ?
        ORDER BY g.id
      `, [id]);

        const groups = groupsResult.rows;

        // 4. Combinar y responder
        res.status(200).json({
            ...user,
            preferences,
            groups
        });

    } catch (err) {
        console.error('Error fetching user by ID:', err);
        next(err);
    }
});


module.exports = router;
