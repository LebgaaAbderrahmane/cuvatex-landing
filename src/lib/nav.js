// Navigation helpers. No React in here — the desktop nav and the mobile panel
// both need this answer and must not disagree about it.

/**
 * Is this nav entry the page we are on?
 *
 * Every entry in `Header.jsx`'s `sections` is a real route today, so this
 * mostly just compares paths. The `#` guard stays anyway: it costs nothing,
 * and it is what stops a future hash-based nav entry from getting marked
 * "current" on every homepage section at once, which happened the last time
 * this array mixed routes and hash anchors.
 *
 * `startsWith` so a case study at `/work/atlas-retail` still marks "Work" — a
 * visitor reading one is still inside that part of the site.
 */
export function isCurrentSection(to, pathname) {
  if (to.includes('#')) return false;
  return pathname === to || pathname.startsWith(`${to}/`);
}
