import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const langs = ['en', 'fr', 'ar'];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // resolvedLanguage is always a supported code; `language` can still be region-coded.
  const resolved = i18n.resolvedLanguage;
  const current = resolved && langs.includes(resolved) ? resolved : 'en';

  useEffect(() => {
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  useEffect(() => {
    function handle(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    if (open) document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [open]);

  function setLang(code) {
    i18n.changeLanguage(code);
    document.documentElement.setAttribute('lang', code);
    document.documentElement.setAttribute('dir', code === 'ar' ? 'rtl' : 'ltr');
    setOpen(false);
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <motion.button
        type="button"
        onClick={() => setOpen(o => !o)}
        whileTap={{ scale: 0.9 }}
        className="focus-ring"
        aria-label="Switch language"
        aria-expanded={open}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          // 44x44 minimum touch target — matches the theme toggle beside it.
          width: 44,
          height: 44,
          border: '1px solid var(--line, rgba(21,18,15,0.13))',
          background: 'transparent',
          color: 'var(--fg, #15120f)',
          borderRadius: 2,
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: '0.03em',
          padding: '0 8px',
        }}
      >
        {current.toUpperCase()}
        <motion.svg
          width="10" height="10"
          viewBox="0 0 10 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          aria-hidden="true"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.15 }}
          style={{ marginTop: 1 }}
        >
          <path d="M2 3.5 L5 6.5 L8 3.5" />
        </motion.svg>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            style={{
              position: 'absolute',
              insetInlineStart: 0,
              top: '100%',
              marginTop: 4,
              minWidth: 44,
              background: 'var(--surface, #fff)',
              border: '1px solid var(--line, rgba(21,18,15,0.13))',
              borderRadius: 4,
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              zIndex: 60,
              overflow: 'hidden',
            }}
          >
            {langs.map(code => {
              const active = code === current;
              return (
                <button
                  key={code}
                  type="button"
                  // Inset ring: the dropdown clips overflow, so an offset ring
                  // would be cut off on the top and bottom options.
                  className="focus-ring-inset"
                  onClick={() => setLang(code)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    width: '100%',
                    // 13px text ≈ 20px line box, so 12px block padding clears 44px.
                    padding: '12px 14px',
                    border: 'none',
                    background: 'transparent',
                    color: active ? 'var(--accent, #0E7A69)' : 'var(--muted, #6c665e)',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: 13,
                    fontWeight: 600,
                    letterSpacing: '0.03em',
                    textAlign: 'start',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => { if (!active) e.target.style.background = 'var(--line, rgba(21,18,15,0.06))'; }}
                  onMouseLeave={e => e.target.style.background = 'transparent'}
                >
                  {active && (
                    <span style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: 'var(--accent, #0E7A69)',
                      flex: 'none',
                    }} />
                  )}
                  <span style={{ flex: 1 }}>{code.toUpperCase()}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
