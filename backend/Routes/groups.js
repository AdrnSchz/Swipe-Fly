const express = require('express');
const router = express.Router();
const db = require('../db');

// Create a new group
router.post('/group', async (req, res) => {
  const { name, adminId } = req.body;

  
    // Enhanced validation
    if (!name?.trim()) {
      return res.status(400).json({ 
        error: 'Group name is required' 
      });
    }

    if (name.length > 100) {
      return res.status(400).json({ 
        error: 'Group name must be 100 characters or less' 
      });
    }

    if (!adminId || isNaN(adminId)) {
      return res.status(400).json({
        error: 'Valid adminId is required'
      });
    }
  try {
    const result = await db.query(
      `INSERT INTO groups (name, admin_id, status)
       VALUES (?, ?, 'planning')
       RETURNING id, name, admin_id, status, created_at`,
      [name.trim(), adminId]
    );

    // Add creator as admin member
    await db.query(
      `INSERT INTO group_members (group_id, user_id)
       VALUES (?, ?)`,
      [result.rows[0].id, adminId]
    );

    res.status(201).json({
      success: true,
      group: result.rows[0]
    });

  } catch (err) {
    console.error('Create group error:', err);
    res.status(500).json({ 
      error: 'Failed to create group',
      details: err.message
    });
  }
});

// Get group details
router.get('/:groupId', async (req, res) => {
  try {
    const { groupId } = req.params;
    
    // Validate groupId is a number
    if (isNaN(groupId)) {
      return res.status(400).json({ error: 'Invalid group ID' });
    }

    const result = await db.query(
      `SELECT 
        id,
        name,
        admin_id,
        destination_id,
        status,
        strftime('%Y-%m-%d %H:%M:%S', created_at) as created_at
       FROM groups 
       WHERE id = ?`,
      [groupId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Group not found' });
    }

    res.json({
      success: true,
      group: result.rows[0]
    });

  } catch (err) {
    console.error('Get group error:', err);
    res.status(500).json({ error: 'Failed to get group details' });
  }
});

// Update group status
router.patch('/:groupId/status', async (req, res) => {
  try {
    const { groupId } = req.params;
    const { status, userId } = req.body;

    // Input validation
    if (isNaN(groupId)) {
      return res.status(400).json({ error: 'Invalid group ID' });
    }

    const allowedStatuses = ['planning', 'voting', 'finalized'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ 
        error: `Status must be one of: ${allowedStatuses.join(', ')}`,
        allowedStatuses
      });
    }

    // Verify admin privileges
    const isAdmin = await db.query(
      'SELECT 1 FROM groups WHERE id = ? AND admin_id = ?',
      [groupId, userId]
    );

    if (isAdmin.rows.length === 0) {
      return res.status(403).json({ error: 'Only group admin can update status' });
    }

    const result = await db.query(
      `UPDATE groups 
       SET status = ?
       WHERE id = ?
       RETURNING id, status`,
      [status, groupId]
    );

    res.json({
      success: true,
      newStatus: result.rows[0].status,
      groupId: Number(groupId)
    });

  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ 
      error: 'Failed to update group status',
      ...(process.env.NODE_ENV === 'development' && {
        details: err.message
      })
    });
  }
});

// Voting endpoint
router.post('/:groupId/vote', async (req, res) => {
  try {
    const { groupId } = req.params;
    const { destinationId, vote, userId } = req.body;

    // Validate inputs
    if (isNaN(groupId) || isNaN(destinationId)) {
      return res.status(400).json({ error: 'Invalid group or destination ID' });
    }

    if (!Number.isInteger(vote) || ![-1, 0, 1].includes(vote)) {
      return res.status(400).json({ 
        error: 'Vote must be -1 (dislike), 0 (neutral), or 1 (like)',
        allowedVotes: [-1, 0, 1]
      });
    }

    // Check group status
    const groupStatus = await db.query(
      'SELECT status FROM groups WHERE id = ?',
      [groupId]
    );

    if (groupStatus.rows[0]?.status !== 'voting') {
      return res.status(400).json({ 
        error: 'Group is not in voting phase',
        currentStatus: groupStatus.rows[0]?.status
      });
    }

    // Check group membership
    const isMember = await db.query(
      'SELECT 1 FROM group_members WHERE group_id = ? AND user_id = ?',
      [groupId, userId]
    );

    if (isMember.rows.length === 0) {
      return res.status(403).json({ error: 'You are not a member of this group' });
    }

    // Process vote
    await db.query(
      `INSERT INTO destination_votes (group_id, destination_id, user_id, vote)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(group_id, destination_id, user_id) 
       DO UPDATE SET vote = excluded.vote`,
      [groupId, destinationId, userId, vote]
    );

    res.json({ 
      success: true,
      groupId: Number(groupId),
      destinationId: Number(destinationId),
      vote
    });

  } catch (err) {
    console.error('Vote error:', err);
    res.status(500).json({ 
      error: 'Failed to process vote',
      ...(process.env.NODE_ENV === 'development' && {
        details: err.message
      })
    });
  }
});

module.exports = router;