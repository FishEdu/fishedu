import { getBaseURL } from "@/app/utils/getBaseURL";
import { useLocalSearchParams } from "expo-router";

export const useEducationMaterialURL = () => {
  const { url } = useLocalSearchParams<{ title: string; url: string }>();
  const base_url = getBaseURL()
  console.log(`${base_url}${url}`)

  return `${base_url}${url}`
}