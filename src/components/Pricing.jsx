import { useTranslation } from 'react-i18next';
import ScrollReveal from './ScrollReveal';

export default function Pricing() {
  const { t } = useTranslation();

  return (
    <section
      id="pricing"
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
            {t('pricingEyebrow')}
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
            {t('pricingTitle')}
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
            {t('pricingBody')}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
