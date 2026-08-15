import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// The colour values themselves live in `src/index.css` under `:root` and
// `:root[data-theme='dark']`. Keeping them in CSS is what lets the inline script
// in index.html pick the right theme before the first paint — it only has to set
// one attribute, with no colours duplicated into the HTML. This module owns the
// *choice*: which theme is active, and persisting it.
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
