import { STALE_TIME } from "@/app/constants/cache"
import { fetchData } from "@/app/services/api"
import { getCache, saveCache } from "@/app/services/storage"
import { Cache } from "@/app/types/cache"
import { FetchQueryArguments } from "@/app/types/fetch"
import { UseFetchQueryReturn } from "@/app/types/useFetchQueryReturn"
import { useEffect, useState } from "react"
import { useLanguage } from "../useLanguage/useLanguage"

export function useFetchQuery<T>({
  endpoint,
  localStorageId,
}: FetchQueryArguments): UseFetchQueryReturn<T> {
  const { language } = useLanguage()

  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadData() {
      console.log("REAL FETCH START")
      try {
        setLoading(true)

        if (!language) {
          throw new Error("Language not found")
        }

        const cache = await getCache<T>()

        const cachedEntry =
          cache?.[localStorageId]?.[language]

        const isCacheValid =
          cachedEntry &&
          Date.now() - cachedEntry.lastSaveTime < STALE_TIME

        if (isCacheValid) {
          setData(cachedEntry.value)
          return
        }

        const apiData = await fetchData<T>(endpoint, language)

        const newCache: Cache<T> = {
          ...cache,
          [localStorageId]: {
            ...cache?.[localStorageId],
            [language]: {
              value: apiData,
              lastSaveTime: Date.now(),
            },
          },
        }

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