import { LanguageCode } from '@/app/(tabs)/settings';
import { createContext } from 'react';

export type LanguageContextType = {
  language: LanguageCode,
  languageCode: LanguageCode,
  setLanguage: (lang: LanguageCode) => Promise<void>
}

export const LanguageContext = createContext<LanguageContextType | null>(null)