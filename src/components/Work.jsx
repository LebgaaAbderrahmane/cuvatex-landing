import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { projects, cardImage } from '../data/projects';

const EASE = [0.2, 0.6, 0.2, 1];

export default function Work({ openSlug = null, onOpen }) {
  const { t, i18n } = useTranslation();
  const reduce = useReducedMotion();
  const rtl = i18n.dir() === 'rtl';
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    setIsMobile(mq.matches);
    function handler(e) { setIsMobile(e.matches); }
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const maxVisible = showAll ? projects.length : (isMobile ? 3 : 6);
  const visible = projects.slice(0, maxVisible);
  const hasHidden = !showAll && projects.length > maxVisible;

  // Hover and keyboard focus drive the same variant, so the affordance is not
  // mouse-only. The badge sits at 0.55 at rest so touch devices still see it.
  const cardV = {
    rest: { y: 0 },
    hover: { y: reduce ? 0 : -6 },
  };
  const imgV = {
    rest: { scale: 1 },
    hover: { scale: reduce ? 1 : 1.05 },
  };
  const veilV = {
    rest: { opacity: 0 },
    hover: { opacity: 1 },
  };
  const pillV = {
    rest: { opacity: 0, y: reduce ? 0 : 14 },
    hover: { opacity: 1, y: 0 },
  };
  const badgeV = {
    rest: { opacity: 0.55, scale: 1 },
    hover: { opacity: 1, scale: reduce ? 1 : 1.08 },
  };
  const titleV = {
    rest: { color: 'var(--fg, #15120f)' },
    hover: { color: 'var(--accent, #0E7A69)' },
  };

  return (
    <section
      id="work"
      style={{
        scrollMarginTop: 80,
        padding: 'clamp(64px, 10vw, 120px) clamp(20px, 5vw, 48px)',
        borderTop: '1px solid var(--line, rgba(21,18,15,0.13))',
      }}
    >
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 24,
          flexWrap: 'wrap',
        }}>
          <div>
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
                {t('nav.work')}
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <h2 style={{
                fontSize: 'clamp(30px, 5vw, 52px)',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                lineHeight: 1.05,
                margin: '16px 0 0',
              }}>
                {t('workTitle')}
              </h2>
            </ScrollReveal>
          </div>
          <ScrollReveal delay={0.2}>
            <p style={{ margin: 0, color: 'var(--muted, #6c665e)', fontSize: 15 }}>
              {t('workIntro')}
            </p>
          </ScrollReveal>
        </div>

        <motion.div layout style={{
          marginTop: 'clamp(36px, 5vw, 56px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'clamp(24px, 3vw, 36px)',
        }}>
          <AnimatePresence>
            {visible.map((p, i) => {
              const title = t(`projects.${p.slug}.title`);
              const isOpen = openSlug === p.slug;
              return (
                // Outer element owns the grid entry/exit animation; the button owns the
                // hover/focus variants, so the two do not overwrite each other's state.
                <motion.div
                  key={p.slug}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: reduce ? 0 : 0.35, delay: reduce ? 0 : i * 0.05 }}
                >
                <motion.button
                  type="button"
                  className="focus-ring"
                  data-case-card={p.slug}
                  onClick={() => onOpen?.(p.slug)}
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
                    padding: 0,
                    border: 'none',
                    background: 'transparent',
                    color: 'inherit',
                    font: 'inherit',
                    textAlign: rtl ? 'right' : 'left',
                    cursor: 'pointer',
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
                    {/* While this project's case study is open, the overlay owns the
                        shared layoutId. Rendering a second live participant here would
                        make the transition fight itself, so we swap in a plain image. */}
                    {isOpen ? (
                      <img
                        src={cardImage(p.slug)}
                        alt=""
                        aria-hidden="true"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0 }}
                      />
                    ) : (
                      <motion.img
                        layoutId={`case-img-${p.slug}`}
                        src={cardImage(p.slug)}
                        alt={`${title} — ${t('imgLabel')}`}
                        loading="lazy"
                        variants={imgV}
                        transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    )}

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
                      {/* The glyph points away from the reading direction, so it flips in Arabic. */}
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
                        {t(`tags.${p.tagKey}`)}
                      </span>
                    </div>
                    <p style={{
                      margin: '8px 0 0',
                      color: 'var(--muted, #6c665e)',
                      fontSize: 15,
                      lineHeight: 1.55,
                    }}>
                      {t(`projects.${p.slug}.summary`)}
                    </p>
                  </div>
                </motion.button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: 'clamp(36px, 5vw, 52px)',
          gap: 12,
        }}>
          <AnimatePresence mode="wait">
            {hasHidden && (
              <motion.button
                key="show"
                type="button"
                className="focus-ring"
                onClick={() => setShowAll(true)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                whileHover={{ background: 'var(--accent, #0E7A69)', color: 'var(--accent-fg, #fff)' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--accent, #0E7A69)',
                  color: 'var(--accent, #0E7A69)',
                  fontWeight: 600,
                  fontSize: 14,
                  letterSpacing: '0.04em',
                  padding: '12px 26px',
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'background 0.2s, color 0.2s',
                }}
              >
                {t('workCta')}
              </motion.button>
            )}
            {showAll && (
              <motion.button
                key="hide"
                type="button"
                className="focus-ring"
                onClick={() => setShowAll(false)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                whileHover={{ background: 'var(--accent, #0E7A69)', color: 'var(--accent-fg, #fff)' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--line, rgba(21,18,15,0.13))',
                  color: 'var(--muted, #6c665e)',
                  fontWeight: 600,
                  fontSize: 14,
                  letterSpacing: '0.04em',
                  padding: '12px 26px',
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'background 0.2s, color 0.2s',
                }}
              >
                {t('workCtaLess')}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
