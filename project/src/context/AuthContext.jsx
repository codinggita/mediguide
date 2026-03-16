import { createContext, useContext, useState, useEffect } from 'react';

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

  const login = (userData) => {
    const u = { ...userData, savedHospitals: userData.savedHospitals || [] };
    setUser(u);
    localStorage.setItem('mediguide_user', JSON.stringify(u));
  };

  const signup = (userData) => {
    const u = { ...userData, id: Date.now().toString(), savedHospitals: [], createdAt: new Date().toISOString() };
    setUser(u);
    localStorage.setItem('mediguide_user', JSON.stringify(u));
    // Persist to all-users list
    const existing = JSON.parse(localStorage.getItem('mediguide_users') || '[]');
    existing.push(u);
    localStorage.setItem('mediguide_users', JSON.stringify(existing));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mediguide_user');
  };

  const deleteAccount = () => {
    if (user) {
      // Remove from the all-users registry
      const allUsers = JSON.parse(localStorage.getItem('mediguide_users') || '[]');
      const updated  = allUsers.filter(u => u.id !== user.id && u.email !== user.email);
      localStorage.setItem('mediguide_users', JSON.stringify(updated));
    }
    // Wipe current session and any saved theme / other keys
    localStorage.removeItem('mediguide_user');
    setUser(null);
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('mediguide_user', JSON.stringify(updated));
  };

  const saveHospital = (hospital) => {
    const saved = user.savedHospitals || [];
    const exists = saved.find(h => h.id === hospital.id);
    let updated;
    if (exists) {
      updated = saved.filter(h => h.id !== hospital.id);
    } else {
      updated = [...saved, hospital];
    }
    updateUser({ savedHospitals: updated });
    return !exists;
  };

  const isHospitalSaved = (id) => {
    return (user?.savedHospitals || []).some(h => h.id === id);
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
