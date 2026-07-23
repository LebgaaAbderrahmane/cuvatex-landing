import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';

export default function About() {
  const { t } = useTranslation();

  return (
    <section
      id="about"
      style={{
        scrollMarginTop: 80,
        padding: 'clamp(64px, 10vw, 120px) clamp(20px, 5vw, 48px)',
        background: 'var(--surface, #fff)',
        borderTop: '1px solid var(--line, rgba(21,18,15,0.13))',
      }}
    >
      <div style={{
        maxWidth: 1160,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 'clamp(40px, 6vw, 80px)',
        alignItems: 'center',
      }}>
        <div>
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
              <span style={{ width: 7, height: 7, background: 'var(--accent, #0E7A69)', display: 'inline-block' }} />
              {t('aboutEyebrow')}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h2 style={{
              fontSize: 'clamp(30px, 5vw, 52px)',
              fontWeight: 600,
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
              margin: '16px 0 0',
              maxWidth: '16ch',
            }}>
              {t('aboutTitle')}
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <p style={{
              margin: '24px 0 0',
              color: 'var(--fg, #15120f)',
              fontSize: 'clamp(16px, 1.8vw, 20px)',
              lineHeight: 1.6,
              maxWidth: '58ch',
            }}>
              {t('aboutBody')}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p style={{
              margin: '16px 0 0',
              color: 'var(--muted, #6c665e)',
              fontSize: 'clamp(15px, 1.4vw, 17px)',
              lineHeight: 1.7,
              maxWidth: '58ch',
            }}>
              {t('aboutExtra')}
            </p>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={0.25}>
          <motion.div
            style={{
              aspectRatio: '4/3',
              border: '1px solid var(--line, rgba(21,18,15,0.13))',
              borderRadius: 3,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--bg, #f6f5f2)',
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <svg viewBox="0 0 500 375" style={{ width: '100%', height: '100%' }}>
              <rect width="500" height="375" fill="var(--surface, #fff)" />
              <circle cx="250" cy="160" r="60" fill="var(--accent, #0E7A69)" opacity="0.08" />
              <circle cx="250" cy="160" r="40" fill="var(--accent, #0E7A69)" opacity="0.12" />
              <rect x="170" y="250" width="160" height="8" rx="4" fill="var(--line, rgba(21,18,15,0.13))" />
              <rect x="190" y="270" width="120" height="6" rx="3" fill="var(--line, rgba(21,18,15,0.13))" />
              <rect x="210" y="286" width="80" height="6" rx="3" fill="var(--line, rgba(21,18,15,0.13))" />
              <rect x="120" y="220" width="260" height="1" fill="var(--line, rgba(21,18,15,0.13))" />
              <text
                x="250" y="340"
                textAnchor="middle"
                fill="var(--muted, #6c665e)"
                fontSize="13"
                fontFamily="'IBM Plex Sans', monospace"
                letterSpacing="0.06em"
              >
                {t('photoLabel')}
              </text>
            </svg>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
}
