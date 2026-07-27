import { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useReducedMotion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    setIsMobile(mq.matches);
    function handler(e) { setIsMobile(e.matches); }
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isMobile;
}

export default function Process() {
  const { t } = useTranslation();
  const steps = t('steps', { returnObjects: true });
  const stepList = Array.isArray(steps) ? steps : [];
  const isMobile = useIsMobile();
  const reduceMotion = useReducedMotion();

  const trackRef = useRef(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start center', 'end center'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (stepList.length < 2) return;
    const idx = Math.min(
      stepList.length - 1,
      Math.max(0, Math.round(v * (stepList.length - 1)))
    );
    setActive(idx);
  });

  const activeStep = stepList[active];

  return (
    <section
      id="process"
      style={{
        scrollMarginTop: 80,
        padding: 'clamp(64px, 10vw, 124px) clamp(20px, 5vw, 48px)',
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
            {t('nav.process')}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h2 style={{
            fontSize: 'clamp(30px, 5vw, 52px)',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
            margin: '16px 0 0',
            maxWidth: '18ch',
          }}>
            {t('processTitle')}
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <p style={{
            margin: '18px 0 0',
            color: 'var(--muted, #6c665e)',
            fontSize: 'clamp(16px, 1.8vw, 19px)',
            maxWidth: '52ch',
            lineHeight: 1.6,
          }}>
            {t('processIntro')}
          </p>
        </ScrollReveal>

        <div
          ref={trackRef}
          style={{
            marginTop: 'clamp(40px, 6vw, 68px)',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: 'clamp(32px, 5vw, 80px)',
            alignItems: 'start',
          }}
        >
          {/* Steps column */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? 'clamp(34px, 6vw, 52px)' : 'clamp(120px, 18vh, 200px)',
            paddingBlock: isMobile ? 0 : 'clamp(20px, 4vh, 60px)',
          }}>
            {stepList.map((st, i) => (
              <motion.div
                key={st.n}
                animate={{ opacity: isMobile || i === active ? 1 : 0.35 }}
                transition={{ duration: reduceMotion ? 0 : 0.35, ease: 'easeOut' }}
                style={{
                  position: 'relative',
                  paddingInlineStart: 'clamp(24px, 3vw, 40px)',
                  borderInlineStart: `2px solid ${i === active || isMobile ? 'var(--accent, #0E7A69)' : 'var(--line, rgba(21,18,15,0.13))'}`,
                  transition: 'border-color 0.35s ease',
                }}
              >
                <div style={{
                  fontFamily: "'IBM Plex Sans', monospace",
                  fontSize: 14,
                  color: 'var(--accent, #0E7A69)',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                }}>
                  {st.n}
                </div>
                <h3 style={{
                  margin: '8px 0 0',
                  fontSize: 'clamp(21px, 2.6vw, 28px)',
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                }}>
                  {st.title}
                </h3>
                <p style={{
                  margin: '10px 0 0',
                  color: 'var(--muted, #6c665e)',
                  fontSize: 15.5,
                  lineHeight: 1.6,
                  maxWidth: '52ch',
                }}>
                  {st.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Sticky visual panel (desktop only) */}
          {!isMobile && activeStep && (
            <div style={{
              position: 'sticky',
              top: 'calc(50vh - 210px)',
              height: 420,
            }}>
              <div style={{
                position: 'relative',
                height: '100%',
                overflow: 'hidden',
                borderRadius: 16,
                border: '1px solid var(--line, rgba(21,18,15,0.13))',
                background: 'var(--bg, #faf8f5)',
              }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: reduceMotion ? 1 : 1.02 }}
                    transition={{ duration: reduceMotion ? 0 : 0.3, ease: 'easeOut' }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 12,
                    }}
                  >
                    <div aria-hidden style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'radial-gradient(circle at 30% 20%, var(--accent, #0E7A69), transparent 60%)',
                      opacity: 0.12,
                    }} />
                    <div style={{
                      fontFamily: "'IBM Plex Sans', monospace",
                      fontSize: 'clamp(72px, 8vw, 120px)',
                      fontWeight: 700,
                      lineHeight: 1,
                      color: 'var(--accent, #0E7A69)',
                      letterSpacing: '-0.02em',
                    }}>
                      {activeStep.n}
                    </div>
                    <div style={{
                      fontSize: 'clamp(20px, 2.2vw, 26px)',
                      fontWeight: 600,
                      letterSpacing: '-0.01em',
                    }}>
                      {activeStep.title}
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div style={{
                  position: 'absolute',
                  bottom: 24,
                  insetInline: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 8,
                }}>
                  {stepList.map((st, i) => (
                    <span
                      key={st.n}
                      style={{
                        width: i === active ? 24 : 8,
                        height: 8,
                        borderRadius: 4,
                        background: i === active ? 'var(--accent, #0E7A69)' : 'var(--line, rgba(21,18,15,0.13))',
                        transition: 'all 0.3s ease',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
