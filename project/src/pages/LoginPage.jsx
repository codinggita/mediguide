import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Eye, EyeOff, Mail, Lock, ArrowRight, Shield, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Please fill all fields.'); return; }
    setLoading(true);
    
    const res = await login(form.email, form.password);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 hero-gradient flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-400/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-green-400/10 blur-3xl" />
        </div>
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 relative">
          <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center">
            <Heart size={20} className="text-white fill-white" />
          </div>
          <span className="text-2xl font-bold text-white">MediGuide</span>
        </Link>
        {/* Center */}
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-400/30 to-green-400/30 border border-white/20 flex items-center justify-center mb-8 animate-float">
            <Shield size={40} className="text-white" />
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-4 leading-tight">
            Your Health, <br />Our Priority
          </h2>
          <p className="text-slate-300 text-base leading-relaxed mb-8 max-w-xs">
            Join millions of patients finding the right healthcare with MediGuide.
          </p>
          <div className="flex gap-4">
            {[
              { value: '15K+', label: 'Hospitals' },
              { value: '2M+', label: 'Patients' },
              { value: '4.8★', label: 'Rating' },
            ].map(({ value, label }) => (
              <div key={label} className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-center backdrop-blur">
                <p className="text-white font-bold text-lg">{value}</p>
                <p className="text-slate-300 text-xs">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-slate-500 text-sm relative">© 2025 MediGuide. All rights reserved.</p>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
              <Heart size={16} className="text-white fill-white" />
            </div>
            <span className="text-xl font-bold gradient-text">MediGuide</span>
          </Link>

          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
            <h1 className="text-2xl font-extrabold text-slate-800 mb-1">Welcome back 👋</h1>
            <p className="text-slate-500 text-sm mb-6">Sign in to your MediGuide account</p>

            {/* Demo hint */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3 mb-5 flex items-start gap-2">
              <Shield size={15} className="text-blue-500 mt-0.5 shrink-0" />
              <p className="text-xs text-blue-700">Demo: <strong>demo@mediguide.com</strong> / <strong>demo1234</strong></p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-4 flex items-center gap-2">
                <AlertCircle size={15} className="text-red-500 shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block uppercase tracking-wide">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 bg-slate-50 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block uppercase tracking-wide">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 bg-slate-50 focus:bg-white transition-all"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary justify-center py-3.5 text-base"
              >
                {loading ? (
                  <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Signing in...</span>
                ) : (
                  <span className="flex items-center gap-2">Sign in <ArrowRight size={17} /></span>
                )}
              </button>
            </form>

            <p className="text-center text-slate-500 text-sm mt-6">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-600 font-semibold hover:text-blue-700">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
