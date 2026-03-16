import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import ThemeToggle from '../components/common/ThemeToggle';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, Bell, ChevronDown } from 'lucide-react';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/hospitals': 'Nearby Hospitals',
  '/map':       'Map View',
  '/maps':      'Map View',
  '/profile/maps': 'Map View',
  '/saved':     'Saved Hospitals',
  '/profile':   'Profile',
  '/settings':  'Settings',
};

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user }     = useAuth();
  const { isDark }   = useTheme();
  const { pathname } = useLocation();
  const pageTitle    = PAGE_TITLES[pathname] ?? 'MediGuide';

  const initials = user?.name
    ?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U';

  /* ── token helpers ── */
  const bg       = isDark ? '#0B0F19'  : '#F5F7FB';
  const topbar   = isDark ? '#0F172A'  : '#FFFFFF';
  const border   = isDark ? '#1F2937'  : '#E5E7EB';
  const text     = isDark ? '#E5E7EB'  : '#111827';
  const textSec  = isDark ? '#9CA3AF'  : '#6B7280';
  const iconBtn  = isDark ? '#1F2937'  : '#FFFFFF';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: bg, transition: 'background 0.3s ease' }}>

      {/* ── Desktop Sidebar ─────────────────────── */}
      <div className="hidden md:flex" style={{ flexShrink: 0 }}>
        <Sidebar />
      </div>

      {/* ── Mobile Sidebar overlay ──────────────── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            onClick={() => setSidebarOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(11,15,25,.6)', backdropFilter: 'blur(4px)' }}
          />
          <div style={{ position: 'relative', zIndex: 10 }}>
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* ── Main area ───────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', overflow: 'hidden' }}>

        {/* Top bar */}
        <header
          className="dash-topbar"
          style={{
            background: topbar,
            borderBottom: `1px solid ${border}`,
            transition: 'background 0.3s ease, border-color 0.3s ease',
          }}
        >
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden"
            style={{
              width: 36, height: 36, borderRadius: 9,
              border: `1.5px solid ${border}`,
              background: iconBtn,
              cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              color: textSec, flexShrink: 0,
              transition: 'background 0.3s ease, border-color 0.3s ease',
            }}
          >
            <Menu size={17} />
          </button>

          {/* Page title */}
          <div className="hidden md:block" style={{ flexShrink: 0 }}>
            <h1 style={{ fontSize: 17, fontWeight: 700, color: text, transition: 'color 0.3s ease' }}>
              {pageTitle}
            </h1>
          </div>

          {/* Right side actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>

            {/* ── Theme Toggle ── */}
            <ThemeToggle />

            {/* Notification bell */}
            <button
              style={{
                width: 38, height: 38, borderRadius: 10,
                border: `1.5px solid ${border}`,
                background: iconBtn,
                cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                color: textSec, position: 'relative',
                transition: 'background 0.3s ease, border-color 0.3s ease',
              }}
            >
              <Bell size={16} />
              <span
                style={{
                  position: 'absolute', top: 7, right: 7, width: 7, height: 7,
                  background: '#ef4444', borderRadius: '50%',
                  border: `2px solid ${topbar}`,
                }}
              />
            </button>

            {/* Avatar / profile chip */}
            <Link
              to="/profile"
              style={{
                display: 'flex', alignItems: 'center', gap: 9,
                padding: '5px 10px 5px 5px',
                borderRadius: 11, border: `1.5px solid ${border}`,
                background: iconBtn, textDecoration: 'none',
                cursor: 'pointer',
                transition: 'border-color 0.2s ease, background 0.3s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#3B82F6'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = border; }}
            >
              <div
                style={{
                  width: 30, height: 30, borderRadius: 8,
                  background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 700, fontSize: 12, flexShrink: 0,
                }}
              >
                {initials}
              </div>
              <span
                style={{ fontSize: 13, fontWeight: 600, color: text, transition: 'color 0.3s ease' }}
                className="hidden sm:block"
              >
                {user?.name?.split(' ')[0]}
              </span>
              <ChevronDown size={13} color={textSec} className="hidden sm:block" />
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '24px', overflowX: 'hidden', background: bg, color: text, transition: 'background 0.3s ease, color 0.3s ease' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
