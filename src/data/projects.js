// Structural project data. Copy lives in src/i18n/{en,fr,ar}.json under `projects.<slug>`.
// `tagKey` points at the shared `tags` map in the locale files so tag labels stay translated once.
// `shots` is how many gallery images the case study renders.

export const projects = [
  { slug: 'atlas-retail', tagKey: 'web', shots: 2 },
  { slug: 'nordwind-api', tagKey: 'api', shots: 2 },
  { slug: 'lumen-studio', tagKey: 'product', shots: 3 },
  { slug: 'terra-fleet', tagKey: 'mobile', shots: 0 },
  { slug: 'okapi-books', tagKey: 'web', shots: 0 },
  { slug: 'vela-grid', tagKey: 'platform', shots: 0 },
  { slug: 'siren-labs', tagKey: 'web', shots: 0 },
  { slug: 'cobalt-pay', tagKey: 'api', shots: 0 },
];

// Seeds are derived from the slug, never the array index — an index seed would change
// the image whenever "Show all" shifts a card's position, and the card would stop
// matching its own case-study hero.
export const cardImage = (slug) => `https://picsum.photos/seed/${slug}/600/450`;
export const heroImage = (slug) => `https://picsum.photos/seed/${slug}/1600/900`;
export const shotImage = (slug, n) => `https://picsum.photos/seed/${slug}-${n}/1000/700`;

export function findProject(slug) {
  return projects.find((p) => p.slug === slug) || null;
}

export function nextProject(slug) {
  const i = projects.findIndex((p) => p.slug === slug);
  if (i === -1) return null;
  return projects[(i + 1) % projects.length];
}
