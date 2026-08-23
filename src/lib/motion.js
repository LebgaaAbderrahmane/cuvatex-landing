// Shared motion constants. main.jsx's reducedMotion="user" wrapper handles
// *whether* things animate; this file owns *how*, so one curve change lands everywhere.

// The house easing curve, used across most animated components.
export const EASE = [0.2, 0.6, 0.2, 1];

// The hero's own curve. Sharper than EASE — it lands almost immediately and
// settles, which is what keeps the 400 ms entrance from feeling slow.
// Hero.jsx and HeroShowcase.jsx only; changing EASE would move the whole site.
export const HERO_EASE = [0.16, 1, 0.3, 1];
