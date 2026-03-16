import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Hospital, Map, BookmarkCheck,
  User, Settings, LogOut, Heart, X,
} from 'lucide-react';

import { useLanguage } from '../../context/LanguageContext';

const NAV = [
  { label: 'dashboard',       icon: LayoutDashboard, to: '/dashboard' },
  { label: 'nearbyHospitals', icon: Hospital,        to: '/hospitals' },
  { label: 'mapView',        icon: Map,             to: '/maps'      },
  { label: 'savedHospitals', icon: BookmarkCheck,   to: '/saved'     },
  { label: 'profile',         icon: User,            to: '/profile'   },
  { label: 'settings',        icon: Settings,        to: '/settings'  },
];

export default function Sidebar({ onClose }) {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate   = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => { logout(); navigate('/'); };

  const initials = user?.name
    ?.split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  return (
    <aside className="sidebar-root">

      {/* ── Logo ───────────────────────────────── */}
      <div className="sidebar-logo-area">
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <div
            style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'linear-gradient(135deg,#2563EB,#1d4ed8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(37,99,235,.4)',
            }}
          >
            <Heart size={17} color="#fff" fill="#fff" />
          </div>
          <span
            style={{
              fontWeight: 800, fontSize: 18,
              background: 'linear-gradient(135deg,#2563EB,#10B981)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}
          >
            MediGuide
          </span>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              width: 28, height: 28, borderRadius: 7, border: 'none',
              background: '#f1f5f9', cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: '#64748b',
            }}
            className="md:hidden"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* ── User card ──────────────────────────── */}
      {user && (
        <div className="sidebar-user-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} style={{ width: 44, height: 44, borderRadius: '12px', objectFit: 'cover', flexShrink: 0 }} />
            ) : (
              <div className="sidebar-user-avatar">{initials}</div>
            )}
            <div style={{ minWidth: 0 }}>
              <p style={{ fontWeight: 700, fontSize: 13, color: '#0f172a', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {user.name}
              </p>
              <p style={{ fontSize: 11, color: '#64748b', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {user.email}
              </p>
              <span
                style={{
                  marginTop: 5, display: 'inline-flex', alignItems: 'center', gap: 4,
                  background: '#dcfce7', color: '#15803d', fontSize: 10, fontWeight: 700,
                  padding: '2px 8px', borderRadius: 999,
                }}
              >
                <span className="animate-pulse-dot" style={{ width: 5, height: 5, borderRadius: '50%', background: '#16a34a', display:'inline-block' }} />
                {t('active')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Nav label ──────────────────────────── */}
      <div className="sidebar-section-label">Main Menu</div>

      {/* ── Navigation ─────────────────────────── */}
      <nav className="sidebar-nav">
        {NAV.map(({ label, icon: Icon, to }) => {
          const active = pathname === to || (to === '/maps' && (pathname === '/map' || pathname === '/profile/maps'));
          return (
            <Link
              key={to}
              to={to}
              onClick={onClose}
              className={`sidebar-link ${active ? 'active' : ''}`}
            >
              <Icon size={17} className="sidebar-link-icon" strokeWidth={active ? 2.5 : 2} />
              <span>{t(label)}</span>
              {/* saved count badge */}
              {to === '/saved' && (user?.savedHospitals?.length ?? 0) > 0 && (
                <span className="sidebar-link-badge">
                  {user.savedHospitals.length}
                </span>
              )}
            </Link>
          );
        })}
      </nav>


      {/* ── Logout ─────────────────────────────── */}
      <div className="sidebar-footer">
        <button
          onClick={handleLogout}
          className="sidebar-link"
          style={{ color: '#dc2626' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#b91c1c'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#dc2626'; }}
        >
          <LogOut size={17} strokeWidth={2} />
          <span>{t('logout')}</span>
        </button>
      </div>
    </aside>
  );
}
