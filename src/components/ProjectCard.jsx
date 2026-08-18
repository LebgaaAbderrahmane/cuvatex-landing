import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router';
import { ArrowUpRight } from 'lucide-react';
import { cardImage } from '../data/projects';
import { EASE } from '../lib/motion';
import useMediaQuery from '../hooks/useMediaQuery';

// One card, used by the homepage teaser (Work.jsx) and the full index
// (pages/WorkList.jsx). Written once so the two cannot drift apart.
const MotionLink = motion.create(Link); // module scope, or a new type remounts the card every render

// Capability query, not a width — a small laptop still hovers, a large tablet doesn't.
const NO_HOVER = '(hover: none)';

export default function ProjectCard({ slug, tagKey, index = 0 }) {
  const { t, i18n } = useTranslation();
  const reduce = useReducedMotion();
  const rtl = i18n.dir() === 'rtl';
  // Touch screens never fire hover, so the badge/label rest visible there instead.
  const noHover = useMediaQuery(NO_HOVER);

  const title = t(`projects.${slug}.title`);

  // Hover and keyboard focus drive the same variant, so it's not mouse-only.
  const cardV = { rest: { y: 0 }, hover: { y: reduce ? 0 : -6 } };
  const imgV = { rest: { scale: 1 }, hover: { scale: reduce ? 1 : 1.05 } };
  const veilV = { rest: { opacity: noHover ? 0.85 : 0 }, hover: { opacity: 1 } };
  const pillV = {
    rest: { opacity: noHover ? 1 : 0, y: noHover || reduce ? 0 : 14 },
    hover: { opacity: 1, y: 0 },
  };
  const badgeV = {
    rest: { opacity: noHover ? 1 : 0.55, scale: 1 },
    hover: { opacity: 1, scale: reduce ? 1 : 1.08 },
  };
  const titleV = {
    rest: { color: 'var(--fg, #15120f)' },
    hover: { color: 'var(--accent, #0E7A69)' },
  };

  return (
    // Outer div owns the entry animation, the link owns hover/focus, so the two
    // don't overwrite each other's animation state.
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{
        duration: reduce ? 0 : 0.5,
        delay: reduce ? 0 : (index % 3) * 0.08,
        ease: EASE,
      }}
    >
      <MotionLink
        to={`/work/${slug}`}
        className="focus-ring"
        aria-label={`${title} — ${t('caseStudy.view')}`}
        variants={cardV}
        initial="rest"
        animate="rest"
        whileHover="hover"
        whileFocus="hover"
        transition={{ duration: reduce ? 0 : 0.35, ease: EASE }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          color: 'inherit', // index.css's `a { color: var(--accent) }` would repaint the whole card
          textDecoration: 'none',
          textAlign: rtl ? 'right' : 'left',
        }}
      >
        <div style={{
          position: 'relative',
          aspectRatio: '4/3',
          border: '1px solid var(--line, rgba(21,18,15,0.13))',
          borderRadius: 3,
          overflow: 'hidden',
          background: 'var(--surface, #fff)',
        }}>
          <motion.img
            src={cardImage(slug)}
            alt={`${title} — ${t('imgLabel')}`}
            loading="lazy"
            variants={imgV}
            transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          <motion.div
            variants={veilV}
            transition={{ duration: reduce ? 0 : 0.3, ease: EASE }}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, var(--scrim, rgba(21,18,15,0.55)), transparent 62%)',
              pointerEvents: 'none',
            }}
          />

          <motion.span
            variants={badgeV}
            transition={{ duration: reduce ? 0 : 0.3, ease: EASE }}
            style={{
              position: 'absolute',
              insetBlockStart: 12,
              insetInlineEnd: 12,
              width: 34,
              height: 34,
              borderRadius: 999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--accent, #0E7A69)',
              color: 'var(--accent-fg, #fff)',
              pointerEvents: 'none',
            }}
          >
            <ArrowUpRight size={18} style={{ transform: rtl ? 'scaleX(-1)' : 'none' }} />
          </motion.span>

          <motion.span
            variants={pillV}
            transition={{ duration: reduce ? 0 : 0.3, ease: EASE }}
            style={{
              position: 'absolute',
              insetBlockEnd: 14,
              insetInlineStart: 14,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--accent-fg, #fff)',
              background: 'var(--accent, #0E7A69)',
              padding: '7px 14px',
              borderRadius: 999,
              pointerEvents: 'none',
            }}
          >
            {t('caseStudy.view')}
          </motion.span>
        </div>

        <div style={{ padding: '18px 2px 0' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}>
            <motion.h3
              variants={titleV}
              transition={{ duration: reduce ? 0 : 0.25, ease: EASE }}
              style={{
                margin: 0,
                fontSize: 19,
                fontWeight: 600,
                letterSpacing: '-0.01em',
              }}
            >
              {title}
            </motion.h3>
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: 'var(--accent, #0E7A69)',
              border: '1px solid var(--line, rgba(21,18,15,0.13))',
              padding: '4px 10px',
              borderRadius: 999,
              whiteSpace: 'nowrap',
              flex: 'none',
            }}>
              {t(`tags.${tagKey}`)}
            </span>
          </div>
          <p style={{
            margin: '8px 0 0',
            color: 'var(--muted, #6c665e)',
            fontSize: 15,
            lineHeight: 1.55,
          }}>
            {t(`projects.${slug}.summary`)}
          </p>
        </div>
      </MotionLink>
    </motion.div>
  );
}
