import { useTranslation } from 'react-i18next';
import ScrollReveal from '../components/ScrollReveal';
import ProjectCard from '../components/ProjectCard';
import CtaBanner from '../components/CtaBanner';
import { projects } from '../data/projects';

// Writes its own shell instead of using ui/Section, for the same reason Hero
// does: Section always draws a top border, and this section is the first thing
// under the header — its own bottom border would sit directly against it and
// read as one 2px rule. There is also an <h1> here rather than SectionHeader's
// <h2>, because on this page the list *is* the page.
export default function WorkList() {
  const { t } = useTranslation();

  return (
    <>
    <section
      id="work"
      style={{ padding: 'clamp(40px, 7vw, 88px) clamp(20px, 5vw, 48px) clamp(64px, 10vw, 120px)' }}
    >
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        <ScrollReveal>
          <p style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            margin: 0,
            fontSize: 13,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--muted, #6c665e)',
            fontWeight: 600,
          }}>
            <span style={{
              width: 7,
              height: 7,
              background: 'var(--accent, #0E7A69)',
              display: 'inline-block',
            }} />
            {t('nav.work')}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h1 style={{
            fontSize: 'clamp(34px, 7vw, 62px)',
            fontWeight: 600,
            letterSpacing: '-0.03em',
            lineHeight: 1.03,
            margin: '16px 0 0',
            maxWidth: '16ch',
          }}>
            {t('workPageTitle')}
          </h1>
        </ScrollReveal>

        <ScrollReveal delay={0.18}>
          <p style={{
            margin: 'clamp(18px, 2.5vw, 24px) 0 0',
            maxWidth: '52ch',
            color: 'var(--muted, #6c665e)',
            fontSize: 'clamp(16px, 2vw, 19px)',
            lineHeight: 1.6,
          }}>
            {t('workPageIntro')}
          </p>
        </ScrollReveal>

        <div style={{
          marginTop: 'clamp(40px, 6vw, 68px)',
          paddingTop: 'clamp(32px, 4vw, 48px)',
          borderTop: '1px solid var(--line, rgba(21,18,15,0.13))',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'clamp(28px, 3.5vw, 44px)',
        }}>
          {projects.map((p, i) => (
            <ProjectCard key={p.slug} slug={p.slug} tagKey={p.tagKey} index={i} />
          ))}
        </div>
      </div>
    </section>

    {/* Someone who scrolled every card is the warmest visitor this page gets.
        Without this they reach the footer with nothing to do. */}
    <CtaBanner />
    </>
  );
}
