import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { WHATSAPP_URL, PHONE_URL, PHONE_DISPLAY } from '../lib/contact';
import { InstagramIcon, LinkedinIcon, GithubIcon, XIcon } from './icons/SocialIcons';

// Home isn't in Header's `sections` (the logo covers that job there), but the
// footer lists it explicitly.
const footerLinks = [
  { key: 'home', to: '/', labelKey: 'footerNav.home' },
  { key: 'services', to: '/services', labelKey: 'nav.services' },
  { key: 'work', to: '/work', labelKey: 'nav.work' },
  { key: 'about', to: '/about', labelKey: 'nav.about' },
  { key: 'contact', to: '/contact', labelKey: 'nav.contact' },
];

const legalLinks = [
  { key: 'terms', to: '/terms', labelKey: 'legal.termsNav' },
  { key: 'privacy', to: '/privacy', labelKey: 'legal.privacyNav' },
];

// Placeholder profile URLs — none of these accounts exist yet.
const socials = [
  { key: 'instagram', href: 'https://instagram.com/', Icon: InstagramIcon },
  { key: 'linkedin', href: 'https://linkedin.com/', Icon: LinkedinIcon },
  { key: 'github', href: 'https://github.com/', Icon: GithubIcon },
  { key: 'x', href: 'https://x.com/', Icon: XIcon },
];

const mutedColor = 'var(--muted, #6c665e)';
const fgColor = 'var(--fg, #15120f)';
const lineColor = 'var(--line, rgba(21,18,15,0.13))';

const headingStyle = {
  margin: '0 0 14px',
  fontSize: 13,
  fontWeight: 600,
  letterSpacing: '0.02em',
  textTransform: 'uppercase',
  color: fgColor,
};

// inline-flex + minHeight: 44 turns each text link into a full tappable row.
const linkStyle = {
  textDecoration: 'none',
  color: mutedColor,
  fontSize: 14,
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: 44,
  transition: 'color 0.2s',
};

// currentTarget, not target — several links wrap an icon, and hovering it
// would otherwise target the child SVG instead of the link.
function onLinkEnter(e) { e.currentTarget.style.color = fgColor; }
function onLinkLeave(e) { e.currentTarget.style.color = mutedColor; }

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer style={{
      borderTop: `1px solid ${lineColor}`,
      background: 'var(--surface, #fff)',
      padding: 'clamp(40px, 6vw, 64px) clamp(20px, 5vw, 48px) 24px',
    }}>
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '40px clamp(24px, 4vw, 48px)',
        }}>
          <div>
            <Link
              to="/"
              className="focus-ring"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                textDecoration: 'none',
                color: fgColor,
                fontWeight: 700,
                fontSize: 18,
                letterSpacing: '-0.01em',
                minHeight: 44,
              }}
            >
              <img
                src="/Cuvatex_logo.png"
                alt="CUVATEX"
                style={{ height: 26, width: 'auto', display: 'block' }}
              />
              CUVATEX
            </Link>
          </div>

          {/* Pages */}
          <nav aria-label={t('footerPagesHeading')}>
            <h2 style={headingStyle}>{t('footerPagesHeading')}</h2>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {footerLinks.map(link => (
                <Link
                  key={link.key}
                  to={link.to}
                  className="focus-ring"
                  style={linkStyle}
                  onMouseEnter={onLinkEnter}
                  onMouseLeave={onLinkLeave}
                >
                  {t(link.labelKey)}
                </Link>
              ))}
            </div>
          </nav>

          {/* Contact */}
          <div>
            <h2 style={headingStyle}>{t('footerContactHeading')}</h2>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <a
                href={`mailto:${t('email')}`}
                className="focus-ring"
                style={linkStyle}
                onMouseEnter={onLinkEnter}
                onMouseLeave={onLinkLeave}
              >
                {t('email')}
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring"
                style={linkStyle}
                onMouseEnter={onLinkEnter}
                onMouseLeave={onLinkLeave}
              >
                {t('whatsappLink')}
              </a>
              <a
                href={PHONE_URL}
                className="focus-ring"
                style={linkStyle}
                onMouseEnter={onLinkEnter}
                onMouseLeave={onLinkLeave}
              >
                {PHONE_DISPLAY}
              </a>
            </div>
          </div>

          {/* Follow us */}
          <div>
            <h2 style={headingStyle}>{t('footerFollowHeading')}</h2>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {socials.map(({ key, href, Icon }) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t(`footerSocial.${key}`)}
                  className="focus-ring"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 44,
                    height: 44,
                    color: mutedColor,
                    border: `1px solid ${lineColor}`,
                    borderRadius: 4,
                    transition: 'color 0.2s, border-color 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.color = fgColor;
                    e.currentTarget.style.borderColor = 'var(--accent, #0E7A69)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.color = mutedColor;
                    e.currentTarget.style.borderColor = lineColor;
                  }}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div style={{
          marginTop: 'clamp(32px, 5vw, 48px)',
          paddingTop: 20,
          borderTop: `1px solid ${lineColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
          fontSize: 14,
          color: mutedColor,
        }}>
          <span>{t('footer')}</span>
          <nav aria-label={t('footerLegalHeading')} style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {legalLinks.map(link => (
              <Link
                key={link.key}
                to={link.to}
                className="focus-ring"
                style={linkStyle}
                onMouseEnter={onLinkEnter}
                onMouseLeave={onLinkLeave}
              >
                {t(link.labelKey)}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
