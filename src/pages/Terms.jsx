import { useTranslation } from 'react-i18next';
import LegalPage from '../components/ui/LegalPage';

export default function Terms() {
  const { t } = useTranslation();

  return (
    <LegalPage
      eyebrow={t('legal.termsNav')}
      title={t('legal.terms.title')}
      updated={t('legal.lastUpdated')}
      sections={t('legal.terms.sections', { returnObjects: true })}
    />
  );
}
