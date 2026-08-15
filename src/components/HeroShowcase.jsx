import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { EASE } from '../lib/motion';

// Named `showcaseProjects`, not `projects`: these are decorative mockups for the
// hero carousel and have nothing to do with the real case studies exported as
// `projects` from src/data/projects.js. The two used to share a name, so reading
// one file and then the other suggested a relationship that does not exist.
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

export default function HeroShowcase() {
  const [index, setIndex] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: '-80px' });
  const reduceMotion = useReducedMotion();

  // MotionConfig removes the cross-fade but not the swap itself, which would
  // leave the hero jump-cutting between projects — the loudest motion on the
  // page. Under reduced motion the showcase holds on the first project instead.
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
      style={{
        width: '100%',
        maxWidth: 700,
        aspectRatio: '3/2',
        position: 'relative',
      }}
    >
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

          <div style={{ position: 'relative', width: '100%', height: 'calc(100% - 36px)', overflow: 'hidden' }}>
            {showcaseProjects.map((proj, i) => (
              <motion.img
                key={proj.id}
                src={proj.desktop}
                alt={proj.title}
                loading={i === 0 ? 'eager' : 'lazy'}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                initial={false}
                animate={{ opacity: i === index ? 1 : 0 }}
                transition={{ duration: FADE_S, ease: 'easeInOut' }}
              />
            ))}
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

          <div style={{ position: 'relative', width: '100%', height: 'calc(100% - 22px)', overflow: 'hidden' }}>
            {showcaseProjects.map((proj, i) => (
              <motion.img
                key={proj.id + '-m'}
                src={proj.mobile}
                alt={proj.title}
                loading={i === 0 ? 'eager' : 'lazy'}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                initial={false}
                animate={{ opacity: i === index ? 1 : 0 }}
                transition={{ duration: FADE_S, ease: 'easeInOut' }}
              />
            ))}
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
    </motion.div>
  );
}
