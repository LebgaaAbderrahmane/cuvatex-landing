import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router';
import HeroShowcase from './HeroShowcase';
import HeroBackground from './HeroBackground';
import useMediaQuery from '../hooks/useMediaQuery';
import { dirArrow } from '../lib/text';
import { HERO_EASE } from '../lib/motion';
import { WHATSAPP_URL } from '../lib/contact';
import { track } from '../analytics';

// Module scope: `motion.create` inside the component remounts the link every render.
const MotionLink = motion.create(Link);

const MOBILE_QUERY = '(max-width: 767px)'; // must match Header's breakpoint exactly

// The copy is being rewritten. Swapping the hero headline means changing this
// one key (and the matching entry in all three locale files) — nothing else.
const HEADLINE_KEY = 'heroTitle';

// Entrance: kicker + headline, then subtitle, then the buttons. Three steps of
// 80 ms with a 400 ms fade means the last one lands at 560 ms — the whole hero
// is settled before anyone can read it.
const ENTER_DURATION = 0.4;
const ENTER_STAGGER = 0.08;

// The two button looks. A button gets one of these wholesale, never a mix —
// an inline `background`/`border` beats index.css's `.ghost-btn` and silently
// kills its :hover transition, so "solid" must never carry the ghost class.
const SOLID_BTN_STYLE = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 10,
  background: 'var(--accent, #0E7A69)',
  color: 'var(--accent-fg, #fff)',
  textDecoration: 'none',
  fontWeight: 600,
  fontSize: 16,
  padding: '15px 28px',
  borderRadius: 2,
};

// Ghost's hover wash and border colour live in index.css's .ghost-btn — a
// transition on :hover cannot be written inline. 14px + the ghost-btn 1px
// border matches the solid button's 15px of padding, so both stay the same height.
const GHOST_BTN_STYLE = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 9,
  padding: '14px 27px',
  borderRadius: 2,
  color: 'var(--fg, #15120f)',
  textDecoration: 'none',
  fontWeight: 600,
  fontSize: 16,
};

// Which button is solid flips by viewport (mobile-first audience → WhatsApp is
// the one they'll actually tap), so the look is picked here rather than baked
// into either button's markup.
function buttonLook(solid) {
  return solid
    ? { className: 'focus-ring', style: SOLID_BTN_STYLE }
    : { className: 'focus-ring ghost-btn', style: GHOST_BTN_STYLE };
}

/**
 * One step of the on-load entrance. `initial={false}` under reduced motion, not
 * a zero duration: MotionConfig's reducedMotion="user" does not gate opacity, so
 * an opacity-0 initial state would otherwise leave the headline invisible.
 */
function Enter({ step, reduce, style, children }) {
  return (
    <motion.div
      style={style}
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: ENTER_DURATION, delay: step * ENTER_STAGGER, ease: HERO_EASE }}
    >
      {children}
    </motion.div>
  );
}

// Sized to the label, not larger — it names the channel, it isn't the button.
function WhatsAppIcon() {
  return (
    <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="currentColor" style={{ flex: 'none' }}>
      <path d="M12.04 2.02c-5.46 0-9.9 4.44-9.9 9.9 0 1.74.45 3.44 1.32 4.94L2.06 22l5.28-1.38a9.9 9.9 0 0 0 4.7 1.2h.01c5.45 0 9.9-4.44 9.9-9.9a9.84 9.84 0 0 0-2.9-7A9.84 9.84 0 0 0 12.04 2Zm0 18.13a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.37 8.24 8.24 0 0 1 14.07-5.82 8.18 8.18 0 0 1 2.42 5.82 8.24 8.24 0 0 1-8.24 8.23Zm4.52-6.16c-.25-.13-1.47-.73-1.69-.81-.23-.09-.39-.13-.56.12-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.38-1.99-1.23-.74-.65-1.23-1.46-1.38-1.71-.14-.25-.01-.39.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.84-.2-.48-.4-.42-.55-.43h-.48c-.16 0-.43.06-.66.31-.22.25-.86.85-.86 2.06s.89 2.38 1.01 2.55c.13.16 1.75 2.67 4.24 3.74.59.25 1.05.4 1.41.52.59.19 1.13.16 1.55.1.48-.07 1.47-.6 1.68-1.19.21-.58.21-1.08.15-1.18-.06-.11-.23-.17-.48-.29Z" />
    </svg>
  );
}

export default function Hero() {
  const { t, i18n } = useTranslation();
  const reduceMotion = useReducedMotion();
  const isMobile = useMediaQuery(MOBILE_QUERY);
  // Same source as dirArrow below, so the glyph and the slide always agree.
  const isRtl = i18n.resolvedLanguage === 'ar';

  // Mobile-first audience: WhatsApp is what a local client will actually tap,
  // so it's the solid button and comes first there. Desktop keeps the form as
  // the lead. Elements carry a `key` and swap by array order, not CSS — a
  // visual-only reorder (flexDirection: column-reverse, CSS `order`) would
  // leave keyboard/screen-reader order pointing at the wrong button first.
  const quoteButton = (
    <MotionLink
      key="quote"
      to="/contact"
      {...buttonLook(!isMobile)}
      // A variant *label*, not an object: only a label propagates the
      // gesture down to the arrow's own `hover` variant. Same soft
      // accent-tinted shadow the removed scroll-cue button used to lift
      // on hover — a real interaction response, not ambient motion, so
      // it's not gated for reduced motion (matches the opacity dim here,
      // which already wasn't).
      whileHover="hover"
      variants={{ hover: { opacity: 0.92, boxShadow: '0 4px 20px rgba(14,122,105,0.15)' } }}
      whileTap={{ scale: 0.98 }}
    >
      {t('cta')}
      <motion.span
        aria-hidden="true"
        style={{ display: 'inline-block' }}
        // Gated by hand: Framer skips the *animation* under reduced
        // motion but still snaps the value, so the arrow would jump.
        variants={{ hover: { x: reduceMotion ? 0 : (isRtl ? -4 : 4) } }}
        transition={{ duration: 0.15, ease: HERO_EASE }}
      >
        {/* resolvedLanguage, not language: the latter can be 'ar-DZ'. */}
        {dirArrow(i18n.resolvedLanguage)}
      </motion.span>
    </MotionLink>
  );

  const whatsappButton = (
    <motion.a
      key="whatsapp"
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track('whatsapp_click')}
      {...buttonLook(isMobile)}
      whileTap={{ scale: 0.98 }}
    >
      <WhatsAppIcon />
      {t('heroWhatsapp')}
    </motion.a>
  );

  return (
    <section
      style={{
        // Full first screen: whatever the header doesn't take, this fills —
        // same fold contract as Clients and NotFound. Content centres in any
        // slack via flex, instead of the old fixed 88dvh that stranded empty
        // space above AND below on tall monitors. 6vw rather than Section's
        // own 10vw: that steeper rate made the widest screens worst before —
        // a flatter rate keeps the padding from growing back into the problem.
        minHeight: 'calc(100dvh - var(--header-h, 73px))',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: `${isMobile ? '28px' : 'clamp(48px, 6vw, 72px)'} clamp(20px, 5vw, 48px)`,
        position: 'relative',
        // Safety net only. The mockups and their badges are sized to stay inside
        // the 1160 container — see HeroShowcase — so nothing should reach this.
        overflow: 'hidden',
      }}
    >
      <HeroBackground />
      <div style={{ maxWidth: 1160, margin: '0 auto', width: '100%' }}>
        <div style={{
          display: 'flex',
          // Tighter on mobile: wrapped to two stacked rows, this is the gap
          // between the text block and the showcase below it. 40px+ read as
          // adrift once the showcase made the column much taller.
          gap: isMobile ? 20 : 'clamp(40px, 6vw, 80px)',
          alignItems: 'center',
          flexWrap: 'wrap',
          width: '100%',
        }}>
          <div style={{ flex: '1 1 400px' }}>
            <Enter step={0} reduce={reduceMotion}>
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
                {/* Static — the pulse now lives on the availability pill below,
                    where "blinking" means something (live/available). Here it
                    named a process step, not a status. */}
                <span
                  style={{
                    width: 7,
                    height: 7,
                    background: 'var(--accent, #0E7A69)',
                    display: 'inline-block',
                  }}
                />
                {t('heroKicker')}
              </p>
              <h1 style={{
                fontSize: 'clamp(32px, 5.4vw, 52px)',
                fontWeight: 600,
                letterSpacing: '-0.03em',
                lineHeight: 1.02,
                // Tighter on mobile: with no mockup beside it the eyebrow and
                // headline are the first thing on the page, and the old 22px
                // read as loose with nothing to its right balancing it out.
                margin: isMobile ? '14px 0 0' : '22px 0 0',
                textWrap: 'balance',
              }}>
                {/* The English copy carries a manual break ("apps\nthat") so the
                    line stops landing as "apps that grow" alone mid-sentence on
                    desktop. Mobile ignores it — its own natural wrap already
                    works — and fr/ar have no `\n`, so `.split` is a no-op there
                    and this renders exactly as it always did. */}
                {isMobile
                  ? t(HEADLINE_KEY).replace(/\n/g, ' ')
                  : t(HEADLINE_KEY).split('\n').map((line, i, arr) => (
                    <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                  ))}
              </h1>
            </Enter>

            <Enter step={1} reduce={reduceMotion}>
              <p style={{
                maxWidth: '56ch',
                margin: '30px 0 0',
                color: 'var(--muted, #6c665e)',
                fontSize: 'clamp(16px, 1.8vw, 20px)',
                lineHeight: 1.6,
              }}>
                {t('heroNote')}
              </p>
            </Enter>

            {/* 32 on mobile, not 44: the showcase below made the column much
                taller, so this gap gives back some of that height. Desktop
                keeps 44 — its own rhythm was already fine. */}
            <Enter step={2} reduce={reduceMotion} style={{ marginTop: isMobile ? 32 : 44 }}>
              <div style={{
                display: 'flex',
                gap: 12,
                // Stacked and full-width on a phone; side by side above it.
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'stretch' : 'center',
                flexWrap: 'wrap',
              }}>
                {isMobile ? [whatsappButton, quoteButton] : [quoteButton, whatsappButton]}
              </div>

              {/* A pill, not a bare line — this is the most credible, most
                  checkable sentence in the hero and it was styled like a
                  footnote. `inline-flex` on purpose: a full-width pill under
                  stacked mobile buttons would read as a third button. */}
              {/* <p style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                margin: '16px 0 0',
                padding: '7px 14px',
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--fg, #15120f)',
                background: 'var(--surface, #fff)',
                border: '1px solid var(--line, rgba(21,18,15,0.13))',
                // Nowrap on desktop keeps it a tidy pill; at 320px mobile the pill's own
                // min-content width overruns the column, so it wraps there instead.
                whiteSpace: isMobile ? 'normal' : 'nowrap',
              }}>
                <motion.span
                  aria-hidden="true"
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: 'var(--accent, #0E7A69)',
                    flex: 'none',
                  }}
                  animate={reduceMotion ? { opacity: 1 } : { opacity: [1, 0.3, 1] }} // MotionConfig doesn't gate opacity
                  transition={reduceMotion ? { duration: 0 } : { duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
                {t('heroAvailability')}
              </p>*/}
            </Enter>
          </div>

          {/* HeroShowcase picks its own mobile/desktop shape internally
              (`isMobile` reads synchronously on first render, so there's no
              flash of the wrong one). On mobile it runs after the buttons and
              can end past the fold — the section's own bottom padding is what
              closes it off, same as everywhere else in this hero.
              grow:0, not 1 — HeroShowcase caps itself at 560px anyway, so
              growing past that only added dead centering slack around the
              mockup instead of real size. Pinning the basis at that same
              560px removes the slack and lets the text column claim the
              space instead, with zero change to the mockup's own size.
              Shrink stays 1: still gives way on narrower desktop widths. */}
          <div style={{ flex: '0 1 560px', display: 'flex', justifyContent: 'center' }}>
            <HeroShowcase />
          </div>
        </div>
      </div>
    </section>
  );
}
