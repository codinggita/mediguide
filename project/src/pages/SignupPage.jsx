import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Eye, EyeOff, Mail, Lock, User, Phone, MapPin, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';

const CITIES = ['Ahmedabad', 'Mumbai', 'Bangalore', 'Delhi', 'Pune', 'Chennai', 'Hyderabad', 'Kolkata'];

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', city: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordChecks = [
    { label: '8+ characters', pass: form.password.length >= 8 },
    { label: 'Uppercase letter', pass: /[A-Z]/.test(form.password) },
    { label: 'Number', pass: /\d/.test(form.password) },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password) { setError('Please fill all required fields.'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    
    setLoading(true);
    const res = await signup({ 
      name: form.name, 
      email: form.email, 
      phone: form.phone, 
      city: form.city, 
      password: form.password 
    });

    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.error);
    }
    setLoading(false);
  };

  const f = (field, val) => setForm(prev => ({ ...prev, [field]: val }));

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex w-2/5 hero-gradient flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-blue-400/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-green-400/10 blur-3xl" />
        </div>
        <Link to="/" className="flex items-center gap-2 relative">
          <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center">
            <Heart size={20} className="text-white fill-white" />
          </div>
          <span className="text-2xl font-bold text-white">MediGuide</span>
        </Link>
        <div className="relative">
          <h2 className="text-3xl font-extrabold text-white mb-4 leading-tight">
            Start Your Healthcare Journey
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-8 max-w-xs">
            Create your free account and discover hospitals, save favourites, and get personalized healthcare guidance.
          </p>
          <div className="space-y-3">
            {['Free to use forever', 'Verified hospital listings', 'Real-time availability', 'Secure & private'].map(b => (
              <div key={b} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-green-400/20 border border-green-400/40 flex items-center justify-center">
                  <CheckCircle size={12} className="text-green-400" />
                </div>
                <span className="text-slate-300 text-sm">{b}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-slate-500 text-sm relative">© 2025 MediGuide</p>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <Link to="/" className="flex items-center gap-2 mb-6 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
              <Heart size={16} className="text-white fill-white" />
            </div>
            <span className="text-xl font-bold gradient-text">MediGuide</span>
          </Link>

          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
            <h1 className="text-2xl font-extrabold text-slate-800 mb-1">Create your account</h1>
            <p className="text-slate-500 text-sm mb-6">Join MediGuide — it's free and always will be</p>

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-4 flex items-center gap-2">
                <AlertCircle size={15} className="text-red-500 shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block uppercase tracking-wide">Full Name *</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" value={form.name} onChange={e => f('name', e.target.value)} placeholder="John Doe" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 bg-slate-50 focus:bg-white transition-all" />
                </div>
              </div>
              {/* Email */}
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block uppercase tracking-wide">Email *</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="email" value={form.email} onChange={e => f('email', e.target.value)} placeholder="you@example.com" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 bg-slate-50 focus:bg-white transition-all" />
                </div>
              </div>
              {/* Phone & City */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block uppercase tracking-wide">Phone</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="tel" value={form.phone} onChange={e => f('phone', e.target.value)} placeholder="+91 ..." className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 bg-slate-50 focus:bg-white transition-all" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1.5 block uppercase tracking-wide">City</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select value={form.city} onChange={e => f('city', e.target.value)} className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 bg-slate-50 focus:bg-white transition-all appearance-none">
                      <option value="">Select</option>
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              {/* Password */}
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block uppercase tracking-wide">Password *</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => f('password', e.target.value)} placeholder="••••••••" className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 bg-slate-50 focus:bg-white transition-all" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {form.password && (
                  <div className="flex gap-3 mt-2">
                    {passwordChecks.map(({ label, pass }) => (
                      <div key={label} className={`flex items-center gap-1 text-[11px] ${pass ? 'text-green-600' : 'text-slate-400'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${pass ? 'bg-green-500' : 'bg-slate-300'}`} />
                        {label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Confirm password */}
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1.5 block uppercase tracking-wide">Confirm Password *</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="password" value={form.confirm} onChange={e => f('confirm', e.target.value)} placeholder="••••••••" className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm bg-slate-50 focus:bg-white transition-all ${form.confirm && form.password !== form.confirm ? 'border-red-300 text-red-700' : 'border-slate-200 text-slate-800'}`} />
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full btn-primary justify-center py-3.5 text-base mt-2">
                {loading ? (
                  <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Creating account...</span>
                ) : (
                  <span className="flex items-center gap-2">Create Account <ArrowRight size={17} /></span>
                )}
              </button>
            </form>
            <p className="text-center text-slate-500 text-sm mt-5">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
