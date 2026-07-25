import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeContext';
import { motion } from 'framer-motion';

const langs = ['en', 'fr', 'ar'];

export default function Header() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  function setLang(code) {
    i18n.changeLanguage(code);
    document.documentElement.setAttribute('lang', code);
    document.documentElement.setAttribute('dir', code === 'ar' ? 'rtl' : 'ltr');
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'var(--bg-header, rgba(246,245,242,0.82))',
        backdropFilter: 'saturate(1.1) blur(8px)',
        WebkitBackdropFilter: 'saturate(1.1) blur(8px)',
        borderBottom: '1px solid var(--line, rgba(21,18,15,0.13))',
      }}
    >
      <div style={{
        maxWidth: 1160,
        margin: '0 auto',
        padding: '14px clamp(20px, 5vw, 48px)',
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        flexWrap: 'wrap',
      }}>
        <a
          href="#top"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            textDecoration: 'none',
            color: 'var(--fg, #15120f)',
            fontWeight: 700,
            letterSpacing: '-0.01em',
            fontSize: 18,
            marginInlineEnd: 'auto',
          }}
        >
          <img
            src="/Cuvatex_logo.png"
            alt="CUVATEX"
            style={{ height: 28, width: 'auto', display: 'block' }}
          />
          CUVATEX
        </a>

        <nav style={{
          display: 'flex',
          gap: 22,
          flexWrap: 'wrap',
          alignItems: 'center',
          fontSize: 15,
        }}>
          {['services', 'process', 'work', 'team', 'faq', 'contact'].map(section => (
            <a
              key={section}
              href={`#${section}`}
              style={{
                textDecoration: 'none',
                color: 'var(--muted, #6c665e)',
                fontWeight: 500,
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.target.style.color = 'var(--fg, #15120f)'}
              onMouseLeave={e => e.target.style.color = 'var(--muted, #6c665e)'}
            >
              {t(`nav.${section}`)}
            </a>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div role="group" aria-label="Language" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {langs.map(code => {
              const active = i18n.language === code || (!i18n.language && code === 'en');
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  aria-label={code.toUpperCase()}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px 5px',
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: '0.03em',
                    color: active ? 'var(--accent, #0E7A69)' : 'var(--muted, #6c665e)',
                    borderBottom: active ? '2px solid var(--accent, #0E7A69)' : '2px solid transparent',
                    borderRadius: 0,
                    fontFamily: 'inherit',
                  }}
                >
                  {code.toUpperCase()}
                </button>
              );
            })}
          </div>

          <motion.button
            type="button"
            onClick={toggleTheme}
            whileTap={{ scale: 0.9 }}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 38,
              height: 38,
              border: '1px solid var(--line, rgba(21,18,15,0.13))',
              background: 'transparent',
              color: 'var(--fg, #15120f)',
              borderRadius: 2,
              cursor: 'pointer',
            }}
          >
            {theme === 'dark' ? (
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
        </div>
      </div>
    </motion.header>
  );
}
