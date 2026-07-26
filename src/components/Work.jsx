import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from './ScrollReveal';

const projectDefs = ['web', 'api', 'product', 'mobile', 'web', 'platform', 'web', 'api'];

export default function Work() {
  const { t } = useTranslation();
  const [showAll, setShowAll] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    setIsMobile(mq.matches);
    function handler(e) { setIsMobile(e.matches); }
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const maxVisible = showAll ? projectDefs.length : (isMobile ? 3 : 6);
  const visible = projectDefs.slice(0, maxVisible);
  const hasHidden = !showAll && projectDefs.length > maxVisible;

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
            {visible.map((k, i) => (
              <motion.article
                key={k + i}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
                whileHover={{ y: -3 }}
              >
                <div style={{
                  aspectRatio: '4/3',
                  border: '1px solid var(--line, rgba(21,18,15,0.13))',
                  borderRadius: 3,
                  overflow: 'hidden',
                  background: 'var(--surface, #fff)',
                }}>
                  <img
                    src={`https://picsum.photos/seed/project${i}/400/300`}
                    alt={t('imgLabel')}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '18px 2px 0' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                  }}>
                    <h3 style={{
                      margin: 0,
                      fontSize: 19,
                      fontWeight: 600,
                      letterSpacing: '-0.01em',
                    }}>
                      {t('projectTitle')}
                    </h3>
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
                      {t(`tags.${k}`)}
                    </span>
                  </div>
                  <p style={{
                    margin: '8px 0 0',
                    color: 'var(--muted, #6c665e)',
                    fontSize: 15,
                    lineHeight: 1.55,
                  }}>
                    {t('projectDesc')}
                  </p>
                </div>
              </motion.article>
            ))}
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
                Show less
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
