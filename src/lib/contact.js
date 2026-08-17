// Contact details that more than one component links to.

/**
 * TODO(docs/AUDIT.md item 38): unresolved placeholder — this link is live on the
 * production site and goes nowhere.
 *
 * It lives here, and not in either component, because two of them link to it:
 * `Contact.jsx` for the direct link and `ContactForm.jsx` for the fallback shown
 * after a failed submission. When the real number arrives it is one edit here.
 * Format: country code, no `+`, no spaces — e.g. `https://wa.me/213XXXXXXXXX`.
 */
export const WHATSAPP_URL = 'https://wa.me/PHONE_NUMBER_PLACEHOLDER';

/**
 * TODO(docs/AUDIT.md item 42): unresolved placeholder — no real phone number yet.
 *
 * It lives here, not in `Footer.jsx`, for the same reason as `WHATSAPP_URL`
 * above: a shared value belongs in one place, not copied into every component
 * that needs it. Two exports rather than one, because a display string and a
 * `tel:` URL are not the same format — `tel:` cannot contain spaces. Update
 * both together when the real number arrives.
 */
export const PHONE_DISPLAY = '+1 000 000 0000';
export const PHONE_URL = 'tel:+10000000000';
