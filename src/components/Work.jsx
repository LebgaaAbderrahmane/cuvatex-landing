import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from './ScrollReveal';

const projectDefs = ['web', 'api', 'product', 'mobile', 'web', 'platform'];

export default function Work() {
  const { t } = useTranslation();
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? projectDefs : projectDefs.slice(0, 4);

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

        <div style={{
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  animation: 'none',
                }}
                whileHover={{ y: -3 }}
              >
                <div style={{
                  aspectRatio: '4/3',
                  border: '1px solid var(--line, rgba(21,18,15,0.13))',
                  background: 'repeating-linear-gradient(135deg, var(--line, rgba(21,18,15,0.13)) 0 1px, transparent 1px 13px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 3,
                  overflow: 'hidden',
                }}>
                  <svg viewBox="0 0 400 300" style={{ width: '100%', height: '100%' }}>
                    <rect width="400" height="300" fill="var(--surface, #fff)" />
                    <rect x="140" y="110" width="120" height="80" rx="4" fill="var(--accent, #0E7A69)" opacity="0.15" />
                    <text
                      x="200" y="160"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="var(--muted, #6c665e)"
                      fontSize="14"
                      fontFamily="'IBM Plex Sans', monospace"
                      letterSpacing="0.06em"
                    >
                      {t('imgLabel')}
                    </text>
                  </svg>
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
        </div>

        {!showAll && projectDefs.length > 4 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 'clamp(36px, 5vw, 52px)',
          }}>
            <motion.button
              type="button"
              onClick={() => setShowAll(true)}
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
          </div>
        )}
      </div>
    </section>
  );
}
