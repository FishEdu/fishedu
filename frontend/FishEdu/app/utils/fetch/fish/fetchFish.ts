import { LanguageCode } from "@/app/constants/language"
import { FishGetResponse } from "@/app/api/fish"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { fetchApi } from "../fetchApi"

export type FishLocalStorage = {
  fish: Partial<Record<LanguageCode, FishGetResponse[]>>
  lastSaveTime: number
}

export type FetchFishReturn = {
  fish: FishGetResponse[],
  isDataStale: boolean
}

export const fetchFish: (isConnected: boolean | undefined, name?: string) => Promise<FetchFishReturn> = async (isConnected, name) => {
  const language = await AsyncStorage.getItem('language') as LanguageCode
  
  const raw = await AsyncStorage.getItem('fish')
  const stored: FishLocalStorage = raw ? 
    await JSON.parse(raw) : 
    { fish: {}, lastSaveTime: 0 }

  const minute = 60 * 1000
  const staleTimeInMinutes = 5 * minute
  const isDataStale = (Date.now() - stored.lastSaveTime) > staleTimeInMinutes

  const nameIncluded = !!(name) && name.length !== 0
  const localDataExists = !!(stored?.fish[language])
  const canGetFreshLocalData = localDataExists && !isDataStale
  
  const canFilterLocalDataByName = canGetFreshLocalData && nameIncluded
  
  if(canFilterLocalDataByName) {
    console.log('Filtered data by cache')
    
    const fish = stored.fish[language] ?? []
    
    const filteredFish = fish
      .filter(
        (fish) => fish.name.toLowerCase().includes(name)
      )
    
    return {
      fish: filteredFish,
      isDataStale
    }
  }

  if(isConnected === false || canGetFreshLocalData) {
    console.log('Hit from cache')
    
    const fish = stored.fish[language]
    
    return {
      fish, 
      isDataStale 
    }
  }
  
  const endpoint = nameIncluded
    ? `fish/search/${name}?language=${language}` 
    : `fish?language=${language}`

  console.log('Hit from API')
  const fish = await fetchApi(endpoint)

  stored.fish[language] = fish
  stored.lastSaveTime = Date.now()
  await AsyncStorage.setItem('fish', JSON.stringify(stored))

  const f = await AsyncStorage.getItem('fish')
  if(f) {
    const f1 = await JSON.parse(f)
    console.log(f1)
  }

  return { 
    fish,
    isDataStale 
  }
}
