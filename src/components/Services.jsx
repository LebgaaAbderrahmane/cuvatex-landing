import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import ServiceCard from './ServiceCard';
import ServiceDivider from './ServiceDivider';
import Section from './ui/Section';
import SectionHeader from './ui/SectionHeader';

// Teaser only, mirroring Work.jsx: the homepage shows the first three
// services and hands the rest to /services — it is a sales page, not the
// catalogue. Rows, not a card grid: a grid of squares here would repeat
// Work's grid of squares one section down the page. The card itself lives
// in ServiceCard so this and the full page cannot drift apart.
const TEASER_COUNT = 3;

const MotionLink = motion.create(Link);

export default function Services() {
  const { t, i18n } = useTranslation();
  const rtl = i18n.dir() === 'rtl';
  const services = t('services', { returnObjects: true });
  const list = Array.isArray(services) ? services : [];

  return (
    <Section
      id="services"
      paddingBlockMax="120px"
      background={null}
      containerStyle={null}
    >
      <SectionHeader
        eyebrow={t('nav.services')}
        title={t('servicesTitle')}
        titleMaxWidth="20ch"
      />

      <div style={{ marginTop: 'clamp(40px, 6vw, 64px)' }}>
        {list.slice(0, TEASER_COUNT).map((s, i) => (
          <div key={s.title}>
            {i > 0 && (
              <div style={{ margin: 'clamp(32px, 5vw, 48px) 0' }}>
                <ServiceDivider index={i} />
              </div>
            )}
            <ServiceCard service={s} index={i} />
          </div>
        ))}
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: 'clamp(40px, 6vw, 56px)',
      }}>
        <MotionLink
          to="/services"
          className="focus-ring"
          whileHover={{ background: 'var(--accent, #0E7A69)', color: 'var(--accent-fg, #fff)' }}
          whileTap={{ scale: 0.97 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            background: 'transparent',
            border: '1px solid var(--accent, #0E7A69)',
            color: 'var(--accent, #0E7A69)',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: 14,
            letterSpacing: '0.04em',
            // 48px tall: a thumb target, not a mouse target.
            padding: '14px 26px',
            borderRadius: 2,
            transition: 'background 0.2s, color 0.2s',
          }}
        >
          {t('servicesCta')}
          <ArrowRight size={16} style={{ transform: rtl ? 'scaleX(-1)' : 'none' }} />
        </MotionLink>
      </div>
    </Section>
  );
}
