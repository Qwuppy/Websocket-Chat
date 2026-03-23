'use client'

import i18n, { Language, LANGUAGES } from "@/shared/i18n";
import { 
    createContext, 
    useCallback, 
    useContext, 
    useEffect, 
    useState 
} from "react";


interface I18nContextValue {
    language: Language;
    changeLanguage: (lang: Language) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>(
        (typeof window !== 'undefined' 
            ? localStorage.getItem('app_language') as Language 
            : null) ?? LANGUAGES.RU
    );

    useEffect(() => {
        i18n.changeLanguage(language)
    }, []);

    const changeLanguage = useCallback((lang: Language) => {
        i18n.changeLanguage(lang);
        setLanguage(lang);
    }, []);

    return (
        <I18nContext.Provider value={{ language, changeLanguage }}>
            {children}
        </I18nContext.Provider>
    );
};

export const useI18nContext = (): I18nContextValue => {
    const ctx = useContext(I18nContext);
    if (!ctx) throw new Error('useI18nContext must be used within I18nProvider');
    return ctx;
};