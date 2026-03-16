import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import HospitalCard from '../components/hospital/HospitalCard';
import { SkeletonCard } from '../components/common/Skeleton';
import { useHospital } from '../context/HospitalContext';
import { useDebounce, useGeolocation } from '../hooks/useHooks';
import { SPECIALIZATIONS, CITIES } from '../data/hospitals';
import {
  Search, SlidersHorizontal, ChevronLeft, ChevronRight,
  X, Filter, Map, ArrowUpDown,
} from 'lucide-react';

/* Category chips shown above the grid */
const CHIPS = ['All', 'Multi-Specialty', 'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Cancer Care'];

export default function HospitalsPage() {
  const navigate   = useNavigate();
  const location   = useLocation();

  const {
    searchQuery, setSearchQuery,
    filters,    setFilters,
    sortBy,     setSortBy,
    currentPage, setCurrentPage,
    getPaginatedHospitals,
  } = useHospital();

  const [localSearch,  setLocalSearch]  = useState(searchQuery);
  const [filtersOpen,  setFiltersOpen]  = useState(false);
  const [loading,      setLoading]      = useState(false);
  const debounced = useDebounce(localSearch, 400);

  /* Sync URL query param or navigation state on mount */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    const c = params.get('city');

    if (q) {
      setLocalSearch(q);
    } else if (location.state?.search) {
      setLocalSearch(location.state.search);
      // Clear the state so it doesn't persistently override if they navigate away and back
      navigate(location.pathname, { replace: true, state: {} });
    }

    if (c) {
      setFilters(prev => ({ ...prev, city: c }));
    }
  }, [location.search, location.state, location.pathname, navigate]);

  /* Apply debounced search */
  useEffect(() => {
    setLoading(true);
    setSearchQuery(debounced);
    setCurrentPage(1);
    const t = setTimeout(() => setLoading(false), 380);
    return () => clearTimeout(t);
  }, [debounced]);

  const { location: geoCoords, city: geoCity, detectLocation } = useGeolocation();

  useEffect(() => {
    detectLocation();
  }, []);

  useEffect(() => {
    if (geoCoords) {
      setFilters(prev => ({
        ...prev,
        userCoords: geoCoords,
        city: prev.city || geoCity
      }));
    }
  }, [geoCoords, geoCity, setFilters]);

  const { data: hospitals, total, pages } = getPaginatedHospitals();

  const handleFilter = (key, val) => {
    setFilters(prev => ({ ...prev, [key]: val }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ specialization: '', rating: '', cost: '', city: '' });
    setLocalSearch('');
    setSortBy('distance');
    setCurrentPage(1);
  };

  const activeCount = Object.values(filters).filter(Boolean).length + (localSearch ? 1 : 0);

  /* helper: select style */
  const selectStyle = {
    padding: '9px 12px', borderRadius: 10, border: '1.5px solid #e2e8f0',
    fontSize: 13, color: '#374151', background: '#fff', cursor: 'pointer',
    appearance: 'none', WebkitAppearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center',
    paddingRight: 30,
  };

  return (
    <DashboardLayout>

      {/* ── Header ─────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 2 }}>Find Hospitals</h2>
          <p style={{ fontSize: 13, color: '#64748b' }}>
            {loading ? 'Searching…' : (
              <><strong style={{ color: '#0f172a' }}>{total}</strong> hospitals found
                {localSearch ? <> for <em>"{localSearch}"</em></> : ''}</>
            )}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {activeCount > 0 && (
            <button
              onClick={clearFilters}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '9px 14px', borderRadius: 10, border: '1.5px solid #fca5a5',
                background: '#fef2f2', color: '#dc2626', fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}
            >
              <X size={13} /> Clear ({activeCount})
            </button>
          )}
        </div>
      </div>

      {/* ── Search + Sort + Filter bar ──────────── */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>

        {/* Search */}
        <div className="search-bar" style={{ maxWidth: 'unset', flex: 1, minWidth: 200 }}>
          <Search size={16} color="#94a3b8" style={{ flexShrink: 0 }} />
          <input
            value={localSearch}
            onChange={e => setLocalSearch(e.target.value)}
            placeholder="Search hospitals, symptoms, or city..."
          />
          {localSearch && (
            <button
              onClick={() => setLocalSearch('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0, display:'flex' }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Sort dropdown */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <ArrowUpDown size={13} color="#94a3b8" style={{ position:'absolute', left:10, pointerEvents:'none' }} />
          <select
            value={sortBy}
            onChange={e => { setSortBy(e.target.value); setCurrentPage(1); }}
            style={{ ...selectStyle, paddingLeft: 28, minWidth: 148 }}
          >
            <option value="distance">Sort: Distance</option>
            <option value="rating">Sort: Rating</option>
            <option value="cost">Sort: Cost (Low)</option>
          </select>
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setFiltersOpen(o => !o)}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '9px 16px', borderRadius: 10, cursor: 'pointer',
            fontSize: 13, fontWeight: 600, transition: 'all .15s',
            border: filtersOpen || activeCount > 0 ? '1.5px solid #2563EB' : '1.5px solid #e2e8f0',
            background: filtersOpen || activeCount > 0 ? '#2563EB' : '#fff',
            color: filtersOpen || activeCount > 0 ? '#fff' : '#374151',
          }}
        >
          <SlidersHorizontal size={15} />
          Filters
          {activeCount > 0 && (
            <span style={{
              background: 'rgba(255,255,255,.25)', color: 'inherit',
              fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 999,
            }}>
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {/* ── Advanced Filters panel ──────────────── */}
      {filtersOpen && (
        <div className="filter-panel" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontWeight: 700, fontSize: 14, color: '#0f172a' }}>
              <Filter size={15} color="#2563EB" /> Advanced Filters
            </div>
            <button
              onClick={clearFilters}
              style={{ fontSize: 12, color: '#dc2626', fontWeight: 600, background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:4 }}
            >
              <X size={12} /> Clear all
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
            {[
              { label: 'Specialization', key: 'specialization', opts: [['', 'All'], ...SPECIALIZATIONS.map(s => [s, s])] },
              { label: 'Min Rating',      key: 'rating',         opts: [['', 'Any rating'], ['4.5','4.5★+'], ['4.0','4.0★+'], ['3.5','3.5★+'], ['3.0','3.0★+']] },
              { label: 'Cost Range',      key: 'cost',           opts: [['', 'Any cost'], ['low','₹0 – ₹500'], ['medium','₹501 – ₹1000'], ['high','₹1000+']] },
              { label: 'City',            key: 'city',           opts: [['', 'All Cities'], ...CITIES.map(c => [c, c])] },
            ].map(({ label, key, opts }) => (
              <div key={key}>
                <label style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '.06em', display: 'block', marginBottom: 6 }}>
                  {label}
                </label>
                <select
                  value={filters[key]}
                  onChange={e => handleFilter(key, e.target.value)}
                  style={{ ...selectStyle, width: '100%' }}
                >
                  {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Category chip bar ───────────────────── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
        {CHIPS.map(chip => (
          <button
            key={chip}
            onClick={() => handleFilter('specialization', chip === 'All' ? '' : chip)}
            className={`cat-chip ${(chip === 'All' && !filters.specialization) || filters.specialization === chip ? 'active' : ''}`}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* ── Hospital Grid ───────────────────────── */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : hospitals.length === 0 ? (
        <div className="empty-state">
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: 'linear-gradient(135deg,#eff6ff,#e0f2fe)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
          }}>
            <Search size={28} color="#93c5fd" />
          </div>
          <h3 style={{ fontWeight: 700, fontSize: 16, color: '#0f172a', marginBottom: 6 }}>No hospitals found</h3>
          <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>
            Try adjusting your search terms or clearing the filters.
          </p>
          <button onClick={clearFilters} className="btn-primary" style={{ fontSize: 13, padding: '9px 22px' }}>
            Clear Filters
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 24,
          }}
        >
          {hospitals.map((h, i) => (
            <div key={h.id} className="animate-fadeInUp" style={{ animationDelay: `${i * 0.045}s` }}>
              <HospitalCard hospital={h} />
            </div>
          ))}
        </div>
      )}

      {/* ── Pagination ──────────────────────────── */}
      {pages > 1 && !loading && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 36 }}>
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="page-btn page-btn-word"
          >
            <ChevronLeft size={14} style={{ marginRight: 2 }} /> Prev
          </button>

          {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              className={`page-btn ${p === currentPage ? 'active' : ''}`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(p => Math.min(pages, p + 1))}
            disabled={currentPage === pages}
            className="page-btn page-btn-word"
          >
            Next <ChevronRight size={14} style={{ marginLeft: 2 }} />
          </button>
        </div>
      )}

      {/* ── Floating Map Button ─────────────────── */}
      <Link
        to="/map"
        className="float-map-btn"
      >
        <span className="float-map-btn-pulse animate-pulse-dot" />
        <Map size={17} />
        Open Map View
      </Link>
    </DashboardLayout>
  );
}
