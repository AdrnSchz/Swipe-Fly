// Routes/groups.js
router.post('/:groupId/vote', async (req, res) => {
    const { destinationId, userId, vote } = req.body;
    await db.query(
      'INSERT INTO destination_votes VALUES (?, ?, ?) ON CONFLICT UPDATE vote = ?',
      [groupId, destinationId, userId, vote]
    );
    res.json({ success: true });
  });