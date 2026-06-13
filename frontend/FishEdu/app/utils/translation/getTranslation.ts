import { LanguageCode } from "@/app/(tabs)/settings";
import { translations } from "./translations";
import { capitalizeText } from "../capitalizeText";

export const getTranslation = (
  key: keyof typeof translations.pl | keyof typeof translations.en,
  language: LanguageCode,
  capitalize: boolean = true
) => {
  let translation = translations[language][key] as string
  translation = capitalize 
    ? capitalizeText(translation) 
    : translation
  
  return translation
}