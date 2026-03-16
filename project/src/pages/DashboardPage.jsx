import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useHospital } from '../context/HospitalContext';
import { useTheme } from '../context/ThemeContext';
import DashboardLayout from './DashboardLayout';
import HospitalCard from '../components/hospital/HospitalCard';
import { SkeletonCard } from '../components/common/Skeleton';
import { useGeolocation } from '../hooks/useHooks';
import {
  MapPin, Search, Hospital, BookmarkCheck, Star, Activity,
  TrendingUp, ChevronRight, Zap, ArrowRight, Users, Map,
  SlidersHorizontal, Thermometer, Stethoscope, BriefcaseMedical,
  TestTube, ShieldAlert, PhoneCall, Truck
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const QUICK = ['Fever', 'Cold', 'Headache', 'Chest Pain', 'Diabetes', 'Dental Pain', 'Skin Allergy', 'Joint Pain', 'Breathlessness'];

export default function DashboardPage() {
  const { user }    = useAuth();
  const { isDark }  = useTheme();
  const { hospitals, setFilters } = useHospital();
  const { city, location, detectLocation } = useGeolocation();
  const { t, lang } = useLanguage();
  const [search,  setSearch]  = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /* ── Design tokens (all inline styles follow these) ── */
  const T = {
    bg:        isDark ? '#0B0F19'  : '#F5F7FB',
    card:      isDark ? '#111827'  : '#FFFFFF',
    cardBorder:isDark ? '#1F2937'  : '#E5E7EB',
    text:      isDark ? '#E5E7EB'  : '#111827',
    textSec:   isDark ? '#9CA3AF'  : '#6B7280',
    textMuted: isDark ? '#6B7280'  : '#94a3b8',
    btn:       isDark ? '#3B82F6'  : '#2563EB',
    inputBg:   isDark ? '#1F2937'  : '#FFFFFF',
    hoverBg:   isDark ? '#1e293b'  : '#F8FAFC',
    chipBg:    isDark ? '#1e293b'  : '#ffffff',
    chipBorder:isDark ? '#374151'  : '#E5E7EB',
    chipColor: isDark ? '#9CA3AF'  : '#475569',
    shadow:    isDark ? '0 4px 12px rgba(0,0,0,0.4)' : '0 4px 12px rgba(0,0,0,0.04)',
    iconBg:    isDark ? '#1e293b'  : '#f1f5f9',
  };

  useEffect(() => {
    detectLocation();
    const t = setTimeout(() => setLoading(false), 1100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (city && city !== 'Detecting...' && city !== 'Your Location') {
      setFilters(prev => ({ 
        ...prev, 
        city: city,
        userCoords: location
      }));
    }
  }, [city, location, setFilters]);

  const topRated = hospitals.filter(h => h.rating >= 4.5).slice(0, 2);

  const suggestions = search.trim() ? hospitals.filter(h => {
    const matchesQuery = h.name.toLowerCase().includes(search.toLowerCase()) ||
                         h.specialization.toLowerCase().includes(search.toLowerCase()) ||
                         (search.toLowerCase() === 'fever' && h.specialization === 'General Medicine');
    const cityClusters = {
      'kalol': ['Kalol', 'Ahmedabad', 'Gandhinagar'],
      'gandhinagar': ['Kalol', 'Ahmedabad', 'Gandhinagar'],
      'ahmedabad': ['Kalol', 'Ahmedabad', 'Gandhinagar'],
      'delhi': ['Delhi', 'Gurugram', 'Noida'],
      'gurugram': ['Delhi', 'Gurugram', 'Noida'],
      'noida': ['Delhi', 'Gurugram', 'Noida'],
    };
    if (!matchesQuery) return false;
    if (!city || city === 'Detecting...' || city === 'Your Location') return true;
    const targetCity = city.toLowerCase();
    const cluster = cityClusters[targetCity];
    if (cluster) return cluster.includes(h.city);
    return h.city.toLowerCase() === targetCity;
  }).slice(0, 5) : [];

  const getCityQueryParam = () => {
    if (city && city !== 'Detecting...' && city !== 'Your Location') {
      return `&city=${encodeURIComponent(city)}`;
    }
    return '';
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? (lang === 'hi' ? 'शुभ प्रभात' : lang === 'gu' ? 'શુભ સવાર' : 'Good morning') : 
                   hour < 17 ? (lang === 'hi' ? 'नमस्ते' : lang === 'gu' ? 'નમસ્તે' : 'Good afternoon') : 
                   (lang === 'hi' ? 'शुभ संध्या' : lang === 'gu' ? 'શુભ સાંજ' : 'Good evening');

  const STATS = [
    { label: t('hospitalsNearby'),  value: hospitals.length,              icon: Hospital,      color: '#3b82f6', bg: isDark ? '#1e3a5f' : '#eff6ff', border: isDark ? '#1e40af' : '#bfdbfe', link: '/hospitals' },
    { label: t('savedHospitals'),   value: user?.savedHospitals?.length || 0, icon: BookmarkCheck, color: '#ec4899', bg: isDark ? '#500724' : '#fdf2f8', border: isDark ? '#831843' : '#fbcfe8', link: '/saved' },
    { label: t('topRated'),  value: topRated.length,               icon: Star,          color: '#f59e0b', bg: isDark ? '#451a03' : '#fffbeb', border: isDark ? '#78350f' : '#fde68a', link: '/hospitals?rating=4.5' },
    { label: t('specializations'),   value: 17,                            icon: Activity,      color: '#8b5cf6', bg: isDark ? '#2e1065' : '#f5f3ff', border: isDark ? '#4c1d95' : '#ddd6fe', link: '/hospitals' },
  ];

  const QUICK_ACTIONS = [
    { label: t('bookAppointment'), icon: Thermometer,      to: '/hospitals', color: '#3b82f6', bg: isDark ? '#1e3a8a' : '#dbeafe' },
    { label: t('findDoctors'),     icon: Stethoscope,      to: '/hospitals', color: '#10b981', bg: isDark ? '#064e3b' : '#d1fae5' },
    { label: t('nearbyPharmacy'),  icon: BriefcaseMedical, to: '/map',       color: '#f59e0b', bg: isDark ? '#78350f' : '#fef3c7' },
    { label: t('diagnosticLabs'),  icon: TestTube,         to: '/hospitals', color: '#8b5cf6', bg: isDark ? '#4c1d95' : '#ede9fe' },
  ];

  return (
    <DashboardLayout>

      {/* ── Welcome & Location header ──────────────────────── */}
      <div style={{ marginBottom: 28, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: T.text, marginBottom: 8, transition: 'color 0.3s ease' }}>
            {greeting},{' '}
            <span style={{ background: 'linear-gradient(135deg,#3B82F6,#10B981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {user?.name?.split(' ')[0]} 👋
            </span>
          </h2>

          {/* New Location Section format */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: T.iconBg, padding: '6px 14px', borderRadius: 12, border: `1px solid ${T.cardBorder}` }}>
              <MapPin size={16} color={T.btn} />
              <span style={{ fontSize: 13, fontWeight: 700, color: T.text, transition: 'color 0.3s ease' }}>
                {city && city !== 'Detecting...' ? `${city}, Gujarat` : t('locationUnknown')}
              </span>
            </div>
            <button
              onClick={detectLocation}
              style={{
                fontSize: 12, fontWeight: 700, color: T.btn, background: 'none', border: 'none',
                cursor: 'pointer', textDecoration: 'underline', padding: 0, textUnderlineOffset: '3px'
              }}
            >
              {t('changeLocation')}
            </button>
          </div>
        </div>
        <Link to="/map" className="btn-primary" style={{ fontSize: 13, padding: '12px 20px', borderRadius: 14 }}>
          {t('findHospitalsMap')} <ArrowRight size={15} />
        </Link>
      </div>


      {/* ── Search bar (Voice, Filter, Large) ──────────────────────────── */}
      <div className="relative z-20" style={{ marginBottom: 16 }}>
        <div
          className="search-bar"
          style={{
            maxWidth: 'unset', height: 56,
            background: T.inputBg,
            border: `1.5px solid ${T.cardBorder}`,
            boxShadow: T.shadow,
            transition: 'background 0.3s ease, border-color 0.3s ease',
            display: 'flex', alignItems: 'center', padding: '0 16px', borderRadius: 16
          }}
        >
          <Search size={20} color={T.btn} style={{ flexShrink: 0, marginRight: 12 }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('searchPlaceholder')}
            style={{ fontSize: 15, color: T.text, background: 'transparent', flex: 1, border: 'none', outline: 'none' }}
          />

          <div style={{ height: 24, width: 1, background: T.cardBorder, margin: '0 12px' }} />

          {/* Filter Button */}
          <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 8 }}>
            <SlidersHorizontal size={20} color={T.textMuted} />
          </button>

          <Link
            to={`/hospitals?q=${encodeURIComponent(search)}${getCityQueryParam()}`}
            style={{
              background: T.btn, color: '#fff', fontSize: 13, fontWeight: 700,
              padding: '10px 20px', borderRadius: 10, textDecoration: 'none',
              flexShrink: 0, whiteSpace: 'nowrap', transition: 'background 0.3s ease',
            }}
          >
            Search
          </Link>
        </div>

        {/* Suggestions Dropdown */}
        {search.length > 1 && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 10,
            background: T.card, borderRadius: 16, border: `1.5px solid ${T.cardBorder}`,
            boxShadow: T.shadow, overflow: 'hidden', zIndex: 30,
            transition: 'background 0.3s ease',
          }}>
            <div style={{ padding: 8 }}>
              {suggestions.map(h => (
                <button
                  key={h.id}
                  onClick={() => window.open(h.wikiUrl || `https://www.google.com/search?q=${encodeURIComponent(h.name)}`, '_blank')}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px', borderRadius: 12, textAlign: 'left',
                    border: 'none', background: 'transparent', cursor: 'pointer',
                    transition: 'background 0.15s', color: T.text,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = T.hoverBg; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <img src={h.image} style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover' }} alt="" />
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontWeight: 700, color: T.text, fontSize: 14, margin: 0 }}>{h.name}</p>
                    <p style={{ fontSize: 11, color: T.textSec, margin: 0 }}>{h.specialization} • {h.city}</p>
                  </div>
                  <ChevronRight size={15} color={T.textMuted} style={{ marginLeft: 'auto', flexShrink: 0 }} />
                </button>
              ))}
              {suggestions.length === 0 && (
                <div style={{ padding: '20px', textAlign: 'center', fontSize: 14, color: T.textSec }}>
                  No matches for "{search}"
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Quick symptom chips (Horizontal scroll) ──────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, overflowX: 'auto', paddingBottom: 8, whiteSpace: 'nowrap', WebkitOverflowScrolling: 'touch' }} className="hide-scrollbar">
        <span style={{ fontSize: 12, color: T.textMuted, fontWeight: 700, flexShrink: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quick Symptoms:</span>
        {QUICK.map(s => (
          <Link
            key={s}
            to={`/hospitals?q=${encodeURIComponent(s)}${getCityQueryParam()}`}
            style={{
              fontSize: 13, fontWeight: 600, padding: '8px 16px', borderRadius: 999,
              background: T.chipBg, color: T.chipColor, textDecoration: 'none',
              border: `1.5px solid ${T.chipBorder}`,
              transition: 'all 0.2s ease', flexShrink: 0, boxShadow: T.shadow
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = isDark ? '#1e3a8a' : '#dbeafe';
              e.currentTarget.style.color = isDark ? '#93c5fd' : '#1d4ed8';
              e.currentTarget.style.borderColor = isDark ? '#3B82F6' : '#93c5fd';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = T.chipBg;
              e.currentTarget.style.color = T.chipColor;
              e.currentTarget.style.borderColor = T.chipBorder;
              e.currentTarget.style.transform = 'none';
            }}
          >
            {s}
          </Link>
        ))}
      </div>

      {/* ── Stat cards (Clickable) ──────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        {STATS.map(({ label, value, icon: Icon, color, bg, border, link }) => (
          <Link
            key={label}
            to={link}
            style={{
              background: T.card, borderColor: border, borderWidth: 1.5, borderStyle: 'solid',
              boxShadow: T.shadow, transition: 'all 0.3s ease', borderRadius: 16, padding: 20,
              textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 12
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={22} color={color} />
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 800, color: T.text, lineHeight: 1, marginBottom: 4 }}>{value}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.textSec }}>{label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Main grid ───────────────────────────── */}
      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}
        className="lg-grid-main"
      >
        {/* Left: top-rated hospitals */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: T.text, display: 'flex', alignItems: 'center', gap: 8, transition: 'color 0.3s ease' }}>
              <TrendingUp size={20} color={T.btn} /> Top Rated Hospitals
            </h3>
            <Link to="/map" style={{ fontSize: 13, color: T.btn, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              {t('viewAll')} <ChevronRight size={14} />
            </Link>
          </div>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <SkeletonCard /> <SkeletonCard />
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: 20 }}>
              {topRated.map(h => <HospitalCard key={h.id} hospital={h} />)}
            </div>
          )}
        </div>

        {/* Right panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Location Card — Map Preview Design */}
          <div style={{
            background: T.card, borderRadius: 20, overflow: 'hidden', border: `1.5px solid ${T.cardBorder}`, boxShadow: T.shadow, position: 'relative'
          }}>
            <div style={{ height: 120, background: 'url(https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&q=80) center/cover', position: 'relative' }}>
              {/* Blur gradient fade */}
              <div style={{ position: 'absolute', inset: 0, background: isDark ? 'linear-gradient(to bottom, transparent, #111827)' : 'linear-gradient(to bottom, transparent, #ffffff)' }} />
              {/* Fake Map Pin */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 40, height: 40, background: 'rgba(37,99,235,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }}>
                <MapPin size={24} color="#2563EB" fill="#2563EB" />
              </div>
            </div>
            
            <div style={{ padding: '0 20px 20px', position: 'relative', zIndex: 10, marginTop: -20, textAlign: 'center' }}>
              <p style={{ fontSize: 11, color: T.textMuted, fontWeight: 800, letterSpacing: '0.05em', marginBottom: 4 }}>{t('currentRegion')}</p>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: T.text, marginBottom: 4 }}>{city || t('detecting')}</h3>
              <p style={{ fontSize: 13, color: T.textSec, marginBottom: 16 }}>
                {lang === 'hi' ? 'आपके आस-पास ' : lang === 'gu' ? 'તમારી આસપાસ ' : 'Found '} 
                <strong style={{ color: T.btn }}>{hospitals.length}</strong> 
                {lang === 'hi' ? ' अस्पताल मिले।' : lang === 'gu' ? ' હોસ્પિટલો મળી.' : ` ${t('hospitalNearbyFound')}.`}
              </p>
              <Link to="/map" style={{
                display: 'block', width: '100%', background: T.btn, color: '#fff', fontSize: 13, fontWeight: 700,
                padding: '12px 0', borderRadius: 12, textDecoration: 'none', transition: 'background 0.2s',
                boxShadow: isDark ? '0 4px 12px rgba(59,130,246,0.3)' : '0 4px 12px rgba(37,99,235,0.2)'
              }}>
                <Map size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'text-bottom' }} />
                {t('openLiveMap')}
              </Link>
            </div>
          </div>

          {/* New Quick Actions Panel */}
          <div style={{
            background: T.card, borderRadius: 20, border: `1.5px solid ${T.cardBorder}`,
            padding: 20, boxShadow: T.shadow, transition: 'all 0.3s ease'
          }}>
            <h4 style={{ fontSize: 15, fontWeight: 800, color: T.text, marginBottom: 16 }}>{t('quickServices')}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {QUICK_ACTIONS.map(({ label, icon: Icon, to, color, bg }) => (
                <Link
                  key={label} to={to}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: 12, borderRadius: 12,
                    textDecoration: 'none', background: T.inputBg, border: `1px solid ${T.cardBorder}`,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = T.hoverBg; e.currentTarget.style.borderColor = color; }}
                  onMouseLeave={e => { e.currentTarget.style.background = T.inputBg; e.currentTarget.style.borderColor = T.cardBorder; }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={16} color={color} />
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: T.text, flex: 1 }}>{label}</span>
                  <ChevronRight size={14} color={T.textMuted} />
                </Link>
              ))}
            </div>
          </div>

          {/* Redesigned Emergency Card (Dark Theme Specific) */}
          <div style={{
            background: 'linear-gradient(135deg, #1f2937, #111827)',
            border: '1px solid #374151',
            borderRadius: 20,
            padding: 24,
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Subtle glow effect behind the card content */}
            <div style={{
              position: 'absolute', top: -30, right: -30, width: 120, height: 120,
              background: 'radial-gradient(circle, rgba(239,68,68,0.15) 0%, transparent 70%)',
              borderRadius: '50%'
            }} />
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, position: 'relative' }}>
              <span style={{ fontSize: 24, lineHeight: 1 }}>🚑</span>
              <h3 style={{ fontWeight: 800, fontSize: 18, color: '#f8fafc', margin: 0 }}>{t('emergencyHelp')}</h3>
            </div>

            <p style={{ fontSize: 14, fontWeight: 700, margin: '0 0 4px', color: '#e2e8f0', position: 'relative' }}>
              {t('emergencyDesc')}
            </p>
            <p style={{ fontSize: 13, fontWeight: 400, margin: '0 0 20px', lineHeight: 1.5, color: '#94a3b8', position: 'relative' }}>
              {t('emergencySub')}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, position: 'relative' }}>
              <a
                href="tel:108"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  background: '#ef4444', color: '#ffffff', fontWeight: 800, fontSize: 15,
                  padding: '14px 16px', borderRadius: 12, textDecoration: 'none', width: '100%',
                  boxShadow: '0 4px 16px rgba(239,68,68,0.35)', transition: 'background 0.2s',
                  boxSizing: 'border-box'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#dc2626'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#ef4444'; }}
              >
                <PhoneCall size={18} /> {t('call108')}
              </a>
              <Link
                to="/hospitals"
                style={{
                  display: 'block', textAlign: 'center', width: '100%',
                  background: 'rgba(255,255,255,0.05)', color: '#cbd5e1',
                  fontWeight: 600, fontSize: 13, padding: '12px 16px', borderRadius: 12,
                  textDecoration: 'none', transition: 'all 0.2s', border: '1px solid rgba(255,255,255,0.1)',
                  boxSizing: 'border-box'
                }}
                onMouseEnter={e => { 
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; 
                  e.currentTarget.style.color = '#f8fafc';
                }}
                onMouseLeave={e => { 
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; 
                  e.currentTarget.style.color = '#cbd5e1';
                }}
              >
                {t('findHospitals')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 950px) {
          .lg-grid-main { grid-template-columns: 1fr !important; }
        }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </DashboardLayout>
  );
}
