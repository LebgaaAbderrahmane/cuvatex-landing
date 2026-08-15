import { useTranslation } from 'react-i18next';
import ScrollReveal from './ScrollReveal';
import Section from './ui/Section';
import SectionHeader from './ui/SectionHeader';

export default function Pricing() {
  const { t } = useTranslation();

  return (
    <Section id="pricing" paddingBlockMax="120px" background={null} containerStyle={null}>
      <SectionHeader
        eyebrow={t('pricingEyebrow')}
        title={t('pricingTitle')}
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
          {t('pricingBody')}
        </p>
      </ScrollReveal>
    </Section>
  );
}
