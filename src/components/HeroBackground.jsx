import useMediaQuery from '../hooks/useMediaQuery';

const MOBILE_QUERY = '(max-width: 767px)'; // must match Header's breakpoint exactly

// Desktop gets three glows spread across a tall, wide hero — plenty of open
// canvas for them to sit in. Mobile's hero is short and content-hugging, so
// the same three at the same corner offsets mostly land under the text and
// buttons instead of in open space, and read as flat. Below 768px this
// renders one bigger, brighter glow instead — same colour, same static
// rule, sized for a canvas that's mostly text.
//
// Static by design either way: the background never has to compete with the
// hero's own ambient motion — the entrance, gesture responses (hover/tap),
// the availability dot, the desktop badge float, and the showcase carousel
// (pausable — see HeroShowcase). There is no `motion` import here and there
// should not be one.
export default function HeroBackground() {
  const isMobile = useMediaQuery(MOBILE_QUERY);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        // Clips both variants below, so an oversized box never reaches the
        // page scrollbar.
        overflow: 'hidden',
      }}
    >
      {isMobile ? (
        /* One glow, upper-far-side — behind the eyebrow/headline's far edge,
           clear of the buttons underneath. `insetInlineEnd`, not `right`: the
           badges elsewhere in the hero use physical left/right because they
           track physically-positioned mockup images, but nothing pins this
           glow to a side — it should flip with the text in Arabic like any
           other decorative element. 15% mix: desktop's strongest orb, because
           a single glow here is carrying the whole effect instead of
           splitting it three ways. */
        <div
          style={{
            position: 'absolute',
            width: 'clamp(280px, 90vw, 420px)',
            height: 'clamp(280px, 90vw, 420px)',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--accent, #0E7A69) 15%, transparent), transparent 70%)',
            filter: 'blur(55px)',
            top: '-14%',
            insetInlineEnd: '-24%',
          }}
        />
      ) : (
        <>
          {/* Large orb — top left area */}
          <div
            style={{
              position: 'absolute',
              width: 'clamp(300px, 50vw, 600px)',
              height: 'clamp(300px, 50vw, 600px)',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, color-mix(in srgb, var(--accent, #0E7A69) 15%, transparent), transparent 70%)',
              filter: 'blur(60px)',
              top: '-10%',
              left: '-5%',
            }}
          />

          {/* Medium orb — bottom right area */}
          <div
            style={{
              position: 'absolute',
              width: 'clamp(200px, 35vw, 450px)',
              height: 'clamp(200px, 35vw, 450px)',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 70% 70%, color-mix(in srgb, var(--accent, #0E7A69) 12%, transparent), transparent 70%)',
              filter: 'blur(50px)',
              bottom: '-5%',
              right: '-5%',
            }}
          />

          {/* Small accent dot — centre */}
          <div
            style={{
              position: 'absolute',
              width: 'clamp(120px, 18vw, 240px)',
              height: 'clamp(120px, 18vw, 240px)',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--accent, #0E7A69) 8%, transparent), transparent 70%)',
              filter: 'blur(40px)',
              top: '50%',
              left: '50%',
              // Negative margins, not translate(-50%,-50%) — a transform on a
              // blurred box costs a compositor layer for nothing.
              marginTop: 'calc(clamp(120px, 18vw, 240px) / -2)',
              marginLeft: 'calc(clamp(120px, 18vw, 240px) / -2)',
            }}
          />
        </>
      )}
    </div>
  );
}
