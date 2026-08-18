import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router';
import { EASE } from '../lib/motion';
import { isCurrentSection } from '../lib/nav';

// Two exports, not one component: the button sits in the header's control
// cluster, the panel is a sibling of the whole bar so it can overlay the page.
// Open/closed state stays in Header, which also closes the panel on resize.

const buttonStyle = {
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
};

/** The burger, which morphs into an X while the panel is open. */
export function MobileMenuButton({ open, onToggle }) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      whileTap={{ scale: 0.9 }}
      className="focus-ring"
      aria-label={open ? 'Close menu' : 'Open menu'}
      aria-expanded={open}
      aria-controls="mobile-nav"
      style={buttonStyle}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" aria-hidden="true">
        <motion.line x1="3" y1="6" x2="17" y2="6" animate={{ y: open ? 4 : 0, rotate: open ? 45 : 0 }} style={{ transformOrigin: '10px 6px' }} transition={{ duration: 0.2 }} />
        <motion.line x1="3" y1="14" x2="17" y2="14" animate={{ y: open ? -4 : 0, rotate: open ? -45 : 0 }} style={{ transformOrigin: '10px 14px' }} transition={{ duration: 0.2 }} />
      </svg>
    </motion.button>
  );
}

// The drop-down panel of nav links. Scroll/focus handling lives in
// ScrollManager, so this only needs to close itself on click.
export function MobileMenuPanel({ open, sections, linkStyle, onClose }) {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  return (
    <AnimatePresence>
      {open && (
        <motion.nav
          id="mobile-nav"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE }}
          style={{
            position: 'absolute', // overlay, not in-flow — in-flow would shift page height on close
            top: '100%',
            insetInline: 0,
            overflow: 'hidden',
            background: 'var(--bg, #f6f5f2)',
            borderBottom: '1px solid var(--line, rgba(21,18,15,0.13))',
            boxShadow: '0 8px 20px rgba(0,0,0,0.10)',
          }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '8px clamp(20px, 5vw, 48px) 16px',
          }}>
            {sections.map(section => {
              const current = isCurrentSection(section.to, pathname);
              return (
                <Link
                  key={section.key}
                  to={section.to}
                  className="focus-ring"
                  onClick={onClose}
                  aria-current={current ? 'page' : undefined}
                  style={{
                    ...linkStyle,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    fontSize: 17,
                    padding: '15px 0', // grows tap target well past the 17px word
                    borderBottom: '1px solid var(--line, rgba(21,18,15,0.13))',
                    color: current ? 'var(--accent, #0E7A69)' : linkStyle.color,
                  }}
                >
                  {current && (
                    <span
                      aria-hidden="true"
                      style={{
                        width: 7,
                        height: 7,
                        flex: 'none',
                        background: 'var(--accent, #0E7A69)',
                      }}
                    />
                  )}
                  {t(`nav.${section.key}`)}
                </Link>
              );
            })}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
