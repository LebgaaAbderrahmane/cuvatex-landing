import { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion, useInView } from 'framer-motion';

const DURATION = [0, 1600, 1800, 1600, 1800, 2000, 2000, 2000, 1400];

let SEQ = null;
let LOOP_MS = 0;

function buildTimeline() {
  if (SEQ) return;
  const seq = [];
  let acc = 0;
  for (let s = 1; s < DURATION.length; s++) {
    acc += DURATION[s];
    seq.push({ s, at: acc });
  }
  SEQ = seq;
  LOOP_MS = acc;
}
buildTimeline();

const MOBILE_SEQ = [
  { s: 1, at: 1600 },
  { s: 2, at: 3400 },
];
const MOBILE_LOOP = 5200;

const LOGO_PATHS = [
  'M690 625C690 636.819 687.672 648.522 683.149 659.441C678.626 670.361 671.997 680.282 663.64 688.64C655.282 696.997 645.361 703.626 634.441 708.149C623.522 712.672 611.819 715 600 715C576.13 715 553.239 705.518 536.36 688.64C519.482 671.761 510 648.869 510 625C510 601.13 519.482 578.239 536.36 561.36C553.239 544.482 576.13 535 600 535C623.869 535 646.761 544.482 663.64 561.36C680.518 578.239 690 601.13 690 625Z',
  'M726 625L1092 259L1200 367L942 625L1200 883L1092 991L726 625Z',
  'M474 625L108 259L0 367L258 625L0 883L108 991L474 625Z',
  'M600 499L966 133L858 25L600 283L342 25L234 133L600 499Z',
  'M600 751L966 1117L858 1225L600 967L342 1225L234 1117L600 751Z',
];

export default function HeroIllustration() {
  const [scene, setScene] = useState(0);
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: '-80px' });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    setIsMobile(mq.matches);
    const handler = e => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (reduce) { setScene(0); return; }
    if (!inView) return;

    let alive = true;
    const seq = isMobile ? MOBILE_SEQ : SEQ;
    const loopMs = isMobile ? MOBILE_LOOP : LOOP_MS;

    const schedule = () => {
      if (!alive) return;
      setScene(0);
      seq.forEach(({ s, at }) => {
        setTimeout(() => { if (alive) setScene(s); }, at);
      });
      setTimeout(schedule, loopMs);
    };

    schedule();
    return () => { alive = false; };
  }, [reduce, inView, isMobile]);

  const active = (...s) => (reduce ? s.includes(0) : s.includes(scene));

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.88 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.7, ease: [0.2, 0.6, 0.2, 1] }}
      style={{ width: '100%', maxWidth: 540, aspectRatio: '1/1' }}
    >
      <svg
        viewBox="0 0 520 520"
        style={{ width: '100%', height: '100%' }}
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <clipPath id="phoneScreenClip">
            <rect x={216} y={166} width={88} height={183} rx={12} />
          </clipPath>
          <clipPath id="browserClip">
            <rect x={130} y={184} width={260} height={169} />
          </clipPath>
        </defs>

        <circle
          cx={260} cy={260} r={220}
          fill="var(--accent, #0E7A69)" opacity={0.04}
        />
        <circle
          cx={260} cy={260} r={150}
          fill="var(--accent, #0E7A69)" opacity={0.06}
        />

        {/*
         * SCENE 0 – Logo entrance
         * The logo paths fade in with a staggered spring.
         */}
        <motion.g
          initial={false}
          animate={{ opacity: active(0) ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <g transform="translate(218, 224) scale(0.07)">
            {LOGO_PATHS.map((d, i) => (
              <motion.path
                key={i}
                fillRule="evenodd"
                clipRule="evenodd"
                d={d}
                fill="var(--accent, #0E7A69)"
                initial={{ opacity: 0, scale: 0.3 }}
                animate={active(0)
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.3 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 13,
                  delay: i * 0.08,
                }}
              />
            ))}
          </g>
        </motion.g>

        {/*
         * PHONE FRAME – scenes 1-2
         */}
        <motion.g
          initial={false}
          animate={{
            opacity: active(1, 2) ? 1 : 0,
            x: active(1, 2) ? 0 : -80,
          }}
          transition={{
            type: 'spring', stiffness: 280, damping: 18, mass: 0.7,
          }}
        >
          {/* Phone body */}
          <rect x={210} y={160} width={100} height={195} rx={20}
            fill="var(--bg, #f6f5f2)"
            stroke="var(--line, rgba(21,18,15,0.13))" strokeWidth={1.5}
          />
          {/* Phone screen */}
          <rect x={216} y={166} width={88} height={183} rx={12}
            fill="var(--surface, #fff)"
            stroke="var(--line, rgba(21,18,15,0.13))" strokeWidth={1}
          />

          {/* Status bar */}
          <rect x={224} y={172} width={20} height={4} rx={2}
            fill="var(--muted, #6c665e)" opacity={0.35}
          />
          <rect x={274} y={172} width={12} height={4} rx={2}
            fill="var(--muted, #6c665e)" opacity={0.35}
          />
          <circle cx={280} cy={174} r={3}
            fill="var(--accent, #0E7A69)" opacity={0.5}
          />

          {/* ---- Scene 1 — Home screen ---- */}
          <motion.g
            initial={false}
            animate={{ opacity: active(1) ? 1 : 0 }}
            transition={{ duration: 0.25 }}
            clipPath="url(#phoneScreenClip)"
          >
            {[
              { x: 224, y: 196, t: '18%' },
              { x: 268, y: 196, t: '12%' },
              { x: 224, y: 240, t: '8%' },
              { x: 268, y: 240, t: '14%' },
            ].map((a, i) => (
              <motion.rect
                key={i}
                x={a.x} y={a.y} width={28} height={28} rx={6}
                fill={`color-mix(in srgb, var(--accent, #0E7A69) ${a.t}, transparent)`}
                animate={active(1) ? { scale: 1 } : { scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.3, delay: i * 0.07 }}
              />
            ))}

            <motion.circle
              cx={238} cy={210} r={8}
              fill="var(--accent, #0E7A69)"
              animate={active(1) ? { r: [8, 24], opacity: [0.35, 0] } : {}}
              transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
            />

            <rect x={244} y={335} width={20} height={3} rx={1.5}
              fill="var(--muted, #6c665e)" opacity={0.4}
            />
          </motion.g>

          {/* ---- Scene 2 — App opens, list scrolls ---- */}
          <motion.g
            initial={false}
            animate={{ opacity: active(2) ? 1 : 0 }}
            transition={{ duration: 0.25 }}
            clipPath="url(#phoneScreenClip)"
          >
            {/* Fixed header — stays put while the list underneath scrolls */}
            <rect x={222} y={180} width={76} height={20} rx={4}
              fill="color-mix(in srgb, var(--accent, #0E7A69) 10%, transparent)"
            />
            <circle cx={228} cy={190} r={4}
              fill="var(--accent, #0E7A69)" opacity={0.6}
            />
            <rect x={244} y={186} width={30} height={7} rx={3}
              fill="var(--muted, #6c665e)" opacity={0.25}
            />
            <circle cx={232} cy={188} r={2}
              fill="var(--accent, #0E7A69)"
            />
            <motion.circle
              cx={232} cy={188} r={5}
              fill="none"
              stroke="var(--accent, #0E7A69)"
              strokeWidth={1.5}
              animate={active(2)
                ? { r: [5, 10], opacity: [0.6, 0] }
                : {}}
              transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
            />

            {/* Scrollable list — clipped by the phone screen, translates up mid-scene
                so a 4th card visibly scrolls into view instead of overflowing the frame */}
            <motion.g
              animate={active(2) ? { y: [0, 0, -76] } : { y: 0 }}
              transition={{ duration: 1.8, times: [0, 0.35, 1], ease: 'easeInOut' }}
            >
              {[
                { y: 210, t: '12%' },
                { y: 254, t: '8%' },
                { y: 298, t: '10%' },
                { y: 342, t: '14%' },
              ].map((c, i) => (
                <motion.g key={i}>
                  <motion.rect
                    x={224} y={c.y} width={72} height={34} rx={5}
                    fill={`color-mix(in srgb, var(--accent, #0E7A69) ${c.t}, transparent)`}
                    animate={active(2) ? { y: c.y, opacity: 1 } : { y: c.y + 10, opacity: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.1, ease: 'easeOut' }}
                  />
                  <motion.rect
                    x={232} y={c.y + 7} width={40} height={4} rx={2}
                    fill="var(--accent, #0E7A69)" opacity={0.5}
                    transition={{ duration: 0.25, delay: i * 0.1 + 0.12 }}
                  />
                  <motion.rect
                    x={232} y={c.y + 16} width={56} height={3} rx={1.5}
                    fill="var(--muted, #6c665e)" opacity={0.2}
                    transition={{ duration: 0.25, delay: i * 0.1 + 0.17 }}
                  />
                  <motion.rect
                    x={232} y={c.y + 23} width={30} height={3} rx={1.5}
                    fill="var(--muted, #6c665e)" opacity={0.15}
                    transition={{ duration: 0.25, delay: i * 0.1 + 0.22 }}
                  />
                </motion.g>
              ))}
            </motion.g>

            {/* Fixed home indicator */}
            <rect x={244} y={335} width={20} height={3} rx={1.5}
              fill="var(--muted, #6c665e)" opacity={0.4}
            />
          </motion.g>
        </motion.g>

        {/*
         * DESKTOP FRAME – scenes 3-7
         */}
        {!isMobile && (
          <motion.g
            initial={false}
            animate={{
              opacity: active(3, 4, 5, 6, 7) ? 1 : 0,
              x: active(3, 4, 5, 6, 7) ? 0 : 80,
            }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <rect x={125} y={158} width={270} height={200} rx={10}
              fill="var(--bg, #f6f5f2)"
              stroke="var(--line, rgba(21,18,15,0.13))" strokeWidth={1.5}
            />
            <rect x={130} y={163} width={260} height={190} rx={6}
              fill="var(--surface, #fff)"
              stroke="var(--line, rgba(21,18,15,0.13))" strokeWidth={1}
            />

            <g>
              <circle cx={142} cy={174} r={3.5} fill="#ff5f57" />
              <circle cx={154} cy={174} r={3.5} fill="#febc2e" />
              <circle cx={166} cy={174} r={3.5} fill="#28c840" />
              <rect x={178} y={169} width={140} height={12} rx={6}
                fill="var(--bg, #f6f5f2)"
                stroke="var(--line, rgba(21,18,15,0.13))" strokeWidth={0.5}
              />

              <motion.text
                x={190} y={178}
                fontSize={7} fontFamily="monospace"
                fill="var(--muted, #6c665e)"
                animate={active(3) ? { opacity: [0, 0.6] } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                cuvatex.com
              </motion.text>

              <motion.rect
                x={130} y={182} width={260} height={2} rx={1}
                fill="var(--accent, #0E7A69)"
                animate={active(3) ? { opacity: [0.08, 0.35, 0.08] } : {}}
                transition={{ duration: 1.2, repeat: 1, ease: 'easeInOut' }}
              />
            </g>

            {/* ---- Scene 4 — Dashboard ---- */}
            <motion.g
              initial={false}
              animate={{ opacity: active(4) ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <rect x={138} y={190} width={28} height={155} rx={3}
                fill="color-mix(in srgb, var(--accent, #0E7A69) 6%, transparent)"
              />

              {[
                { x: 174, l: '98%' },
                { x: 234, l: '12k' },
                { x: 294, l: '4.9' },
              ].map((s, i) => (
                <g key={i}>
                  <motion.rect
                    x={s.x} y={194} width={52} height={28} rx={4}
                    fill="color-mix(in srgb, var(--accent, #0E7A69) 8%, transparent)"
                    animate={active(4) ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.06 }}
                  />
                  <motion.text
                    x={s.x + 26} y={213}
                    textAnchor="middle" fontSize={10} fontWeight={600}
                    fill="var(--accent, #0E7A69)"
                    animate={active(4) ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.06 + 0.08 }}
                  >
                    {s.l}
                  </motion.text>
                </g>
              ))}

              <rect x={174} y={230} width={40} height={4} rx={2}
                fill="var(--muted, #6c665e)" opacity={0.2}
              />
              {[
                { x: 180, h: 35 }, { x: 210, h: 62 },
                { x: 240, h: 45 }, { x: 270, h: 78 },
                { x: 300, h: 52 },
              ].map((b, i) => (
                <g key={i}>
                  <rect x={b.x} y={250} width={18} height={78} rx={3}
                    fill="color-mix(in srgb, var(--accent, #0E7A69) 6%, transparent)"
                  />
                  <motion.rect
                    x={b.x} y={328} width={18} height={0} rx={3}
                    fill="var(--accent, #0E7A69)" opacity={0.6}
                    animate={active(4)
                      ? { height: b.h, y: 328 - b.h }
                      : { height: 0, y: 328 }}
                    transition={{ duration: 0.4, delay: 0.25 + i * 0.08 }}
                  />
                </g>
              ))}
            </motion.g>

            {/* ---- Scene 5 — Build log + Layers panel ---- */}
            <motion.g
              initial={false}
              animate={{ opacity: active(5) ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              clipPath="url(#browserClip)"
            >
              <line x1={260} y1={192} x2={260} y2={347}
                stroke="var(--line, rgba(21,18,15,0.13))" strokeWidth={1}
              />

              {/* Left panel — Layers panel (Figma-style) */}
              <rect x={140} y={190} width={112} height={155} rx={3}
                fill="color-mix(in srgb, var(--accent, #0E7A69) 4%, transparent)"
              />
              <motion.rect
                x={146} y={196} width={24} height={5} rx={2}
                fill="var(--accent, #0E7A69)" opacity={0.5}
                animate={active(5) ? { opacity: 0.5 } : { opacity: 0 }}
                transition={{ duration: 0.2, delay: 0.06 }}
              />
              <motion.rect
                x={240} y={196} width={6} height={5} rx={1.5}
                fill="var(--muted, #6c665e)" opacity={0.3}
                animate={active(5) ? { opacity: 0.3 } : { opacity: 0 }}
                transition={{ duration: 0.2, delay: 0.08 }}
              />

              {[
                { y: 216, w: 28, a: false },
                { y: 232, w: 24, a: false },
                { y: 248, w: 32, a: true },
                { y: 264, w: 26, a: false },
                { y: 280, w: 20, a: false },
                { y: 296, w: 22, a: false },
                { y: 312, w: 24, a: false },
              ].map((ly, i) => (
                <motion.g key={i}>
                  <motion.rect
                    x={148} y={ly.y + 1} width={2} height={2} rx={1}
                    fill="var(--muted, #6c665e)" opacity={0.25}
                    animate={active(5) ? { opacity: 0.25 } : { opacity: 0 }}
                    transition={{ duration: 0.2, delay: 0.1 + i * 0.04 }}
                  />
                  <motion.rect
                    x={154} y={ly.y} width={4} height={4} rx={1}
                    fill={ly.a ? 'var(--accent, #0E7A69)' : 'var(--muted, #6c665e)'}
                    opacity={ly.a ? 0.7 : 0.2}
                    animate={active(5) ? { opacity: ly.a ? 0.7 : 0.2 } : { opacity: 0 }}
                    transition={{ duration: 0.2, delay: 0.1 + i * 0.04 }}
                  />
                  <motion.rect
                    x={162} y={ly.y + 1} width={ly.w} height={3} rx={1.5}
                    fill={ly.a ? 'var(--accent, #0E7A69)' : 'var(--muted, #6c665e)'}
                    opacity={ly.a ? 0.6 : 0.2}
                    animate={active(5) ? { opacity: ly.a ? 0.6 : 0.2 } : { opacity: 0 }}
                    transition={{ duration: 0.2, delay: 0.1 + i * 0.04 }}
                  />
                  {ly.a && (
                    <motion.rect
                      x={142} y={ly.y - 2} width={2} height={8} rx={1}
                      fill="var(--accent, #0E7A69)"
                      animate={active(5) ? { opacity: 0.7 } : { opacity: 0 }}
                      transition={{ duration: 0.2, delay: 0.14 + i * 0.04 }}
                    />
                  )}
                </motion.g>
              ))}

              {/* Right panel — Build log (scrolls up) */}
              <rect x={268} y={190} width={114} height={155} rx={3}
                fill="color-mix(in srgb, var(--accent, #0E7A69) 3%, transparent)"
              />

              <motion.g
                animate={active(5) ? { y: [0, 0, -96] } : { y: 0 }}
                transition={{ duration: 1.6, times: [0, 0.3, 1], ease: 'easeInOut' }}
              >
                {[
                  { y: 202, t: '$', w: 68, o: 0.5 },
                  { y: 214, t: '' , w: 52, o: 0.35 },
                  { y: 226, t: '$', w: 56, o: 0.5 },
                  { y: 238, t: '' , w: 60, o: 0.35 },
                  { y: 250, t: '$', w: 44, o: 0.5 },
                  { y: 262, t: '' , w: 64, o: 0.25 },
                  { y: 274, t: '' , w: 58, o: 0.25 },
                  { y: 286, t: '' , w: 70, o: 0.4 },
                  { y: 298, t: '$', w: 62, o: 0.5 },
                  { y: 310, t: '' , w: 76, o: 0.3 },
                  { y: 322, t: '' , w: 56, o: 0.25 },
                  { y: 334, t: '' , w: 68, o: 0.35 },
                  { y: 346, t: '$', w: 72, o: 0.5 },
                  { y: 358, t: '' , w: 60, o: 0.3 },
                  { y: 370, t: '' , w: 48, o: 0.25 },
                  { y: 382, t: '' , w: 66, o: 0.4 },
                  { y: 394, t: '' , w: 74, o: 0.35 },
                  { y: 406, t: '' , w: 52, o: 0.25 },
                ].map((l, i) => (
                  <motion.g key={i}>
                    {l.t === '$' && (
                      <motion.text
                        x={276} y={l.y + 3}
                        fontSize={5} fontFamily="monospace"
                        fill="var(--accent, #0E7A69)"
                        opacity={0.6}
                        animate={active(5) ? { opacity: 0.6 } : { opacity: 0 }}
                        transition={{ duration: 0.15, delay: 0.08 + i * 0.03 }}
                      >
                        $
                      </motion.text>
                    )}
                    <motion.rect
                      x={l.t === '$' ? 282 : 276}
                      y={l.y} width={l.w} height={3} rx={1.5}
                      fill={i % 3 === 0 ? 'var(--accent, #0E7A69)' : 'var(--muted, #6c665e)'}
                      opacity={l.o}
                      animate={active(5) ? { opacity: l.o } : { opacity: 0 }}
                      transition={{ duration: 0.15, delay: 0.08 + i * 0.03 }}
                    />
                  </motion.g>
                ))}
              </motion.g>

              {/* Scrollbar */}
              <rect x={378} y={190} width={2} height={155} rx={1}
                fill="var(--line, rgba(21,18,15,0.13))" opacity={0.3}
              />
              <motion.rect
                x={378}
                animate={active(5) ? { y: [190, 244] } : { y: 190 }}
                width={2} height={101} rx={1}
                fill="var(--accent, #0E7A69)" opacity={0.4}
                transition={{ duration: 1.6, times: [0, 0.3, 1], ease: 'easeInOut' }}
              />
            </motion.g>

            {/* ---- Scene 6 — Deployment Success ---- */}
            <motion.g
              initial={false}
              animate={{ opacity: active(6) ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              clipPath="url(#browserClip)"
            >
              {/* Header — Deployments */}
              <rect x={136} y={188} width={56} height={14} rx={3}
                fill="color-mix(in srgb, var(--accent, #0E7A69) 6%, transparent)"
              />
              <rect x={142} y={192} width={24} height={5} rx={2}
                fill="var(--accent, #0E7A69)" opacity={0.5}
              />

              {/* Branch pill */}
              <rect x={200} y={190} width={20} height={10} rx={3}
                fill="var(--line, rgba(21,18,15,0.13))" opacity={0.4}
              />
              <rect x={206} y={193} width={8} height={4} rx={2}
                fill="var(--muted, #6c665e)" opacity={0.3}
              />

              {/* 3 status dots that light up sequentially */}
              {[0, 1, 2].map(i => (
                <motion.circle
                  key={i}
                  cx={234 + i * 8} cy={195} r={2}
                  fill="var(--accent, #0E7A69)"
                  initial={{ opacity: 0.2 }}
                  animate={active(6) ? { opacity: [0.2, 0.7, 0.7] } : { opacity: 0.2 }}
                  transition={{ duration: 0.4, delay: i * 0.35, ease: 'easeInOut' }}
                />
              ))}

              {/* Divider */}
              <rect x={136} y={204} width={248} height={1}
                fill="var(--line, rgba(21,18,15,0.13))" opacity={0.2}
              />

              {/* Scrollable deployment log */}
              <motion.g
                animate={active(6) ? { y: [0, 0, -56] } : { y: 0 }}
                transition={{ duration: 1.4, times: [0, 0.3, 1], ease: 'easeInOut' }}
              >
                {[
                  { y: 212, s: 'cmd', w: 64, o: 0.5 },
                  { y: 226, s: 'out', w: 52, o: 0.35 },
                  { y: 240, s: 'cmd', w: 60, o: 0.5 },
                  { y: 254, s: 'out', w: 56, o: 0.3 },
                  { y: 268, s: 'cmd', w: 62, o: 0.5 },
                  { y: 282, s: 'out', w: 50, o: 0.35 },
                  { y: 296, s: 'cmd', w: 58, o: 0.5 },
                  { y: 310, s: 'out', w: 54, o: 0.3 },
                  { y: 324, s: 'cmd', w: 56, o: 0.5 },
                  { y: 338, s: 'out', w: 60, o: 0.35 },
                  { y: 352, s: 'cmd', w: 62, o: 0.5 },
                  { y: 366, s: 'out', w: 48, o: 0.3 },
                  { y: 380, s: 'url', w: 54, o: 0.6 },
                  { y: 394, s: 'end', w: 50, o: 0.5 },
                ].map((l, i) => (
                  <motion.rect
                    key={i}
                    x={l.s === 'cmd' ? 136 : l.s === 'end' ? 142 : 144}
                    y={l.y}
                    width={l.w}
                    height={l.s === 'end' ? 5 : 3}
                    rx={1.5}
                    fill={
                      l.s === 'url' ? 'var(--accent, #0E7A69)' :
                      l.s === 'end' ? 'var(--accent, #0E7A69)' :
                      l.s === 'cmd' ? 'var(--accent, #0E7A69)' :
                      'var(--muted, #6c665e)'
                    }
                    opacity={l.o}
                    animate={active(6) ?
                      (l.s === 'url' ? { opacity: [0.6, 1, 0.6] } :
                       l.s === 'end' ? { opacity: [0.5, 0.9, 0.5] } :
                       { opacity: l.o })
                      : { opacity: 0 }}
                    transition={
                      l.s === 'url' || l.s === 'end'
                        ? { duration: 0.6, delay: 0.9, repeat: 1, ease: 'easeInOut' }
                        : { duration: 0.15, delay: 0.06 + i * 0.03 }}
                  />
                ))}
              </motion.g>

              {/* Scrollbar */}
              <rect x={378} y={188} width={2} height={155} rx={1}
                fill="var(--line, rgba(21,18,15,0.13))" opacity={0.3}
              />
              <motion.rect
                x={378}
                animate={active(6) ? { y: [188, 228] } : { y: 188 }}
                width={2} height={115} rx={1}
                fill="var(--accent, #0E7A69)" opacity={0.4}
                transition={{ duration: 1.4, times: [0, 0.3, 1], ease: 'easeInOut' }}
              />

              {/* Celebration — mini logo diamond */}
              <motion.g
                animate={active(6) ? { opacity: [0, 1] } : { opacity: 0 }}
                transition={{ duration: 0.3, delay: 1.1 }}
              >
                <g transform="translate(248, 298) scale(0.035)">
                  {LOGO_PATHS.map((d, i) => (
                    <path
                      key={i}
                      fillRule="evenodd" clipRule="evenodd"
                      d={d}
                      fill="var(--accent, #0E7A69)"
                    />
                  ))}
                </g>
              </motion.g>

              {/* Sparkle particles burst from logo */}
              {[
                { dx: -12, dy: -8 },
                { dx: 12, dy: -10 },
                { dx: -8, dy: 8 },
                { dx: 10, dy: 10 },
                { dx: 0, dy: -14 },
              ].map((sp, i) => (
                <motion.g
                  key={i}
                  animate={active(6) ? {
                    x: [260, 260 + sp.dx],
                    y: [298, 298 + sp.dy],
                    opacity: [0, 0.8, 0],
                  } : { opacity: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 + i * 0.06, ease: 'easeOut' }}
                >
                  <motion.circle
                    cx={0} cy={0}
                    fill="var(--accent, #0E7A69)"
                    animate={active(6) ? { r: [0, 1.5, 0] } : { r: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 + i * 0.06, ease: 'easeOut' }}
                  />
                </motion.g>
              ))}

              {/* LIVE badge */}
              <motion.g
                animate={active(6) ? { opacity: [0, 1] } : { opacity: 0 }}
                transition={{ duration: 0.3, delay: 1.3 }}
              >
                <rect x={360} y={190} width={28} height={12} rx={6}
                  fill="var(--accent, #0E7A69)" opacity={0.15}
                />
                <text x={374} y={199}
                  textAnchor="middle" fontSize={6} fontWeight={700}
                  fill="var(--accent, #0E7A69)"
                >
                  LIVE
                </text>
              </motion.g>
            </motion.g>
          </motion.g>
        )}
      </svg>
    </motion.div>
  );
}
