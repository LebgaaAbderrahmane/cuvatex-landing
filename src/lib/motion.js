// Shared motion constants.
//
// Framer's `reducedMotion="user"` wrapper in main.jsx handles *whether* things
// animate; this file only owns *how* they move, so that one curve change does
// not have to be applied in eight places by hand.

/**
 * The house easing curve. Was copy-pasted into eight call sites across
 * CaseStudy, Work, Faq, Header, HeroShowcase and ScrollReveal.
 */
export const EASE = [0.2, 0.6, 0.2, 1];
