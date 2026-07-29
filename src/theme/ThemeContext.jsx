import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const themes = {
  light: {
    '--bg': '#f6f5f2', '--surface': '#ffffff', '--fg': '#15120f',
    '--muted': '#6c665e', '--line': 'rgba(21,18,15,0.13)',
    '--accent': '#0E7A69', '--accent-fg': '#ffffff',
    '--bg-header': 'rgba(246,245,242,0.82)',
    '--scrim': 'rgba(21,18,15,0.55)',
    '--danger': '#b3261e',
  },
  dark: {
    '--bg': '#131210', '--surface': '#1b1a17', '--fg': '#f3efe8',
    '--muted': '#a39c92', '--line': 'rgba(243,239,232,0.15)',
    '--accent': '#33AC9C', '--accent-fg': '#05231f',
    '--bg-header': 'rgba(19,18,16,0.82)',
    '--scrim': 'rgba(5,4,3,0.72)',
    // Lighter than the light-theme red: #b3261e is unreadable on #131210.
    '--danger': '#f2857c',
  },
};

const ThemeContext = createContext();

function applyThemeVars(theme) {
  const vars = themes[theme] || themes.light;
  const root = document.documentElement;
  for (const [key, val] of Object.entries(vars)) {
    root.style.setProperty(key, val);
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem('studio-theme');
      if (stored === 'dark' || stored === 'light') return stored;
    } catch {}
    return 'light';
  });

  useEffect(() => {
    applyThemeVars(theme);
    try { localStorage.setItem('studio-theme', theme); } catch {}
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
