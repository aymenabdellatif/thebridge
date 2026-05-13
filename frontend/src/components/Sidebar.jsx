import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const links = [
  { path: '/dashboard', icon: 'ti-layout-dashboard', label: 'Tableau de bord' },
  { path: '/cours',     icon: 'ti-book',              label: 'Mes cours'       },
  { path: '/entretien', icon: 'ti-microphone',         label: 'Entretien IA'   },
  { path: '/agent',     icon: 'ti-robot',              label: 'EduBot'         },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const initiales = user?.nom?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-logo">
          <div className="brand-icon"><i className="ti ti-target" /></div>
          <span className="brand-name">EduXpert</span>
        </div>
        <div className="brand-sub">Plateforme d'apprentissage IA</div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">Navigation</div>
        {links.map(l => (
          <button key={l.path}
            className={`nav-item ${location.pathname === l.path ? 'active' : ''}`}
            onClick={() => navigate(l.path)}>
            <i className={`ti ${l.icon} nav-icon`} />
            {l.label}
          </button>
        ))}

        <div className="nav-section" style={{ marginTop: 'auto' }}>Apparence</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px' }}>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className={`ti ${dark ? 'ti-moon' : 'ti-sun'}`} style={{ color: 'var(--accent)' }} />
            {dark ? 'Mode sombre' : 'Mode clair'}
          </span>
          <button className="theme-toggle" onClick={toggle} title="Changer le thème" />
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="avatar">{initiales}</div>
          <div className="user-info">
            <div className="name">{user?.nom}</div>
            <div className="role">Étudiant</div>
          </div>
          <button className="btn-logout" title="Déconnexion" onClick={() => { logout(); navigate('/login'); }}>
            <i className="ti ti-logout" />
          </button>
        </div>
      </div>
    </aside>
  );
}
