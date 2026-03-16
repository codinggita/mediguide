import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import DashboardLayout from './DashboardLayout';
import { useHospital } from '../context/HospitalContext';
import { useGeolocation } from '../hooks/useHooks';
import { MapPin, Navigation, Star, Phone, ChevronRight, Locate } from 'lucide-react';

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
  const { getFilteredHospitals, setSearchQuery, searchQuery } = useHospital();
  const hospitals = getFilteredHospitals();
  const { location, city, loading: locLoading, detectLocation } = useGeolocation();
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

  useEffect(() => { detectLocation(); }, []);
  useEffect(() => {
    if (location) setMapCenter([location.lat, location.lng]);
  }, [location]);

  return (
    <DashboardLayout>
      <div className="mb-5 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 mb-1">Hospital Map</h1>
          <p className="text-slate-500 text-sm flex items-center gap-1.5">
            <MapPin size={13} className="text-blue-500" />
            {city ? `Showing hospitals near ${city}` : 'Detecting your location...'}
          </p>
        </div>
        <button
          onClick={detectLocation}
          disabled={locLoading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-md disabled:opacity-60"
        >
          <Locate size={16} className={locLoading ? 'animate-spin' : ''} />
          {locLoading ? 'Detecting...' : 'Locate Me'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Map */}
        <div className="lg:col-span-2">
          <div className="w-full h-[480px] rounded-3xl overflow-hidden shadow-lg border border-slate-200">
            <MapContainer center={mapCenter} zoom={12} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
              />
              <RecenterMap center={mapCenter} />

              {/* User Marker */}
              {location && (
                <Marker position={[location.lat, location.lng]} icon={userIcon}>
                  <Popup>
                    <div className="text-center">
                      <p className="font-bold text-blue-600">📍 You are here</p>
                      <p className="text-xs text-slate-500">{city}</p>
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* Hospital Markers */}
              {hospitals.map(h => (
                <Marker
                  key={h.id}
                  position={[h.lat, h.lng]}
                  icon={hospitalIcon}
                  eventHandlers={{ click: () => setSelected(h) }}
                >
                  <Popup>
                    <div className="min-w-[200px]">
                      <h3 className="font-bold text-slate-800 mb-1 text-sm">{h.name}</h3>
                      <p className="text-xs text-slate-500 mb-1">{h.specialization}</p>
                      <div className="flex items-center gap-1 text-amber-500 text-xs mb-1">
                        <Star size={11} fill="currentColor" /> <span>{h.rating}</span>
                        <span className="text-slate-400 ml-1">{h.distance} km</span>
                      </div>
                      <p className="text-xs text-blue-600 font-semibold">₹{h.consultationFee} consultation</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-5 mt-3 px-1">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <div className="w-3 h-3 rounded-full bg-blue-600" /> Your Location
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <div className="w-3 h-3 rounded-full bg-red-500" /> Hospitals
            </div>
          </div>
        </div>

        {/* Hospital list panel */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">{hospitals.length} Hospitals</h3>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: '440px' }}>
            {hospitals.map(h => (
              <button
                key={h.id}
                onClick={() => { setSelected(h); setMapCenter([h.lat, h.lng]); }}
                className={`w-full p-4 text-left border-b border-slate-50 hover:bg-blue-50 transition-colors ${selected?.id === h.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 text-sm truncate">{h.name}</p>
                    <p className="text-xs text-slate-500 truncate">{h.specialization} • {h.city}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex items-center gap-1 text-amber-500 text-xs">
                        <Star size={11} fill="currentColor" /> {h.rating}
                      </div>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500">{h.distance.toFixed(1)} km</span>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-slate-300 shrink-0 mt-1" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Hospital Detail */}
      {selected && (
        <div className="mt-5 bg-white rounded-3xl border border-blue-100 shadow-md p-5 animate-fadeInUp">
          <div className="flex items-start gap-4">
            <img
              src={selected.image}
              alt={selected.name}
              onError={e => { e.target.src = 'https://via.placeholder.com/80x80?text=H'; }}
              className="w-20 h-20 rounded-2xl object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{selected.name}</h3>
                  <p className="text-sm text-slate-500 mb-2">{selected.specialization} · {selected.city}</p>
                  <div className="flex flex-wrap gap-3 text-sm">
                    <span className="flex items-center gap-1 text-amber-500">
                      <Star size={14} fill="currentColor" /> {selected.rating} ({selected.reviewCount?.toLocaleString()} reviews)
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Navigation size={13} /> {selected.distance.toFixed(1)} km away
                    </span>
                    <span className="flex items-center gap-1 text-blue-600 font-semibold">
                      ₹{selected.consultationFee} consultation
                    </span>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 text-xl leading-none">&times;</button>
              </div>
              <p className="text-xs text-slate-500 mt-2">{selected.address}</p>
              <div className="flex items-center gap-3 mt-3">
                <a 
                  href={selected.wikiUrl || `https://www.google.com/search?q=${encodeURIComponent(selected.name + ' ' + selected.city)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Explore Hospital <ChevronRight size={13} />
                </a>
                <a
                  href={`https://www.openstreetmap.org/directions?from=${location?.lat},${location?.lng}&to=${selected.lat},${selected.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors border border-blue-100"
                >
                  <Navigation size={13} /> Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
