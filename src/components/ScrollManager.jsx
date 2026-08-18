import { useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router';
import { useReducedMotion } from 'framer-motion';

// Renders nothing. Owns scroll position and focus on navigation, since
// react-router does neither. Single code path for every nav link.
export default function ScrollManager() {
  const { pathname, hash, key } = useLocation();
  const navType = useNavigationType();
  const reduce = useReducedMotion();

  const firstRun = useRef(true);
  const prevPath = useRef(pathname);

  // useLayoutEffect (not useEffect): runs before paint, so the new page
  // never flashes at the old page's scroll offset first.
  useLayoutEffect(() => {
    const isFirst = firstRun.current;
    firstRun.current = false;
    const changedPage = prevPath.current !== pathname;
    prevPath.current = pathname;

    // First paint with a hash: browser can't scroll to it yet, we do it instead.
    if (isFirst && !hash) return undefined;
    // Back/forward: let the browser restore its own remembered offset.
    if (navType === 'POP' && !isFirst) return undefined;

    const target = hash ? document.getElementById(hash.slice(1)) : null;

    if (target) {
      target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    } else {
      // 'instant' explicitly — scrollTo(0, 0) can pick up index.css's
      // smooth scroll-behavior and animate instead of cutting.
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }

    // Skip on same-page hash jumps — focus is already where the user put it.
    if (changedPage) {
      document.getElementById('main')?.focus({ preventScroll: true });
    }

    return undefined;
  }, [pathname, hash, key, navType, reduce]);

  return null;
}
