import { useTranslation } from 'react-i18next';
import ScrollReveal from './ScrollReveal';

export default function Testimonials() {
  const { t } = useTranslation();
  const items = t('testimonials', { returnObjects: true });

  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <section
      id="testimonials"
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
        display: 'flex',
        flexDirection: 'column',
        gap: 'clamp(48px, 8vw, 88px)',
      }}>
        {items.map((item, i) => (
          <figure key={i} style={{ margin: 0 }}>
            <ScrollReveal>
              <blockquote style={{
                margin: 0,
                fontSize: 'clamp(24px, 4vw, 40px)',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                color: 'var(--fg, #15120f)',
                maxWidth: '24ch',
              }}>
                {item.quote}
              </blockquote>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <figcaption style={{
                marginTop: 'clamp(20px, 3vw, 28px)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontSize: 15,
                color: 'var(--muted, #6c665e)',
              }}>
                <span style={{ width: 7, height: 7, background: 'var(--accent, #0E7A69)', display: 'inline-block', flex: 'none' }} />
                <span>
                  <span style={{ color: 'var(--fg, #15120f)', fontWeight: 600 }}>{item.name}</span>
                  {', '}
                  {item.business}
                </span>
              </figcaption>
            </ScrollReveal>
          </figure>
        ))}
      </div>
    </section>
  );
}
