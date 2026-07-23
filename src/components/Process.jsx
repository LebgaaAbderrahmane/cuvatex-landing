import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';
import { useEffect, useRef, useState } from 'react';

function StepLine() {
  const lineRef = useRef(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const el = lineRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          io.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={lineRef}
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        insetInlineStart: 0,
        width: 1,
        background: 'var(--line, rgba(21,18,15,0.13))',
        overflow: 'hidden',
      }}
    >
      <motion.div
        style={{ width: 1, background: 'var(--accent, #0E7A69)', height: '100%' }}
        initial={{ scaleY: 0, transformOrigin: 'top' }}
        animate={drawn ? { scaleY: 1 } : {}}
        transition={{ duration: 1, ease: [0.2, 0.6, 0.2, 1] }}
      />
    </div>
  );
}

export default function Process() {
  const { t } = useTranslation();
  const steps = t('steps', { returnObjects: true });

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

        <div style={{
          marginTop: 'clamp(40px, 6vw, 68px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(34px, 5vw, 52px)',
          position: 'relative',
          paddingInlineStart: 0,
        }}>
          {Array.isArray(steps) && steps.map((st, i) => (
            <ScrollReveal key={st.n} delay={i * 0.1}>
              <div style={{
                position: 'relative',
                paddingInlineStart: 'clamp(32px, 5vw, 60px)',
              }}>
                {i === 0 && <StepLine />}
                <div style={{
                  position: 'absolute',
                  top: -1,
                  insetInlineStart: 0,
                  marginInlineStart: -20,
                  width: 40,
                  textAlign: 'center',
                  background: 'var(--surface, #fff)',
                  padding: '3px 0',
                  fontFamily: "'IBM Plex Sans', monospace",
                  fontSize: 14,
                  color: 'var(--accent, #0E7A69)',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                }}>
                  {st.n}
                </div>
                <motion.h3
                  style={{
                    margin: 0,
                    fontSize: 'clamp(21px, 2.6vw, 28px)',
                    fontWeight: 600,
                    letterSpacing: '-0.01em',
                  }}
                  whileHover={{ x: 4 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {st.title}
                </motion.h3>
                <p style={{
                  margin: '10px 0 0',
                  color: 'var(--muted, #6c665e)',
                  fontSize: 15.5,
                  lineHeight: 1.6,
                  maxWidth: '52ch',
                }}>
                  {st.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
