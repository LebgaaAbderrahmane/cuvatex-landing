import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';
import HeroShowcase from './HeroShowcase';
import HeroBackground from './HeroBackground';

const dirArrow = { en: '\u2192', fr: '\u2192', ar: '\u2190' };

export default function Hero() {
  const { t, i18n } = useTranslation();

  const handleScrollDown = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="top"
      style={{
        scrollMarginTop: 0,
        minHeight: 'calc(100dvh - 56px)',
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
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
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
                <motion.a
                  href="#contact"
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
                  <span aria-hidden="true">{dirArrow[i18n.language] || '\u2192'}</span>
                </motion.a>
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

      <motion.button
        onClick={handleScrollDown}
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
    </section>
  );
}
