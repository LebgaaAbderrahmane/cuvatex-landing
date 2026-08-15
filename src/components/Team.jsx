import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';
import Section from './ui/Section';
import SectionHeader from './ui/SectionHeader';
import { getInitials } from '../lib/text';

const names = ['Alex Morgan', 'Sam Rivera', 'Jordan Lee'];

export default function Team() {
  const { t } = useTranslation();
  const roles = t('roles', { returnObjects: true });
  const bios = t('bios', { returnObjects: true });

  const members = names.map((name, i) => ({
    name,
    initials: getInitials(name),
    role: Array.isArray(roles) ? roles[i] : '',
    bio: Array.isArray(bios) ? bios[i] : '',
  }));

  return (
    <Section id="team" paddingBlockMax="120px" background={null} containerStyle={null}>
      <SectionHeader
        eyebrow={t('nav.team')}
        title={t('teamTitle')}
        titleMaxWidth={null}
      />

      <ScrollReveal delay={0.15}>
        <p style={{
          margin: '18px 0 0',
          color: 'var(--muted, #6c665e)',
          fontSize: 'clamp(16px, 1.8vw, 19px)',
          maxWidth: '48ch',
          lineHeight: 1.6,
        }}>
          {t('teamIntro')}
        </p>
      </ScrollReveal>

      <div style={{
        marginTop: 'clamp(40px, 5vw, 60px)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 'clamp(28px, 4vw, 48px)',
      }}>
        {members.map((m, i) => (
          <ScrollReveal key={m.name} delay={i * 0.1}>
            <motion.div
              style={{ display: 'flex', flexDirection: 'column' }}
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <div style={{
                aspectRatio: '4/5',
                borderRadius: 3,
                overflow: 'hidden',
                background: 'color-mix(in srgb, var(--accent, #0E7A69) 8%, transparent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--line, rgba(21,18,15,0.13))',
              }}>
                <span style={{
                  fontSize: 'clamp(48px, 6vw, 64px)',
                  fontWeight: 600,
                  color: 'var(--accent, #0E7A69)',
                  opacity: 0.25,
                }}>
                  {m.initials}
                </span>
              </div>
              <h3 style={{
                margin: '20px 0 0',
                fontSize: 21,
                fontWeight: 600,
                letterSpacing: '-0.01em',
              }}>
                {m.name}
              </h3>
              <div style={{
                margin: '4px 0 0',
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: 'var(--accent, #0E7A69)',
              }}>
                {m.role}
              </div>
              <p style={{
                margin: '12px 0 0',
                color: 'var(--muted, #6c665e)',
                fontSize: 15,
                lineHeight: 1.6,
              }}>
                {m.bio}
              </p>
            </motion.div>
          </ScrollReveal>
        ))}
      </div>
    </Section>
  );
}
