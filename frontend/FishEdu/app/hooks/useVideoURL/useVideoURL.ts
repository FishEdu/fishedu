import { getBaseApiUrl } from "@/app/utils/getBaseApiUrl";
import { useLocalSearchParams } from "expo-router";

export const useVideoURL = () => {
  const { url } = useLocalSearchParams<{ title: string; url: string }>();
  const base_url = getBaseApiUrl()
  
  return `${base_url}/education-materials/file/${url}`
}