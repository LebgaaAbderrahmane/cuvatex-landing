import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';
import { MobileMenuButton, MobileMenuPanel } from './MobileMenu';
import useMediaQuery from '../hooks/useMediaQuery';

// Drives both the desktop nav and the mobile panel. Each entry needs a matching
// section `id` in App.jsx and a `nav.<key>` label in all three locale files.
const sections = ['services', 'process', 'work', 'pricing', 'team', 'faq', 'contact'];

// Below this width the six nav links wrap onto extra rows and push the sticky
// header to ~200px, so they move behind a toggle instead.
const MOBILE_QUERY = '(max-width: 767px)';

const linkStyle = {
  textDecoration: 'none',
  color: 'var(--muted, #6c665e)',
  fontWeight: 500,
  transition: 'color 0.2s',
};

export default function Header() {
  const { t } = useTranslation();
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const [menuOpen, setMenuOpen] = useState(false);
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
          <ThemeToggle />
          {isMobile && (
            <MobileMenuButton
              open={menuOpen}
              onToggle={() => setMenuOpen(o => !o)}
            />
          )}
        </div>
      </div>

      <MobileMenuPanel
        open={isMobile && menuOpen}
        sections={sections}
        linkStyle={linkStyle}
        onClose={() => setMenuOpen(false)}
      />
    </motion.header>
  );
}
