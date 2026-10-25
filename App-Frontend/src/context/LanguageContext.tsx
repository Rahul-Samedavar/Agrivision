import React, { createContext, useContext, useState } from 'react';
import i18n from '../i18n';

type Language = 'en' | 'hi' | 'kn' | 'mr';

type LanguageContextType = {
    language: Language;
    setLanguage: (lang: Language) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [language, setLang] = useState<Language>('en');

    const setLanguage = (lang: Language) => {
        setLang(lang);
        i18n.changeLanguage(lang); // 🔥 Sync with i18n
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);

    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }

    return context;
};