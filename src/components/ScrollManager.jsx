import { useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router';
import { useReducedMotion } from 'framer-motion';

// Renders nothing. Owns the two things react-router deliberately does not do:
// where the page is scrolled after a navigation, and where keyboard focus lands.
//
// It replaces the hand-rolled `handleNavClick` that used to live in MobileMenu,
// so every nav link — desktop, mobile panel, footer, in-page CTA — goes through
// one code path.
export default function ScrollManager() {
  const { pathname, hash, key } = useLocation();
  const navType = useNavigationType();
  const reduce = useReducedMotion();

  const firstRun = useRef(true);
  const prevPath = useRef(pathname);

  // useLayoutEffect, not useEffect: this runs synchronously after React commits
  // the new page and *before* the browser paints it. With useEffect the old
  // scroll offset survived into the first painted frame, and two things broke.
  //
  // 1. The new page appeared mid-scroll and then slid up to the top. Measured:
  //    clicking a project card from the bottom of the homepage rendered the case
  //    study at y=2635 and travelled to 0.
  // 2. Anything using `useInView({ once: true })` latched against that stale
  //    offset. IntersectionObserver reports during the same frame, so the metric
  //    counters at ~y=1000 counted themselves up while the page was flying past
  //    them and read as finished by the time the reader actually got there.
  //
  // Both disappear if nothing is ever painted at the old offset.
  useLayoutEffect(() => {
    const isFirst = firstRun.current;
    firstRun.current = false;
    const changedPage = prevPath.current !== pathname;
    prevPath.current = pathname;

    // First paint. A visitor landing on `/#contact` gets no scroll from the
    // browser, because at HTML-parse time React has not rendered `#contact` yet —
    // so that one case is ours to handle. Without a hash, do nothing: the browser
    // restores its own offset on reload and we would only fight it.
    if (isFirst && !hash) return undefined;

    // Back / Forward. The browser remembers where the user was on that entry;
    // scrolling here would dump them at the top of the page they just returned to.
    if (navType === 'POP' && !isFirst) return undefined;

    const target = hash ? document.getElementById(hash.slice(1)) : null;

    if (target) {
      // Not covered by MotionConfig — AGENTS.md 2c. Gated by hand.
      target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    } else {
      // `behavior: 'instant'` explicitly, not a temporary inline `scroll-behavior`
      // override: the two-argument `scrollTo(0, 0)` reads the *computed* value, so
      // it can still pick up `html { scroll-behavior: smooth }` from index.css and
      // animate. A page change should cut, not travel.
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }

    // Focus follows the navigation, or a keyboard user's next Tab restarts from
    // the top of the document and a screen reader announces nothing. `<main>` is
    // already `tabIndex={-1}` for the skip link, so it is a valid target, and
    // `main:focus { outline: none }` in index.css keeps it from drawing a ring
    // around the whole page. Skipped for same-page hash jumps, where the user's
    // focus is already where they put it.
    if (changedPage) {
      document.getElementById('main')?.focus({ preventScroll: true });
    }

    return undefined;
  }, [pathname, hash, key, navType, reduce]);

  return null;
}
