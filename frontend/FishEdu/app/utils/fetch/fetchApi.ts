import { getBaseApiUrl } from "@/app/utils/getBaseApiUrl"

export const fetchApi = async (endpoint: string) => {
  // TODO: Add fetch for GET/POST/PUT/PATCH
  const apiBaseUrl = getBaseApiUrl();
  const url = `${apiBaseUrl}/${endpoint}`;

  
  const response = await fetch(url)

  if(!response.ok) {
    console.error(`FETCH FAILED. Status: ${response.status}.`)
    return
  }

  const json = await response.json()

  return json
} 