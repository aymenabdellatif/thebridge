const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');
const axios = require('axios');

router.get('/', auth, async (req, res) => {
  try {
    const [cours] = await db.query('SELECT * FROM cours ORDER BY id');
    res.json(cours);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/progression', auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT c.*, COALESCE(p.score, 0) as score, COALESCE(p.completed, 0) as completed
       FROM cours c LEFT JOIN progression p ON c.id = p.cours_id AND p.user_id = ?`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/:id/score', auth, async (req, res) => {
  const { score } = req.body;
  try {
    await db.query(
      `INSERT INTO progression (user_id, cours_id, score, completed)
       VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE score = ?, completed = ?`,
      [req.user.id, req.params.id, score, score >= 70, score, score >= 70]
    );
    res.json({ message: 'Score enregistré' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
