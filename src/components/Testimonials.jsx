import { useTranslation } from 'react-i18next';
import ScrollReveal from './ScrollReveal';
import Section from './ui/Section';
import SectionHeader from './ui/SectionHeader';
import { getInitials } from '../lib/text';

export default function Testimonials() {
  const { t } = useTranslation();
  const items = t('testimonials', { returnObjects: true });

  if (!Array.isArray(items) || items.length === 0) return null;

  return (
    <Section
      id="testimonials"
      paddingBlockMax="120px"
      background="var(--surface, #fff)"
      containerStyle={null}
    >
      <SectionHeader
        eyebrow={t('testimonialsEyebrow')}
        title={t('testimonialsTitle')}
        titleMaxWidth="20ch"
      />

      <div style={{
        marginTop: 'clamp(36px, 5vw, 56px)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: 'clamp(20px, 2.5vw, 32px)',
      }}>
        {items.map((item, i) => (
          <ScrollReveal key={i} delay={i * 0.08} style={{ height: '100%' }}>
            <TestimonialCard item={item} t={t} />
          </ScrollReveal>
        ))}
      </div>
    </Section>
  );
}

function TestimonialCard({ item, t }) {
  const attribution = [item.role, item.business].filter(Boolean).join(', ');

  return (
    <figure
      style={{
        margin: 0,
        height: '100%',
        border: '1px solid var(--line, rgba(21,18,15,0.13))',
        borderRadius: 3,
        padding: 'clamp(28px, 3.5vw, 44px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 20,
      }}
    >
      <blockquote
        style={{
          margin: 0,
          fontSize: 'clamp(18px, 2.6vw, 26px)',
          lineHeight: 1.5,
          fontWeight: 500,
          color: 'var(--fg, #15120f)',
        }}
      >
        {item.quote}
      </blockquote>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {item.rating > 0 && (
          <div
            role="img"
            aria-label={t('testimonialsRating', { rating: item.rating })}
            style={{ display: 'flex', gap: 4, color: 'var(--accent, #0E7A69)', fontSize: 14 }}
          >
            {Array.from({ length: item.rating }, (_, i) => (
              <span key={i} aria-hidden="true">★</span>
            ))}
          </div>
        )}

        <figcaption style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'color-mix(in srgb, var(--accent, #0E7A69) 10%, transparent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 'none',
          }}>
            <span style={{
              color: 'var(--accent, #0E7A69)',
              fontSize: 13,
              fontWeight: 600,
            }}>
              {getInitials(item.name)}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--fg, #15120f)' }}>
              {item.name}
            </span>
            {attribution && (
              <span style={{ fontSize: 12, color: 'var(--muted, #6c665e)' }}>
                {attribution}
              </span>
            )}
          </div>
        </figcaption>
      </div>
    </figure>
  );
}
