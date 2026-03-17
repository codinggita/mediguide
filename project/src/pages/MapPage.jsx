import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import DashboardLayout from './DashboardLayout';
import { useHospital } from '../context/HospitalContext';
import { useGeolocation } from '../hooks/useHooks';
import { MapPin, Navigation, Star, Phone, ChevronRight, Locate, ShieldCheck, Heart } from 'lucide-react';

// Fix leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});
const hospitalIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => { if (center) map.setView(center, 13); }, [center]);
  return null;
}

export default function MapPage() {
  const routerLocation = useLocation();
  const navigate = useNavigate();
  const { getFilteredHospitals, setSearchQuery, detectLocation, locating, filters } = useHospital();
  const hospitals = getFilteredHospitals();
  const location = filters.userCoords;
  const city = filters.city;
  const [selected, setSelected] = useState(null);
  const [mapCenter, setMapCenter] = useState([23.0225, 72.5714]);

  /* Sync URL query param or navigation state on mount */
  useEffect(() => {
    const q = new URLSearchParams(routerLocation.search).get('q');
    if (q) {
      setSearchQuery(q);
      navigate(routerLocation.pathname, { replace: true, state: {} });
    } else if (routerLocation.state?.search) {
      setSearchQuery(routerLocation.state.search);
      navigate(routerLocation.pathname, { replace: true, state: {} });
    }
  }, [routerLocation.search, routerLocation.state, routerLocation.pathname, navigate, setSearchQuery]);

  useEffect(() => {
    if (location) setMapCenter([location.lat, location.lng]);
  }, [location]);

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <span className="flex h-2 w-2 relative">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
             </span>
             <h1 className="text-2xl font-black text-slate-800 tracking-tight">Interactive Hospitals Map</h1>
          </div>
          <p className="text-slate-500 text-sm flex items-center gap-1.5 font-medium">
            <MapPin size={14} className="text-blue-500" />
            {city ? `Showing verified hospitals near ${city}` : 'Accessing your live coordinates...'}
          </p>
        </div>
        <button
          onClick={detectLocation}
          disabled={locating}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl text-sm font-bold transition-all shadow-lg active:scale-95 disabled:opacity-60"
        >
          <Locate size={18} className={locating ? 'animate-spin' : ''} />
          {locating ? 'Detecting...' : 'Update Location'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map Container */}
        <div className="lg:col-span-3">
          <div className="w-full h-[520px] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
            <MapContainer center={mapCenter} zoom={12} style={{ height: '100%', width: '100%', zIndex: 10 }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
              />
              <RecenterMap center={mapCenter} />

              {/* User Marker */}
              {location && (
                <Marker position={[location.lat, location.lng]} icon={userIcon}>
                  <Popup className="custom-map-popup">
                    <div className="p-1 text-center">
                      <p className="font-bold text-blue-600 text-sm mb-1">📍 You are here</p>
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono">{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</p>
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* Hospital Markers */}
              {hospitals.filter(h => h.lat && h.lng).map((h, i) => (
                <Marker
                  key={`marker-${h.id || i}`}
                  position={[h.lat, h.lng]}
                  icon={hospitalIcon}
                  eventHandlers={{ click: () => setSelected(h) }}
                >
                  <Popup className="custom-map-popup">
                    <div className="min-w-[220px] p-1">
                      <div className="flex items-center gap-2 mb-2">
                         <div className="w-6 h-6 rounded bg-red-50 flex items-center justify-center text-red-500">
                           <Heart size={12} fill="currentColor" />
                         </div>
                         <h3 className="font-bold text-slate-800 text-sm truncate">{h.name}</h3>
                      </div>
                      <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">{h.specialization}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                          <Star size={12} fill="currentColor" /> <span>{h.rating}</span>
                        </div>
                        <p className="text-[11px] text-blue-600 font-black">₹{h.consultationFee}</p>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
          {/* Map Info Strip */}
          <div className="flex items-center gap-6 mt-4 ml-4">
            <div className="flex items-center gap-2.5 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <div className="w-4 h-4 rounded-full bg-blue-600 shadow-sm border-2 border-white" /> Your Position
            </div>
            <div className="flex items-center gap-2.5 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <div className="w-4 h-4 rounded-full bg-red-500 shadow-sm border-2 border-white" /> Verified Hospitals
            </div>
          </div>
        </div>

        {/* Dynamic Sidebar Panel */}
        <div className="flex flex-col gap-5">
           <div className="bg-white rounded-[2rem] p-5 shadow-xl border border-slate-100 flex-1 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="font-black text-slate-800 text-sm uppercase tracking-tight">Hospitals Nearby</h3>
                <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-2 py-0.5 rounded-full">{hospitals.length} Found</span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {hospitals.map((h, i) => (
                  <button
                    key={`sidebar-item-${h.id || i}`}
                    onClick={() => { setSelected(h); setMapCenter([h.lat, h.lng]); }}
                    className={`w-full group p-3.5 rounded-2xl text-left border transition-all ${selected?.id === h.id ? 'bg-blue-600 border-blue-600 shadow-lg' : 'bg-slate-50 border-transparent hover:border-blue-200 hover:bg-white'}`}
                  >
                    <p className={`font-bold text-sm truncate mb-0.5 ${selected?.id === h.id ? 'text-white' : 'text-slate-800 group-hover:text-blue-600'}`}>{h.name}</p>
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-medium ${selected?.id === h.id ? 'text-blue-100' : 'text-slate-400'}`}>{h.city}</span>
                      <div className="flex items-center gap-1">
                        <Star size={10} fill="currentColor" className={selected?.id === h.id ? 'text-white' : 'text-amber-400'} />
                        <span className={`text-[10px] font-black ${selected?.id === h.id ? 'text-white' : 'text-slate-600'}`}>{h.rating}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
           </div>

           {/* Quick Stat */}
           <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[2rem] p-5 text-white shadow-xl relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest mb-1 opacity-80">Safety First</p>
                <h4 className="text-sm font-black mb-3 leading-tight">Emergency Support Available 24/7</h4>
                <a href="tel:108" className="inline-flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-xl text-xs font-black shadow-sm group-hover:bg-blue-50 transition-colors">
                  <Phone size={12} fill="currentColor" /> Call Emergency
                </a>
              </div>
              <ShieldCheck size={80} className="absolute -bottom-4 -right-4 text-white opacity-10 rotate-12 group-hover:scale-110 transition-transform" />
           </div>
        </div>
      </div>

      {/* Selected Detail Modal-Overlay Style */}
      {selected && (
        <div className="mt-8 bg-white rounded-[2.5rem] border-2 border-blue-50 shadow-2xl p-7 animate-fadeInUp relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <button onClick={() => setSelected(null)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-all text-xl font-light">&times;</button>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="relative w-full md:w-64 h-48 rounded-[2rem] overflow-hidden shadow-inner flex-shrink-0">
               <img
                src={selected.image}
                alt={selected.name}
                onError={e => { e.currentTarget.src = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&q=80'; }}
                className="w-full h-full object-cover transition-transform hover:scale-110 duration-700"
              />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
                <Star size={13} className="text-amber-500" fill="currentColor" />
                <span className="text-xs font-black text-slate-800">{selected.rating}</span>
              </div>
            </div>

            <div className="flex-1 w-full">
              <h3 className="text-3xl font-black text-slate-800 mb-2 leading-tight">{selected.name}</h3>
              <div className="flex flex-wrap gap-3 mb-5">
                <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold border border-blue-100">{selected.specialization}</span>
                <span className="bg-slate-50 text-slate-600 px-4 py-1.5 rounded-full text-xs font-bold border border-slate-100">{selected.city}</span>
                <span className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-xs font-bold border border-green-100">
                   <Locate size={12} /> {selected.distance != null ? `${selected.distance.toFixed(1)} km away` : 'Calculating...'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                 <div className="flex items-start gap-3">
                   <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                     <MapPin size={18} />
                   </div>
                   <p className="text-sm text-slate-500 font-medium leading-relaxed">{selected.address}</p>
                 </div>
                 <div className="flex items-start gap-3">
                   <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 flex-shrink-0">
                     <Phone size={18} />
                   </div>
                   <p className="text-sm text-slate-500 font-medium leading-relaxed pt-2">+91 99887 76655<br/><span className="text-[10px] text-slate-400">Emergency Desk</span></p>
                 </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <a 
                  href={selected.wikiUrl || `https://www.google.com/search?q=${encodeURIComponent(selected.name + ' ' + selected.city)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 min-w-[180px] flex items-center justify-center gap-2 bg-blue-600 text-white font-black px-6 py-4 rounded-2xl hover:bg-blue-700 hover:shadow-xl transition-all active:scale-[0.98]"
                >
                  View Full Details <ChevronRight size={18} />
                </a>
                <a
                  href={`https://www.openstreetmap.org/directions?from=${location?.lat},${location?.lng}&to=${selected.lat},${selected.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 bg-slate-100 text-slate-700 font-bold px-6 py-4 rounded-2xl hover:bg-slate-200 transition-all border border-slate-200"
                >
                  <Navigation size={18} /> Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
