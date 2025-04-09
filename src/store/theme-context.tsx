import React, { createContext, useState, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import '../utils/i18n'; // Import i18n config

interface ThemeContextType {
  theme: String;
  language: String;
  toggleTheme: () => void;
  toggleLanguage: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  language: 'en',
  toggleTheme: () => {},
  toggleLanguage: () => {},
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [language, setLanguage] = useState('en');
  const { i18n } = useTranslation();

  const theme = isDarkTheme ? 'dark' : 'light';

  const toggleTheme = () => {
    setIsDarkTheme((prev) => !prev);
  };

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLang);
    setLanguage(newLang);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, language, toggleLanguage }}>
      {children}
    </ThemeContext.Provider>
  );
};
