import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import en from './en';
import fr from './fr';

const translations = { en, fr };

const I18nContext = createContext(null);

const STORAGE_KEY = 'wine-cellar-lang';

function getInitialLocale() {
  // Check localStorage first
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && translations[stored]) return stored;

  // Fallback to browser language
  const browserLang = navigator.language.slice(0, 2);
  if (translations[browserLang]) return browserLang;

  return 'en';
}

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(getInitialLocale);

  const setLocale = useCallback((newLocale) => {
    if (translations[newLocale]) {
      setLocaleState(newLocale);
      localStorage.setItem(STORAGE_KEY, newLocale);
      document.documentElement.lang = newLocale;
    }
  }, []);

  const t = useCallback((key, params = {}) => {
    const translation = translations[locale][key] || translations.en[key] || key;
    // Simple template replacement: {name} → value
    return translation.replace(/\{(\w+)\}/g, (_, k) => params[k] ?? `{${k}}`);
  }, [locale]);

  const value = useMemo(() => ({
    locale,
    setLocale,
    t,
    locales: Object.keys(translations),
  }), [locale, setLocale, t]);

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
