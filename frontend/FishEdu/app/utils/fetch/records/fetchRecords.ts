import {
  CatchRecordCreateRequest,
  CatchRecordGetResponse,
  RecordViewMode,
} from "@/app/api/records"
import { LanguageCode } from "@/app/(tabs)/settings"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { getBaseApiUrl } from "@/app/utils/getBaseApiUrl"

type FetchRecordsParams = {
  mode?: RecordViewMode
  query?: string
}

const LOCAL_RECORDS_KEY = "catchRecords"


// =========================
// LOKALNE REKORDY
// =========================

const getLocalRecords = async (): Promise<CatchRecordGetResponse[]> => {
  const rawRecords = await AsyncStorage.getItem(LOCAL_RECORDS_KEY)

  return rawRecords
    ? (JSON.parse(rawRecords) as CatchRecordGetResponse[])
    : []
}


const saveLocalRecords = async (
  records: CatchRecordGetResponse[]
) => {
  await AsyncStorage.setItem(
    LOCAL_RECORDS_KEY,
    JSON.stringify(records)
  )
}


// =========================
// SORTOWANIE
// =========================

const sortRecordsByDate = (
  records: CatchRecordGetResponse[]
) => {
  return [...records].sort(
    (a, b) =>
      new Date(b.created_at).getTime() -
      new Date(a.created_at).getTime()
  )
}


// =========================
// FILTROWANIE
// =========================

const filterRecords = (
  records: CatchRecordGetResponse[],
  params: FetchRecordsParams
) => {
  const query = params.query?.trim().toLowerCase()

  if (!query)
    return records

  if (params.mode === "spots") {
    return records.filter(record =>
      record.fishing_spot
        .toLowerCase()
        .includes(query)
    )
  }

  if (params.mode === "fish") {
    return records.filter(record =>
      record.fish_name
        ?.toLowerCase()
        .includes(query)
    )
  }

  return records.filter(record =>
    record.fishing_spot
      .toLowerCase()
      .includes(query)
    ||
    record.fish_name
      ?.toLowerCase()
      .includes(query)
  )
}


// =========================
// SYNCHRONIZACJA LOKALNYCH
// REKORDÓW Z API
// =========================

const syncLocalRecords = async (): Promise<boolean> => {
  const localRecords = await getLocalRecords()

  // Nie ma czego synchronizować
  if (localRecords.length === 0)
    return true

  const apiBaseUrl = getBaseApiUrl()

  const remainingLocalRecords: CatchRecordGetResponse[] = []

  for (const localRecord of localRecords) {

    try {

      const response = await fetch(
        `${apiBaseUrl}/records`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: localRecord.user_id,
            fish_id: localRecord.fish_id,
            fish_name: localRecord.fish_name,
            fishing_spot: localRecord.fishing_spot,
            total_length: localRecord.total_length,
            fork_length: localRecord.fork_length,
            weight: localRecord.weight,
            description: localRecord.description,
            image_url: localRecord.image_url,
          }),
        }
      )

      if (!response.ok) {

        // API odrzuciło rekord.
        // Zostawiamy go lokalnie.
        remainingLocalRecords.push(localRecord)

        continue
      }

      // Rekord został poprawnie zapisany
      // w bazie.
      //
      // Nie dodajemy go ponownie do AsyncStorage,
      // ponieważ od teraz jego wersja z API
      // jest źródłem prawdy.

    } catch (error) {

      console.error(
        "Failed to sync local record",
        localRecord.id,
        error
      )

      // Brak internetu/API.
      // Rekord zostaje lokalnie.
      remainingLocalRecords.push(localRecord)
    }
  }

  await saveLocalRecords(
    remainingLocalRecords
  )

  return remainingLocalRecords.length === 0
}


// =========================
// POBIERANIE REKORDÓW
// =========================

export const fetchRecords = async (
  params: FetchRecordsParams = {}
): Promise<CatchRecordGetResponse[]> => {

  try {

    // Najpierw próbujemy zsynchronizować
    // rekordy zapisane lokalnie.
    await syncLocalRecords()

    const localRecords = await getLocalRecords()

    const language =
      await AsyncStorage.getItem(
        "language"
      ) as LanguageCode

    const apiBaseUrl =
      getBaseApiUrl()

    const searchParams =
      new URLSearchParams({
        language:
          language ?? LanguageCode.PL,
      })

    if (
      params.mode &&
      params.mode !== "recent"
    ) {
      searchParams.append(
        "mode",
        params.mode
      )
    }

    if (params.query) {
      searchParams.append(
        "query",
        params.query
      )
    }

    const response = await fetch(
      `${apiBaseUrl}/records?${searchParams.toString()}`
    )


    // =========================
    // API NIE DZIAŁA
    // =========================

    if (!response.ok) {

      return filterRecords(
        sortRecordsByDate(
          localRecords
        ),
        params
      )
    }


    // =========================
    // API DZIAŁA
    // =========================

    const apiRecords =
      await response.json() as CatchRecordGetResponse[]


    /*
      API jest teraz źródłem prawdy.

      Lokalnie mogą zostać tylko rekordy,
      których nie udało się zsynchronizować.

      Usuwamy ewentualne duplikaty po ID.
    */

    const apiIds = new Set(
      apiRecords.map(record => record.id)
    )

    const unsyncedLocalRecords =
      localRecords.filter(
        record => !apiIds.has(record.id)
      )


    /*
      API + niesynchronizowane lokalne rekordy.

      Jeżeli internet działa i synchronizacja
      się udała, localRecords będzie puste.
    */

    const allRecords = [
      ...apiRecords,
      ...unsyncedLocalRecords,
    ]


    return filterRecords(
      sortRecordsByDate(
        allRecords
      ),
      params
    )

  } catch (error) {

    console.error(
      "Failed to fetch records",
      error
    )


    // =========================
    // BRAK INTERNETU
    // =========================

    const localRecords =
      await getLocalRecords()

    return filterRecords(
      sortRecordsByDate(
        localRecords
      ),
      params
    )
  }
}


// =========================
// DODAWANIE REKORDU
// =========================

export const createRecord = async (
  record: CatchRecordCreateRequest
): Promise<CatchRecordGetResponse | null> => {

  try {

    const apiBaseUrl =
      getBaseApiUrl()

    const response = await fetch(
      `${apiBaseUrl}/records`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(record),
      }
    )


    // =========================
    // API NIE ZADZIAŁAŁO
    // =========================

    if (!response.ok) {

      return await createLocalRecord(
        record
      )
    }


    // =========================
    // API ZADZIAŁAŁO
    // =========================

    return await response.json()

  } catch (error) {

    console.error(
      "Failed to create record",
      error
    )

    // Brak internetu.
    // Zapisujemy lokalnie.

    return await createLocalRecord(
      record
    )
  }
}


// =========================
// DODAWANIE LOKALNE
// =========================

const createLocalRecord = async (
  record: CatchRecordCreateRequest
): Promise<CatchRecordGetResponse> => {

  const localRecords =
    await getLocalRecords()

  const localRecord:
    CatchRecordGetResponse = {

    id: Date.now(),

    user_id:
      record.user_id,

    fish_id:
      record.fish_id,

    fish_name:
      record.fish_name,

    fishing_spot:
      record.fishing_spot,

    total_length:
      record.total_length,

    fork_length:
      record.fork_length,

    weight:
      record.weight,

    description:
      record.description,

    image_url:
      record.image_url,

    created_at:
      new Date().toISOString(),
  }


  await saveLocalRecords([
    localRecord,
    ...localRecords,
  ])


  return localRecord
}


// =========================
// EDYCJA REKORDU
// =========================

export const updateRecord = async (
  id: number,
  record: CatchRecordCreateRequest
): Promise<CatchRecordGetResponse | null> => {

  try {

    const apiBaseUrl =
      getBaseApiUrl()

    const response = await fetch(
      `${apiBaseUrl}/records/${id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(record),
      }
    )


    // =========================
    // API NIE ZADZIAŁAŁO
    // =========================

    if (!response.ok) {

      return await updateLocalRecord(
        id,
        record
      )
    }


    // =========================
    // API ZADZIAŁAŁO
    // =========================

    return await response.json()

  } catch (error) {

    console.error(
      "Failed to update record",
      error
    )

    // Brak internetu.
    // Aktualizujemy lokalnie.

    return await updateLocalRecord(
      id,
      record
    )
  }
}


// =========================
// EDYCJA LOKALNA
// =========================

const updateLocalRecord = async (
  id: number,
  record: CatchRecordCreateRequest
): Promise<CatchRecordGetResponse | null> => {

  const localRecords =
    await getLocalRecords()

  const index =
    localRecords.findIndex(
      item => item.id === id
    )


  // Nie znaleziono rekordu
  if (index === -1)
    return null


  const updatedRecord:
    CatchRecordGetResponse = {

    ...localRecords[index],

    ...record,
  }


  localRecords[index] =
    updatedRecord


  await saveLocalRecords(
    localRecords
  )


  return updatedRecord
}


// =========================
// USUWANIE REKORDU
// =========================

export const deleteRecord = async (
  id: number
) => {

  try {

    // =========================
    // NAJPIERW USUWAMY LOKALNIE
    // =========================

    const localRecords =
      await getLocalRecords()

    const updatedLocalRecords =
      localRecords.filter(
        record => record.id !== id
      )


    const wasLocalRecord =
      updatedLocalRecords.length !==
      localRecords.length


    await saveLocalRecords(
      updatedLocalRecords
    )


    // =========================
    // USUWAMY Z API
    // =========================

    const apiBaseUrl =
      getBaseApiUrl()

    const response =
      await fetch(
        `${apiBaseUrl}/records/${id}`,
        {
          method: "DELETE",
        }
      )


    return (
      response.ok ||
      wasLocalRecord
    )

  } catch (error) {

    console.error(
      "Failed to delete record",
      error
    )

    return false
  }
}