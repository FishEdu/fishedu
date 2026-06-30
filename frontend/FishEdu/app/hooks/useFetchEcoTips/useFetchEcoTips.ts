import { EcoTipsGetResponse } from "@/app/api/ecoTips"
import { useFetchQuery } from "../useFetchQuery/useFetchQuery"
import { useLanguage } from "../useLanguage/useLanguage"

export const useFetchEcoTips = () => {
  const { language } = useLanguage()
  const {
    data
  } = useFetchQuery<EcoTipsGetResponse>({
    endpoint: 'ecoTips',
    localStorageId: 'ecoTips',
    language: language
  })

  return { data }
}