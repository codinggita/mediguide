import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import {
  Heart, Menu, X, Bell, User, LogOut, Settings,
  Search, MapPin, ChevronDown,
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
              <Heart size={18} className="text-white fill-white" />
            </div>
            <span className="text-xl font-bold gradient-text">MediGuide</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-slate-600 hover:text-blue-600 font-medium transition-colors text-sm">Home</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="text-slate-600 hover:text-blue-600 font-medium transition-colors text-sm">Dashboard</Link>
                <Link to="/hospitals" className="text-slate-600 hover:text-blue-600 font-medium transition-colors text-sm">Hospitals</Link>
                <Link to="/maps" className="text-slate-600 hover:text-blue-600 font-medium transition-colors text-sm">Map</Link>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-600 hover:text-blue-600 font-medium transition-colors text-sm">Login</Link>
                <Link to="/signup" className="btn-primary text-sm py-2 px-5">Get Started</Link>
              </>
            )}
            <ThemeToggle />
          </div>

          {/* User menu */}
          {user && (
            <div className="hidden md:flex items-center gap-3 relative">
              <button className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-blue-50 flex items-center justify-center text-slate-500 hover:text-blue-600 transition-colors">
                <Bell size={16} />
              </button>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 pl-2 hover:bg-slate-50 rounded-xl px-3 py-2 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-bold">
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-medium text-slate-700">{user.name?.split(' ')[0]}</span>
                <ChevronDown size={14} className="text-slate-400" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fadeIn">
                  <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-slate-700 text-sm transition-colors">
                    <User size={15} /> Profile
                  </Link>
                  <Link to="/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-slate-700 text-sm transition-colors">
                    <Settings size={15} /> Settings
                  </Link>
                  <hr className="my-1 border-slate-100" />
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-red-500 text-sm transition-colors">
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile menu btn */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <button className="p-2 rounded-xl hover:bg-slate-100 transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-slate-100 mt-2 animate-fadeIn">
            <div className="flex flex-col gap-1 pt-3">
              <Link to="/" className="px-4 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 font-medium text-sm" onClick={() => setMobileOpen(false)}>Home</Link>
              {user ? (
                <>
                  <Link to="/dashboard" className="px-4 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 font-medium text-sm" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                  <Link to="/hospitals" className="px-4 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 font-medium text-sm" onClick={() => setMobileOpen(false)}>Hospitals</Link>
                  <Link to="/maps" className="px-4 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 font-medium text-sm" onClick={() => setMobileOpen(false)}>Map View</Link>
                  <Link to="/saved" className="px-4 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 font-medium text-sm" onClick={() => setMobileOpen(false)}>Saved</Link>
                  <Link to="/profile" className="px-4 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 font-medium text-sm" onClick={() => setMobileOpen(false)}>Profile</Link>
                  <button onClick={handleLogout} className="px-4 py-2.5 rounded-xl hover:bg-red-50 text-red-500 font-medium text-sm text-left">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-4 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 font-medium text-sm" onClick={() => setMobileOpen(false)}>Login</Link>
                  <Link to="/signup" className="mx-4 btn-primary justify-center text-sm py-2.5" onClick={() => setMobileOpen(false)}>Get Started</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
