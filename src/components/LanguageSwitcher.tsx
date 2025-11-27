'use client';

import { useLanguage } from '@/app/context/LanguageContext';
import { languages } from '@/i18n';
import styles from './LanguageSwitcher.module.css';

export function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();

    return (
        <div className={styles.languageSwitcher}>
            <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'es')}
                className={styles.select}
                aria-label="Seleccionar idioma / Select language"
            >
                {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                        {lang.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
