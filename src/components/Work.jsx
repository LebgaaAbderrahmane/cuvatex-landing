import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import ProjectCard from './ProjectCard';
import { projects } from '../data/projects';
import Section from './ui/Section';
import SectionHeader from './ui/SectionHeader';

// Teaser only — the rest lives on /work.
const TEASER_COUNT = 3;

const MotionLink = motion.create(Link);

export default function Work() {
  const { t, i18n } = useTranslation();
  const rtl = i18n.dir() === 'rtl';

  return (
    <Section
      id="work"
      paddingBlockMax="120px"
      background={null}
      containerStyle={null}
    >
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 24,
        flexWrap: 'wrap',
      }}>
        <div>
          <SectionHeader
            eyebrow={t('nav.work')}
            title={t('workTitle')}
            titleMaxWidth={null}
          />
        </div>
        <ScrollReveal delay={0.2}>
          <p style={{ margin: 0, color: 'var(--muted, #6c665e)', fontSize: 15 }}>
            {t('workIntro')}
          </p>
        </ScrollReveal>
      </div>

      <div style={{
        marginTop: 'clamp(36px, 5vw, 56px)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 'clamp(24px, 3vw, 36px)',
      }}>
        {projects.slice(0, TEASER_COUNT).map((p, i) => (
          <ProjectCard key={p.slug} slug={p.slug} tagKey={p.tagKey} index={i} />
        ))}
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: 'clamp(36px, 5vw, 52px)',
      }}>
        <MotionLink
          to="/work"
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
            padding: '14px 26px',
            borderRadius: 2,
            transition: 'background 0.2s, color 0.2s',
          }}
        >
          {t('workCta')}
          <ArrowRight size={16} style={{ transform: rtl ? 'scaleX(-1)' : 'none' }} />
        </MotionLink>
      </div>
    </Section>
  );
}
