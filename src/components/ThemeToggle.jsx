import { motion } from 'framer-motion';
import { useTheme } from '../theme/ThemeContext';

// Drawn inline, not lucide-react — the moon crescent needs the header bg token.

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === 'dark';

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      whileTap={{ scale: 0.9 }}
      className="focus-ring"
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 44, // minimum comfortable touch target
        height: 44,
        border: '1px solid var(--line, rgba(21,18,15,0.13))',
        background: 'transparent',
        color: 'var(--fg, #15120f)',
        borderRadius: 2,
        cursor: 'pointer',
      }}
    >
      {dark ? (
        <svg width="18" height="18" viewBox="0 0 18 18" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" aria-hidden="true">
          <circle cx="9" cy="9" r="3.3" />
          <line x1="9" y1="1.2" x2="9" y2="3" />
          <line x1="9" y1="15" x2="9" y2="16.8" />
          <line x1="1.2" y1="9" x2="3" y2="9" />
          <line x1="15" y1="9" x2="16.8" y2="9" />
          <line x1="3.5" y1="3.5" x2="4.8" y2="4.8" />
          <line x1="13.2" y1="13.2" x2="14.5" y2="14.5" />
          <line x1="3.5" y1="14.5" x2="4.8" y2="13.2" />
          <line x1="13.2" y1="4.8" x2="14.5" y2="3.5" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <circle cx="9" cy="9" r="7" fill="currentColor" />
          <circle cx="12.4" cy="6.6" r="6" fill="var(--bg-header, #f6f5f2)" />
        </svg>
      )}
    </motion.button>
  );
}
