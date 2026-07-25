import { useTranslation } from 'react-i18next';
import { Building2, Store, Heart, Rocket, MapPin } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const clientIcons = [Building2, Store, Heart, Rocket, MapPin];

export default function Clients() {
  const { t } = useTranslation();
  const items = t('clientTypes', { returnObjects: true });

  return (
    <section
      id="clients"
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
            {t('clientsEyebrow')}
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
            {t('clientsTitle')}
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <p style={{
            margin: '18px 0 0',
            color: 'var(--muted, #6c665e)',
            fontSize: 'clamp(16px, 1.8vw, 19px)',
            lineHeight: 1.6,
            maxWidth: '58ch',
          }}>
            {t('clientsBody')}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div style={{
            marginTop: 'clamp(32px, 5vw, 48px)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: 'clamp(12px, 2vw, 20px)',
            fontSize: 'clamp(16px, 1.8vw, 19px)',
            fontWeight: 600,
            letterSpacing: '-0.01em',
            color: 'var(--fg, #15120f)',
          }}>
            {Array.isArray(items) && items.map((item, i) => {
              const Icon = clientIcons[i] || Building2;
              return (
                <span key={i} style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  <span style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: 'color-mix(in srgb, var(--accent, #0E7A69) 10%, transparent)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 'none',
                  }}>
                    <Icon size={16} color="var(--accent, #0E7A69)" strokeWidth={1.5} />
                  </span>
                  <span>{item}</span>
                </span>
              );
            })}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
