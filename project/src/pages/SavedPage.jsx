import DashboardLayout from './DashboardLayout';
import { useAuth } from '../context/AuthContext';
import HospitalCard from '../components/hospital/HospitalCard';
import { BookmarkCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SavedPage() {
  const { user } = useAuth();
  const saved = user?.savedHospitals || [];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-800 mb-1 flex items-center gap-2">
          <BookmarkCheck size={22} className="text-blue-600" /> Saved Hospitals
        </h1>
        <p className="text-slate-500 text-sm">{saved.length} hospital{saved.length !== 1 ? 's' : ''} saved</p>
      </div>

      {saved.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <div className="w-20 h-20 rounded-3xl bg-blue-50 flex items-center justify-center mb-5">
            <Heart size={36} className="text-blue-300" />
          </div>
          <h3 className="font-bold text-slate-700 text-lg mb-2">No saved hospitals yet</h3>
          <p className="text-slate-500 text-sm text-center max-w-xs mb-6">
            Bookmark hospitals to quickly access them for appointments or emergencies.
          </p>
          <Link to="/hospitals" className="btn-primary py-3 px-6 text-sm">
            Browse Hospitals
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {saved.map((h, i) => (
            <div key={h.id} className="animate-fadeInUp" style={{ animationDelay: `${i * 0.07}s` }}>
              <HospitalCard hospital={h} />
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
