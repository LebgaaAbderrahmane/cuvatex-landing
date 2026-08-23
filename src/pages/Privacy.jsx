import { useTranslation } from 'react-i18next';
import LegalPage from '../components/ui/LegalPage';

export default function Privacy() {
  const { t } = useTranslation();

  return (
    <LegalPage
      eyebrow={t('legal.privacyNav')}
      title={t('legal.privacy.title')}
      updated={t('legal.lastUpdated')}
      sections={t('legal.privacy.sections', { returnObjects: true })}
    />
  );
}
