import { useState, useRef, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, Edit3, Save, X, Camera, BookmarkCheck, Calendar, Shield, Upload, RefreshCw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const CITIES = ['Ahmedabad', 'Mumbai', 'Bangalore', 'Delhi', 'Pune', 'Chennai', 'Hyderabad', 'Kolkata'];

/* ─── Camera Modal Component ─────────────────────── */
function CameraModal({ onCapture, onCancel, onUpload }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user' }, 
          audio: false 
        });
        setStream(s);
        if (videoRef.current) videoRef.current.srcObject = s;
      } catch (err) {
        setError("Camera access denied or not available.");
      }
    }
    startCamera();
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, []);

  const capture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      onCapture(dataUrl);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(11, 15, 25, 0.85)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
    }}>
      <div style={{
        background: '#fff', width: '100%', maxWidth: 440, borderRadius: 24,
        overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
      }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#0f172a' }}>Take Photo</h3>
          <button onClick={onCancel} style={{ background: '#f1f5f9', border: 'none', borderRadius: 99, padding: 6, cursor: 'pointer', color: '#64748b' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ position: 'relative', background: '#000', aspectRatio: '4/3' }}>
          {error ? (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', padding: 20, textAlign: 'center' }}>
              <p style={{ margin: '0 0 12px', fontSize: 14 }}>{error}</p>
              <button onClick={() => window.location.reload()} style={{ background: '#3B82F6', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 12, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                Retry
              </button>
            </div>
          ) : (
            <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          )}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>

        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            onClick={capture}
            disabled={!!error}
            style={{
              width: '100%', padding: '14px', borderRadius: 16, border: 'none',
              background: '#3B82F6', color: '#fff', fontWeight: 800, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              boxShadow: '0 4px 12px rgba(59,130,246,0.3)', opacity: error ? 0.5 : 1
            }}
          >
            <Camera size={20} /> Capture Photo
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: '#f1f5f9' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8' }}>OR</span>
            <div style={{ flex: 1, height: 1, background: '#f1f5f9' }} />
          </div>

          <label style={{
            width: '100%', padding: '12px', borderRadius: 16, border: '1.5px solid #e2e8f0',
            background: '#fff', color: '#64748b', fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontSize: 14
          }}>
            <Upload size={18} /> Upload from Files
            <input type="file" accept="image/*" className="hidden" style={{ display: 'none' }} onChange={onUpload} />
          </label>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { t } = useLanguage();
  const [editing, setEditing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    city: user?.city || '',
    bio: user?.bio || '',
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateUser(form);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCancel = () => {
    setForm({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', city: user?.city || '', bio: user?.bio || '' });
    setEditing(false);
  };

  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U';
  const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : 'March 2025';

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUser({ avatar: reader.result });
        setShowCamera(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCapture = (dataUrl) => {
    updateUser({ avatar: dataUrl });
    setShowCamera(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-extrabold text-slate-800">{t('myProfile')}</h1>
          {saved && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-xl text-sm font-medium animate-fadeIn">
              <Save size={14} /> Profile saved!
            </div>
          )}
        </div>

        {/* Profile card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-5">
          {/* Cover */}
          <div className="h-28 hero-gradient relative">
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5" />
            </div>
          </div>

          <div className="px-6 pb-6">
            {/* Avatar and Profile Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              
              <div className="flex items-end gap-5">
                {/* Image is specifically pulled up, breaking out of the container naturally */}
                <div className="relative -mt-12 sm:-mt-14">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-24 h-24 rounded-[20px] object-cover border-4 border-white shadow-lg bg-white" />
                  ) : (
                    <div className="w-24 h-24 rounded-[20px] bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-4xl font-black border-4 border-white shadow-lg">
                      {initials}
                    </div>
                  )}
                  <button 
                    onClick={() => setShowCamera(true)}
                    className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md border-2 border-white hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    <Camera size={14} />
                  </button>
                </div>
                
                {/* Text block (NO negative margin here, so it sits naturally below the banner) */}
                <div className="pb-1">
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">{user?.name}</h2>
                  <p className="text-slate-500 font-medium mt-0.5">{user?.email}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pb-1">
                {editing ? (
                  <div className="flex gap-2">
                    <button onClick={handleCancel} className="flex items-center gap-1.5 border-2 border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                      <X size={15} /> {t('cancel')}
                    </button>
                    <button onClick={handleSave} className="flex items-center gap-1.5 bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-md shadow-blue-600/20">
                      <Save size={15} /> {t('save')}
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 border-2 border-blue-100 text-blue-600 hover:bg-blue-50 hover:border-blue-200 px-4 py-2 rounded-xl text-sm font-bold transition-colors">
                    <Edit3 size={15} /> {t('editProfile')}
                  </button>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: t('savedHospitals'), value: user?.savedHospitals?.length || 0, icon: BookmarkCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: t('memberSince'), value: memberSince, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
                { label: t('account'), value: t('verified'), icon: Shield, color: 'text-green-600', bg: 'bg-green-50' },
              ].map(({ label, value, icon: Icon, color, bg }) => (
                <div key={label} className={`${bg} rounded-2xl p-4 text-center`}>
                  <Icon size={18} className={`${color} mx-auto mb-1`} />
                  <p className="font-bold text-slate-800 text-sm">{value}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Form fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: t('fullName'), key: 'name', icon: User, type: 'text', placeholder: 'Your full name' },
                { label: t('email'), key: 'email', icon: Mail, type: 'email', placeholder: 'your@email.com' },
                { label: t('phone'), key: 'phone', icon: Phone, type: 'tel', placeholder: '+91 xxxxxxxx' },
              ].map(({ label, key, icon: Icon, type, placeholder }) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">{label}</label>
                  <div className="relative">
                    <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      disabled={!editing}
                      type={type}
                      value={form[key]}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className={`w-full pl-9 pr-4 py-3 rounded-xl border text-sm transition-all ${editing ? 'border-blue-200 bg-white text-slate-800' : 'border-slate-100 bg-slate-50 text-slate-600 cursor-not-allowed'}`}
                    />
                  </div>
                </div>
              ))}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">{t('city')}</label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    disabled={!editing}
                    value={form.city}
                    onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                    className={`w-full pl-9 pr-4 py-3 rounded-xl border text-sm transition-all ${editing ? 'border-blue-200 bg-white text-slate-800' : 'border-slate-100 bg-slate-50 text-slate-600 cursor-not-allowed'}`}
                  >
                    <option value="">Select city</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5 block">{t('bio')}</label>
                <textarea
                  disabled={!editing}
                  rows={3}
                  value={form.bio}
                  onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                  placeholder="Write a short bio..."
                  className={`w-full px-4 py-3 rounded-xl border text-sm resize-none transition-all ${editing ? 'border-blue-200 bg-white text-slate-800' : 'border-slate-100 bg-slate-50 text-slate-600 cursor-not-allowed'}`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCamera && (
        <CameraModal 
          onCapture={handleCapture}
          onCancel={() => setShowCamera(false)}
          onUpload={handleImageUpload}
        />
      )}
    </DashboardLayout>
  );
}
