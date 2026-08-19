// Three soft glows behind the hero. Static by design: the hero's whole motion
// budget is the entrance, the button hover and the badge float. These used to
// drift on infinite x/y loops — frozen at their base positions, so the look is
// unchanged. There is no `motion` import here and there should not be one.
//
// The wrapper clips them, so their oversized boxes never reach the page scrollbar.
export default function HeroBackground() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
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
    </div>
  );
}
