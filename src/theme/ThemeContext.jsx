import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Colour values live in index.css (:root / :root[data-theme='dark']), so
// index.html's inline script can set the theme before first paint. This
// module owns the choice — which theme is active — and persists it.
const THEMES = ['light', 'dark'];
const STORAGE_KEY = 'studio-theme';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (THEMES.includes(stored)) return stored;
    } catch {}
    return 'light';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem(STORAGE_KEY, theme); } catch {}
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
