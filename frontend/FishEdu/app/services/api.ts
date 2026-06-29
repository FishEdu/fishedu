export async function fetchData<T>(
  endpoint: string,
  language: string
): Promise<T[]> {
  const response = await fetch(
    `${endpoint}?language=${language}`
  )

  if (!response.ok) {
    throw new Error("Failed to fetch data")
  }

  return await response.json()
}