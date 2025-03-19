import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation JSON files
import en from '../locales/en.json';
import sr from '../locales/sr.json';
import ru from '../locales/ru.json';
import el from '../locales/el.json';
import bg from '../locales/bg.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      sr: { translation: sr },
      ru: { translation: ru },
      el: { translation: el },
      bg: { translation: bg }
    },
    lng: "en", // Default language
    fallbackLng: "en", // If selected language is missing, fallback to English
    interpolation: {
      escapeValue: false // React already protects against XSS
    }
  });

export default i18n;
