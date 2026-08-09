import { CatchRecordCreateRequest, CatchRecordGetResponse, RecordViewMode } from "@/app/api/records"
import { LanguageCode } from "@/app/(tabs)/settings"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getBaseApiUrl } from "@/app/utils/getBaseApiUrl"

type FetchRecordsParams = {
  mode?: RecordViewMode,
  query?: string
}

const LOCAL_RECORDS_KEY = "catchRecords"

const getLocalRecords = async () => {
  const rawRecords = await AsyncStorage.getItem(LOCAL_RECORDS_KEY)

  return rawRecords
    ? JSON.parse(rawRecords) as CatchRecordGetResponse[]
    : []
}

const saveLocalRecords = async (records: CatchRecordGetResponse[]) => {
  await AsyncStorage.setItem(LOCAL_RECORDS_KEY, JSON.stringify(records))
}

const filterRecords = (
  records: CatchRecordGetResponse[],
  params: FetchRecordsParams
) => {
  const query = params.query?.trim().toLowerCase()

  if(!query)
    return records

  if(params.mode === "spots")
    return records.filter(record =>
      record.fishing_spot.toLowerCase().includes(query)
    )

  if(params.mode === "fish")
    return records.filter(record =>
      record.fish_name?.toLowerCase().includes(query)
    )

  return records.filter(record =>
    record.fishing_spot.toLowerCase().includes(query)
      || record.fish_name?.toLowerCase().includes(query)
  )
}

export const fetchRecords: (params?: FetchRecordsParams) => Promise<CatchRecordGetResponse[]> = async (params = {}) => {
  try {
    const localRecords = await getLocalRecords()
    const language = await AsyncStorage.getItem('language') as LanguageCode
    const apiBaseUrl = getBaseApiUrl()
    const searchParams = new URLSearchParams({
      language: language ?? LanguageCode.PL,
    })

    if(params.mode && params.mode !== "recent")
      searchParams.append("mode", params.mode)

    if(params.query)
      searchParams.append("query", params.query)

    const response = await fetch(`${apiBaseUrl}/records?${searchParams.toString()}`)

    if(!response.ok)
      return filterRecords(localRecords, params)

    const apiRecords = await response.json() as CatchRecordGetResponse[]

    return filterRecords([...localRecords, ...apiRecords], params)
  } catch(error) {
    console.error("Failed to fetch records", error)
    const localRecords = await getLocalRecords()

    return filterRecords(localRecords, params)
  }
}

export const createRecord: (record: CatchRecordCreateRequest) => Promise<CatchRecordGetResponse | null> = async (record) => {
  try {
    const apiBaseUrl = getBaseApiUrl()
    const response = await fetch(`${apiBaseUrl}/records`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(record)
    })

    if(!response.ok)
      return await createLocalRecord(record)

    return await response.json()
  } catch(error) {
    console.error("Failed to create record", error)
    return await createLocalRecord(record)
  }
}

const createLocalRecord = async (record: CatchRecordCreateRequest) => {
  const localRecords = await getLocalRecords()
  const localRecord: CatchRecordGetResponse = {
    id: Date.now(),
    user_id: record.user_id,
    fish_id: record.fish_id,
    fish_name: record.fish_name,
    fishing_spot: record.fishing_spot,
    total_length: record.total_length,
    fork_length: record.fork_length,
    weight: record.weight,
    description: record.description,
    image_url: record.image_url,
    created_at: new Date().toISOString(),
  }

  await saveLocalRecords([localRecord, ...localRecords])

  return localRecord
}

export const deleteRecord = async (id: number) => {
  try {
    // Usuń z lokalnych rekordów
    const localRecords = await getLocalRecords()

    const updatedLocalRecords = localRecords.filter(
      record => record.id !== id
    )

    await saveLocalRecords(updatedLocalRecords)

    // Spróbuj usunąć również z API
    const apiBaseUrl = getBaseApiUrl()

    const response = await fetch(
      `${apiBaseUrl}/records/${id}`,
      {
        method: "DELETE",
      }
    )

    return response.ok || updatedLocalRecords.length !== localRecords.length

  } catch(error) {
    console.error("Failed to delete record", error)
    return false
  }
}

export const updateRecord = async (
  id: number,
  record: CatchRecordCreateRequest
): Promise<CatchRecordGetResponse | null> => {
  try {
    const apiBaseUrl = getBaseApiUrl()

    const response = await fetch(
      `${apiBaseUrl}/records/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(record),
      }
    )

    if (!response.ok)
      return null

    return await response.json()

  } catch(error) {
    console.error("Failed to update record", error)
    return null
  }
}


