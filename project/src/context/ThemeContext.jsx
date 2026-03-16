import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    // 1. Check localStorage first (user preference wins)
    const saved = localStorage.getItem('mediguide-theme');
    if (saved === 'dark')  return true;
    if (saved === 'light') return false;
    // 2. Fall back to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('mediguide-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('mediguide-theme', 'light');
    }
  }, [isDark]);

  // Also listen to OS-level preference changes (only when user hasn't overridden)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e) => {
      const saved = localStorage.getItem('mediguide-theme');
      if (!saved) setIsDark(e.matches); // only follow OS if no manual choice
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
