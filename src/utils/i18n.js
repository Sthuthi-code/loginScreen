import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import en from '../locales/en.json';
import hi from '../locales/hi.json';

const resources = { en: { translation: en }, hi: { translation: hi } };

i18next.use(initReactI18next).init({
    resources,
    // lng: RNLocalize.findBestAvailableLanguage(['en', 'hi'])?.languageTag || 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
});

export default i18next;
