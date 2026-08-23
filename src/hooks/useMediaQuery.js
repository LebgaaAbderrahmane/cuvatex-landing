import { useState, useEffect } from 'react';

// Subscribes to a CSS media query and re-renders when it flips. Initial value
// is read synchronously so the first render already matches the real
// viewport — docs/AUDIT.md item 35.
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
