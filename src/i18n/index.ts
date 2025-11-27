import en from './en.json';
import es from './es.json';

export type Language = 'en' | 'es';

const translations = {
    en,
    es,
};

export const getTranslation = (lang: Language) => {
    return translations[lang] || translations.es;
};

export const languages: { code: Language; name: string }[] = [
    { code: 'es', name: 'Español' },
    { code: 'en', name: 'English' },
];

export default translations;
