// Routes/groups.js
router.post('/:groupId/vote', async (req, res) => {
    const { destinationId, userId, vote } = req.body;
    await db.query(
      'INSERT INTO destination_votes VALUES (?, ?, ?) ON CONFLICT UPDATE vote = ?',
      [groupId, destinationId, userId, vote]
    );
    res.json({ success: true });
  });

  // In groups.js
router.get('/:groupId/matches', async (req, res) => {
    // Get destinations with the most "likes" (votes > 0)
    const result = await db.query(`
      SELECT destination_id, SUM(vote) as score 
      FROM destination_votes 
      WHERE group_id = ?
      GROUP BY destination_id
      ORDER BY score DESC
      LIMIT 3
    `, [req.params.groupId]);
    
    res.json(result.rows);
  });