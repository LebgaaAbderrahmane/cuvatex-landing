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
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <img
              src="/whoWeAre.jpg"
              alt="CUVATEX team workspace"
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
}
