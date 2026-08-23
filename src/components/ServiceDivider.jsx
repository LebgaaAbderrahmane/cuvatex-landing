import { useTranslation } from 'react-i18next';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE } from '../lib/motion';

// Hairline between two service rows. Draws in from the side the *next* row's
// photo sits on, accent-coloured at that end. `index` is the row that
// follows this divider, not the one above it.
export default function ServiceDivider({ index }) {
  const { i18n } = useTranslation();
  const reduce = useReducedMotion();
  const rtl = i18n.dir() === 'rtl';
  const isEven = index % 2 === 0;

  // Must match ServiceCard's own photoOnLeft calculation.
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
