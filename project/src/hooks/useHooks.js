import { useState, useEffect, useRef } from 'react';

export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export function useGeolocation() {
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported by your browser.');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocation(coords);
        // Reverse geocode using Nominatim (OpenStreetMap)
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${coords.lat}&lon=${coords.lng}&format=json`
          );
          const data = await res.json();
          const c =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.county ||
            'Your Location';
          setCity(c);
        } catch (_) {
          setCity('Your Location');
        }
        setLoading(false);
      },
      (err) => {
        setError('Location access denied. Using default location.');
        // Default to Ahmedabad
        setLocation({ lat: 23.0225, lng: 72.5714 });
        setCity('Ahmedabad');
        setLoading(false);
      }
    );
  };

  return { location, city, error, loading, detectLocation };
}
