// Shared motion constants. main.jsx's reducedMotion="user" wrapper handles
// *whether* things animate; this file owns *how*, so one curve change lands everywhere.

// The house easing curve, used across most animated components.
export const EASE = [0.2, 0.6, 0.2, 1];
