// Routes/destinations.js
router.get('/recommended', async (req, res) => {
    // Example: Filter by group preferences
    const result = await db.query(
      'SELECT * FROM destinations WHERE tags @> ?',
      [JSON.stringify(['beach'])]
    );
    res.json(result.rows);
  });