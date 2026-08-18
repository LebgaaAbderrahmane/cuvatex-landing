import { useRef, useEffect, useState, useMemo } from 'react';
import { useInView, animate } from 'framer-motion';
import { EASE } from '../lib/motion';

// Splits "-64%" / "2,4x" / "4 yrs" into prefix/number/suffix so the number can
// count up while the rest stays intact. Returns null if there's no number.
function parseMetric(value) {
  const m = String(value).match(/^(\D*)(\d+(?:[.,]\d+)?)(.*)$/);
  if (!m) return null;
  const digits = m[2];
  const separator = digits.includes(',') ? ',' : '.';
  const split = digits.split(/[.,]/);
  return {
    prefix: m[1],
    suffix: m[3],
    target: Number(digits.replace(',', '.')),
    separator,
    decimals: split.length > 1 ? split[1].length : 0,
  };
}

/**
 * Counts a "40+" / "-64%" / "2,4x" style value up from 0 once `ref` scrolls
 * into view, once. Returns [ref, displayText] — attach `ref` to the element
 * that should trigger the count when it becomes visible.
 */
export default function useCountUp(value, reduce) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  // Parsed once per value, or a fresh object every render restarts the animation.
  const parsed = useMemo(() => parseMetric(value), [value]);
  const [n, setN] = useState(() => (parsed && !reduce ? 0 : parsed ? parsed.target : 0));

  useEffect(() => {
    if (!parsed || reduce || !inView) return undefined;
    const controls = animate(0, parsed.target, {
      duration: 1.1,
      ease: EASE,
      onUpdate: setN,
    });
    return () => controls.stop();
  }, [inView, reduce, parsed]);

  const text = parsed
    ? `${parsed.prefix}${n.toFixed(parsed.decimals).replace('.', parsed.separator)}${parsed.suffix}`
    : value;

  return [ref, text];
}
