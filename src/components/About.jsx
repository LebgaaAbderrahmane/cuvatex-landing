import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import ScrollReveal from './ScrollReveal';
import Section from './ui/Section';
import SectionHeader from './ui/SectionHeader';
import { dirArrow } from '../lib/text';

const MotionLink = motion.create(Link); // module scope: avoids remount on render

export default function About() {
  const { t, i18n } = useTranslation();

  return (
    <Section
      id="about"
      paddingBlockMax="120px"
      background="var(--surface, #fff)"
      containerStyle={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 'clamp(40px, 6vw, 80px)',
        alignItems: 'center',
      }}
    >
      <div>
        <SectionHeader
          eyebrow={t('aboutEyebrow')}
          title={t('aboutTitle')}
          titleMaxWidth="16ch"
        />

        <ScrollReveal delay={0.15}>
          <p style={{
            margin: '24px 0 0',
            color: 'var(--fg, #15120f)',
            fontSize: 'clamp(16px, 1.8vw, 20px)',
            lineHeight: 1.6,
            maxWidth: '58ch',
          }}>
            {t('aboutBody')}
          </p>
        </ScrollReveal>
        <MotionLink
          to="/about"
          className="focus-ring"
          whileHover={{ opacity: 0.75 }}
          style={{ display: 'inline-block', marginTop: 20, color: 'var(--accent, #0E7A69)', fontWeight: 600, textDecoration: 'none', fontSize: 15, padding: '10px 0' }}
        >
          {t('aboutCta')} {dirArrow(i18n.resolvedLanguage)}
        </MotionLink>
      </div>

      <ScrollReveal delay={0.25}>
        <motion.div
          style={{
            aspectRatio: '4/3',
            border: '1px solid var(--line, rgba(21,18,15,0.13))',
            borderRadius: 3,
            overflow: 'hidden',
          }}
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <img
            src="/whoWeAre.jpg"
            alt="CUVATEX team workspace"
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </motion.div>
      </ScrollReveal>
    </Section>
  );
}
