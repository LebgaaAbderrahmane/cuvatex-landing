import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { HERO_EASE } from '../lib/motion';
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

const SHOW_MS = 6000;
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

// Every badge is anchored over a mockup corner — never floating in open space.
const badgeChipStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 7,
  padding: '8px 13px',
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--fg, #15120f)',
  background: 'var(--surface, #fff)',
  border: '1px solid var(--line, rgba(21,18,15,0.13))',
  boxShadow: '0 6px 20px rgba(0,0,0,0.10)',
  whiteSpace: 'nowrap',
};

// Icons stay in JSX so the locale files hold plain sentences, not emoji. Matched
// to `heroBadges` by position, the same way SERVICE_SLUGS maps onto `services`.
function BadgeIcon({ index }) {
  if (index === 0) {
    return (
      <span aria-hidden="true" style={{
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: 'var(--accent, #0E7A69)',
        flex: 'none',
      }} />
    );
  }
  return (
    <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ flex: 'none' }}>
      <rect x="7" y="2" width="10" height="20" rx="2.5" />
      <path d="M11 18.5h2" />
    </svg>
  );
}

// Not aria-hidden: unlike the old chips, these two say something the hero copy
// doesn't. No whileInView either — it's a child of the mockup's own entrance,
// so the float loop runs from mount and is invisible until that reveals it.
function Badge({ text, index, float, style }) {
  return (
    <motion.div
      animate={float ? { y: [0, -6, 0] } : { y: 0 }}
      transition={float ? { duration: 4, repeat: Infinity, ease: 'easeInOut' } : { duration: 0 }}
      style={{ position: 'absolute', zIndex: 3, ...badgeChipStyle, ...style }}
    >
      <BadgeIcon index={index} />
      {text}
    </motion.div>
  );
}

// WCAG 2.2.2: the carousel runs on its own past 5s, so it needs an in-content
// way to stop — an OS-level `prefers-reduced-motion` setting doesn't satisfy
// that, and `useInView` doesn't help either since this sits above the fold.
// 28px clears the 24px minimum target size (WCAG 2.5.8); it stays small next
// to the dots it sits beside, since it's a secondary control, not the CTA.
function CarouselPauseButton({ paused, onToggle, pauseLabel, playLabel }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="focus-ring"
      aria-label={paused ? playLabel : pauseLabel}
      aria-pressed={paused}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 28,
        height: 28,
        marginInlineStart: 2,
        border: 'none',
        borderRadius: '50%',
        background: 'transparent',
        color: 'var(--muted, #6c665e)',
        cursor: 'pointer',
        flex: 'none',
      }}
    >
      {paused ? (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M8 5v14l11-7z" />
        </svg>
      ) : (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <rect x="6" y="5" width="4" height="14" />
          <rect x="14" y="5" width="4" height="14" />
        </svg>
      )}
    </button>
  );
}

export default function HeroShowcase() {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const [manualPause, setManualPause] = useState(false);
  const [hoverPause, setHoverPause] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: '-80px' });
  const reduceMotion = useReducedMotion();
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const badges = t('heroBadges', { returnObjects: true });
  const badgeList = Array.isArray(badges) ? badges : [];
  // The button is the actual pause mechanism (WCAG 2.2.2). Hover/focus-pause
  // is a courtesy on top of it, not a substitute — it does nothing on touch.
  const paused = manualPause || hoverPause;

  // Holds on the first project under reduced motion instead of jump-cutting.
  useEffect(() => {
    if (!inView || reduceMotion || paused) return;
    const timer = setInterval(() => {
      setIndex(i => (i + 1) % showcaseProjects.length);
    }, SHOW_MS);
    return () => clearInterval(timer);
  }, [inView, reduceMotion, paused]);

  const p = showcaseProjects[index];

  return (
    <motion.div
      ref={ref}
      // React attaches focus/blur via focusin/focusout, so these fire for any
      // descendant gaining/losing focus, not just this element — a courtesy
      // pause for anyone tabbing through, on top of the button below.
      onMouseEnter={() => setHoverPause(true)}
      onMouseLeave={() => setHoverPause(false)}
      onFocus={() => setHoverPause(true)}
      onBlur={() => setHoverPause(false)}
      // Plays on mount, one step behind the hero's buttons — the showcase is
      // above the fold, so a scroll reveal would only fire on a replayed scroll.
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.16, ease: HERO_EASE }}
      // Mobile shows one device in normal flow; desktop composites two devices
      // over a fixed 3/2 stage, so it needs the aspect-ratio box to place them in.
      // 560 rather than the column's full width: the stage then centres with slack
      // on both sides, which is what keeps the badges inside the 1160 container.
      style={isMobile ? {
        width: '100%',
        position: 'relative',
      } : {
        width: '100%',
        maxWidth: 560,
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
            // Flex, not a hardcoded `calc(100% - 36px)` on the picture below:
            // the toolbar's real height moves with its font, and the mismatch
            // left a strip of bare surface under the picture.
            display: 'flex',
            flexDirection: 'column',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '9px 10px',
              background: 'var(--bg, #f6f5f2)',
              borderBottom: '1px solid var(--line, rgba(21,18,15,0.13))',
              flex: 'none',
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
            <div style={{ width: '100%', flex: 1, minHeight: 0 }}>
              <CrossfadeImages urlKey="desktop" index={index} />
            </div>
          </div>

          {/* One badge only. `top` clears the 35px title bar so the window dots
              stay visible — it straddles the left edge of the picture instead.
              -8 on the left still clears the hero's 20px side padding.
              No float loop on a phone — the spec keeps that desktop-only. */}
          {badgeList[0] && (
            <Badge text={badgeList[0]} index={0} float={false} style={{ top: 24, left: -8 }} />
          )}

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
              <CarouselPauseButton
                paused={manualPause}
                onToggle={() => setManualPause(v => !v)}
                pauseLabel={t('heroCarouselPause')}
                playLabel={t('heroCarouselPlay')}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Physical left/right, not insetInlineStart/End: the two mockups below
              are placed with left/right too, so a logical property would send the
              badges to the opposite corners in Arabic and detach them. Both sit
              wholly inside the stage box, overlapping a corner by ~12px.
              Badge A's -6 is what keeps it off the window dots: at top: 0 it
              shaved 3px off all three. */}
          {badgeList[0] && (
            <Badge text={badgeList[0]} index={0} float={!reduceMotion} style={{ top: -6, left: 0 }} />
          )}
          {badgeList[1] && (
            <Badge text={badgeList[1]} index={1} float={!reduceMotion} style={{ bottom: 0, right: 0 }} />
          )}

          {/* Laptop mockup */}
          <div style={{
            position: 'absolute',
            top: '4%',
            left: '5%',
            width: '78%',
            height: '76%',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Screen. Takes every pixel the label row below doesn't, so the
                picture always reaches the frame's bottom edge. */}
            <div style={{
              flex: 1,
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
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
                flex: 'none',
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

              <div style={{ width: '100%', flex: 1, minHeight: 0 }}>
                <CrossfadeImages urlKey="desktop" index={index} />
              </div>
            </div>

            {/* Label + dots, both packed to the left. `space-between` put the
                dots at this row's right end, which is underneath the phone — it
                has zIndex 2, so all six were painted over and never seen.
                Forced LTR for the same reason: the project names are English
                either way, and in Arabic the flipped row sent the label under
                the phone instead. */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginTop: 7,
              direction: 'ltr',
              flex: 'none',
            }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg, #15120f)', letterSpacing: '-0.01em' }}>
                {p.title}
                <span style={{ marginInlineStart: 6, fontSize: 11, color: 'var(--accent, #0E7A69)', fontWeight: 600, letterSpacing: '0.04em' }}>
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
                <CarouselPauseButton
                  paused={manualPause}
                  onToggle={() => setManualPause(v => !v)}
                  pauseLabel={t('heroCarouselPause')}
                  playLabel={t('heroCarouselPlay')}
                />
              </div>
            </div>
          </div>

          {/* Phone mockup. Deliberately short enough that the laptop's own right
              border shows above it — a phone that spans the full height of the
              screen behind it reads as the laptop being cut off. */}
          <div style={{
            position: 'absolute',
            bottom: '4%',
            right: '3%',
            width: '25%',
            zIndex: 2,
          }}>
            <div style={{
              width: '100%',
              aspectRatio: '1/2',
              background: 'var(--surface, #fff)',
              border: '2px solid var(--line, rgba(21,18,15,0.13))',
              borderRadius: 14,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 6px 24px rgba(0,0,0,0.08)',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 10px',
                background: 'var(--bg, #f6f5f2)',
                borderBottom: '1px solid var(--line, rgba(21,18,15,0.13))',
                flex: 'none',
              }}>
                <span style={{ fontSize: 7, fontWeight: 600, color: 'var(--fg, #15120f)', opacity: 0.5 }}>9:41</span>
                <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <span style={{ width: 10, height: 3, borderRadius: 1, background: 'var(--fg, #15120f)', opacity: 0.4 }} />
                  <span style={{ width: 5, height: 3, borderRadius: 1, background: 'var(--fg, #15120f)', opacity: 0.2 }} />
                </div>
              </div>

              <div style={{ width: '100%', flex: 1, minHeight: 0 }}>
                <CrossfadeImages urlKey="mobile" index={index} />
              </div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
