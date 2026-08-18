import { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion, useMotionValue, useAnimationFrame, useInView } from 'framer-motion';
import { Building2, Store, Heart, Rocket, MapPin } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import useMediaQuery from '../hooks/useMediaQuery';
import useCountUp from '../hooks/useCountUp';

const clientIcons = [Building2, Store, Heart, Rocket, MapPin];
const MOBILE_QUERY = '(max-width: 767px)'; // must match Header's breakpoint exactly

export default function Clients() {
  const { t, i18n } = useTranslation();
  const items = t('clientTypes', { returnObjects: true });
  const stats = t('clientStats', { returnObjects: true });
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const reduceMotion = useReducedMotion();
  const rtl = i18n.dir() === 'rtl';

  return (
    <section
      id="clients"
      style={{
        scrollMarginTop: 80,
        // Full-screen fold only above mobile — on phone this content is much
        // shorter than the screen, so forcing the fold height just pads it
        // out with empty space above and below (same issue Hero had).
        minHeight: isMobile ? undefined : 'calc(100dvh - var(--header-h, 73px))',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 'clamp(40px, 6vw, 80px) clamp(20px, 5vw, 48px)',
        borderTop: '1px solid var(--line, rgba(21,18,15,0.13))',
        background: 'var(--bg)',
      }}
    >
      <div style={{ maxWidth: 1160, margin: '0 auto', width: '100%' }}>
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
            {t('clientsEyebrow')}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h2 style={{
            fontSize: 'clamp(30px, 5vw, 52px)',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
            margin: '16px 0 0',
            maxWidth: '16ch',
          }}>
            {t('clientsTitle')}
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <p style={{
            margin: '18px 0 0',
            color: 'var(--muted, #6c665e)',
            fontSize: 'clamp(16px, 1.8vw, 19px)',
            lineHeight: 1.6,
            maxWidth: '58ch',
          }}>
            {t('clientsBody')}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          {/* Wraps below ~600px, or the stat row scrolls the page sideways. */}
          <div style={{
            marginTop: 'clamp(40px, 5vw, 60px)',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            columnGap: 0,
            rowGap: 'clamp(20px, 3vw, 28px)',
          }}>
            {Array.isArray(stats) && stats.map((stat, i) => (
              <div key={stat.label} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'clamp(24px, 4vw, 48px)',
              }}>
                <Stat stat={stat} reduce={reduceMotion} />
                {i < stats.length - 1 && (
                  <span style={{
                    width: 1,
                    height: 48,
                    background: 'var(--line, rgba(21,18,15,0.13))',
                    flex: 'none',
                  }} />
                )}
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>

      <ScrollReveal
        delay={0.25}
        style={{
          marginTop: 'clamp(32px, 4vw, 48px)',
          overflow: 'hidden',
          maskImage: 'linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)',
        }}
      >
        <Marquee items={Array.isArray(items) ? items : []} isMobile={isMobile} rtl={rtl} reduce={reduceMotion} />
      </ScrollReveal>
    </section>
  );
}

const MARQUEE_DURATION_S = { desktop: 40, mobile: 18 }; // matches the previous CSS animation's timing
const SPEED_EASE_TAU = 0.35; // seconds — how fast speed ramps toward its target, on pause and resume

// requestAnimationFrame-driven instead of a CSS keyframe, so pausing eases the
// speed down to 0 instead of a CSS animation-play-state instant freeze.
function Marquee({ items, isMobile, rtl, reduce }) {
  const trackRef = useRef(null);
  const x = useMotionValue(0);
  const [isPaused, setIsPaused] = useState(false);
  const inView = useInView(trackRef, { once: false, margin: '-10% 0px' });
  const halfWidth = useRef(0);
  const speed = useRef(0);

  useEffect(() => {
    const measure = () => { if (trackRef.current) halfWidth.current = trackRef.current.scrollWidth / 2; };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    return () => ro.disconnect();
  }, [isMobile, items]);

  useAnimationFrame((_, delta) => {
    if (reduce || !inView || !halfWidth.current) return;
    const dt = Math.min(delta, 100) / 1000; // cap the jump after a backgrounded tab
    const target = isPaused ? 0 : halfWidth.current / MARQUEE_DURATION_S[isMobile ? 'mobile' : 'desktop'];
    speed.current += (target - speed.current) * Math.min(1, dt / SPEED_EASE_TAU);
    const dir = rtl ? 1 : -1;
    let next = x.get() + dir * speed.current * dt;
    if (dir === -1 && next <= -halfWidth.current) next += halfWidth.current;
    if (dir === 1 && next >= halfWidth.current) next -= halfWidth.current;
    x.set(next);
  });

  return (
    <motion.div
      ref={trackRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      style={{
        x,
        display: 'flex',
        gap: 'clamp(20px, 2.5vw, 32px)',
        width: 'max-content',
        cursor: isPaused ? 'grab' : 'default',
      }}
    >
      {[...items, ...items].map((item, i) => {
        const idx = i % items.length;
        const Icon = clientIcons[idx] || Building2;
        return (
          <div key={i} style={{
            // Smaller on phone: at full size, one card is nearly the whole
            // screen width, which reads as "one big block" instead of "one
            // card in a row." Shrinking it also shows more of the next card
            // peeking in, which is what actually signals "this scrolls."
            width: isMobile ? 220 : 280,
            padding: isMobile ? 20 : 28,
            borderRadius: 12,
            background: 'var(--surface)',
            border: '1px solid var(--line, rgba(21,18,15,0.13))',
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? 10 : 12,
            flex: 'none',
          }}>
            <div style={{
              width: isMobile ? 44 : 56,
              height: isMobile ? 44 : 56,
              borderRadius: isMobile ? 12 : 14,
              background: 'color-mix(in srgb, var(--accent, #0E7A69) 10%, transparent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 'none',
            }}>
              <Icon size={isMobile ? 20 : 26} color="var(--accent, #0E7A69)" strokeWidth={1.5} />
            </div>
            <span style={{
              fontSize: isMobile ? 15 : 17,
              fontWeight: 600,
              letterSpacing: '-0.01em',
              color: 'var(--fg, #15120f)',
            }}>
              {item.name}
            </span>
            <p style={{
              margin: 0,
              fontSize: isMobile ? 12 : 13,
              lineHeight: 1.5,
              color: 'var(--muted, #6c665e)',
            }}>
              {item.desc}
            </p>
            <div style={{
              marginTop: 'auto',
              alignSelf: 'flex-start',
              padding: '4px 12px',
              borderRadius: 12,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.03em',
              color: 'var(--accent, #0E7A69)',
              background: 'color-mix(in srgb, var(--accent, #0E7A69) 10%, transparent)',
            }}>
              {item.stat}
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}

function Stat({ stat, reduce }) {
  const [ref, shown] = useCountUp(stat.number, reduce);

  return (
    <div ref={ref} style={{ textAlign: 'center', padding: '0 clamp(12px, 3vw, 36px)' }}>
      {/* ltr + isolate — otherwise RTL bidi flips "40+" to "+40". */}
      <span style={{
        display: 'block',
        fontSize: 'clamp(32px, 4vw, 52px)',
        fontWeight: 700,
        letterSpacing: '-0.03em',
        lineHeight: 1,
        color: 'var(--fg, #15120f)',
        direction: 'ltr',
        unicodeBidi: 'isolate',
      }}>
        {shown}
      </span>
      <span style={{
        display: 'block',
        marginTop: 6,
        fontSize: 13,
        fontWeight: 500,
        color: 'var(--muted, #6c665e)',
      }}>
        {stat.label}
      </span>
    </div>
  );
}
