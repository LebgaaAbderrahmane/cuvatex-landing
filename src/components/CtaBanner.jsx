import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import ScrollReveal from './ScrollReveal';
import { dirArrow } from '../lib/text';

// Module scope: `motion.create` inside the component remounts the link every render.
const MotionLink = motion.create(Link);

// Used twice — mid-homepage, and at the foot of /work, where a visitor who has
// just read the whole project list otherwise runs into the footer with nothing
// to do. That is why the link is `/#contact` and not `#contact`: a bare hash
// only resolves on the homepage.
export default function CtaBanner() {
  const { t, i18n } = useTranslation();

  return (
    <section
      style={{
        padding: 'clamp(48px, 7vw, 84px) clamp(20px, 5vw, 48px)',
        borderTop: '1px solid var(--line, rgba(21,18,15,0.13))',
      }}
    >
      <div style={{ maxWidth: 1160, margin: '0 auto', textAlign: 'center' }}>
        <ScrollReveal>
          <p style={{
            margin: 0,
            fontSize: 'clamp(18px, 2.4vw, 26px)',
            fontWeight: 600,
            letterSpacing: '-0.01em',
            color: 'var(--fg, #15120f)',
          }}>
            {t('ctaBannerLead')}{' '}
            <MotionLink
              to="/#contact"
              className="focus-ring"
              style={{
                color: 'var(--accent, #0E7A69)',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                // Vertical padding on an inline element grows the tap target to
                // 44px+ without shifting the sentence it sits in.
                padding: '9px 0',
              }}
              whileHover={{ opacity: 0.85 }}
            >
              {t('ctaBannerLink')}{' '}
              {/* resolvedLanguage, not language: the latter can be 'ar-DZ'. */}
              <span aria-hidden="true">{dirArrow(i18n.resolvedLanguage)}</span>
            </MotionLink>
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
