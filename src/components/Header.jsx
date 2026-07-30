import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeContext';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import LanguageSwitcher from './LanguageSwitcher';

const sections = ['services', 'process', 'work', 'pricing', 'team', 'faq', 'contact'];

// Below this width the six nav links wrap onto extra rows and push the sticky
// header to ~200px, so they move behind a toggle instead.
const MOBILE_QUERY = '(max-width: 767px)';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    function onChange(e) { setIsMobile(e.matches); }
    mq.addEventListener('change', onChange);
    setIsMobile(mq.matches);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return isMobile;
}

const linkStyle = {
  textDecoration: 'none',
  color: 'var(--muted, #6c665e)',
  fontWeight: 500,
  transition: 'color 0.2s',
};

export default function Header() {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const headerRef = useRef(null);

  // The header is the only element that knows its own height, and four other
  // components need it (hero/clients fold height, sticky offsets in Services and
  // Process). Publishing it as `--header-h` keeps one source of truth instead of
  // the magic `56` / `67` constants that used to drift from reality.
  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const publish = () => {
      const h = el.getBoundingClientRect().height;
      if (h > 0) document.documentElement.style.setProperty('--header-h', `${h}px`);
    };
    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Close the panel when we grow past the breakpoint, otherwise it stays
  // mounted and overlaps the desktop nav.
  useEffect(() => {
    if (!isMobile) setMenuOpen(false);
  }, [isMobile]);

  useEffect(() => {
    if (!menuOpen) return;
    function onKey(e) { if (e.key === 'Escape') setMenuOpen(false); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  // Closing the panel tears down the clicked <a> in the same task the browser is
  // asked to smooth-scroll, and the scroll is dropped before its first frame —
  // the page just never moves. Scrolling the target ourselves is not enough on
  // its own: React batches `setMenuOpen(false)` and commits after the handler
  // returns, so a `scrollIntoView` called here is still inside that same task.
  //
  // `requestAnimationFrame` is what actually fixes it — it puts the scroll after
  // React's commit and after AnimatePresence has started the panel's exit, at
  // which point nothing is left to cancel it. Verified by measurement: without
  // the rAF, `scrollY` stays flat at 0 for the full 2.5 s after the click.
  function handleMobileNavClick(e, section) {
    e.preventDefault();
    const el = document.getElementById(section);
    if (!el) return;
    setMenuOpen(false);
    // pushState, not replaceState: keeps the back button working for in-page nav.
    history.pushState(null, '', `#${section}`);
    requestAnimationFrame(() => {
      // Still scroll under reduced motion — only the smoothness is dropped.
      el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  return (
    <motion.header
      ref={headerRef}
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
        maxWidth: 1220,
        margin: '0 auto',
        padding: '14px clamp(20px, 5vw, 48px)',
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        flexWrap: 'wrap',
      }}>
        <a
          href="#top"
          className="focus-ring"
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

        {/* Nav gap and font-size taper below ~1300px. Seven links at a flat
            `gap: 22` / `fontSize: 15` overflow the bar at 768px and wrap the
            header onto a second row (measured 121px), which would push every
            anchor target under the header. Both clamps sit at their maximum from
            ~1300px up, so the desktop appearance is unchanged. */}
        {!isMobile && (
          <nav style={{
            display: 'flex',
            gap: 'clamp(12px, 1.8vw, 22px)',
            alignItems: 'center',
            fontSize: 'clamp(13px, 1.15vw, 15px)',
          }}>
            {sections.map(section => (
              <a
                key={section}
                href={`#${section}`}
                className="focus-ring"
                style={linkStyle}
                onMouseEnter={e => e.target.style.color = 'var(--fg, #15120f)'}
                onMouseLeave={e => e.target.style.color = 'var(--muted, #6c665e)'}
              >
                {t(`nav.${section}`)}
              </a>
            ))}
          </nav>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <LanguageSwitcher />

          <motion.button
            type="button"
            onClick={toggleTheme}
            whileTap={{ scale: 0.9 }}
            className="focus-ring"
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            style={{
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

          {isMobile && (
            <motion.button
              type="button"
              onClick={() => setMenuOpen(o => !o)}
              whileTap={{ scale: 0.9 }}
              className="focus-ring"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 44,
                height: 44,
                border: '1px solid var(--line, rgba(21,18,15,0.13))',
                background: 'transparent',
                color: 'var(--fg, #15120f)',
                borderRadius: 2,
                cursor: 'pointer',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" aria-hidden="true">
                <motion.line x1="3" y1="6" x2="17" y2="6" animate={{ y: menuOpen ? 4 : 0, rotate: menuOpen ? 45 : 0 }} style={{ transformOrigin: '10px 6px' }} transition={{ duration: 0.2 }} />
                <motion.line x1="3" y1="14" x2="17" y2="14" animate={{ y: menuOpen ? -4 : 0, rotate: menuOpen ? -45 : 0 }} style={{ transformOrigin: '10px 14px' }} transition={{ duration: 0.2 }} />
              </svg>
            </motion.button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isMobile && menuOpen && (
          <motion.nav
            id="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.2, 0.6, 0.2, 1] }}
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
                  onClick={e => handleMobileNavClick(e, section)}
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
    </motion.header>
  );
}
