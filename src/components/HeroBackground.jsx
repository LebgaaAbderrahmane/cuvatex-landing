import { useRef } from 'react';
import { motion } from 'framer-motion';

export default function HeroBackground() {
  const ref = useRef(null);

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Large floating orb — top left area */}
      <motion.div
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
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 20, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
          times: [0, 0.4, 0.7, 1],
        }}
      />

      {/* Medium floating orb — bottom right area */}
      <motion.div
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
        animate={{
          x: [0, -30, 20, 0],
          y: [0, 20, -30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
          times: [0, 0.3, 0.7, 1],
        }}
      />

      {/* Small accent dot — wanders around center */}
      <motion.div
        style={{
          position: 'absolute',
          width: 'clamp(120px, 18vw, 240px)',
          height: 'clamp(120px, 18vw, 240px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--accent, #0E7A69) 8%, transparent), transparent 70%)',
          filter: 'blur(40px)',
          top: '50%',
          left: '50%',
          // Centred with negative margins, not `translate(-50%, -50%)`: Framer
          // writes its own `transform` for the x/y animation below and would
          // silently drop the centring offset, parking the orb half its own
          // width down and to the right of centre.
          marginTop: 'calc(clamp(120px, 18vw, 240px) / -2)',
          marginLeft: 'calc(clamp(120px, 18vw, 240px) / -2)',
        }}
        animate={{
          x: [0, 50, -30, 20, 0],
          y: [0, -40, 30, -20, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
          times: [0, 0.25, 0.5, 0.75, 1],
        }}
      />
    </div>
  );
}
