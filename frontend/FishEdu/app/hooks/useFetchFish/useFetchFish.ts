import { FishGetResponse } from "@/app/api/fish"
import { useFetchQuery } from "../useFetchQuery/useFetchQuery"
import { useLanguage } from "../useLanguage/useLanguage"


export const useFetchFish = (name: string | undefined) => {
  const { language } = useLanguage()
   
  const endpoint = name === '' || !name 
    ? `fish`
    : `fish/search/${name}`

  const {
    data
  } = useFetchQuery<FishGetResponse>({
    endpoint: endpoint,
    localStorageId: 'fish',
    language
  })

  return { 
    data,
    fetchFish: useFetchFish 
  }
}