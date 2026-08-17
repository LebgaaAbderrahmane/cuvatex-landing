import { useTranslation } from 'react-i18next';
import ScrollReveal from '../components/ScrollReveal';
import ServiceCard from '../components/ServiceCard';
import ServiceDivider from '../components/ServiceDivider';
import CtaBanner from '../components/CtaBanner';

// Own shell, not ui/Section, for the same reason WorkList is: Section always
// draws a top border, and this page is the first thing under the sticky
// header — that border would sit directly against the header's own bottom
// border and read as one 2px rule. An <h1> here, not SectionHeader's <h2>,
// because on this page the list *is* the page.
//
// Full-width rows rather than a grid: the `features` list needs more
// horizontal room than a narrow grid column gives. Same ServiceCard rows as
// the homepage teaser (just `detailed`, and all 6 instead of 3), so the
// teaser reads as a preview of this page rather than an unrelated section —
// see ServiceCard's own comment for why *that* consistency is the good kind.
// ServiceDivider between rows echoes which side the next row's photo lands
// on, the plain hairline under the intro paragraph does not — it separates
// the intro from the list, not one alternating row from the next.
export default function ServicesList() {
  const { t } = useTranslation();
  const services = t('services', { returnObjects: true });
  const list = Array.isArray(services) ? services : [];

  return (
    <>
    <section
      id="services"
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
            {t('nav.services')}
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
            {t('servicesPageTitle')}
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
            {t('servicesPageIntro')}
          </p>
        </ScrollReveal>

        <div style={{
          marginTop: 'clamp(40px, 6vw, 68px)',
          paddingTop: 'clamp(32px, 4vw, 48px)',
          borderTop: '1px solid var(--line, rgba(21,18,15,0.13))',
        }}>
          {list.map((s, i) => (
            <div key={s.title}>
              {i > 0 && (
                <div style={{ margin: 'clamp(40px, 6vw, 64px) 0' }}>
                  <ServiceDivider index={i} />
                </div>
              )}
              <ServiceCard service={s} index={i} detailed />
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Someone who read every service is the warmest visitor this page gets.
        Without this they reach the footer with nothing to do. */}
    <CtaBanner />
    </>
  );
}
