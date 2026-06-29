export type UseFetchQueryReturn<T> = {
  data: T[]
  loading: boolean
  error: Error | null
}