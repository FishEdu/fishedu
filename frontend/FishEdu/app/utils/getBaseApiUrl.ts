import { getBaseURL } from "./getBaseURL"

export const getBaseApiUrl: () => string = () => {
  // On local machine check your ip address
  const apiPrefix = 'api/v1'
  const base_url = getBaseURL()
  const url = `${base_url}/${apiPrefix}`
  
  return url
}