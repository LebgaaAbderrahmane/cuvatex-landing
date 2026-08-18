import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router';
import ScrollReveal from './ScrollReveal';
import HeroShowcase from './HeroShowcase';
import HeroBackground from './HeroBackground';
import useMediaQuery from '../hooks/useMediaQuery';
import { dirArrow } from '../lib/text';

// Module scope: `motion.create` inside the component remounts the link every render.
const MotionLink = motion.create(Link);

const MOBILE_QUERY = '(max-width: 767px)'; // must match Header's breakpoint exactly

export default function Hero() {
  const { t, i18n } = useTranslation();
  const reduceMotion = useReducedMotion();
  const isMobile = useMediaQuery(MOBILE_QUERY);

  const handleScrollDown = () => {
    document.getElementById('services')
      ?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  return (
    <section
      style={{
        // Full-screen fold only above mobile — on phone, forcing the stacked
        // text+picture into exactly one screen is what crops the picture.
        minHeight: isMobile ? undefined : 'calc(100dvh - var(--header-h, 73px))',
        display: 'flex',
        flexDirection: 'column',
        padding: '0 clamp(20px, 5vw, 48px)',
        position: 'relative',
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
      }}>
        <div style={{
          display: 'flex',
          gap: 'clamp(40px, 6vw, 80px)',
          alignItems: 'center',
          flexWrap: 'wrap',
          width: '100%',
        }}>
          <div style={{ flex: '1 1 400px' }}>
            <ScrollReveal>
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
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
            <h1 style={{
              fontSize: 'clamp(28px, 4.5vw, 52px)',
                fontWeight: 600,
                letterSpacing: '-0.03em',
                lineHeight: 1.02,
                margin: '22px 0 0',
                textWrap: 'balance',
              }}>
                {t('heroTitle')}
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p style={{
                maxWidth: '56ch',
                margin: '30px 0 0',
                color: 'var(--muted, #6c665e)',
                fontSize: 'clamp(16px, 1.8vw, 20px)',
                lineHeight: 1.6,
              }}>
                {t('heroNote')}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div style={{ marginTop: 44 }}>
                <MotionLink
                  to="/contact"
                  className="focus-ring"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 10,
                    background: 'var(--accent, #0E7A69)',
                    color: 'var(--accent-fg, #fff)',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: 16,
                    padding: '15px 28px',
                    borderRadius: 2,
                  }}
                  whileHover={{ opacity: 0.92, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {t('cta')}
                  {/* resolvedLanguage, not language: the latter can be 'ar-DZ'. */}
                  <span aria-hidden="true">{dirArrow(i18n.resolvedLanguage)}</span>
                </MotionLink>
                <p style={{
                  margin: '16px 0 0',
                  fontSize: 14,
                  color: 'var(--muted, #6c665e)',
                  lineHeight: 1.5,
                }}>
                  {t('heroAvailability')}
                </p>
              </div>
            </ScrollReveal>
          </div>

          <div style={{ flex: '1 1 520px', display: 'flex', justifyContent: 'center' }}>
            <HeroShowcase />
          </div>
        </div>
      </div>

      {/* Desktop only — a phone visitor already knows to swipe, and this hero
          stack is tall enough on mobile without a non-essential scroll hint. */}
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
        animate={{ y: [0, 10, 0] }}
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
