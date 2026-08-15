import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
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
    </Section>
  );
}
