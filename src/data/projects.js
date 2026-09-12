// Structural project data. Copy lives in src/i18n/{en,fr,ar}.json under `projects.<slug>`.
// `tagKey` points at the shared `tags` map in the locale files so tag labels stay translated once.
// `shots` is how many gallery images the case study renders.

export const projects = [
  { slug: 'ecomassistant', tagKey: 'api', shots: 9 },
  { slug: 'nktex', tagKey: 'mobile', shots: 10 },
  { slug: 'dentora', tagKey: 'web', shots: 7 },
  { slug: 'groundwork', tagKey: 'web', shots: 11 },
  { slug: 'apex-motors', tagKey: 'web', shots: 12 },
];

const GALLERY = {
  ecomassistant: [
    '/images/projects/ecomassistant/hero.png',
    '/images/projects/ecomassistant/dashboard.png',
    '/images/projects/ecomassistant/orders.png',
    '/images/projects/ecomassistant/products.png',
    '/images/projects/ecomassistant/clients.png',
    '/images/projects/ecomassistant/escalades.png',
    '/images/projects/ecomassistant/notifications.png',
    '/images/projects/ecomassistant/agentSettings.png',
    '/images/projects/ecomassistant/whatsappSettings.png',
  ],
  nktex: [
    { src: '/images/projects/nktex/nktexHero.png', kind: 'desktop' },
    { src: '/images/projects/nktex/login.jpg', kind: 'mobile' },
    { src: '/images/projects/nktex/products.jpg', kind: 'mobile' },
    { src: '/images/projects/nktex/add-product.jpg', kind: 'mobile' },
    { src: '/images/projects/nktex/dashboard.jpg', kind: 'mobile' },
    { src: '/images/projects/nktex/entries.jpg', kind: 'mobile' },
    { src: '/images/projects/nktex/generate-report.jpg', kind: 'mobile' },
    { src: '/images/projects/nktex/add-user.jpg', kind: 'mobile' },
    { src: '/images/projects/nktex/users.jpg', kind: 'mobile' },
    { src: '/images/projects/nktex/locations.jpg', kind: 'mobile' },
  ],
  dentora: [
    '/images/projects/dentora/hero.png',
    '/images/projects/dentora/hero-section.png',
    '/images/projects/dentora/process.png',
    '/images/projects/dentora/services.png',
    '/images/projects/dentora/testimonials.png',
    '/images/projects/dentora/booking-popup.png',
    '/images/projects/dentora/contact-footer.png',
  ],
  groundwork: [
    '/images/projects/groundwork/hero.png',
    '/images/projects/groundwork/hero-section.png',
    '/images/projects/groundwork/menu-home.png',
    '/images/projects/groundwork/menu-page.png',
    '/images/projects/groundwork/add-to-cart.png',
    '/images/projects/groundwork/checkout.png',
    '/images/projects/groundwork/order-confirmed.png',
    '/images/projects/groundwork/admin-login.png',
    '/images/projects/groundwork/admin-dashboard.png',
    '/images/projects/groundwork/orders-queue.png',
    '/images/projects/groundwork/inventory.png',
  ],
  'apex-motors': [
    '/images/projects/apex-motors/hero.png',
    '/images/projects/apex-motors/hero-section.png',
    '/images/projects/apex-motors/inventory-home.png',
    '/images/projects/apex-motors/inventory-page.png',
    '/images/projects/apex-motors/financing.png',
    '/images/projects/apex-motors/trade-in.png',
    '/images/projects/apex-motors/services.png',
    '/images/projects/apex-motors/reviews-cta.png',
    '/images/projects/apex-motors/contact-footer.png',
    '/images/projects/apex-motors/admin-dashboard.png',
    '/images/projects/apex-motors/admin-vehicles.png',
    '/images/projects/apex-motors/admin-orders.png',
  ],
};

const resolve = (entry) => (typeof entry === 'string' ? entry : entry.src);

export const cardImage = (slug) => {
  const g = GALLERY[slug];
  if (g?.length) return resolve(g[0]);
  return `https://picsum.photos/seed/${slug}/600/450`;
};

export const heroImage = (slug) => {
  const g = GALLERY[slug];
  if (g?.length) return resolve(g[0]);
  return `https://picsum.photos/seed/${slug}/1600/900`;
};

export const shotImage = (slug, n) => {
  const g = GALLERY[slug];
  if (g && n >= 1 && n <= g.length) {
    const entry = g[n - 1];
    return { src: resolve(entry), kind: typeof entry === 'string' ? 'desktop' : entry.kind };
  }
  return { src: `https://picsum.photos/seed/${slug}-${n}/1000/700`, kind: 'desktop' };
};

export function findProject(slug) {
  return projects.find((p) => p.slug === slug) || null;
}

export function nextProject(slug) {
  const i = projects.findIndex((p) => p.slug === slug);
  if (i === -1) return null;
  return projects[(i + 1) % projects.length];
}
