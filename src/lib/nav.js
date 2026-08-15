// Navigation helpers. No React in here — the desktop nav and the mobile panel
// both need this answer and must not disagree about it.

/**
 * Is this nav entry the page we are on?
 *
 * Only route entries can be, so today that is `work` alone. The other six
 * entries in `Header.jsx`'s `sections` point at hashes on the homepage; testing
 * those against the pathname would mark all six at once on `/`, which tells the
 * visitor nothing.
 *
 * `startsWith` so a case study at `/work/atlas-retail` still marks "Work" — a
 * visitor reading one is still inside that part of the site.
 */
export function isCurrentSection(to, pathname) {
  if (to.includes('#')) return false;
  return pathname === to || pathname.startsWith(`${to}/`);
}
