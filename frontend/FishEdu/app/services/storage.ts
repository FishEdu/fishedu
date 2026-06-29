import { Cache } from "@/app/types/cache"
import AsyncStorage from "@react-native-async-storage/async-storage"

const KEY = "APP_CACHE"

export async function getCache<T>(): Promise<Cache<T> | null> {
  const item = await AsyncStorage.getItem(KEY)

  return item ? JSON.parse(item) : null
}

export async function saveCache<T>(cache: Cache<T>) {
  await AsyncStorage.setItem(KEY, JSON.stringify(cache))
}