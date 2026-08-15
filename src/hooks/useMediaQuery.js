import { useState, useEffect } from 'react';

/**
 * Subscribes to a CSS media query and re-renders when it flips.
 *
 * Replaces four near-identical hand-rolled copies (Header, Services, Process,
 * Work). The query stays at the call site because those are *different* rules,
 * not copies of one: 767px collapses the nav and switches the Work and Process
 * layouts, 949px drops the Services sticky stack.
 *
 * The initial value is read synchronously, so the first render already matches
 * the real viewport. Two of the four copies this replaced started at `false` and
 * corrected in an effect, which rendered the desktop branch on the first frame
 * on a phone — docs/AUDIT.md item 35.
 */
export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = e => setMatches(e.matches);
    setMatches(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}
