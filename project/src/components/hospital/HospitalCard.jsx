import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHospital } from '../../context/HospitalContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import {
  Star, MapPin, Bookmark, BookmarkCheck,
  Clock, Users, Bed, ChevronRight, Shield, Stethoscope, Navigation, CalendarCheck
} from 'lucide-react';

export default function HospitalCard({ hospital, compact = false }) {
  const { user, saveHospital, isHospitalSaved } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80';
  const saved = isHospitalSaved(hospital.id);
  const [justSaved, setJustSaved] = useState(false);

  const T = {
    cardBg:    isDark ? '#111827' : '#FFFFFF',
    cardBorder:isDark ? '#1F2937' : '#E5E7EB',
    text:      isDark ? '#E5E7EB' : '#111827',
    textSec:   isDark ? '#9CA3AF' : '#6B7280',
    textMuted: isDark ? '#6B7280' : '#94A3B8',
    iconColor: isDark ? '#60A5FA' : '#2563EB',
    boxBg:     isDark ? '#1F2937' : '#F8FAFC',
    badgeBg:   isDark ? '#1F2937' : '#F1F5F9',
    badgeText: isDark ? '#9CA3AF' : '#64748B',
    hoverBg:   isDark ? '#1E293B' : '#F8FAFC',
    btnPrimaryBg:  isDark ? '#3B82F6' : '#2563EB',
    btnSecondaryBg:isDark ? '#1F2937' : '#F1F5F9',
    btnSecondaryText:isDark ? '#E5E7EB' : '#475569',
    shadow:    isDark ? '0 4px 20px rgba(0,0,0,0.5)' : '0 4px 12px rgba(0,0,0,0.05)',
  };

  const handleSave = (e) => {
    e.stopPropagation();
    if (!user) { navigate('/login'); return; }
    const added = saveHospital(hospital);
    if (added) {
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 1500);
    }
  };

  const starArr = Array.from({ length: 5 }, (_, i) => i < Math.floor(hospital.rating));

  if (compact) return (
    <div 
      style={{
        background: T.cardBg, borderColor: T.cardBorder,
        borderWidth: 1, borderStyle: 'solid', borderRadius: 16,
        padding: 16, display: 'flex', gap: 12, alignItems: 'center',
        cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: T.shadow
      }}
      onClick={() => {
        const url = hospital.wikiUrl || `https://www.google.com/search?q=${encodeURIComponent(hospital.name + ' ' + hospital.city)}`;
        window.open(url, '_blank');
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'none'}
    >
      <img 
        src={imgError ? FALLBACK_IMAGE : (hospital.image || FALLBACK_IMAGE)} 
        alt={hospital.name} 
        onError={() => setImgError(true)} 
        style={{ width: 56, height: 56, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} 
      />
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 2 }}>
          {hospital.verified && <Shield size={12} color="#3B82F6" />}
          <h4 style={{ fontWeight: 700, color: T.text, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0, transition: 'color 0.3s ease' }}>{hospital.name}</h4>
        </div>
        <p style={{ fontSize: 12, color: T.textSec, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>{hospital.specialization}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <div style={{ display: 'flex' }}>
            {starArr.map((f, i) => <Star key={i} size={10} fill={f ? '#f59e0b' : 'none'} color={f ? '#f59e0b' : T.textMuted} />)}
          </div>
          <span style={{ fontSize: 12, color: T.textSec, fontWeight: 600 }}>{hospital.rating}</span>
          {typeof hospital.distance === 'number' && hospital.distance < 100 && (
            <>
              <span style={{ fontSize: 12, color: T.textMuted }}>•</span>
              <span style={{ fontSize: 12, color: T.textSec }}>
                {hospital.distance.toFixed(1)} km
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div 
      style={{
        background: T.cardBg, borderColor: T.cardBorder, borderWidth: 1.5, borderStyle: 'solid',
        borderRadius: 20, overflow: 'hidden', transition: 'all 0.3s ease',
        boxShadow: T.shadow, display: 'flex', flexDirection: 'column'
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'none'}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
        <img
          src={imgError ? FALLBACK_IMAGE : (hospital.image || FALLBACK_IMAGE)}
          alt={hospital.name}
          onError={() => setImgError(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }} />
        
        {/* Top Badges */}
        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 8 }}>
          <span style={{ background: 'rgba(255,255,255,0.95)', color: '#2563EB', fontSize: 11, fontWeight: 700, padding: '4px 8px', borderRadius: 8, backdropFilter: 'blur(4px)' }}>
            {hospital.specialization}
          </span>
          {hospital.verified && (
            <span style={{ background: '#2563EB', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 8px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Shield size={12} fill="#fff" /> Verified
            </span>
          )}
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          style={{
            position: 'absolute', top: 12, right: 12, width: 36, height: 36, borderRadius: 10,
            background: saved ? '#2563EB' : 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center',
            color: saved ? '#fff' : '#64748b', transition: 'all 0.2s',
            backdropFilter: 'blur(4px)'
          }}
          onMouseEnter={e => { if (!saved) { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.color = '#2563EB'; } }}
          onMouseLeave={e => { if (!saved) { e.currentTarget.style.background = 'rgba(255,255,255,0.9)'; e.currentTarget.style.color = '#64748b'; } }}
        >
          {saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        </button>

        {justSaved && (
          <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', background: '#10B981', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 8, animation: 'fadeIn 0.2s ease-out' }}>
            Saved!
          </div>
        )}

        {/* Distance Badge */}
        {typeof hospital.distance === 'number' && hospital.distance < 100 && (
          <div style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(255,255,255,0.95)', borderRadius: 8, padding: '4px 8px', display: 'flex', alignItems: 'center', gap: 4, backdropFilter: 'blur(4px)' }}>
            <MapPin size={12} color="#2563EB" />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#1E293B' }}>
              {hospital.distance.toFixed(1)} km
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ flex: 1, paddingRight: 8 }}>
            <h3 style={{ fontWeight: 800, color: T.text, fontSize: 16, lineHeight: 1.3, marginBottom: 4, transition: 'color 0.3s ease' }}>{hospital.name}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: T.textSec }}>
              <MapPin size={12} />
              <p style={{ fontSize: 12, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{hospital.city}</p>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', marginBottom: 2 }}>
              <Star size={14} fill="#f59e0b" color="#f59e0b" />
              <span style={{ fontWeight: 800, color: T.text, fontSize: 14 }}>{hospital.rating}</span>
            </div>
            <p style={{ fontSize: 11, color: T.textMuted, margin: 0 }}>({hospital.reviewCount?.toLocaleString()})</p>
          </div>
        </div>

        {/* Stats Boxes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
          {/* Box 1 */}
          <div style={{ background: T.boxBg, borderRadius: 12, padding: '8px 4px', textAlign: 'center', transition: 'background 0.3s ease' }}>
            <Bed size={15} color="#3B82F6" style={{ margin: '0 auto 4px' }} />
            <p style={{ fontSize: 13, fontWeight: 700, color: T.text, margin: 0, lineHeight: 1 }}>{hospital.beds}</p>
            <p style={{ fontSize: 10, color: T.textSec, margin: '2px 0 0' }}>Beds</p>
          </div>
          {/* Box 2 */}
          <div style={{ background: T.boxBg, borderRadius: 12, padding: '8px 4px', textAlign: 'center', transition: 'background 0.3s ease' }}>
            <Stethoscope size={15} color="#10B981" style={{ margin: '0 auto 4px' }} />
            <p style={{ fontSize: 13, fontWeight: 700, color: T.text, margin: 0, lineHeight: 1 }}>{hospital.doctors}</p>
            <p style={{ fontSize: 10, color: T.textSec, margin: '2px 0 0' }}>Doctors</p>
          </div>
          {/* Box 3 */}
          <div style={{ background: T.boxBg, borderRadius: 12, padding: '8px 4px', textAlign: 'center', transition: 'background 0.3s ease' }}>
            <Clock size={15} color="#F59E0B" style={{ margin: '0 auto 4px' }} />
            <p style={{ fontSize: 11, fontWeight: 700, color: T.text, margin: 0, lineHeight: 1.2 }}>{hospital.availability?.includes('24/7') ? 'Open' : 'Closed'}</p>
            <p style={{ fontSize: 10, color: T.textSec, margin: '2px 0 0' }}>Status</p>
          </div>
        </div>

        <div style={{ flex: 1 }} /> {/* Spacer */}

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 'auto' }}>
          <button
            onClick={() => {
              const url = hospital.wikiUrl || `https://www.google.com/search?q=${encodeURIComponent(hospital.name + ' ' + hospital.city)}`;
              window.open(url, '_blank');
            }}
            style={{
              background: T.btnSecondaryBg, color: T.btnSecondaryText, border: 'none', borderRadius: 12,
              padding: '10px 0', fontSize: 12, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              transition: 'all 0.2s', width: '100%'
            }}
            onMouseEnter={e => e.currentTarget.style.background = isDark ? '#374151' : '#E2E8F0'}
            onMouseLeave={e => e.currentTarget.style.background = T.btnSecondaryBg}
          >
            <Navigation size={14} /> Directions
          </button>
          <button
            onClick={() => {
              const url = hospital.wikiUrl || `https://www.google.com/search?q=${encodeURIComponent(hospital.name + ' ' + hospital.city)}`;
              window.open(url, '_blank');
            }}
            style={{
              background: T.btnPrimaryBg, color: '#fff', border: 'none', borderRadius: 12,
              padding: '10px 0', fontSize: 12, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              transition: 'background 0.2s', width: '100%'
            }}
            onMouseEnter={e => e.currentTarget.style.background = isDark ? '#2563eb' : '#1d4ed8'}
            onMouseLeave={e => e.currentTarget.style.background = T.btnPrimaryBg}
          >
            <CalendarCheck size={14} /> Book
          </button>
        </div>
      </div>
    </div>
  );
}
