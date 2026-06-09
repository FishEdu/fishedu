import AsyncStorage from "@react-native-async-storage/async-storage"
import { fetchApi } from "../fetchApi"
import { LanguageCode } from "@/app/(tabs)/settings"

export type FishGetResponse = {
  id: number,
  min_protection_length: number,
  max_protection_length: number,
  is_endangered: boolean,
  name: string,
  description: string,
  appearance: string,
  feeding_places: string,
  preferences: string,
  handling: string
}

export type FishLocalStorage = {
  fish: Partial<Record<LanguageCode, FishGetResponse[]>>
  lastSaveTime: number
}

export type FetchFishReturn = {
  fish: FishGetResponse[],
  isDataStale: boolean
}

export const fetchFish: (name?: string) => Promise<FetchFishReturn> = async (name) => {
  const language = await AsyncStorage.getItem('language') as LanguageCode

  const raw = await AsyncStorage.getItem('fish')  
  const stored: FishLocalStorage = raw ? await JSON.parse(raw) : { fish: {}, lastSaveTime: 0 }

  const minute = 60 * 1000
  const staleTimeInMinutes = 5 * minute
  const isDataStale = (Date.now() - stored.lastSaveTime) > staleTimeInMinutes

  if(stored?.fish[language] && !isDataStale && name && name !== '') {
    const fish = stored.fish[language]
    const filteredFish = fish
      .filter(
        (fish) => fish.name.toLowerCase().includes(name)
      )
    
    return {
      fish: filteredFish,
      isDataStale
    }
  }

  if(stored?.fish[language] && !isDataStale) {
    console.log('Hit from cache')
    const fish = stored.fish[language]
    return {
      fish, 
      isDataStale 
    }
  }
  
  const endpoint = name === '' || !name 
    ? `fish?language=${language}`
    : `fish/search/${name}?language=${language}`

  console.log('Hit from API')
  const fish = await fetchApi(endpoint)

  stored.fish[language] = fish
  stored.lastSaveTime = Date.now()
  await AsyncStorage.setItem('fish', JSON.stringify(stored))

  return { 
    fish,
    isDataStale 
  }
}