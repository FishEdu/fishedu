import { LanguageCode } from "../(tabs)/settings"

export type CacheEntry<T> = {
  value: T[]
  lastSaveTime: number
}

export type Cache<T> = {
  [endpoint: string]: {
    [language in LanguageCode]?: CacheEntry<T>
  }
}