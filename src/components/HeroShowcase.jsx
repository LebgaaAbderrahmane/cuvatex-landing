import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { EASE } from '../lib/motion';
import useMediaQuery from '../hooks/useMediaQuery';

// Decorative carousel mockups — unrelated to the real case studies in data/projects.js.
const showcaseProjects = [
  { id: 'shop', title: 'ShopFlow', cat: 'E-Commerce Platform', desktop: 'https://picsum.photos/seed/shop-d/800/500', mobile: 'https://picsum.photos/seed/shop-m/240/480' },
  { id: 'dash', title: 'Pulse', cat: 'Analytics Dashboard', desktop: 'https://picsum.photos/seed/dash-d/800/500', mobile: 'https://picsum.photos/seed/dash-m/240/480' },
  { id: 'social', title: 'Vibe', cat: 'Social Platform', desktop: 'https://picsum.photos/seed/vibe-d/800/500', mobile: 'https://picsum.photos/seed/vibe-m/240/480' },
  { id: 'fin', title: 'Vault', cat: 'Fintech App', desktop: 'https://picsum.photos/seed/vault-d/800/500', mobile: 'https://picsum.photos/seed/vault-m/240/480' },
  { id: 'learn', title: 'Campus', cat: 'EdTech Platform', desktop: 'https://picsum.photos/seed/campus-d/800/500', mobile: 'https://picsum.photos/seed/campus-m/240/480' },
  { id: 'health', title: 'Vital', cat: 'HealthTech', desktop: 'https://picsum.photos/seed/vital-d/800/500', mobile: 'https://picsum.photos/seed/vital-m/240/480' },
];

const SHOW_MS = 3500;
const FADE_S = 0.6;
const MOBILE_QUERY = '(max-width: 767px)'; // must match Header's breakpoint exactly

/** The stack of cross-fading screenshots shared by every mockup below. */
function CrossfadeImages({ urlKey, index }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {showcaseProjects.map((proj, i) => (
        <motion.img
          key={proj.id + urlKey}
          src={proj[urlKey]}
          alt={proj.title}
          loading={i === 0 ? 'eager' : 'lazy'}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          initial={false}
          animate={{ opacity: i === index ? 1 : 0 }}
          transition={{ duration: FADE_S, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

// Shared visual for the credibility chips — floating on desktop (FloatingBadge),
// a static row on mobile (below). `aria-hidden` on both: they're a flourish,
// the real claims live in Hero's own copy.
const badgeChipStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '8px 12px',
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--fg, #15120f)',
  background: 'var(--surface, #fff)',
  border: '1px solid var(--line, rgba(21,18,15,0.13))',
  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
  whiteSpace: 'nowrap',
};

// No whileInView: children of the mockup's own fade/scale-in, so the float
// loop just runs from mount and stays invisible until that reveals them.
function FloatingBadge({ text, style, reduce, delay }) {
  return (
    <motion.div
      aria-hidden="true"
      animate={{ y: reduce ? 0 : [0, -6, 0] }}
      transition={{ duration: 3.4, repeat: reduce ? 0 : Infinity, ease: 'easeInOut', delay }}
      style={{ position: 'absolute', zIndex: 3, ...badgeChipStyle, ...style }}
    >
      {text}
    </motion.div>
  );
}

export default function HeroShowcase() {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: '-80px' });
  const reduceMotion = useReducedMotion();
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const badges = t('heroBadges', { returnObjects: true });
  const badgeList = Array.isArray(badges) ? badges : [];

  // Holds on the first project under reduced motion instead of jump-cutting.
  useEffect(() => {
    if (!inView || reduceMotion) return;
    const timer = setInterval(() => {
      setIndex(i => (i + 1) % showcaseProjects.length);
    }, SHOW_MS);
    return () => clearInterval(timer);
  }, [inView, reduceMotion]);

  const p = showcaseProjects[index];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.88 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.7, ease: EASE }}
      // Mobile shows one device in normal flow; desktop composites two devices
      // over a fixed 3/2 stage, so it needs the aspect-ratio box to place them in.
      style={isMobile ? {
        width: '100%',
      } : {
        width: '100%',
        maxWidth: 700,
        aspectRatio: '3/2',
        position: 'relative',
      }}
    >
      {isMobile ? (
        <>
          {/* Short and wide, not tall like a phone: a portrait phone card with
              no status bar read as a random photo, not a device. This browser
              window — the same chrome as the laptop mockup below — reads as
              software on its own, and stays short enough not to eat the fold. */}
          <div style={{
            width: '100%',
            aspectRatio: '3/2',
            background: 'var(--surface, #fff)',
            border: '1px solid var(--line, rgba(21,18,15,0.13))',
            borderRadius: 8,
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '9px 10px',
              background: 'var(--bg, #f6f5f2)',
              borderBottom: '1px solid var(--line, rgba(21,18,15,0.13))',
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ff5f57', flex: 'none' }} />
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#febc2e', flex: 'none' }} />
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#28c840', flex: 'none' }} />
              <span style={{
                flex: 1,
                height: 16,
                marginInlineStart: 4,
                borderRadius: 3,
                background: 'var(--surface, #fff)',
                border: '1px solid var(--line, rgba(21,18,15,0.13))',
                display: 'flex',
                alignItems: 'center',
                paddingInline: 7,
                fontSize: 7,
                fontFamily: 'monospace',
                color: 'var(--muted, #6c665e)',
                letterSpacing: '0.02em',
              }}>
                {p.id}.app
              </span>
            </div>
            <div style={{ width: '100%', height: 'calc(100% - 36px)' }}>
              <CrossfadeImages urlKey="desktop" index={index} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg, #15120f)', letterSpacing: '-0.01em' }}>
              {p.title}
              <span style={{ marginInlineStart: 6, fontSize: 11, color: 'var(--accent, #0E7A69)', fontWeight: 600, letterSpacing: '0.03em' }}>
                {p.cat}
              </span>
            </span>
            <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
              {showcaseProjects.map((_, i) => (
                <span key={i} style={{
                  width: i === index ? 12 : 5,
                  height: 3,
                  borderRadius: 2,
                  background: i === index ? 'var(--accent, #0E7A69)' : 'var(--line, rgba(21,18,15,0.13))',
                  transition: 'width 0.3s, background 0.3s',
                }} />
              ))}
            </div>
          </div>

          {/* Static, not floating — no absolute-positioned stage to float
              around here, and not enough width for chips beside the mockup. */}
          {badgeList.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
              {badgeList.map((text, i) => (
                <span key={i} aria-hidden="true" style={{ ...badgeChipStyle, fontSize: 11, padding: '6px 10px' }}>
                  {text}
                </span>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {badgeList[0] && (
            <FloatingBadge text={badgeList[0]} reduce={reduceMotion} delay={0} style={{ insetInlineStart: '-4%', top: '8%' }} />
          )}
          {badgeList[1] && (
            <FloatingBadge text={badgeList[1]} reduce={reduceMotion} delay={0.6} style={{ insetInlineEnd: '-2%', top: '2%' }} />
          )}
          {badgeList[2] && (
            <FloatingBadge text={badgeList[2]} reduce={reduceMotion} delay={1.2} style={{ insetInlineStart: '10%', bottom: '-6%' }} />
          )}

          {/* Laptop mockup */}
          <div style={{
            position: 'absolute',
            top: '4%',
            left: '6%',
            width: '84%',
            height: '78%',
          }}>
            {/* Screen */}
            <div style={{
              width: '100%',
              height: '83%',
              background: 'var(--surface, #fff)',
              border: '1px solid var(--line, rgba(21,18,15,0.13))',
              borderRadius: 8,
              overflow: 'hidden',
              position: 'relative',
              boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '9px 10px',
                background: 'var(--bg, #f6f5f2)',
                borderBottom: '1px solid var(--line, rgba(21,18,15,0.13))',
              }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ff5f57', flex: 'none' }} />
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#febc2e', flex: 'none' }} />
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#28c840', flex: 'none' }} />
                <span style={{
                  flex: 1,
                  height: 16,
                  marginInlineStart: 4,
                  borderRadius: 3,
                  background: 'var(--surface, #fff)',
                  border: '1px solid var(--line, rgba(21,18,15,0.13))',
                  display: 'flex',
                  alignItems: 'center',
                  paddingInline: 7,
                  fontSize: 7,
                  fontFamily: 'monospace',
                  color: 'var(--muted, #6c665e)',
                  letterSpacing: '0.02em',
                }}>
                  {p.id}.app
                </span>
              </div>

              <div style={{ width: '100%', height: 'calc(100% - 36px)' }}>
                <CrossfadeImages urlKey="desktop" index={index} />
              </div>
            </div>

            {/* Hinge */}
            <div style={{
              width: '104%',
              height: '10%',
              marginInlineStart: '-2%',
              background: 'var(--surface, #fff)',
              border: '1px solid var(--line, rgba(21,18,15,0.13))',
              borderTop: 'none',
              borderRadius: '0 0 5px 5px',
              position: 'relative',
            }}>
              <div style={{
                width: '28%',
                height: 3,
                background: 'var(--line, rgba(21,18,15,0.13))',
                borderRadius: 2,
                margin: '0 auto',
                position: 'relative',
                top: -1.5,
              }} />
            </div>

            {/* Label + dots */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 7,
            }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg, #15120f)', letterSpacing: '-0.01em' }}>
                {p.title}
                <span style={{ marginInlineStart: 6, fontSize: 9, color: 'var(--accent, #0E7A69)', fontWeight: 600, letterSpacing: '0.04em' }}>
                  {p.cat}
                </span>
              </span>
              <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                {showcaseProjects.map((_, i) => (
                  <span key={i} style={{
                    width: i === index ? 12 : 5,
                    height: 3,
                    borderRadius: 2,
                    background: i === index ? 'var(--accent, #0E7A69)' : 'var(--line, rgba(21,18,15,0.13))',
                    transition: 'width 0.3s, background 0.3s',
                  }} />
                ))}
              </div>
            </div>
          </div>

          {/* Phone mockup */}
          <div style={{
            position: 'absolute',
            bottom: '3%',
            right: '3%',
            width: '30%',
            zIndex: 2,
          }}>
            <div style={{
              width: '100%',
              aspectRatio: '1/2.1',
              background: 'var(--surface, #fff)',
              border: '2px solid var(--line, rgba(21,18,15,0.13))',
              borderRadius: 14,
              overflow: 'hidden',
              position: 'relative',
              boxShadow: '0 6px 24px rgba(0,0,0,0.08)',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 10px',
                background: 'var(--bg, #f6f5f2)',
                borderBottom: '1px solid var(--line, rgba(21,18,15,0.13))',
              }}>
                <span style={{ fontSize: 7, fontWeight: 600, color: 'var(--fg, #15120f)', opacity: 0.5 }}>9:41</span>
                <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <span style={{ width: 10, height: 3, borderRadius: 1, background: 'var(--fg, #15120f)', opacity: 0.4 }} />
                  <span style={{ width: 5, height: 3, borderRadius: 1, background: 'var(--fg, #15120f)', opacity: 0.2 }} />
                </div>
              </div>

              <div style={{ width: '100%', height: 'calc(100% - 22px)' }}>
                <CrossfadeImages urlKey="mobile" index={index} />
              </div>
            </div>
            <div style={{
              textAlign: 'center',
              marginTop: 4,
              fontSize: 8,
              color: 'var(--muted, #6c665e)',
              letterSpacing: '0.03em',
              fontWeight: 500,
            }}>
              Mobile
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
