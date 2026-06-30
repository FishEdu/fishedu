import { Cache, CacheEntry } from "@/app/types/cache"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { LanguageCode } from "../(tabs)/settings"
import { STALE_TIME } from "../constants/cache"

const KEY = "APP_CACHE"

export async function getCache<T>(): Promise<Cache<T> | null> {
  const item = await AsyncStorage.getItem(KEY)

  return item ? JSON.parse(item) : null
}

export async function saveCache<T>(cache: Cache<T> | null) {
  if(cache === null)
    return
  
  await AsyncStorage.setItem(KEY, JSON.stringify(cache))
}

export function createCache<T>(
  oldCache: Cache<T> | null, 
  localStorageId: string, 
  apiData: T[], 
  language: LanguageCode) {
    if(oldCache === null)
      return null
    
    const newCache: Cache<T> = {
      ...oldCache,
      [localStorageId]: {
        ...oldCache?.[localStorageId],
        [language]: {
          value: apiData,
          lastSaveTime: Date.now(),
        },
      },
    }

  return newCache
}

export function isCacheValid<T>(cacheEntry: CacheEntry<T> | undefined) {
  if(!cacheEntry)
    return false
  
  const isDataStale = Date.now() - cacheEntry.lastSaveTime < STALE_TIME
  
  return cacheEntry  && isDataStale
}

export function getCacheEntry<T>(cache: Cache<T> | null, localStorageId: string, language: LanguageCode) {
  return cache?.[localStorageId]?.[language]
}