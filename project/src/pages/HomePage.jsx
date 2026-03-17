import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useHospital } from '../context/HospitalContext';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import HospitalCard from '../components/hospital/HospitalCard';
import {
  Search, MapPin, ArrowRight, Star, Shield, Clock,
  Heart, Phone, Activity, Users, Building2, Award, Map, Navigation, Locate
} from 'lucide-react';

const SYMPTOM_SUGGESTIONS = [
  'Chest pain', 'Fever', 'Headache', 'Back pain', 'Breathlessness',
  'Knee pain', 'Skin rash', 'Eye problem', 'Dental pain', 'Anxiety'
];

const STATS = [
  { icon: Building2, label: 'Hospitals', value: '15,000+', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: Users, label: 'Patients Served', value: '2M+', color: 'text-green-600', bg: 'bg-green-50' },
  { icon: Award, label: 'Cities Covered', value: '200+', color: 'text-purple-600', bg: 'bg-purple-50' },
  { icon: Star, label: 'Avg Rating', value: '4.8★', color: 'text-amber-600', bg: 'bg-amber-50' },
];

const FEATURES = [
  {
    icon: MapPin,
    title: 'Smart Location Detection',
    desc: 'Instantly finds hospitals near you using GPS and shows real-time distance.',
    color: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
    textColor: 'text-blue-600',
  },
  {
    icon: Search,
    title: 'Symptom-Based Search',
    desc: 'Search hospitals by symptoms or specialization to find the right care.',
    color: 'from-green-500 to-green-600',
    bg: 'bg-green-50',
    textColor: 'text-green-600',
  },
  {
    icon: Shield,
    title: 'Verified Hospitals',
    desc: 'All listed hospitals are verified and reviewed by healthcare experts.',
    color: 'from-purple-500 to-purple-600',
    bg: 'bg-purple-50',
    textColor: 'text-purple-600',
  },
  {
    icon: Clock,
    title: 'Real-Time Availability',
    desc: 'Check hospital availability, appointment slots and emergency status 24/7.',
    color: 'from-orange-500 to-orange-600',
    bg: 'bg-orange-50',
    textColor: 'text-orange-600',
  },
  {
    icon: Activity,
    title: 'Health Insights',
    desc: 'Get insights on specializations, ratings and consultation costs upfront.',
    color: 'from-red-500 to-red-600',
    bg: 'bg-red-50',
    textColor: 'text-red-600',
  },
  {
    icon: Heart,
    title: 'Save Favourites',
    desc: 'Bookmark hospitals for quick access during emergencies or follow-ups.',
    color: 'from-pink-500 to-pink-600',
    bg: 'bg-pink-50',
    textColor: 'text-pink-600',
  },
];

export default function HomePage() {
  const { user } = useAuth();
  const { hospitals } = useHospital();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [animIdx, setAnimIdx] = useState(0);

  const heroTexts = ['Find Nearby Hospitals Instantly', 'Get The Right Care Fast', 'Your Health, Our Priority'];
  useEffect(() => {
    const t = setInterval(() => setAnimIdx(p => (p + 1) % heroTexts.length), 3200);
    return () => clearInterval(t);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(user ? `/hospitals?q=${encodeURIComponent(searchTerm)}` : '/login', { state: { search: searchTerm } });
    } else {
      navigate(user ? '/hospitals' : '/login');
    }
  };

  const featuredHospitals = hospitals.slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-gradient pt-24 pb-20 relative overflow-hidden">
        {/* BG shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-green-500/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-purple-500/5 blur-3xl" />
          {/* Floating icons */}
          <div className="hidden lg:block absolute top-24 right-16 animate-float" style={{ animationDelay: '0s' }}>
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">
              <Heart size={24} className="text-red-300 fill-red-300" />
            </div>
          </div>
          <div className="hidden lg:block absolute bottom-24 right-32 animate-float" style={{ animationDelay: '1s' }}>
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">
              <Activity size={20} className="text-green-300" />
            </div>
          </div>
          <div className="hidden lg:block absolute top-36 left-20 animate-float" style={{ animationDelay: '2s' }}>
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center">
              <Shield size={20} className="text-blue-300" />
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-green-300 text-sm font-medium px-4 py-2 rounded-full mb-6 backdrop-blur">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Trusted by 2M+ patients across India
          </div>

          {/* Heading with animation */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6 min-h-[80px]">
            {heroTexts[animIdx].split(' ').slice(0, -1).join(' ')}{' '}
            <span className="gradient-text">{heroTexts[animIdx].split(' ').slice(-1)}</span>
          </h1>

          <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Describe your symptoms or search by specialization to discover the best hospitals near you — with ratings, costs, and real-time availability.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-6">
            <div className="flex items-center bg-white rounded-2xl shadow-2xl overflow-hidden">
              <Search size={20} className="ml-5 text-slate-400 shrink-0" />
              <input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                type="text"
                placeholder="Search symptoms, hospital name or specialization..."
                className="flex-1 px-4 py-4 text-slate-800 placeholder-slate-400 text-sm bg-transparent"
              />
              <div className="flex items-center gap-0.5 border-l border-slate-200 pl-3 pr-1 mr-1">
                <MapPin size={16} className="text-blue-500" />
                <span className="text-xs text-slate-500 mr-2">Near me</span>
              </div>
              <button type="submit" className="m-1.5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors">
                Search
              </button>
            </div>
            {/* Suggestions */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fadeIn">
                <p className="px-4 py-1.5 text-xs font-medium text-slate-400 uppercase">Popular Symptoms</p>
                {SYMPTOM_SUGGESTIONS.filter(s => !searchTerm || s.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 6).map(sym => (
                  <button key={sym} type="button" onClick={() => { setSearchTerm(sym); setShowSuggestions(false); }}
                    className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-2">
                    <Search size={13} className="text-slate-400" /> {sym}
                  </button>
                ))}
              </div>
            )}
          </form>

          <div className="flex flex-wrap gap-2 justify-center">
            {['Emergency', 'Cardiology', 'Orthopedics', 'Pediatrics', 'Neurology'].map(tag => (
              <button key={tag}
                onClick={() => navigate(user ? `/hospitals?q=${encodeURIComponent(tag)}` : '/login')}
                className="bg-white/10 border border-white/20 text-white text-xs px-3 py-1.5 rounded-full hover:bg-white/20 transition-colors backdrop-blur">
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-6 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map(({ icon: Icon, label, value, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl p-5 shadow-lg border border-slate-100 flex items-center gap-4 card-hover">
              <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                <Icon size={22} className={color} />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-800">{value}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Nearby Hospitals Preview */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-1">Hospitals Near You</h2>
            <p className="text-slate-500 text-sm">Top-rated hospitals in your area</p>
          </div>
          <Link
            to={user ? '/hospitals' : '/login'}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors"
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(featuredHospitals) && featuredHospitals.map((h, i) => (
            <div key={h.id || i} className="animate-fadeInUp" style={{ animationDelay: `${i * 0.1}s` }}>
              <HospitalCard hospital={h} />
            </div>
          ))}
        </div>
      </section>

      {/* Feature Section */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="badge bg-blue-100 text-blue-600 mb-3">Why MediGuide?</span>
            <h2 className="text-3xl font-extrabold text-slate-800 mb-3">Healthcare That Comes to You</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
              MediGuide connects you with the right healthcare providers in seconds, making quality medical care accessible to everyone.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, color, bg, textColor }, i) => (
              <div key={title} className="bg-white rounded-2xl p-6 card-hover border border-slate-100 shadow-sm animate-fadeInUp" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg`}>
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: text */}
            <div className="animate-fadeInUp">
              <span className="badge bg-blue-100 text-blue-600 mb-4">Live Map</span>
              <h2 className="text-3xl font-extrabold text-slate-800 mb-4 leading-tight">
                Hospitals on the Map,{' '}
                <span className="gradient-text">Right Near You</span>
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                Our interactive live map shows all verified hospitals around your current location.
                Pin, explore and get directions — all from one place.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  { icon: Locate,     text: 'Auto-detects your GPS location instantly' },
                  { icon: MapPin,     text: 'Red pins mark every nearby hospital' },
                  { icon: Navigation, text: 'One-tap directions via OpenStreetMap' },
                  { icon: Star,       text: 'Ratings and fees visible right in the popup' },
                ].map(({ icon: I, text }) => (
                  <li key={text} className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <I size={15} className="text-blue-600" />
                    </div>
                    {text}
                  </li>
                ))}
              </ul>
              <Link
                to={user ? '/maps' : '/login'}
                className="btn-primary inline-flex"
              >
                <Map size={17} /> Open Live Map
              </Link>
            </div>

            {/* Right: map preview card */}
            <div className="relative animate-fadeInUp" style={{ animationDelay: '0.15s' }}>
              {/* Outer glow */}
              <div className="absolute -inset-3 bg-gradient-to-br from-blue-400/20 to-green-400/10 rounded-3xl blur-xl" />
              <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
                {/* Fake map image */}
                <div className="relative h-72 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80"
                    alt="Map preview"
                    className="w-full h-full object-cover"
                  />
                  {/* overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-transparent to-transparent" />
                  {/* Floating hospital pins */}
                  {[{ top: '30%', left: '42%', delay: '0s' }, { top: '55%', left: '62%', delay: '0.3s' }, { top: '20%', left: '65%', delay: '0.6s' }].map((p, i) => (
                    <div key={i} className="absolute animate-bounce" style={{ top: p.top, left: p.left, animationDelay: p.delay, animationDuration: '2.5s' }}>
                      <div className="w-7 h-7 bg-red-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                        <MapPin size={13} className="text-white fill-white" />
                      </div>
                    </div>
                  ))}
                  {/* You are here pin */}
                  <div className="absolute" style={{ top: '45%', left: '45%' }}>
                    <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center shadow-xl border-3 border-white ring-4 ring-blue-200">
                      <Locate size={16} className="text-white" />
                    </div>
                    <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-white text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full shadow whitespace-nowrap">
                      You are here
                    </div>
                  </div>
                  {/* Bottom label */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/90 backdrop-blur rounded-xl px-4 py-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-semibold text-slate-700">Live Hospital Map</span>
                      </div>
                      <span className="text-xs text-slate-400">{hospitals.length}+ hospitals</span>
                    </div>
                  </div>
                </div>
                {/* Bottom strip */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <div className="w-3 h-3 rounded-full bg-blue-500" /> Your location
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <div className="w-3 h-3 rounded-full bg-red-500" /> Hospitals
                    </div>
                  </div>
                  <Link
                    to={user ? '/maps' : '/login'}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                  >
                    Open full map <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="max-w-5xl mx-auto px-6 py-16">
          <div className="hero-gradient rounded-3xl p-10 md:p-14 text-center relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-blue-400/10 blur-3xl" />
              <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-green-400/10 blur-3xl" />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Ready to Find Your Hospital?</h2>
            <p className="text-slate-300 mb-8 text-base max-w-md mx-auto">Join millions of patients who trust MediGuide for fast, reliable healthcare discovery.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="btn-primary text-base py-3 px-8">
                Get Started Free <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="bg-white/10 border border-white/30 text-white py-3 px-8 rounded-xl font-semibold hover:bg-white/20 transition-colors">
                Sign In
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Emergency Banner */}
      <div className="bg-red-50 border-y border-red-100 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-red-500" />
            <span className="text-red-700 font-semibold text-sm">Emergency? Call 108 immediately!</span>
          </div>
          <span className="text-slate-300 hidden sm:block">|</span>
          <span className="text-slate-500 text-sm">Available 24/7 across India</span>
        </div>
      </div>
      <Footer />
    </div>
  );
}
