import { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Bell, Shield, Globe, Moon, Eye, Trash2, Lock,
  ChevronRight, Check, LogOut, Sun, AlertTriangle, X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* ─── Pill Toggle ─────────────────────────────────── */
function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        position: 'relative', display: 'inline-flex', alignItems: 'center',
        width: 44, height: 24, borderRadius: 999,
        border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0,
        background: checked ? '#3B82F6' : '#6B7280',
        transition: 'background 0.3s ease',
        boxShadow: checked ? '0 0 0 1px rgba(59,130,246,0.3)' : 'none',
      }}
    >
      <span style={{
        position: 'absolute', top: 2, left: 2,
        width: 20, height: 20, borderRadius: '50%', background: '#fff',
        transform: checked ? 'translateX(20px)' : 'translateX(0)',
        transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </button>
  );
}

/* ─── Setting Row ─────────────────────────────────── */
function SettingRow({ icon: Icon, label, desc, children, iconBgStyle, iconColorHex, isDark }) {
  const bg = iconBgStyle || (isDark ? '#1e293b' : '#eff6ff');
  const ic = iconColorHex || '#3b82f6';
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: `1px solid ${isDark ? '#1f2937' : '#f1f5f9'}` }}
      className="last:border-0">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={16} color={ic} />
        </div>
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: isDark ? '#e2e8f0' : '#334155', margin: 0 }}>{label}</p>
          {desc && <p style={{ fontSize: 12, color: isDark ? '#6b7280' : '#94a3b8', margin: '2px 0 0' }}>{desc}</p>}
        </div>
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}

/* ─── Delete Confirmation Modal ───────────────────── */
function DeleteModal({ userName, onConfirm, onCancel, isDark, t }) {
  const [confirmText, setConfirmText] = useState('');
  const isMatch = confirmText.trim().toLowerCase() === 'delete';

  const overlay = {
    position: 'fixed', inset: 0, zIndex: 9999,
    background: 'rgba(0,0,0,0.65)',
    backdropFilter: 'blur(6px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '20px',
    animation: 'fadeIn 0.2s ease-out both',
  };

  const modal = {
    background: isDark ? '#111827' : '#ffffff',
    border: `1.5px solid ${isDark ? '#374151' : '#fecaca'}`,
    borderRadius: 24,
    padding: 28,
    width: '100%',
    maxWidth: 420,
    boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
    animation: 'fadeInUp 0.25s ease-out both',
    position: 'relative',
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        {/* Close button */}
        <button
          onClick={onCancel}
          style={{
            position: 'absolute', top: 16, right: 16,
            width: 32, height: 32, borderRadius: 8,
            background: isDark ? '#1f2937' : '#f1f5f9',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: isDark ? '#9ca3af' : '#6b7280',
          }}
        >
          <X size={15} />
        </button>

        {/* Warning icon */}
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: isDark ? '#450a0a' : '#fef2f2',
          border: `2px solid ${isDark ? '#7f1d1d' : '#fecaca'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 18,
        }}>
          <AlertTriangle size={26} color="#dc2626" />
        </div>

        <h2 style={{ fontSize: 18, fontWeight: 800, color: isDark ? '#f1f5f9' : '#111827', marginBottom: 8 }}>
          {t('deleteAccountTitle')}
        </h2>
        <p style={{ fontSize: 13, color: isDark ? '#9ca3af' : '#6b7280', lineHeight: 1.6, marginBottom: 20 }}>
          {t('deleteAccountConfirmDesc')}
        </p>

        {/* What gets deleted */}
        <div style={{
          background: isDark ? '#1f2937' : '#fef2f2',
          border: `1px solid ${isDark ? '#374151' : '#fecaca'}`,
          borderRadius: 12, padding: '12px 16px', marginBottom: 20,
        }}>
          {[
            'Your profile and personal information',
            'All saved hospitals',
            'Account credentials & login access',
          ].map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, fontSize: 12 }}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#dc2626', flexShrink: 0 }} />
              <span style={{ color: isDark ? '#fca5a5' : '#991b1b' }}>{item}</span>
            </div>
          ))}
        </div>

        {/* Type-to-confirm */}
        <label style={{ fontSize: 12, fontWeight: 600, color: isDark ? '#9ca3af' : '#6b7280', display: 'block', marginBottom: 8 }}>
          Type <strong style={{ color: '#dc2626', fontFamily: 'monospace' }}>delete</strong> to confirm:
        </label>
        <input
          type="text"
          value={confirmText}
          onChange={e => setConfirmText(e.target.value)}
          placeholder="Type delete here..."
          autoFocus
          style={{
            width: '100%', padding: '10px 14px', borderRadius: 10, marginBottom: 20,
            border: `1.5px solid ${isMatch ? '#dc2626' : (isDark ? '#374151' : '#e5e7eb')}`,
            background: isDark ? '#1f2937' : '#f9fafb',
            color: isDark ? '#e5e7eb' : '#111827',
            fontSize: 13, outline: 'none',
            boxSizing: 'border-box',
            boxShadow: isMatch ? '0 0 0 3px rgba(220,38,38,0.15)' : 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
          onKeyDown={e => { if (e.key === 'Enter' && isMatch) onConfirm(); }}
        />

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: '11px', borderRadius: 11, border: `1.5px solid ${isDark ? '#374151' : '#e5e7eb'}`,
              background: isDark ? '#1f2937' : '#f9fafb',
              color: isDark ? '#e5e7eb' : '#374151',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = isDark ? '#374151' : '#f1f5f9'; }}
            onMouseLeave={e => { e.currentTarget.style.background = isDark ? '#1f2937' : '#f9fafb'; }}
          >
            {t('cancelDelete')}
          </button>
          <button
            onClick={isMatch ? onConfirm : undefined}
            disabled={!isMatch}
            style={{
              flex: 1, padding: '11px', borderRadius: 11, border: 'none',
              background: isMatch ? '#dc2626' : (isDark ? '#374151' : '#f1f5f9'),
              color: isMatch ? '#ffffff' : (isDark ? '#6b7280' : '#94a3b8'),
              fontSize: 13, fontWeight: 700, cursor: isMatch ? 'pointer' : 'not-allowed',
              boxShadow: isMatch ? '0 4px 14px rgba(220,38,38,0.35)' : 'none',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => { if (isMatch) e.currentTarget.style.background = '#b91c1c'; }}
            onMouseLeave={e => { if (isMatch) e.currentTarget.style.background = '#dc2626'; }}
          >
            🗑 {t('confirmDeleteBtn')}
          </button>
        </div>
      </div>
    </div>
  );
}

import { useLanguage } from '../context/LanguageContext';

/* ─── Main Page ───────────────────────────────────── */
export default function SettingsPage() {
  const { user, logout, deleteAccount } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: false,
    locationAccess: true,
    twoFactor: false,
    dataSharing: false,
  });
  const [saved, setSaved]               = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const toggle = (key) => setSettings(s => ({ ...s, [key]: !s[key] }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDeleteAccount = () => {
    deleteAccount();          // wipe localStorage & clear user state
    navigate('/signup');      // redirect to signup page
  };

  return (
    <DashboardLayout>
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteModal
          userName={user?.name}
          isDark={isDark}
          t={t}
          onConfirm={handleDeleteAccount}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold" style={{ color: isDark ? '#e5e7eb' : '#1e293b' }}>{t('settings')}</h1>
          <button onClick={handleSave} className="btn-primary py-2 px-5 text-sm">
            {saved ? <span className="flex items-center gap-1.5"><Check size={14} /> {t('saved')}</span> : t('saveChanges')}
          </button>
        </div>

        {/* Notifications */}
        <div style={{ background: isDark ? '#111827' : '#fff', borderRadius: 24, border: `1.5px solid ${isDark ? '#1f2937' : '#e2e8f0'}`, boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.04)', padding: 20, marginBottom: 16 }}>
          <h2 style={{ fontWeight: 700, color: isDark ? '#93c5fd' : '#1e40af', fontSize: 13, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Bell size={15} color={isDark ? '#93c5fd' : '#2563eb'} /> {t('notifications')}
          </h2>
          <p style={{ fontSize: 12, color: isDark ? '#6b7280' : '#94a3b8', marginBottom: 16 }}>Control how you receive updates</p>
          <SettingRow icon={Bell} label={t('pushNotifications')} desc={t('pushNotificationsDesc')} isDark={isDark} iconBgStyle={isDark ? '#1e3a5f' : '#eff6ff'} iconColorHex={isDark ? '#93c5fd' : '#2563eb'}>
            <Toggle checked={settings.notifications} onChange={() => toggle('notifications')} />
          </SettingRow>
          <SettingRow icon={Globe} label={t('emailAlerts')} desc={t('emailAlertsDesc')} isDark={isDark} iconBgStyle={isDark ? '#064e3b' : '#f0fdf4'} iconColorHex={isDark ? '#6ee7b7' : '#16a34a'}>
            <Toggle checked={settings.emailAlerts} onChange={() => toggle('emailAlerts')} />
          </SettingRow>
        </div>

        {/* Privacy */}
        <div style={{ background: isDark ? '#111827' : '#fff', borderRadius: 24, border: `1.5px solid ${isDark ? '#1f2937' : '#e2e8f0'}`, boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.04)', padding: 20, marginBottom: 16 }}>
          <h2 style={{ fontWeight: 700, color: isDark ? '#c4b5fd' : '#7c3aed', fontSize: 13, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Shield size={15} color={isDark ? '#c4b5fd' : '#7c3aed'} /> {t('privacy')}
          </h2>
          <p style={{ fontSize: 12, color: isDark ? '#6b7280' : '#94a3b8', marginBottom: 16 }}>Manage your data and security</p>
          <SettingRow icon={Eye} label={t('locationAccess')} desc={t('locationAccessDesc')} isDark={isDark} iconBgStyle={isDark ? '#1e3a5f' : '#eff6ff'} iconColorHex={isDark ? '#93c5fd' : '#2563eb'}>
            <Toggle checked={settings.locationAccess} onChange={() => toggle('locationAccess')} />
          </SettingRow>
          <SettingRow icon={Lock} label={t('twoFactor')} desc={t('twoFactorDesc')} isDark={isDark} iconBgStyle={isDark ? '#2e1065' : '#f5f3ff'} iconColorHex={isDark ? '#c4b5fd' : '#7c3aed'}>
            <Toggle checked={settings.twoFactor} onChange={() => toggle('twoFactor')} />
          </SettingRow>
          <SettingRow icon={Globe} label={t('anonymousDataSharing')} desc={t('anonymousDataSharingDesc')} isDark={isDark} iconBgStyle={isDark ? '#1e293b' : '#f8fafc'} iconColorHex={isDark ? '#9ca3af' : '#64748b'}>
            <Toggle checked={settings.dataSharing} onChange={() => toggle('dataSharing')} />
          </SettingRow>
        </div>

        {/* Appearance */}
        <div style={{ background: isDark ? '#111827' : '#fff', borderRadius: 24, border: `1.5px solid ${isDark ? '#1f2937' : '#e2e8f0'}`, boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.04)', padding: 20, marginBottom: 16 }}>
          <h2 style={{ fontWeight: 700, color: isDark ? '#a5b4fc' : '#4338ca', fontSize: 13, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Moon size={15} color={isDark ? '#a5b4fc' : '#4338ca'} /> {t('appearance')}
          </h2>
          <p style={{ fontSize: 12, color: isDark ? '#6b7280' : '#94a3b8', marginBottom: 16 }}>Customize your experience</p>
          <SettingRow
            icon={isDark ? Moon : Sun}
            label={t('darkMode')}
            desc={isDark ? 'Currently in dark mode — click to switch' : 'Currently in light mode — click to switch'}
            isDark={isDark}
            iconBgStyle={isDark ? '#1e1b4b' : '#eef2ff'}
            iconColorHex={isDark ? '#a5b4fc' : '#4338ca'}
          >
            <Toggle checked={isDark} onChange={toggleTheme} />
          </SettingRow>

          {/* Language */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 12, background: isDark ? '#451a03' : '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Globe size={16} color={isDark ? '#fbbf24' : '#d97706'} />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: isDark ? '#e2e8f0' : '#334155', margin: 0 }}>{t('language')}</p>
                <p style={{ fontSize: 12, color: isDark ? '#6b7280' : '#94a3b8', margin: '2px 0 0' }}>{t('choosePreferredLanguage')}</p>
              </div>
            </div>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              style={{
                fontSize: 13, fontWeight: 600, border: `1.5px solid ${isDark ? '#374151' : '#e2e8f0'}`,
                borderRadius: 12, padding: '8px 12px', color: isDark ? '#e2e8f0' : '#374151',
                background: isDark ? '#1f2937' : '#f8fafc', outline: 'none', cursor: 'pointer'
              }}
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="gu">ગુજરાતી (Gujarati)</option>
            </select>
          </div>
        </div>

        {/* Danger Zone */}
        <div style={{ background: isDark ? '#111827' : '#fff', borderRadius: 24, border: `1.5px solid ${isDark ? '#7f1d1d' : '#fecaca'}`, boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.04)', padding: 20 }}>
          <h2 style={{ fontWeight: 700, color: '#dc2626', fontSize: 13, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Trash2 size={15} color="#dc2626" /> {t('dangerZone')}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

            {/* Logout */}
            <button
              onClick={() => { logout(); navigate('/'); }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: 16, borderRadius: 16, border: `1.5px solid ${isDark ? '#374151' : '#e2e8f0'}`,
                background: isDark ? '#1f2937' : '#f8fafc', cursor: 'pointer', textAlign: 'left',
                transition: 'background 0.2s', boxSizing: 'border-box'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = isDark ? '#374151' : '#f1f5f9'; }}
              onMouseLeave={e => { e.currentTarget.style.background = isDark ? '#1f2937' : '#f8fafc'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 12, background: isDark ? '#431407' : '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LogOut size={15} color={isDark ? '#fb923c' : '#ea580c'} />
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: isDark ? '#e2e8f0' : '#334155', margin: 0 }}>{t('logout')}</p>
                  <p style={{ fontSize: 12, color: isDark ? '#6b7280' : '#94a3b8', margin: '2px 0 0' }}>{t('logoutDesc')}</p>
                </div>
              </div>
              <ChevronRight size={15} color={isDark ? '#4b5563' : '#cbd5e1'} />
            </button>

            {/* Delete Account */}
            <button
              onClick={() => setShowDeleteModal(true)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: 16, borderRadius: 16, border: '1.5px solid #fca5a5',
                background: isDark ? '#450a0a' : '#fef2f2', cursor: 'pointer', textAlign: 'left',
                transition: 'background 0.2s', boxSizing: 'border-box'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = isDark ? '#7f1d1d' : '#fee2e2'; }}
              onMouseLeave={e => { e.currentTarget.style.background = isDark ? '#450a0a' : '#fef2f2'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 12, background: isDark ? '#7f1d1d' : '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Trash2 size={15} color="#dc2626" />
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#dc2626', margin: 0 }}>{t('deleteAccount')}</p>
                  <p style={{ fontSize: 12, color: isDark ? '#6b7280' : '#94a3b8', margin: '2px 0 0' }}>{t('deleteAccountDesc')}</p>
                </div>
              </div>
              <ChevronRight size={15} color="#fca5a5" />
            </button>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
