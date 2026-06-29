import { LanguageCode } from "../(tabs)/settings"

export type FetchQueryArguments = {
  localStorageId: string
  endpoint: string,
  language: LanguageCode
}