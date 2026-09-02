import { fetchData } from "@/app/services/api"
import { createCache, getCache, getCacheEntry, isCacheValid, saveCache } from "@/app/services/storage"
import { Cache, CacheEntry } from "@/app/types/cache"
import { FetchQueryArguments } from "@/app/types/fetch"
import { UseFetchQueryReturn } from "@/app/types/useFetchQueryReturn"
import { getBaseApiUrl } from "@/app/utils/getBaseApiUrl"
import { useEffect, useState } from "react"

export function useFetchQuery<T>({
  endpoint,
  localStorageId,
  language
}: FetchQueryArguments): UseFetchQueryReturn<T> {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)

        if (!language) {
          throw new Error("Language not found")
        }

        const cache = await getCache<T>()

        const cachedEntry: CacheEntry<T> | undefined = getCacheEntry(cache, localStorageId, language)

        const cacheValid = isCacheValid<T>(cachedEntry)

        if (cacheValid && cachedEntry) {
          setData(cachedEntry.value)
          return
        }

        const url = `${getBaseApiUrl()}/${endpoint}`
        console.warn(url)
        const apiData = await fetchData<T>(url, language)

        const newCache: Cache<T> | null = createCache<T>(cache, localStorageId, apiData, language)
        await saveCache(newCache)

        setData(apiData)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [endpoint, localStorageId, language])

  return {
    data,
    loading,
    error,
  }
}