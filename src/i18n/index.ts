import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './en/translation.json';

for (const key in enTranslation) {
  if (Object.prototype.hasOwnProperty.call(enTranslation, key)) {
    enTranslation[key as keyof typeof enTranslation] =
      ((enTranslation as any)[key] as any) || key;
  }
}

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  initImmediate: true,
  compatibilityJSON: 'v4',
  debug: false,
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: {
      translation: enTranslation,
    },
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
