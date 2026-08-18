// Umami analytics — cookieless, no personal data, no consent banner needed.
// Both env values are build-time config, inlined by Vite; neither is a secret.
const SCRIPT_URL = import.meta.env.VITE_UMAMI_SCRIPT_URL;
const WEBSITE_ID = import.meta.env.VITE_UMAMI_WEBSITE_ID;

// Injects the tracker script, which records the pageview itself. No-op in
// dev and when unconfigured, so local page loads don't pollute the dashboard.
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

// Records a custom event. No-op when the tracker is absent, so callers never
// have to guard.
export function track(name, data) {
  window.umami?.track(name, data);
}
