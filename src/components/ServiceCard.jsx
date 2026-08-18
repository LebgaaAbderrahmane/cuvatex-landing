import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { EASE } from '../lib/motion';
import { SERVICE_SLUGS } from '../lib/services';

const MotionLink = motion.create(Link); // module scope, or a new type remounts the link every render

// Positionally coupled to i18n's services[] array — no slug like projects.js
// has, so reordering services[] silently mismatches these images.
const serviceImages = [
  'https://picsum.photos/seed/services-web/800/600',
  'https://picsum.photos/seed/services-mvp/800/600',
  'https://picsum.photos/seed/services-mobile/800/600',
  'https://picsum.photos/seed/services-design/800/600',
  'https://picsum.photos/seed/services-backend/800/600',
  'https://picsum.photos/seed/services-custom/800/600',
];

const nums = ['01', '02', '03', '04', '05', '06'];

const viewport = { once: true, margin: '-10% 0px' };

// One card, two consumers: the homepage teaser (plain) and /services
// (`detailed`, adds badge/tags/feature list) — same reason ProjectCard exists.
// Rows alternate side by index; see ServiceDivider for the matching hairline.
export default function ServiceCard({ service, index = 0, detailed = false }) {
  const { t, i18n } = useTranslation();
  const reduce = useReducedMotion();
  const rtl = i18n.dir() === 'rtl';
  const image = serviceImages[index] || serviceImages[0];
  const num = nums[index] || nums[0];
  const isEven = index % 2 === 0;

  // Keep in sync with ServiceDivider's identical calculation.
  const photoOnLeft = isEven === !rtl;
  const slideFrom = reduce ? 0 : (photoOnLeft ? -36 : 36);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'clamp(32px, 5vw, 72px)',
        flexDirection: isEven ? 'row' : 'row-reverse',
        flexWrap: 'wrap',
        textAlign: rtl ? 'right' : 'left',
      }}
    >
      <motion.div
        initial={{ opacity: 0, x: slideFrom, scale: reduce ? 1 : 1.05 }}
        whileInView={{ opacity: 1, x: 0, scale: 1 }}
        viewport={viewport}
        transition={{ duration: reduce ? 0 : 0.65, ease: EASE }}
        style={{
          flex: '1 1 360px',
          borderRadius: 8,
          overflow: 'hidden',
          boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
        }}
      >
        <img
          src={image}
          alt={service.title}
          loading={index < 2 ? 'eager' : 'lazy'}
          style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 8 }}
        />
      </motion.div>

      <div style={{ flex: '1 1 360px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <motion.span
          initial={{ opacity: 0, x: slideFrom }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={viewport}
          transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
          style={{
            fontSize: 'clamp(28px, 3.4vw, 40px)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: 'var(--accent, #0E7A69)',
            lineHeight: 1,
          }}
        >
          {num}
        </motion.span>

        <motion.div
          initial={{ opacity: 0, x: slideFrom }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={viewport}
          transition={{ duration: reduce ? 0 : 0.55, ease: EASE, delay: reduce ? 0 : 0.1 }}
          style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
        >
          <h3 style={{
            margin: 0,
            fontSize: 'clamp(22px, 2.8vw, 30px)',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}>
            {service.title}
          </h3>
          <p style={{
            margin: 0,
            color: 'var(--muted, #6c665e)',
            fontSize: 'clamp(16px, 1.6vw, 18px)',
            lineHeight: 1.6,
            maxWidth: '44ch',
          }}>
            {service.desc}
          </p>

          {detailed && service.badge && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 14px',
              borderRadius: 20,
              background: 'color-mix(in srgb, var(--accent, #0E7A69) 10%, transparent)',
              color: 'var(--accent, #0E7A69)',
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '0.02em',
              alignSelf: 'flex-start',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {service.badge}
            </div>
          )}

          {detailed && service.tags && service.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
              {service.tags.map(tag => (
                <span key={tag} style={{
                  padding: '3px 10px',
                  borderRadius: 12,
                  fontSize: 11,
                  fontWeight: 500,
                  color: 'var(--muted, #6c665e)',
                  background: 'color-mix(in srgb, var(--muted) 8%, transparent)',
                  letterSpacing: '0.02em',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          {detailed && service.features && service.features.length > 0 && (
            <ul style={{
              margin: '8px 0 0',
              padding: 0,
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}>
              {service.features.map(f => (
                <li key={f} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 14,
                  color: 'var(--fg, #15120f)',
                  lineHeight: 1.4,
                }}>
                  <span style={{
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: 'var(--accent, #0E7A69)',
                    flex: 'none',
                  }} />
                  {f}
                </li>
              ))}
            </ul>
          )}

          {detailed && (
            <MotionLink
              to={`/contact?service=${SERVICE_SLUGS[index] || ''}`}
              className="focus-ring"
              whileHover={{ x: reduce ? 0 : (rtl ? -3 : 3) }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                marginTop: 4,
                alignSelf: 'flex-start',
                color: 'var(--accent, #0E7A69)',
                fontWeight: 600,
                fontSize: 14,
                textDecoration: 'none',
                minHeight: 44,
              }}
            >
              {t('serviceCta')}
              <ArrowRight size={14} style={{ transform: rtl ? 'scaleX(-1)' : 'none' }} />
            </MotionLink>
          )}
        </motion.div>
      </div>
    </div>
  );
}
