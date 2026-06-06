export const getApiBasicUrl: () => string = () => {
  // On local machine check your ip address
  const address = 'http://192.168.100.6'
  const apiPrefix = 'api/v1/'
  const url = `${address}/${apiPrefix}`
  
  return url
}