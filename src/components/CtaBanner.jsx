import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import ScrollReveal from './ScrollReveal';
import { dirArrow } from '../lib/text';

// Module scope: `motion.create` inside the component remounts the link every render.
const MotionLink = motion.create(Link);

// Reused mid-homepage and at the foot of /work, /services, /about.
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
              to="/contact"
              className="focus-ring"
              style={{
                color: 'var(--accent, #0E7A69)',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                padding: '9px 0', // grows tap target without shifting the sentence
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
