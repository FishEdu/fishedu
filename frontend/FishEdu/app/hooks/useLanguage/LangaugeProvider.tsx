import { useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LanguageContext } from './LanguageContext';
import { LanguageCode } from '@/app/(tabs)/settings';

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<LanguageCode>(LanguageCode.PL);

  useEffect(() => {
    AsyncStorage.getItem('language').then(value => {
      if (value) setLanguageState(value as LanguageCode);
    });
  }, []);

  const setLanguage = async (lang: LanguageCode) => {
    setLanguageState(lang);
    await AsyncStorage.setItem('language', lang);
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        languageCode: language,
        setLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}