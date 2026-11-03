import {
  FishingJournal,
  FishingJournalInput,
  JournalSearchMode,
} from "@/app/api/journal"
import { LanguageCode } from "@/app/constants/language"
import { getBaseApiUrl } from "@/app/utils/getBaseApiUrl"
import { prepareRecordPhotoForApi } from "@/app/utils/fetch/records/recordPhoto"
import AsyncStorage from "@react-native-async-storage/async-storage"

type FetchJournalsParams = {
  mode?: JournalSearchMode
  query?: string
}

const LOCAL_JOURNALS_KEY = "fishingJournals"
const JOURNAL_ID_MAPPINGS_KEY = "fishingJournalIdMappings"

const getLanguage = async () => (
  await AsyncStorage.getItem("language") as LanguageCode | null
) ?? LanguageCode.PL

const getLocalJournals = async (): Promise<FishingJournal[]> => {
  const rawJournals = await AsyncStorage.getItem(LOCAL_JOURNALS_KEY)
  return rawJournals ? JSON.parse(rawJournals) as FishingJournal[] : []
}

const saveLocalJournals = async (journals: FishingJournal[]) => {
  await AsyncStorage.setItem(LOCAL_JOURNALS_KEY, JSON.stringify(journals))
}

const getIdMappings = async (): Promise<Record<string, number>> => {
  const rawMappings = await AsyncStorage.getItem(JOURNAL_ID_MAPPINGS_KEY)
  return rawMappings ? JSON.parse(rawMappings) as Record<string, number> : {}
}

const saveIdMapping = async (localId: number, apiId: number) => {
  const mappings = await getIdMappings()
  mappings[localId] = apiId
  await AsyncStorage.setItem(JOURNAL_ID_MAPPINGS_KEY, JSON.stringify(mappings))
}

const sortJournals = (journals: FishingJournal[]) => (
  [...journals].sort((first, second) => (
    `${second.fished_on}:${second.created_at}`.localeCompare(`${first.fished_on}:${first.created_at}`)
  ))
)

const filterJournals = (journals: FishingJournal[], params: FetchJournalsParams) => {
  const query = params.query?.trim().toLocaleLowerCase()
  if (!query) return sortJournals(journals)

  return sortJournals(journals.filter(journal => {
    const matchesSpot = journal.fishing_spot.toLocaleLowerCase().includes(query)
    const matchesFish = journal.catches.some(catchItem => (
      catchItem.fish_name.toLocaleLowerCase().includes(query)
    ))
    if (params.mode === "spot") return matchesSpot
    if (params.mode === "fish") return matchesFish
    return matchesSpot || matchesFish
  }))
}

const toLocalJournal = (input: FishingJournalInput): FishingJournal => ({
  ...input,
  id: Date.now(),
  created_at: new Date().toISOString(),
  total_catches: input.catches.reduce((total, catchItem) => total + catchItem.count, 0),
  catches: input.catches.map((catchItem, index) => ({
    ...catchItem,
    id: Date.now() + index,
  })),
})

const syncLocalJournals = async () => {
  const localJournals = await getLocalJournals()
  if (!localJournals.length) return

  const language = await getLanguage()
  const remainingJournals: FishingJournal[] = []
  for (const journal of localJournals) {
    try {
      const journalForApi = await prepareRecordPhotoForApi(journal)
      const response = await fetch(`${getBaseApiUrl()}/journals?language=${language}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(journalForApi),
      })
      if (!response.ok) throw new Error("Could not sync journal")
      const savedJournal = await response.json() as FishingJournal
      await saveIdMapping(journal.id, savedJournal.id)
    } catch {
      remainingJournals.push(journal)
    }
  }
  await saveLocalJournals(remainingJournals)
}

export const fetchJournals = async (
  params: FetchJournalsParams = {}
): Promise<FishingJournal[]> => {
  try {
    await syncLocalJournals()
    const language = await getLanguage()
    const searchParams = new URLSearchParams({ language })
    if (params.mode && params.mode !== "all") searchParams.set("mode", params.mode)
    if (params.query?.trim()) searchParams.set("query", params.query.trim())

    const response = await fetch(`${getBaseApiUrl()}/journals?${searchParams.toString()}`)
    if (!response.ok) throw new Error("Could not fetch journals")
    const apiJournals = await response.json() as FishingJournal[]
    const localJournals = await getLocalJournals()
    return filterJournals([...apiJournals, ...localJournals], params)
  } catch (error) {
    console.error("Failed to fetch fishing journals", error)
    return filterJournals(await getLocalJournals(), params)
  }
}

export const fetchJournal = async (id: number): Promise<FishingJournal | null> => {
  const localJournal = (await getLocalJournals()).find(journal => journal.id === id)
  if (localJournal) return localJournal

  try {
    const language = await getLanguage()
    const mappings = await getIdMappings()
    const response = await fetch(`${getBaseApiUrl()}/journals/${mappings[id] ?? id}?language=${language}`)
    return response.ok ? await response.json() as FishingJournal : null
  } catch (error) {
    console.error("Failed to fetch fishing journal", error)
    return null
  }
}

export const fetchJournalSpots = async (query = ""): Promise<string[]> => {
  const localSpots = (await getLocalJournals()).map(journal => journal.fishing_spot)
  try {
    const response = await fetch(`${getBaseApiUrl()}/journals/spots?query=${encodeURIComponent(query)}`)
    if (!response.ok) throw new Error("Could not fetch journal spots")
    const apiSpots = await response.json() as string[]
    return [...new Set([...apiSpots, ...localSpots])]
      .filter(spot => spot.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))
      .slice(0, 20)
  } catch {
    return [...new Set(localSpots)]
      .filter(spot => spot.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))
      .slice(0, 20)
  }
}

export const createJournal = async (input: FishingJournalInput): Promise<FishingJournal> => {
  let journalForApi = input
  try {
    journalForApi = await prepareRecordPhotoForApi(input)
    const language = await getLanguage()
    const response = await fetch(`${getBaseApiUrl()}/journals?language=${language}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(journalForApi),
    })
    if (!response.ok) throw new Error("Could not create journal")
    return await response.json() as FishingJournal
  } catch (error) {
    console.error("Failed to create fishing journal", error)
    const localJournal = toLocalJournal(journalForApi)
    await saveLocalJournals([localJournal, ...(await getLocalJournals())])
    return localJournal
  }
}

export const updateJournal = async (
  id: number,
  input: FishingJournalInput
): Promise<FishingJournal | null> => {
  const localJournals = await getLocalJournals()
  const isLocal = localJournals.some(journal => journal.id === id)
  const journalForApi = await prepareRecordPhotoForApi(input).catch(() => input)

  if (isLocal) {
    const updatedJournal = { ...toLocalJournal(journalForApi), id, created_at: localJournals.find(journal => journal.id === id)?.created_at ?? new Date().toISOString() }
    await saveLocalJournals(localJournals.map(journal => journal.id === id ? updatedJournal : journal))
    return updatedJournal
  }

  try {
    const language = await getLanguage()
    const mappings = await getIdMappings()
    const response = await fetch(`${getBaseApiUrl()}/journals/${mappings[id] ?? id}?language=${language}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(journalForApi),
    })
    return response.ok ? await response.json() as FishingJournal : null
  } catch (error) {
    console.error("Failed to update fishing journal", error)
    return null
  }
}

export const deleteJournal = async (id: number): Promise<boolean> => {
  const localJournals = await getLocalJournals()
  const hasLocalJournal = localJournals.some(journal => journal.id === id)
  if (hasLocalJournal) {
    await saveLocalJournals(localJournals.filter(journal => journal.id !== id))
    return true
  }

  try {
    const mappings = await getIdMappings()
    const response = await fetch(`${getBaseApiUrl()}/journals/${mappings[id] ?? id}`, { method: "DELETE" })
    return response.ok
  } catch (error) {
    console.error("Failed to delete fishing journal", error)
    return false
  }
}
