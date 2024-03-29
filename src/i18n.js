import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ca from './i18n/ca.json';
import en from './i18n/en.json';
import es from './i18n/es.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    detection: {
      order: ['querystring', 'navigator'],
      lookupQuerystring: 'lang',
      checkWhitelist: true
    },
    resources: {
      ca: {
        translation: ca
      },
      en: {
        translation: en
      },
      es: {
        translation: es
      },
    },
    load: 'languageOnly',
    whitelist: ['ca', 'es', 'en'],
    fallbackLng: 'ca',
    debug: false,
    keySeparator: false,
    interpolation: {
      escapeValue: false,
      formatSeparator: ','
    },
    useSuspense: true,
  });
