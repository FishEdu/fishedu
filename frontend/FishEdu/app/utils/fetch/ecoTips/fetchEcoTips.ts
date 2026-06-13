import { LanguageCode } from "@/app/(tabs)/settings"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { fetchApi } from "../fetchApi"

export type EcoTipsGetResponse = {
  id: number,
  title: string,
  description: string,
}

type EcoTipsLocalStorage = {
  ecoTips: Partial<Record<LanguageCode, EcoTipsGetResponse[]>>,
  lastSaveTime: number
}

type EcoTipsFetchReturn = {
  ecoTips: EcoTipsGetResponse[],
  isDataStale: boolean
}

export const fetchEcoTips: () => Promise<EcoTipsFetchReturn> = async () => {
  const language = await AsyncStorage.getItem('language') as LanguageCode

  const raw = await AsyncStorage.getItem('ecoTips')  
  const stored: EcoTipsLocalStorage = raw ? await JSON.parse(raw) : { ecoTips: {}, lastSaveTime: 0 }

  const minute = 60 * 1000
  const staleTimeInMinutes = 5 * minute
  const isDataStale = (Date.now() - stored.lastSaveTime) > staleTimeInMinutes

  if(stored?.ecoTips[language] && !isDataStale) {
    console.log('Hit from cache')
    const ecoTips = stored.ecoTips[language]
    
    return {
      ecoTips,
      isDataStale
    }
  }

  const endpoint = `ecoTips?language=${language}`

  console.log('Hit from API')
  const ecoTips = await fetchApi(endpoint)

  stored.ecoTips[language] = ecoTips
  stored.lastSaveTime = Date.now()
  await AsyncStorage.setItem('ecoTips', JSON.stringify(stored))

  return { 
    ecoTips,
    isDataStale: false
  }
}