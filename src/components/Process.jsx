import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useReducedMotion, useTransform } from 'framer-motion';
import ScrollReveal from './ScrollReveal';
import useMediaQuery from '../hooks/useMediaQuery';

// Everything below is derived from CARD_H, so resizing the card keeps the
// scroll geometry in sync instead of drifting.
const CARD_H = 340;
const CARD_HALF = CARD_H / 2;
const NAV_H = 'var(--header-h, 73px)'; // measured by Header; fallback covers first frame only
const TITLE_BAR_CLEAR = 206; // bottom of the sticky title bar (185) + a gap
const STEP_GAP = 'clamp(120px, 18vh, 200px)';

// A step's centre-of-turn sits at 50vh + gap/2, regardless of step height.
// The card parks centred on that same line.
const FOCUS = `calc(50vh + ${STEP_GAP} / 2)`;
// ...but never so high the sticky title bar covers it on a short viewport.
const CARD_TOP = `max(calc(${FOCUS} - ${CARD_HALF}px), ${TITLE_BAR_CLEAR}px)`;

// Scroll runway above/below the steps, matching the card's parked box (not
// the viewport centre) so the first/last step don't burn part of their turn
// before the card has arrived or after it's left. Sum is always CARD_H.
const RUNWAY_TOP = `100px`;
const RUNWAY_BOTTOM = `${CARD_H / 3 + 20}px`;

const MOBILE_QUERY = '(max-width: 767px)'; // must match Header's breakpoint exactly

export default function Process() {
  const { t } = useTranslation();
  const steps = t('steps', { returnObjects: true });
  const stepList = Array.isArray(steps) ? steps : [];
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const reduceMotion = useReducedMotion();

  const trackRef = useRef(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start center', 'end center'],
  });

  // floor(v * n), not round(v * (n - 1)) — round gives the first/last step
  // half the active window of the middle ones.
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (stepList.length < 2) return;
    const n = stepList.length;
    const idx = n === 4
      ? v < 0.18 ? 0 : v < 0.43 ? 1 : v < 0.68 ? 2 : 3
      : Math.min(n - 1, Math.max(0, Math.floor(v * n)));
    setActive(idx);
  });

  const releaseY = useTransform(scrollYProgress, [0.85, 1], [0, -300]);

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
        <div style={{ position: 'relative' }}>
        {/* Direct child of this tall container — a sticky element only travels
            inside its parent's box, so ScrollReveal has to go inside it instead. */}
        <motion.div style={{
          position: isMobile ? 'static' : 'sticky',
          top: NAV_H,
          y: releaseY,
          zIndex: 3, // over the scrolling steps and the card, under the site header (50)
          background: 'var(--surface, #fff)',
          borderBottom: isMobile ? 'none' : '1px solid var(--line, rgba(21,18,15,0.13))',
          paddingBlock: isMobile ? 0 : 14,
        }}>
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
        </motion.div>

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
          style={{
            marginTop: 'clamp(40px, 6vw, 68px)',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: 'clamp(32px, 5vw, 80px)',
            alignItems: 'start',
          }}
        >
          {/* Padding is scroll runway, not spacing — sits outside trackRef so the
              measured range covers only the steps. */}
          <div style={{
            paddingBlockStart: isMobile ? 0 : RUNWAY_TOP,
            paddingBlockEnd: isMobile ? 0 : RUNWAY_BOTTOM,
          }}>
            <div
              ref={trackRef}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: isMobile ? 'clamp(16px, 4vw, 24px)' : STEP_GAP,
              }}
            >
              {stepList.map((st, i) => {
                // Mobile: no sticky side card to give the number a moment, so
                // each step is its own card with a big number instead — filled
                // background + an edge stripe, not a full hairline border like
                // Clients' cards, so the two sections don't read as the same
                // thing back to back.
                if (isMobile) {
                  return (
                    <ScrollReveal key={st.n}>
                      <div style={{
                        // Not --surface: this section's own background already
                        // is --surface, so a card using it too would be
                        // invisible. --bg is what the desktop card below uses
                        // for the same reason.
                        background: 'var(--bg, #faf8f5)',
                        borderInlineStart: '3px solid var(--accent, #0E7A69)',
                        borderRadius: 12,
                        padding: 'clamp(20px, 5vw, 28px)',
                      }}>
                        <div style={{
                          fontFamily: "'IBM Plex Sans', monospace",
                          fontSize: 40,
                          fontWeight: 700,
                          color: 'var(--accent, #0E7A69)',
                          letterSpacing: '-0.02em',
                          lineHeight: 1,
                        }}>
                          {st.n}
                        </div>
                        <h3 style={{
                          margin: '12px 0 0',
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
                        }}>
                          {st.desc}
                        </p>
                      </div>
                    </ScrollReveal>
                  );
                }

                return (
                  <motion.div
                    key={st.n}
                    animate={{ opacity: i === active ? 1 : 0.35 }}
                    transition={{ duration: reduceMotion ? 0 : 0.35, ease: 'easeOut' }}
                    style={{
                      position: 'relative',
                      paddingInlineStart: 'clamp(24px, 3vw, 40px)',
                      borderInlineStart: `2px solid ${i === active ? 'var(--accent, #0E7A69)' : 'var(--line, rgba(21,18,15,0.13))'}`,
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
                );
              })}
            </div>
          </div>

          {/* Sticky visual panel (desktop only) */}
          {!isMobile && activeStep && (
            <div style={{
              position: 'sticky',
              top: CARD_TOP,
              height: CARD_H,
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
                    // mode="wait" runs exit then enter, so this duration costs double
                    // per switch — keep it short or the card trails a fast scroll.
                    transition={{ duration: reduceMotion ? 0 : 0.22, ease: 'easeOut' }}
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
      </div>
    </section>
  );
}
