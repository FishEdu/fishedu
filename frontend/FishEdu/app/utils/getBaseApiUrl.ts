export const getBaseApiUrl: () => string = () => {
  // On local machine check your ip address
  const address = 'http://192.168.100.7'
  const port = '8000'
  const apiPrefix = 'api/v1'
  const url = `${address}:${port}/${apiPrefix}`
  
  return url
}