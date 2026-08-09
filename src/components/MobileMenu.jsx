import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { EASE } from '../lib/motion';

// Two exports rather than one component, because the trigger and the panel sit
// in different parents inside the header — the button is in the right-hand
// control cluster, the panel is a sibling of the whole bar so it can overlay the
// page. Wrapping both in one component would mean moving the button's DOM
// position, which changes the layout it was tuned against.
//
// The open/closed state stays in Header: it also closes the panel when the
// viewport grows past the breakpoint, which is a header-level concern.

const buttonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  // 44px is the minimum comfortable touch target; the header height is
  // measured and published as `--header-h`, so growing this is safe.
  width: 44,
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

/** The drop-down panel of nav links. */
export function MobileMenuPanel({ open, sections, linkStyle, onClose }) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();

  // Closing the panel tears down the clicked <a> in the same task the browser is
  // asked to smooth-scroll, and the scroll is dropped before its first frame —
  // the page just never moves. Scrolling the target ourselves is not enough on
  // its own: React batches the close and commits after the handler returns, so a
  // `scrollIntoView` called here is still inside that same task.
  //
  // `requestAnimationFrame` is what actually fixes it — it puts the scroll after
  // React's commit and after AnimatePresence has started the panel's exit, at
  // which point nothing is left to cancel it. Verified by measurement: without
  // the rAF, `scrollY` stays flat at 0 for the full 2.5 s after the click.
  function handleNavClick(e, section) {
    e.preventDefault();
    const el = document.getElementById(section);
    if (!el) return;
    onClose();
    // pushState, not replaceState: keeps the back button working for in-page nav.
    history.pushState(null, '', `#${section}`);
    requestAnimationFrame(() => {
      // Still scroll under reduced motion — only the smoothness is dropped.
      el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

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
            // Overlay, not in-flow: an in-flow panel changes document height,
            // so closing it after an anchor click shifts the whole page up by
            // the panel height and the target heading ends up off-screen.
            position: 'absolute',
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
            {sections.map(section => (
              <a
                key={section}
                href={`#${section}`}
                className="focus-ring"
                onClick={e => handleNavClick(e, section)}
                style={{
                  ...linkStyle,
                  fontSize: 17,
                  padding: '13px 0',
                  borderBottom: '1px solid var(--line, rgba(21,18,15,0.13))',
                }}
              >
                {t(`nav.${section}`)}
              </a>
            ))}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
