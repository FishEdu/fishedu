import AsyncStorage from "@react-native-async-storage/async-storage"
import { fetchApi } from "../fetchApi"

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

export const fetchFish: (name?: string) => Promise<FishGetResponse[]> = async (name) => {
  const language = await AsyncStorage.getItem('language')
  const endpoint = name === '' || !name 
    ? `fish?language=${language}`
    : `fish/search/${name}?language=${language}`
  
  const fish = await fetchApi(endpoint)

  return fish
}