import { useTranslation } from 'react-i18next';
import ScrollReveal from '../components/ScrollReveal';
import ServiceCard from '../components/ServiceCard';
import ServiceDivider from '../components/ServiceDivider';
import CtaBanner from '../components/CtaBanner';

// Own shell, not ui/Section — same reason as WorkList: Section's top border
// would double against the sticky header's. Full-width rows, not a grid: the
// `features` list needs more room than a narrow grid column gives.
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

    <CtaBanner />
    </>
  );
}
