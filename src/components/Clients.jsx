import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, Store, Heart, Rocket, MapPin } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const clientIcons = [Building2, Store, Heart, Rocket, MapPin];

export default function Clients() {
  const { t } = useTranslation();
  const items = t('clientTypes', { returnObjects: true });
  const stats = t('clientStats', { returnObjects: true });
  const [isPaused, setIsPaused] = useState(false);

  return (
    <section
      id="clients"
      style={{
        scrollMarginTop: 80,
        minHeight: 'calc(100dvh - var(--header-h, 73px))',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 'clamp(40px, 6vw, 80px) clamp(20px, 5vw, 48px)',
        borderTop: '1px solid var(--line, rgba(21,18,15,0.13))',
        background: 'var(--bg)',
      }}
    >
      <div style={{ maxWidth: 1160, margin: '0 auto', width: '100%' }}>
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
          {/* Four stats in one rigid row are wider than a phone: below ~600px they
              pushed past both edges of the document and the whole page scrolled
              sideways. Wrapping keeps every stat readable; ≥768px is unchanged. */}
          <div style={{
            marginTop: 'clamp(40px, 5vw, 60px)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            columnGap: 0,
            rowGap: 'clamp(20px, 3vw, 28px)',
          }}>
            {Array.isArray(stats) && stats.map((stat, i) => (
              <div key={stat.label} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(24px, 4vw, 48px)',
              }}>
                <div style={{ textAlign: 'center', padding: '0 clamp(12px, 3vw, 36px)' }}>
                  {/* `direction: ltr` + `isolate`: "40+" is a number followed by a
                      neutral character, so in an RTL paragraph the bidi algorithm
                      moves the "+" to the other side and it paints as "+40".
                      Isolating the span keeps it reading "40+" in all languages. */}
                  <span style={{
                    display: 'block',
                    fontSize: 'clamp(32px, 4vw, 52px)',
                    fontWeight: 700,
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                    color: 'var(--fg, #15120f)',
                    direction: 'ltr',
                    unicodeBidi: 'isolate',
                  }}>
                    {stat.number}
                  </span>
                  <span style={{
                    display: 'block',
                    marginTop: 6,
                    fontSize: 13,
                    fontWeight: 500,
                    color: 'var(--muted, #6c665e)',
                  }}>
                    {stat.label}
                  </span>
                </div>
                {i < stats.length - 1 && (
                  <span style={{
                    width: 1,
                    height: 48,
                    background: 'var(--line, rgba(21,18,15,0.13))',
                    flex: 'none',
                  }} />
                )}
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>

      <div style={{
        marginTop: 'clamp(32px, 4vw, 48px)',
        overflow: 'hidden',
        maskImage: 'linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)',
      }}>
        {/* The animation itself lives in `.marquee` in index.css. It cannot be an
            inline style: an inline `animation` shorthand outranks any stylesheet
            rule, so neither the RTL direction flip nor the reduced-motion
            `animation: none` could override it from there. */}
        <div
          className="marquee"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          style={{
            display: 'flex',
            gap: 'clamp(20px, 2.5vw, 32px)',
            width: 'max-content',
            animationPlayState: isPaused ? 'paused' : 'running',
            cursor: isPaused ? 'grab' : 'default',
          }}
        >
          {Array.isArray(items) && [...items, ...items].map((item, i) => {
            const idx = i % items.length;
            const Icon = clientIcons[idx] || Building2;
            return (
              <div key={i} style={{
                width: 280,
                padding: 28,
                borderRadius: 12,
                background: 'var(--surface)',
                border: '1px solid var(--line, rgba(21,18,15,0.13))',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                flex: 'none',
              }}>
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  background: 'color-mix(in srgb, var(--accent, #0E7A69) 10%, transparent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 'none',
                }}>
                  <Icon size={26} color="var(--accent, #0E7A69)" strokeWidth={1.5} />
                </div>
                <span style={{
                  fontSize: 17,
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                  color: 'var(--fg, #15120f)',
                }}>
                  {item.name}
                </span>
                <p style={{
                  margin: 0,
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: 'var(--muted, #6c665e)',
                }}>
                  {item.desc}
                </p>
                <div style={{
                  marginTop: 'auto',
                  alignSelf: 'flex-start',
                  padding: '4px 12px',
                  borderRadius: 12,
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.03em',
                  color: 'var(--accent, #0E7A69)',
                  background: 'color-mix(in srgb, var(--accent, #0E7A69) 10%, transparent)',
                }}>
                  {item.stat}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
