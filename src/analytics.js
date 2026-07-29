/**
 * Umami analytics.
 *
 * Cookieless and collects no personal data, so no consent banner is needed.
 *
 * Both values are build-time config: Vite inlines every `VITE_*` variable into
 * the shipped bundle, so neither is a secret. The website id is public by
 * design. Keeping the script URL in env too means moving from Umami Cloud to a
 * self-hosted instance is a config change, not a code change.
 */
const SCRIPT_URL = import.meta.env.VITE_UMAMI_SCRIPT_URL;
const WEBSITE_ID = import.meta.env.VITE_UMAMI_WEBSITE_ID;

/**
 * Injects the tracker script, which then records the pageview by itself.
 * No-op during development and when unconfigured, so local page loads never
 * pollute the dashboard.
 */
export function loadAnalytics() {
  if (!import.meta.env.PROD) return;
  if (!SCRIPT_URL || !WEBSITE_ID) return;
  if (document.querySelector('script[data-website-id]')) return;

  const script = document.createElement('script');
  script.src = SCRIPT_URL;
  script.defer = true;
  script.dataset.websiteId = WEBSITE_ID;
  document.head.appendChild(script);
}

/**
 * Records a custom event. Does nothing when the tracker is absent — in
 * development, when unconfigured, or when an ad blocker stopped the script —
 * so callers never have to guard.
 */
export function track(name, data) {
  window.umami?.track(name, data);
}
