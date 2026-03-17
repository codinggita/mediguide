import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const HospitalContext = createContext(null);

export function HospitalProvider({ children }) {
  const { user } = useAuth();
  const [hospitals, setHospitals] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ specialization: '', rating: '', cost: '', city: '', userCoords: null });
  const [sortBy, setSortBy] = useState('distance');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);

  const detectLocation = useCallback(async () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${coords.lat}&lon=${coords.lng}&format=json`);
          const data = await res.json();
          const cityStr = data.address?.city || data.address?.town || data.address?.village || data.address?.county || 'Ahmedabad';
          setFilters(prev => ({ ...prev, userCoords: coords, city: cityStr }));
        } catch (_) {
          setFilters(prev => ({ ...prev, userCoords: coords, city: 'Ahmedabad' }));
        }
        setLocating(false);
      },
      () => {
        // Fallback to Ahmedabad if denied
        setFilters(prev => ({ ...prev, userCoords: { lat: 23.0225, lng: 72.5714 }, city: 'Ahmedabad' }));
        setLocating(false);
      }
    );
  }, []);

  // Fetch and Detect on mount
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const res = await axios.get('/api/hospitals');
        setHospitals(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Failed to fetch hospitals:', err);
        setHospitals([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHospitals();
    detectLocation();
  }, [detectLocation]);
  const ITEMS_PER_PAGE = 12;

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
    
    // Clustering logic: Group cities that are close to each other
    const cityClusters = {
      'kalol': ['Kalol', 'Ahmedabad', 'Gandhinagar', 'Kadi'],
      'gandhinagar': ['Kalol', 'Ahmedabad', 'Gandhinagar'],
      'ahmedabad': ['Kalol', 'Ahmedabad', 'Gandhinagar', 'Sanand'],
      'gujarat': ['Kalol', 'Ahmedabad', 'Gandhinagar', 'Surat', 'Vadodara', 'Rajkot'],
      'delhi': ['Delhi', 'Gurugram', 'Noida', 'Faridabad', 'Ghaziabad'],
      'gurugram': ['Delhi', 'Gurugram', 'Noida'],
      'noida': ['Delhi', 'Gurugram', 'Noida'],
      'mumbai': ['Mumbai', 'Thane', 'Navi Mumbai', 'Pune'],
      'pune': ['Pune', 'Mumbai'],
      'karnataka': ['Bangalore', 'Mysore'],
      'bangalore': ['Bangalore'],
    };

    const query = searchQuery.toLowerCase().trim();
    const isSearchAll = query === 'all' || query === 'all hospitals';

    // 1. Strict City/Cluster Filtering
    if (filters.city && !isSearchAll) {
      const targetCity = filters.city.toLowerCase();
      
      // Smart City Matching: Check if city name is part of the user's detected location string
      // e.g. if detected is "Kalol, Gujarat", match with "Kalol" hospitals
      const clusterKey = Object.keys(cityClusters).find(key => targetCity.includes(key));
      const cluster = clusterKey ? cityClusters[clusterKey] : null;

      if (cluster) {
        const lowerCluster = cluster.map(c => c.toLowerCase());
        result = result.filter(h => lowerCluster.includes(h.city.toLowerCase()));
      } else if (targetCity.includes('gujarat')) {
        // Broad Gujarat Fallback
        const gujaratNearby = ['kalol', 'ahmedabad', 'gandhinagar'];
        result = result.filter(h => gujaratNearby.includes(h.city.toLowerCase()));
      } else {
        // Fallback: Check if hospital city name exists anywhere inside the search query or detected city
        result = result.filter(h => {
          const hCity = h.city.toLowerCase();
          return targetCity.includes(hCity) || hCity.includes(targetCity);
        });
      }
    }

    // 2. Search Query / Symptom Mapping
    if (query && !isSearchAll) {
      const symptomMap = {
        // General Medicine / Common Illness
        'fever': 'General Medicine',
        'cold': 'General Medicine',
        'cough': 'General Medicine',
        'flu': 'General Medicine',
        'infection': 'General Medicine',
        'viral': 'General Medicine',
        'body pain': 'General Medicine',
        'stomach': 'General Medicine',
        // Cardiology (Heart)
        'heart': 'Cardiology',
        'chest pain': 'Cardiology',
        'cardiac': 'Cardiology',
        'bp': 'Cardiology',
        'blood pressure': 'Cardiology',
        // Neurology (Brain)
        'brain': 'Neurology',
        'head': 'Neurology',
        'headache': 'Neurology',
        'nerve': 'Neurology',
        'stroke': 'Neurology',
        // Orthopedics (Bones)
        'bone': 'Orthopedics',
        'joint': 'Orthopedics',
        'knee': 'Orthopedics',
        'leg pain': 'Orthopedics',
        // Pediatrics (Kids)
        'child': 'Pediatrics',
        'kids': 'Pediatrics',
        'baby': 'Pediatrics',
        'infant': 'Pediatrics',
        'newborn': 'Pediatrics',
        // Dermatology (Skin)
        'skin': 'Dermatology',
        'acne': 'Dermatology',
        // Oncology (Cancer)
        'cancer': 'Cancer Care',
        'tumor': 'Cancer Care',
        'chemo': 'Cancer Care',
        // Ophthalmology (Eyes)
        'eye': 'Ophthalmology',
        'vision': 'Ophthalmology',
        'glasses': 'Ophthalmology',
        // Dentistry (Teeth)
        'gum': 'Dentistry',
        // Pulmonology (Lungs)
        'breath': 'Pulmonology',
        'lung': 'Pulmonology',
        'asthma': 'Pulmonology',
        // ENT
        'ear': 'ENT',
        'nose': 'ENT',
        'throat': 'ENT',
        'ent': 'ENT',
        // Gynecology (Women)
        'women': 'Gynecology',
        'female': 'Gynecology',
        'pregnancy': 'Gynecology',
        'maternity': 'Gynecology',
        // Nephrology (Kidney)
        'kidney': 'Nephrology',
        'dialysis': 'Nephrology',
        'urine': 'Nephrology',
        // Gastro
        'stomach pain': 'Gastroenterology',
        'digestion': 'Gastroenterology',
        'liver': 'Gastroenterology',
        // New specific mappings
        'diabetes': 'Diabetology',
        'diabetic': 'Diabetology',
        'sugar': 'Diabetology',
        'tooth': 'Dentistry',
        'teeth': 'Dentistry',
        'dental': 'Dentistry',
        'oral': 'Dentistry',
        'skin allergy': 'Dermatology & Skin Allergy',
        'allergy': 'Dermatology & Skin Allergy',
        'rash': 'Dermatology & Skin Allergy',
        'itching': 'Dermatology & Skin Allergy',
        'joint pain': 'Physiotherapy & Joint Pain',
        'knee pain': 'Physiotherapy & Joint Pain',
        'back pain': 'Physiotherapy & Joint Pain',
        'fracture': 'Orthopedics',
        // Multi-specialty
        'multi': 'Multi-Specialty',
        'multispecialist': 'Multi-Specialty',
        'multispecialty': 'Multi-Specialty',
        'multi-specialty': 'Multi-Specialty',
        'multi specialty': 'Multi-Specialty'
      };

      // Smarter Search: Check if any symptom key exists within the query
      let mappedSpec = null;
      for (const [symptom, spec] of Object.entries(symptomMap)) {
        if (query.includes(symptom.toLowerCase())) {
          mappedSpec = spec;
          break;
        }
      }

      result = result.filter(h =>
        h.name.toLowerCase().includes(query) ||
        h.specialization.toLowerCase().includes(query) ||
        (mappedSpec && h.specialization.toLowerCase() === mappedSpec.toLowerCase())
      );

      // If search returns 0 but we have a symptom match, show all hospitals for that symptom in the cluster
      // (Bypassing any other restrictive search filters)
      if (result.length === 0 && mappedSpec) {
        result = hospitals.filter(h => h.specialization.toLowerCase() === mappedSpec.toLowerCase());
        // Still apply city filter if active
        if (filters.city) {
          const targetCity = filters.city.toLowerCase();
          const clusterKey = Object.keys(cityClusters).find(key => targetCity.includes(key));
          const cluster = clusterKey ? cityClusters[clusterKey] : null;
          
          if (cluster) {
            const lowerCluster = cluster.map(c => c.toLowerCase());
            result = result.filter(h => lowerCluster.includes(h.city.toLowerCase()));
          } else if (targetCity.includes('gujarat')) {
            const gujaratNearby = ['kalol', 'ahmedabad', 'gandhinagar'];
            result = result.filter(h => gujaratNearby.includes(h.city.toLowerCase()));
          } else {
            result = result.filter(h => {
              const hCity = h.city.toLowerCase();
              return targetCity.includes(hCity) || hCity.includes(targetCity);
            });
          }
        }
      }
    }
    
    // 3. Additional Hard Filters
    // Note: If a symptom was mapped (like 'fever'), we skip the specialization filter 
    // to prevent conflicting '0 results' scenarios.
    const isSymptomSearch = searchQuery && !["all", "all hospitals"].includes(searchQuery.toLowerCase().trim());

    if (filters.specialization && !isSymptomSearch) {
      result = result.filter(h => h.specialization === filters.specialization);
    }
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
      hospitals, loading, locating, detectLocation, searchQuery, setSearchQuery, filters, setFilters,
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
