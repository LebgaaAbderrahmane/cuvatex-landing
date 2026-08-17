import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE } from '../lib/motion';

// The hairline between two service rows. Draws in like it's being pulled
// taut, from the side the *next* row's photo sits on, coloured accent at
// that end fading to the ordinary line colour — so it previews which side
// is coming next, the same alternating rhythm the rows themselves use,
// instead of being a plain static rule that could belong to any list.
//
// `index` is the row that follows this divider, not the one above it.
export default function ServiceDivider({ index }) {
  const { i18n } = useTranslation();
  const reduce = useReducedMotion();
  const rtl = i18n.dir() === 'rtl';
  const isEven = index % 2 === 0;

  // ServiceCard lays rows out with flexDirection: isEven ? 'row' : 'row-reverse',
  // and `row` itself flips which physical side is first once dir="rtl" — so
  // "isEven" alone does not say which side a photo lands on. This must agree
  // with ServiceCard's own `photoOnLeft` calculation or the line would point
  // at the wrong side.
  const left = isEven === !rtl;

  return (
    <motion.div
      aria-hidden="true"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: reduce ? 0 : 0.8, ease: EASE }}
      style={{
        height: 1,
        transformOrigin: left ? 'left' : 'right',
        background: left
          ? 'linear-gradient(to right, var(--accent, #0E7A69), var(--line, rgba(21,18,15,0.13)) 55%)'
          : 'linear-gradient(to left, var(--accent, #0E7A69), var(--line, rgba(21,18,15,0.13)) 55%)',
      }}
    />
  );
}
