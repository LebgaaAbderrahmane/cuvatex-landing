import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';

export default function Services() {
  const { t } = useTranslation();
  const services = t('services', { returnObjects: true });

  return (
    <section
      id="services"
      style={{
        scrollMarginTop: 80,
        padding: 'clamp(64px, 10vw, 120px) clamp(20px, 5vw, 48px)',
        borderTop: '1px solid var(--line, rgba(21,18,15,0.13))',
      }}
    >
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
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
            {t('nav.services')}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h2 style={{
            fontSize: 'clamp(30px, 5vw, 52px)',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
            margin: '16px 0 0',
            maxWidth: '20ch',
          }}>
            {t('servicesTitle')}
          </h2>
        </ScrollReveal>

        <div style={{
          marginTop: 'clamp(36px, 5vw, 60px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          columnGap: 'clamp(32px, 5vw, 72px)',
        }}>
          {Array.isArray(services) && services.map((s, i) => (
            <ScrollReveal key={s.title} delay={i * 0.05}>
              <motion.div
                style={{
                  display: 'flex',
                  gap: 16,
                  alignItems: 'flex-start',
                  padding: '28px 0',
                  borderTop: '1px solid var(--line, rgba(21,18,15,0.13))',
                }}
                whileHover={{ x: 4 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <span style={{
                  width: 9,
                  height: 9,
                  background: 'var(--accent, #0E7A69)',
                  display: 'inline-block',
                  marginTop: 9,
                  flex: 'none',
                }} />
                <div>
                  <h3 style={{
                    margin: 0,
                    fontSize: 'clamp(19px, 2.3vw, 23px)',
                    fontWeight: 600,
                    letterSpacing: '-0.01em',
                  }}>
                    {s.title}
                  </h3>
                  <p style={{
                    margin: '8px 0 0',
                    color: 'var(--muted, #6c665e)',
                    fontSize: 16,
                    lineHeight: 1.55,
                    maxWidth: '38ch',
                  }}>
                    {s.desc}
                  </p>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
