import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [form, setForm] = useState({ nom: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      await axios.post('/api/auth/register', form);
      setSuccess('Compte créé ! Redirection...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) { setError(err.response?.data?.error || "Erreur d'inscription"); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🎯 EduXpert</div>
        <div className="auth-tagline">Rejoignez des milliers d'apprenants</div>
        {error   && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nom complet</label>
            <input className="input" placeholder="Votre nom" value={form.nom}
              onChange={e => setForm({ ...form, nom: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="input" type="email" placeholder="votre@email.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <input className="input" type="password" placeholder="••••••••" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', marginTop: 8 }}>
            {loading ? <><span className="spinner" /> Création...</> : 'Créer mon compte'}
          </button>
        </form>
        <div className="form-link">Déjà un compte ? <Link to="/login">Se connecter</Link></div>
      </div>
    </div>
  );
}
