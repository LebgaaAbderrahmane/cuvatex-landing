import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import CtaBanner from '../components/CtaBanner';
import { EASE } from '../lib/motion';

// Own shell instead of ui/Section — same reason as WorkList/NotFound: Section's
// top border would double against the sticky header's. <h1> instead of
// SectionHeader's <h2>, since the story is the whole page here.
export default function AboutPage() {
  const { t } = useTranslation();
  const reduce = useReducedMotion();

  return (
    <>
    <section
      style={{ padding: 'clamp(40px, 7vw, 88px) clamp(20px, 5vw, 48px) clamp(64px, 10vw, 120px)' }}
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
            <span style={{
              width: 7,
              height: 7,
              background: 'var(--accent, #0E7A69)',
              display: 'inline-block',
            }} />
            {t('aboutEyebrow')}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h1 style={{
            fontSize: 'clamp(34px, 7vw, 62px)',
            fontWeight: 600,
            letterSpacing: '-0.03em',
            lineHeight: 1.03,
            margin: '16px 0 0',
            maxWidth: '16ch',
          }}>
            {t('aboutTitle')}
          </h1>
        </ScrollReveal>

        {/* Statement and photo side by side, not stacked. */}
        <div style={{
          marginTop: 'clamp(32px, 5vw, 56px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'clamp(40px, 6vw, 72px)',
          alignItems: 'start', // not 'center' — unequal column heights opened a dead gap above the text
        }}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'stretch' }}>
            <motion.span
              aria-hidden="true"
              initial={{ scaleY: reduce ? 1 : 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: reduce ? 0 : 0.6, ease: EASE }}
              style={{
                width: 3,
                flex: 'none',
                background: 'var(--accent, #0E7A69)',
                transformOrigin: 'top',
              }}
            />
            <motion.p
              initial={{ opacity: 0, y: reduce ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ duration: reduce ? 0 : 0.6, ease: EASE, delay: reduce ? 0 : 0.1 }}
              style={{
                margin: 0,
                fontSize: 'clamp(24px, 3vw, 34px)',
                fontWeight: 600,
                lineHeight: 1.35,
                letterSpacing: '-0.01em',
                color: 'var(--fg, #15120f)',
                maxWidth: '30ch',
              }}
            >
              {t('aboutBody')}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: reduce ? 1 : 1.06 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: reduce ? 0 : 0.7, ease: EASE }}
            whileHover={{ scale: 1.02 }}
            style={{
              maxWidth: 520, // caps growth on wide monitors
              aspectRatio: '4/3', // 4:5 pushed the photo below the fold on open
              border: '1px solid var(--line, rgba(21,18,15,0.13))',
              borderRadius: 3,
              overflow: 'hidden',
            }}
          >
            <img
              src="/whoWeAre.jpg"
              alt="CUVATEX team workspace"
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </motion.div>
        </div>

        <ScrollReveal delay={0.1}>
          <p style={{
            margin: 'clamp(40px, 6vw, 56px) 0 0',
            maxWidth: '58ch',
            color: 'var(--muted, #6c665e)',
            fontSize: 'clamp(16px, 1.8vw, 19px)',
            lineHeight: 1.7,
          }}>
            {t('aboutExtra')}
          </p>
        </ScrollReveal>
      </div>
    </section>

    <CtaBanner />
    </>
  );
}
