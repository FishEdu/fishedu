import { EcoTipsGetResponse } from "@/app/api/ecoTips"
import { getBaseApiUrl } from "@/app/utils/getBaseApiUrl"
import { useFetchQuery } from "../useFetchQuery/useFetchQuery"
import { useLanguage } from "../useLanguage/useLanguage"

export const useFetchEcoTips = () => {
  const { language } = useLanguage()
  const {
    data
  } = useFetchQuery<EcoTipsGetResponse>({
    endpoint: `${getBaseApiUrl()}/ecoTips`,
    localStorageId: "ecoTips",
    language: language
  })

  return { data }
}