import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './en.json';
import fr from './fr.json';
import ar from './ar.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      ar: { translation: ar },
    },
    fallbackLng: 'en',
    // Browsers send region-coded locales ('ar-DZ') — without this, every
    // `=== 'ar'` check fails and Arabic renders inside an LTR layout.
    supportedLngs: ['en', 'fr', 'ar'],
    load: 'languageOnly',
    detection: { convertDetectedLanguage: lng => lng.split('-')[0] }, // must be a function, or init throws
    interpolation: { escapeValue: false },
  });

export default i18n;
