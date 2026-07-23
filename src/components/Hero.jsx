import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';

const dirArrow = { en: '\u2192', fr: '\u2192', ar: '\u2190' };

export default function Hero() {
  const { t, i18n } = useTranslation();

  return (
    <section
      id="top"
      style={{
        scrollMarginTop: 90,
        padding: 'clamp(72px, 13vw, 160px) clamp(20px, 5vw, 48px) clamp(56px, 9vw, 120px)',
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
            fontSize: 'clamp(38px, 7.2vw, 88px)',
            fontWeight: 600,
            letterSpacing: '-0.03em',
            lineHeight: 1.02,
            margin: '22px 0 0',
            maxWidth: '17ch',
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
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
