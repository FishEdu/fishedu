import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LanguageCode } from '../(tabs)/settings';

export const useLanguage = () => {
  const [language, setLanguage] = useState<string | undefined>('pl')

  useEffect(() => {
    AsyncStorage.getItem('language').then(value => {
      if (value) {
        setLanguage(value);
      }
    });
  }, [])

  return  { 
    language,
    languageCode: language as LanguageCode,
    setLanguage
  }
}