import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';

const BADGES = [
  { id: 1, icon: '🚀', titre: 'Premier Pas',    desc: 'Vous avez commencé votre premier cours',  condition: p => p.some(c => c.score > 0) },
  { id: 2, icon: '⭐', titre: 'Première Étoile', desc: 'Vous avez terminé un cours avec succès',  condition: p => p.some(c => c.completed) },
  { id: 3, icon: '🎯', titre: 'Entretien Pro',   desc: 'Vous avez passé un entretien simulé',     condition: (p,e) => e.length > 0 },
  { id: 4, icon: '🏆', titre: 'Champion',        desc: 'Score 10/10 à un entretien',              condition: (p,e) => e.some(i => i.score >= 9) },
  { id: 5, icon: '📚', titre: 'Studieux',        desc: '3 cours complétés',                       condition: p => p.filter(c => c.completed).length >= 3 },
  { id: 6, icon: '🔥', titre: 'En Feu',          desc: '5 entretiens passés',                     condition: (p,e) => e.length >= 5 },
];

export default function Dashboard() {
  const { user } = useAuth();
  const api = useApi();
  const navigate = useNavigate();
  const [progression, setProgression] = useState([]);
  const [entretiens, setEntretiens]   = useState([]);
  const [agent, setAgent]             = useState(null);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [p, e] = await Promise.all([api.get('/cours/progression'), api.get('/entretien/historique')]);
        setProgression(p.data); setEntretiens(e.data);
      } catch {}
      try { const a = await api.post('/agent/recommande'); setAgent(a.data); } catch {}
      finally { setLoading(false); }
    };
    load();
  }, []);

  const completed  = progression.filter(c => c.completed).length;
  const inProgress = progression.filter(c => c.score > 0 && !c.completed).length;
  const avgScore   = entretiens.length ? Math.round(entretiens.reduce((s,e) => s+e.score,0)/entretiens.length) : 0;
  const xp         = completed * 200 + entretiens.length * 100 + inProgress * 50;
  const scoreColor = s => s >= 7 ? 'var(--green)' : s >= 5 ? 'var(--orange)' : 'var(--red)';
  const badgesUnlocked = BADGES.filter(b => b.condition(progression, entretiens));

  if (loading) return (
    <div className="page" style={{ display:'flex', alignItems:'center', gap:12, color:'var(--text-muted)' }}>
      <span className="spinner" /> Chargement...
    </div>
  );

  return (
    <div className="page">
      {/* Hero banner */}
      <div className="hero-banner">
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
            <div className="avatar avatar-xl">{user?.nom?.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)}</div>
            <div>
              <h1 style={{ fontSize:22, fontWeight:800, color:'var(--text-primary)' }}>Bonjour, {user?.nom} 👋</h1>
              <p style={{ fontSize:13, color:'var(--text-secondary)', marginTop:2 }}>Continuez votre progression — vous êtes sur la bonne voie !</p>
            </div>
            <div className="xp-badge" style={{ marginLeft:'auto' }}>
              <i className="ti ti-bolt" /> {xp} XP
            </div>
          </div>
          {/* XP progress bar */}
          <div style={{ marginTop:8 }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'var(--text-secondary)', marginBottom:6 }}>
              <span>Progression niveau</span>
              <span>{xp} / 1000 XP</span>
            </div>
            <div className="progress-wrap progress-bar" style={{ height:10 }}>
              <div className="progress-fill" style={{ width:`${Math.min((xp/1000)*100,100)}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Agent IA recommandation */}
      {agent && (
        <div className="card card-grad" style={{ marginBottom:24, display:'flex', gap:16, alignItems:'flex-start' }}>
          <div style={{ width:44, height:44, borderRadius:12, background:'var(--accent-dim)', color:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:20 }}>
            <i className="ti ti-robot" />
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11, color:'var(--accent)', fontWeight:700, textTransform:'uppercase', letterSpacing:'.07em', marginBottom:5 }}>EduBot — Recommandation personnalisée</div>
            <p style={{ fontSize:14, color:'var(--text-primary)', marginBottom:6 }}>{agent.message}</p>
            <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              {agent.prochain_cours && <span style={{ fontSize:13, color:'var(--text-secondary)' }}><i className="ti ti-book" style={{ marginRight:4 }} />Prochain : <strong style={{ color:'var(--text-primary)' }}>{agent.prochain_cours}</strong></span>}
              {agent.niveau_global && <span className="badge badge-blue">{agent.niveau_global}</span>}
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom:24 }}>
        <div className="stat-card blue">
          <div className="stat-label">Cours complétés</div>
          <div className="stat-value" style={{ color:'var(--accent)' }}>{completed}</div>
          <div className="stat-sub">sur {progression.length} cours</div>
          <i className="ti ti-book stat-icon" />
        </div>
        <div className="stat-card green">
          <div className="stat-label">En cours</div>
          <div className="stat-value" style={{ color:'var(--green)' }}>{inProgress}</div>
          <div className="stat-sub">à terminer</div>
          <i className="ti ti-player-play stat-icon" />
        </div>
        <div className="stat-card purple">
          <div className="stat-label">Entretiens</div>
          <div className="stat-value" style={{ color:'var(--purple)' }}>{entretiens.length}</div>
          <div className="stat-sub">simulations IA</div>
          <i className="ti ti-microphone stat-icon" />
        </div>
        <div className="stat-card orange">
          <div className="stat-label">Score moyen</div>
          <div className="stat-value" style={{ color:scoreColor(avgScore) }}>{avgScore}<span style={{ fontSize:16, fontWeight:400 }}>/10</span></div>
          <div className="stat-sub">entretiens</div>
          <i className="ti ti-star stat-icon" />
        </div>
      </div>

      {/* Badges */}
      <div style={{ marginBottom:24 }}>
        <div className="section-title"><i className="ti ti-medal" /> Badges & Récompenses <span className="badge badge-blue">{badgesUnlocked.length}/{BADGES.length}</span></div>
        <div className="grid-3">
          {BADGES.map(b => {
            const unlocked = badgesUnlocked.some(u => u.id === b.id);
            return (
              <div key={b.id} className={`achievement ${unlocked ? 'unlocked' : ''}`}>
                <div className="achievement-icon" style={{ fontSize:22 }}>{unlocked ? b.icon : '🔒'}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:600, color: unlocked ? 'var(--yellow)' : 'var(--text-muted)' }}>{b.titre}</div>
                  <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:2 }}>{b.desc}</div>
                </div>
                {unlocked && <i className="ti ti-check" style={{ color:'var(--yellow)', flexShrink:0 }} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Cours + Entretiens */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:24 }}>
        <div className="card">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
            <div className="section-title" style={{ marginBottom:0 }}><i className="ti ti-book" /> Mes cours</div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/cours')}>Voir tout <i className="ti ti-arrow-right" /></button>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {progression.slice(0,5).map(c => (
              <div key={c.id}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                  <span style={{ fontSize:13, fontWeight:500, color:'var(--text-primary)' }}>{c.titre}</span>
                  <span className={`badge ${c.completed ? 'badge-green' : c.score > 0 ? 'badge-orange' : 'badge-muted'}`}>
                    {c.completed ? 'Terminé' : c.score > 0 ? `${c.score}%` : 'À faire'}
                  </span>
                </div>
                <div className="progress-wrap progress-bar">
                  <div className={`progress-fill ${c.completed ? 'green' : ''}`} style={{ width:`${c.score||0}%` }} />
                </div>
              </div>
            ))}
            {progression.length === 0 && <p style={{ color:'var(--text-muted)', fontSize:13 }}>Aucun cours commencé.</p>}
          </div>
        </div>

        <div className="card">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
            <div className="section-title" style={{ marginBottom:0 }}><i className="ti ti-microphone" /> Entretiens</div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/entretien')}>Nouveau <i className="ti ti-plus" /></button>
          </div>
          {entretiens.length === 0 ? (
            <div style={{ textAlign:'center', padding:'28px 0' }}>
              <div style={{ fontSize:40, marginBottom:10 }}>🎤</div>
              <p style={{ color:'var(--text-muted)', fontSize:13, marginBottom:14 }}>Aucun entretien simulé</p>
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/entretien')}>Commencer maintenant</button>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {entretiens.slice(0,5).map(e => (
                <div key={e.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 14px', borderRadius:10, background:'var(--bg-elevated)' }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:500, color:'var(--text-primary)' }}>{e.domaine}</div>
                    <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:2 }}>{new Date(e.created_at).toLocaleDateString('fr-FR')}</div>
                  </div>
                  <div style={{ fontSize:20, fontWeight:800, color:scoreColor(e.score) }}>{e.score}<span style={{ fontSize:12, color:'var(--text-muted)' }}>/10</span></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actions rapides */}
      <div className="section-title"><i className="ti ti-bolt" /> Actions rapides</div>
      <div className="grid-3">
        {[
          { path:'/cours',     icon:'📚', color:'var(--accent)',  title:'Continuer un cours',   sub:'Reprendre là où vous en étiez' },
          { path:'/entretien', icon:'🎤', color:'var(--purple)', title:'Simuler un entretien', sub:'Pratiquer avec l\'IA vocale' },
          { path:'/agent',     icon:'🤖', color:'var(--green)',  title:'Parler à EduBot',      sub:'Votre assistant personnel' },
        ].map(a => (
          <button key={a.path} className="card card-hover" style={{ textAlign:'left', border:'none', cursor:'pointer', width:'100%' }} onClick={() => navigate(a.path)}>
            <div style={{ fontSize:30, marginBottom:12 }}>{a.icon}</div>
            <div style={{ fontWeight:700, fontSize:14, color:'var(--text-primary)', marginBottom:4 }}>{a.title}</div>
            <div style={{ fontSize:12, color:'var(--text-muted)' }}>{a.sub}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
