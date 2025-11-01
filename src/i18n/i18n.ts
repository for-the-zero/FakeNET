import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import zh from './zh-CN.json';
import en from './en.json';

const resources = {
    'zh-CN': {
        translation: zh
    },
    'en': {
        translation: en
    }
};

i18n.use(initReactI18next)
    .init({
        resources,
        interpolation: {
            escapeValue: false
        },
        debug: process.env.NODE_ENV === 'development',
    });

export default i18n;