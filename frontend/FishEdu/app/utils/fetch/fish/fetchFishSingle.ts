import AsyncStorage from "@react-native-async-storage/async-storage"
import { fetchApi } from "../fetchApi"
import { FishGetResponse } from "./fetchFish"

export const fetchFishSingle: (name: string) => Promise<FishGetResponse> = async (name) => {
  const language = await AsyncStorage.getItem('language')
  const endpoint = `fish/${name}?language=${language}`
  const fish = await fetchApi(endpoint)

  return fish
}