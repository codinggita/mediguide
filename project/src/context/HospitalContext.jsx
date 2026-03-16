import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { HOSPITALS_DATA } from '../data/hospitals';
import { useAuth } from './AuthContext';

const HospitalContext = createContext(null);

export function HospitalProvider({ children }) {
  const { user } = useAuth();
  const [hospitals, setHospitals] = useState(HOSPITALS_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ specialization: '', rating: '', cost: '', city: '', userCoords: null });
  const [sortBy, setSortBy] = useState('distance');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const ITEMS_PER_PAGE = 6;

  // Haversine distance formula
  const getDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Auto-set the city filter based on the logged-in user's city
  // so they only see nearby hospitals by default.
  useEffect(() => {
    if (user && user.city && !filters.city) {
      setFilters(prev => ({ ...prev, city: user.city }));
    }
  }, [user]);

  const getFilteredHospitals = useCallback(() => {
    let result = hospitals.map(h => {
      // Calculate real distance if we have user coords
      const d = filters.userCoords ? getDistance(filters.userCoords.lat, filters.userCoords.lng, h.lat, h.lng) : null;
      return { ...h, distance: d };
    });
    
    // Clustering logic: if searching in a city, include its neighbors
    const cityClusters = {
      'kalol': ['Kalol', 'Ahmedabad', 'Gandhinagar'],
      'gandhinagar': ['Kalol', 'Ahmedabad', 'Gandhinagar'],
      'ahmedabad': ['Kalol', 'Ahmedabad', 'Gandhinagar'],
      'delhi': ['Delhi', 'Gurugram', 'Noida'],
      'gurugram': ['Delhi', 'Gurugram', 'Noida'],
      'noida': ['Delhi', 'Gurugram', 'Noida'],
    };

    const query = searchQuery.toLowerCase().trim();
    const isSearchAll = query === 'all' || query === 'all hospitals';

    // 1. Strict City/Cluster Filtering
    if (filters.city && !isSearchAll) {
      const targetCity = filters.city.toLowerCase();
      const cluster = cityClusters[targetCity];
      if (cluster) {
        result = result.filter(h => cluster.includes(h.city));
      } else {
        result = result.filter(h => h.city.toLowerCase().includes(targetCity));
      }
    }

    // 2. Search Query / Symptom Mapping
    if (query && !isSearchAll) {
      const symptomMap = {
        'fever': 'General Medicine',
        'chest pain': 'Cardiology',
        'heart': 'Cardiology',
        'brain': 'Neurology',
        'headache': 'Neurology',
        'bone': 'Orthopedics',
        'joint': 'Orthopedics',
        'back pain': 'Orthopedics',
        'cancer': 'Cancer Care',
        'skin': 'Dermatology',
        'eye': 'Ophthalmology',
        'breath': 'Pulmonology',
        'breathlessness': 'Pulmonology',
        'lung': 'Pulmonology',
        'kidney': 'Nephrology',
        'tooth': 'Dentistry',
        'dental': 'Dentistry',
      };

      const mappedSpec = symptomMap[query];

      result = result.filter(h =>
        h.name.toLowerCase().includes(query) ||
        h.specialization.toLowerCase().includes(query) ||
        (mappedSpec && h.specialization === mappedSpec)
      );
    }
    
    // 3. Additional Hard Filters
    if (filters.specialization) result = result.filter(h => h.specialization === filters.specialization);
    if (filters.rating) result = result.filter(h => h.rating >= parseFloat(filters.rating));
    if (filters.cost === 'low') result = result.filter(h => h.consultationFee <= 500);
    if (filters.cost === 'medium') result = result.filter(h => h.consultationFee > 500 && h.consultationFee <= 1000);
    if (filters.cost === 'high') result = result.filter(h => h.consultationFee > 1000);

    result.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'cost') return a.consultationFee - b.consultationFee;
      return (a.distance || 9999) - (b.distance || 9999);
    });
    return result;
  }, [hospitals, searchQuery, filters, sortBy]);

  const getPaginatedHospitals = () => {
    const filtered = getFilteredHospitals();
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return {
      data: filtered.slice(start, start + ITEMS_PER_PAGE),
      total: filtered.length,
      pages: Math.ceil(filtered.length / ITEMS_PER_PAGE),
    };
  };

  const addHospital = (hospital) => {
    const newH = { ...hospital, id: Date.now().toString(), rating: 4.0, distance: 5.0 };
    setHospitals(prev => [newH, ...prev]);
  };

  const updateHospital = (id, updates) => {
    setHospitals(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
  };

  const deleteHospital = (id) => {
    setHospitals(prev => prev.filter(h => h.id !== id));
  };

  const getHospitalById = (id) => hospitals.find(h => h.id === id);

  return (
    <HospitalContext.Provider value={{
      hospitals, loading, searchQuery, setSearchQuery, filters, setFilters,
      sortBy, setSortBy, currentPage, setCurrentPage, ITEMS_PER_PAGE,
      getFilteredHospitals, getPaginatedHospitals,
      addHospital, updateHospital, deleteHospital, getHospitalById,
    }}>
      {children}
    </HospitalContext.Provider>
  );
}

export const useHospital = () => {
  const ctx = useContext(HospitalContext);
  if (!ctx) throw new Error('useHospital must be inside HospitalProvider');
  return ctx;
};
