import { LanguageCode } from "../constants/language"

export type FetchQueryArguments = {
  localStorageId: string
  endpoint: string,
  language: LanguageCode
}
