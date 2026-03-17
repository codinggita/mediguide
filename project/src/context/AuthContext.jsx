import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('mediguide_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch (_) {}
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      setUser(res.data.user);
      localStorage.setItem('mediguide_token', res.data.token);
      localStorage.setItem('mediguide_user', JSON.stringify(res.data.user));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Login failed' };
    }
  };

  const signup = async (userData) => {
    try {
      const res = await axios.post('/api/auth/signup', userData);
      setUser(res.data.user);
      localStorage.setItem('mediguide_token', res.data.token);
      localStorage.setItem('mediguide_user', JSON.stringify(res.data.user));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Signup failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mediguide_user');
  };

  const deleteAccount = async () => {
    if (user) {
      try {
        await axios.delete(`/api/user/${user.id || user._id}`);
      } catch (e) {
        console.error("Failed to delete user from db", e);
      }
    }
    localStorage.removeItem('mediguide_token');
    localStorage.removeItem('mediguide_user');
    setUser(null);
  };

  const updateUser = async (updates) => {
    try {
      if (user) {
        const res = await axios.put(`/api/user/${user.id || user._id}`, updates);
        if (res.data.success) {
          const updated = { ...user, ...updates };
          setUser(updated);
          localStorage.setItem('mediguide_user', JSON.stringify(updated));
        }
      }
    } catch(e) {
      console.error("Failed to update user in db", e);
    }
  };

  const saveHospital = async (hospital) => {
    try {
      const res = await axios.post('/api/user/save-hospital', { 
        userId: user.id || user._id, 
        hospitalId: hospital.id 
      });
      const updated = { ...user, savedHospitals: res.data.savedHospitals };
      setUser(updated);
      localStorage.setItem('mediguide_user', JSON.stringify(updated));
      return true;
    } catch (err) {
      console.error('Save failed:', err);
      return false;
    }
  };

  const isHospitalSaved = (id) => {
    if (!user || !user.savedHospitals) return false;
    return user.savedHospitals.includes(String(id));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, deleteAccount, updateUser, saveHospital, isHospitalSaved }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
