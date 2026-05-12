const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

router.post('/register', async (req, res) => {
  const { nom, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO users (nom, email, password) VALUES (?, ?, ?)', [nom, email, hash]);
    res.json({ message: 'Compte créé' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!rows.length) return res.status(401).json({ error: 'Email introuvable' });
    const valid = await bcrypt.compare(password, rows[0].password);
    if (!valid) return res.status(401).json({ error: 'Mot de passe incorrect' });
    const token = jwt.sign({ id: rows[0].id, nom: rows[0].nom }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: rows[0].id, nom: rows[0].nom, email: rows[0].email } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
