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
    // Real browsers send region-coded locales (`ar-DZ`, `fr-DZ`, `en-US`).
    // Without these three, `i18n.language` keeps the suffix: translations still
    // resolve by fallback, but every `=== 'ar'` comparison fails, so an Arabic
    // visitor gets Arabic text inside a left-to-right layout labelled "EN".
    supportedLngs: ['en', 'fr', 'ar'],
    load: 'languageOnly',
    // Must be a function: the detector only special-cases the string 'Iso15897'
    // and otherwise calls this value directly, so any other string throws during
    // init and the whole app renders blank.
    detection: { convertDetectedLanguage: lng => lng.split('-')[0] },
    interpolation: { escapeValue: false },
  });

export default i18n;
