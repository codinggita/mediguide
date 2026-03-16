import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { HospitalProvider } from './context/HospitalContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/common/ProtectedRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import HospitalsPage from './pages/HospitalsPage';
import MapPage from './pages/MapPage';
import SavedPage from './pages/SavedPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

import { LanguageProvider } from './context/LanguageContext';

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <AuthProvider>
            <HospitalProvider>
              <Routes>
                {/* Public */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                {/* Protected */}
                <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                <Route path="/hospitals" element={<ProtectedRoute><HospitalsPage /></ProtectedRoute>} />
                <Route path="/maps" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
                <Route path="/map" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
                <Route path="/profile/maps" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
                <Route path="/saved" element={<ProtectedRoute><SavedPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

                {/* 404 */}
                <Route path="*" element={
                  <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
                    <div className="text-8xl font-black text-slate-200">404</div>
                    <h2 className="text-2xl font-bold text-slate-700">Page Not Found</h2>
                    <a href="/" className="btn-primary">Go Home</a>
                  </div>
                } />
              </Routes>
            </HospitalProvider>
          </AuthProvider>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider> 
  );
}
