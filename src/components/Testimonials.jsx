import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

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
            {t('testimonialsEyebrow')}
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
            {t('testimonialsTitle')}
          </h2>
        </ScrollReveal>

        <div style={{
          marginTop: 'clamp(36px, 5vw, 56px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'clamp(20px, 2.5vw, 32px)',
        }}>
          {items.map((item, i) => (
            <ScrollReveal key={i} delay={i * 0.08}>
              <motion.article
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 200 }}
                style={{
                  border: '1px solid var(--line, rgba(21,18,15,0.13))',
                  borderRadius: 3,
                  padding: 'clamp(24px, 2.5vw, 32px)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                }}
              >
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'color-mix(in srgb, var(--accent, #0E7A69) 10%, transparent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 'none',
                }}>
                  <span style={{
                    color: 'var(--accent, #0E7A69)',
                    fontSize: 22,
                    fontWeight: 600,
                    lineHeight: 1,
                  }}>
                    ❝
                  </span>
                </div>

                <p style={{
                  margin: 0,
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: 'var(--muted, #6c665e)',
                }}>
                  {item.quote}
                </p>

                <div style={{
                  display: 'flex',
                  gap: 3,
                  fontSize: 13,
                  color: 'var(--accent, #0E7A69)',
                }}>
                  {'★★★★★'}
                </div>

                <div style={{
                  height: 1,
                  background: 'var(--line, rgba(21,18,15,0.13))',
                  margin: '4px 0',
                }} />

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}>
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'color-mix(in srgb, var(--accent, #0E7A69) 8%, transparent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 'none',
                  }}>
                    <span style={{
                      color: 'var(--accent, #0E7A69)',
                      fontSize: 12,
                      fontWeight: 600,
                    }}>
                      {getInitials(item.name)}
                    </span>
                  </div>
                  <div>
                    <span style={{
                      fontWeight: 600,
                      fontSize: 14,
                      color: 'var(--fg, #15120f)',
                    }}>
                      {item.name}
                    </span>
                    <span style={{
                      fontSize: 12,
                      color: 'var(--muted, #6c665e)',
                      marginInlineStart: 8,
                    }}>
                      {item.business}
                    </span>
                  </div>
                </div>
              </motion.article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
