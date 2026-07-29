import { useState, useEffect, useRef, useCallback } from 'react';
import { findProject } from '../data/projects';

// The case-study overlay is addressable as `#case/<slug>`.
// The `case/` prefix cannot collide with the section anchors (#work, #services, ...),
// so opening one never triggers the smooth scroll set on `html` in index.css.
const HASH = /^#case\/(.+)$/;

function parseHash() {
  const m = window.location.hash.match(HASH);
  if (!m) return null;
  const slug = decodeURIComponent(m[1]);
  // An unknown slug reads as closed rather than opening an empty overlay.
  return findProject(slug) ? slug : null;
}

export default function useCaseRoute() {
  const [slug, setSlug] = useState(parseHash);
  // True while the overlay owns a history entry we pushed ourselves. If the user
  // landed straight on `#case/x`, going back would leave the site instead of closing.
  const pushed = useRef(false);

  useEffect(() => {
    function sync() {
      const next = parseHash();
      if (!next) pushed.current = false;
      setSlug(next);
    }
    window.addEventListener('hashchange', sync);
    window.addEventListener('popstate', sync);
    return () => {
      window.removeEventListener('hashchange', sync);
      window.removeEventListener('popstate', sync);
    };
  }, []);

  const open = useCallback((next) => {
    if (!findProject(next)) return;
    const url = `#case/${encodeURIComponent(next)}`;
    // Moving between case studies replaces the entry instead of stacking one per
    // project, so Back always returns to the page rather than the previous project.
    // The test is "is the overlay already open", not "did we push it" — a deep link
    // opens the overlay without a push of ours, and must not gain an entry here.
    if (parseHash()) {
      window.history.replaceState(null, '', url);
    } else {
      window.history.pushState(null, '', url);
      pushed.current = true;
    }
    // pushState/replaceState fire neither popstate nor hashchange.
    setSlug(next);
  }, []);

  const close = useCallback(() => {
    if (pushed.current) {
      // popstate then clears the state and resets `pushed`.
      window.history.back();
      return;
    }
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
    setSlug(null);
  }, []);

  return { slug, open, close };
}
