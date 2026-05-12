const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');
const axios = require('axios');

router.post('/start', auth, async (req, res) => {
  const { domaine, niveau } = req.body;
  try {
    const prompt = `Tu es un recruteur RH expert. Génère 5 questions d'entretien pour un poste de ${domaine} niveau ${niveau}.
Réponds UNIQUEMENT en JSON: {"questions": ["question1","question2","question3","question4","question5"]}`;
    const r = await axios.post(`${process.env.OLLAMA_URL}/api/generate`, { model: 'llama3.2', prompt, stream: false });
    const m = r.data.response.match(/\{[\s\S]*\}/);
    res.json(m ? JSON.parse(m[0]) : { questions: [] });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/feedback', auth, async (req, res) => {
  const { question, reponse, domaine } = req.body;
  try {
    const prompt = `Tu es un recruteur expert en ${domaine}. Évalue cette réponse.
Question: "${question}"
Réponse: "${reponse}"
Réponds UNIQUEMENT en JSON: {"score": 7, "feedback": "...", "points_forts": "...", "a_ameliorer": "..."}`;
    const r = await axios.post(`${process.env.OLLAMA_URL}/api/generate`, { model: 'llama3.2', prompt, stream: false });
    const m = r.data.response.match(/\{[\s\S]*\}/);
    res.json(m ? JSON.parse(m[0]) : { score: 5, feedback: 'Feedback indisponible' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/save', auth, async (req, res) => {
  const { domaine, score, feedback } = req.body;
  try {
    await db.query('INSERT INTO entretiens (user_id, domaine, score, feedback) VALUES (?, ?, ?, ?)',
      [req.user.id, domaine, score, feedback]);
    res.json({ message: 'Sauvegardé' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/historique', auth, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM entretiens WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
