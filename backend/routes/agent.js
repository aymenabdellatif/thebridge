const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');
const axios = require('axios');

router.post('/recommande', auth, async (req, res) => {
  try {
    const [progression] = await db.query(
      `SELECT c.titre, c.domaine, p.score, p.completed FROM progression p
       JOIN cours c ON p.cours_id = c.id WHERE p.user_id = ?`, [req.user.id]);
    const [entretiens] = await db.query(
      'SELECT domaine, score FROM entretiens WHERE user_id = ? ORDER BY created_at DESC LIMIT 3', [req.user.id]);
    const prompt = `Tu es un agent IA pédagogique. Analyse ce profil étudiant.
Cours: ${JSON.stringify(progression)}
Entretiens: ${JSON.stringify(entretiens)}
Réponds en JSON: {"message":"message court","prochain_cours":"suggestion","conseil_entretien":"conseil","niveau_global":"débutant"}`;
    const r = await axios.post(`${process.env.OLLAMA_URL}/api/generate`, { model: 'llama3.2', prompt, stream: false });
    const m = r.data.response.match(/\{[\s\S]*\}/);
    res.json(m ? JSON.parse(m[0]) : { message: 'Bienvenue sur EduXpert !', prochain_cours: 'JavaScript', conseil_entretien: 'Préparez vos projets.', niveau_global: 'débutant' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/chat', auth, async (req, res) => {
  const { message } = req.body;
  try {
    const prompt = `Tu es EduBot, assistant pédagogique sur EduXpert. Réponds en français, court et utile (max 3 phrases).
Question: "${message}"`;
    const r = await axios.post(`${process.env.OLLAMA_URL}/api/generate`, { model: 'llama3.2', prompt, stream: false });
    res.json({ reponse: r.data.response });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
