// Small pure text helpers shared across components.

/**
 * Two-letter initials for an avatar placeholder.
 *
 * Team and Testimonials each had their own copy of this. Team's was the looser
 * one — no `filter`, no `toUpperCase`, no length cap — so a lowercase name, a
 * double space, or a three-word name would have rendered differently in the two
 * sections. Both produce the same output for the names currently in the app, so
 * standardising on the stricter version changes nothing visible today and stops
 * the two drifting apart when a name is added.
 */
export function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Arabic reads right-to-left, so a "forward" arrow has to point the other way.
// Escapes rather than literal glyphs: the two are visually identical in an
// editor, which is how Hero and CtaBanner ended up with one of each.
const DIR_ARROW = { en: '→', fr: '→', ar: '←' };

/** The forward-pointing arrow for a language, defaulting to left-to-right. */
export function dirArrow(lang) {
  return DIR_ARROW[lang] || '→';
}
