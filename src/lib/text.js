// Small pure text helpers shared across components.

// Two-letter initials for an avatar placeholder. Shared by Team and Testimonials.
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
