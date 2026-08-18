// Navigation helpers. No React in here — the desktop nav and the mobile panel
// both need this answer and must not disagree about it.

// Is this nav entry the page we're on? `startsWith` so a case study at
// /work/atlas-retail still marks "Work". The `#` guard is defensive — costs
// nothing, and stops a future hash-based entry from matching every section at once.
export function isCurrentSection(to, pathname) {
  if (to.includes('#')) return false;
  return pathname === to || pathname.startsWith(`${to}/`);
}
