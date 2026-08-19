import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router';
import HeroShowcase from './HeroShowcase';
import HeroBackground from './HeroBackground';
import useMediaQuery from '../hooks/useMediaQuery';
import { dirArrow } from '../lib/text';
import { HERO_EASE } from '../lib/motion';
import { WHATSAPP_URL } from '../lib/contact';
import { track } from '../analytics';

// Module scope: `motion.create` inside the component remounts the link every render.
const MotionLink = motion.create(Link);

const MOBILE_QUERY = '(max-width: 767px)'; // must match Header's breakpoint exactly

// The copy is being rewritten. Swapping the hero headline means changing this
// one key (and the matching entry in all three locale files) — nothing else.
const HEADLINE_KEY = 'heroTitle';

// Entrance: kicker + headline, then subtitle, then the buttons. Three steps of
// 80 ms with a 400 ms fade means the last one lands at 560 ms — the whole hero
// is settled before anyone can read it.
const ENTER_DURATION = 0.4;
const ENTER_STAGGER = 0.08;

/**
 * One step of the on-load entrance. `initial={false}` under reduced motion, not
 * a zero duration: MotionConfig's reducedMotion="user" does not gate opacity, so
 * an opacity-0 initial state would otherwise leave the headline invisible.
 */
function Enter({ step, reduce, style, children }) {
  return (
    <motion.div
      style={style}
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: ENTER_DURATION, delay: step * ENTER_STAGGER, ease: HERO_EASE }}
    >
      {children}
    </motion.div>
  );
}

// Sized to the label, not larger — it names the channel, it isn't the button.
function WhatsAppIcon() {
  return (
    <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="currentColor" style={{ flex: 'none' }}>
      <path d="M12.04 2.02c-5.46 0-9.9 4.44-9.9 9.9 0 1.74.45 3.44 1.32 4.94L2.06 22l5.28-1.38a9.9 9.9 0 0 0 4.7 1.2h.01c5.45 0 9.9-4.44 9.9-9.9a9.84 9.84 0 0 0-2.9-7A9.84 9.84 0 0 0 12.04 2Zm0 18.13a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.37 8.24 8.24 0 0 1 14.07-5.82 8.18 8.18 0 0 1 2.42 5.82 8.24 8.24 0 0 1-8.24 8.23Zm4.52-6.16c-.25-.13-1.47-.73-1.69-.81-.23-.09-.39-.13-.56.12-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.38-1.99-1.23-.74-.65-1.23-1.46-1.38-1.71-.14-.25-.01-.39.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.84-.2-.48-.4-.42-.55-.43h-.48c-.16 0-.43.06-.66.31-.22.25-.86.85-.86 2.06s.89 2.38 1.01 2.55c.13.16 1.75 2.67 4.24 3.74.59.25 1.05.4 1.41.52.59.19 1.13.16 1.55.1.48-.07 1.47-.6 1.68-1.19.21-.58.21-1.08.15-1.18-.06-.11-.23-.17-.48-.29Z" />
    </svg>
  );
}

export default function Hero() {
  const { t, i18n } = useTranslation();
  const reduceMotion = useReducedMotion();
  const isMobile = useMediaQuery(MOBILE_QUERY);
  // Same source as dirArrow below, so the glyph and the slide always agree.
  const isRtl = i18n.resolvedLanguage === 'ar';

  const handleScrollDown = () => {
    document.getElementById('services')
      ?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  return (
    <section
      style={{
        // 88dvh minus the sticky header, so the fold is a little short of the
        // screen: the content centres without leaving a dead band above the
        // scroll cue. Full-screen only above mobile — on a phone, forcing the
        // stacked text+picture into one screen is what crops the picture.
        minHeight: isMobile ? undefined : 'calc(88dvh - var(--header-h, 73px))',
        display: 'flex',
        flexDirection: 'column',
        padding: '0 clamp(20px, 5vw, 48px)',
        position: 'relative',
        // Safety net only. The mockups and their badges are sized to stay inside
        // the 1160 container — see HeroShowcase — so nothing should reach this.
        overflow: 'hidden',
      }}
    >
      <HeroBackground />
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: 1160,
        margin: '0 auto',
        width: '100%',
        // On mobile the hero no longer fills the screen, so this content isn't
        // vertically centered anymore — it sits right at the top, flush against
        // the sticky header. This gap replaces the buffer that centering used
        // to give it, so scrolling doesn't slide the headline under the header
        // from the very first pixel.
        paddingTop: isMobile ? 28 : 0,
        paddingBottom: isMobile ? 12 : 0,
      }}>
        <div style={{
          display: 'flex',
          gap: 'clamp(40px, 6vw, 80px)',
          alignItems: 'center',
          flexWrap: 'wrap',
          width: '100%',
        }}>
          <div style={{ flex: '1 1 400px' }}>
            <Enter step={0} reduce={reduceMotion}>
              <p style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                margin: 0,
                fontSize: 13,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--muted, #6c665e)',
                fontWeight: 600,
              }}>
                <motion.span
                  style={{
                    width: 7,
                    height: 7,
                    background: 'var(--accent, #0E7A69)',
                    display: 'inline-block',
                  }}
                  animate={reduceMotion ? { opacity: 1 } : { opacity: [1, 0.3, 1] }} // MotionConfig doesn't gate opacity
                  transition={reduceMotion ? { duration: 0 } : { duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
                {t('heroKicker')}
              </p>
              <h1 style={{
                fontSize: 'clamp(28px, 4.5vw, 52px)',
                fontWeight: 600,
                letterSpacing: '-0.03em',
                lineHeight: 1.02,
                margin: '22px 0 0',
                textWrap: 'balance',
              }}>
                {t(HEADLINE_KEY)}
              </h1>
            </Enter>

            <Enter step={1} reduce={reduceMotion}>
              <p style={{
                maxWidth: '56ch',
                margin: '30px 0 0',
                color: 'var(--muted, #6c665e)',
                fontSize: 'clamp(16px, 1.8vw, 20px)',
                lineHeight: 1.6,
              }}>
                {t('heroNote')}
              </p>
            </Enter>

            <Enter step={2} reduce={reduceMotion} style={{ marginTop: 44 }}>
              <div style={{
                display: 'flex',
                gap: 12,
                // Stacked and full-width on a phone; side by side above it.
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'stretch' : 'center',
                flexWrap: 'wrap',
              }}>
                <MotionLink
                  to="/contact"
                  className="focus-ring"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    background: 'var(--accent, #0E7A69)',
                    color: 'var(--accent-fg, #fff)',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: 16,
                    padding: '15px 28px',
                    borderRadius: 2,
                  }}
                  // A variant *label*, not an object: only a label propagates the
                  // gesture down to the arrow's own `hover` variant.
                  whileHover="hover"
                  variants={{ hover: { opacity: 0.92 } }}
                  whileTap={{ scale: 0.98 }}
                >
                  {t('cta')}
                  <motion.span
                    aria-hidden="true"
                    style={{ display: 'inline-block' }}
                    // Gated by hand: Framer skips the *animation* under reduced
                    // motion but still snaps the value, so the arrow would jump.
                    variants={{ hover: { x: reduceMotion ? 0 : (isRtl ? -4 : 4) } }}
                    transition={{ duration: 0.15, ease: HERO_EASE }}
                  >
                    {/* resolvedLanguage, not language: the latter can be 'ar-DZ'. */}
                    {dirArrow(i18n.resolvedLanguage)}
                  </motion.span>
                </MotionLink>

                {/* Ghost, not a second solid button. The hover wash and the
                    border colour live in index.css's .ghost-btn — a transition
                    on :hover cannot be written inline. */}
                <motion.a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track('whatsapp_click')}
                  className="focus-ring ghost-btn"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 9,
                    // 14px + the .ghost-btn 1px border matches the primary's
                    // 15px of padding, so both buttons are the same height.
                    padding: '14px 27px',
                    borderRadius: 2,
                    color: 'var(--fg, #15120f)',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: 16,
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <WhatsAppIcon />
                  {t('heroWhatsapp')}
                </motion.a>
              </div>
              <p style={{
                margin: '16px 0 0',
                fontSize: 14,
                color: 'var(--muted, #6c665e)',
                lineHeight: 1.5,
              }}>
                {t('heroAvailability')}
              </p>
            </Enter>
          </div>

          <div style={{ flex: '1 1 520px', display: 'flex', justifyContent: 'center' }}>
            <HeroShowcase />
          </div>
        </div>
      </div>

      {/* Desktop only — on a phone this lands on top of the mockup's caption,
          and a phone visitor already knows to swipe. */}
      {!isMobile && (
      <motion.button
        onClick={handleScrollDown}
        className="focus-ring"
        aria-label="Scroll to services"
        style={{
          alignSelf: 'center',
          marginBottom: 32,
          width: 52,
          height: 52,
          borderRadius: '50%',
          border: '1px solid var(--line, rgba(21,18,15,0.13))',
          background: 'var(--bg-header, rgba(246,245,242,0.82))',
          backdropFilter: 'saturate(1.1) blur(8px)',
          cursor: 'pointer',
          color: 'var(--fg, #15120f)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: 0,
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        }}
        animate={{ y: [0, 10, 0] }} // transform-only, so MotionConfig gates it under reduced motion
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ y: 4, borderColor: 'var(--accent, #0E7A69)', color: 'var(--accent, #0E7A69)', boxShadow: '0 4px 20px rgba(14,122,105,0.15)' }}
        whileTap={{ scale: 0.92 }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </motion.button>
      )}
    </section>
  );
}
