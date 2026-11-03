export type JournalSearchMode = "all" | "fish" | "spot"

export type JournalCatch = {
  id: number
  fish_id?: number | null
  fish_name: string
  count: number
  total_length?: number | null
  weight?: number | null
}

export type FishingJournal = {
  id: number
  user_id?: number | null
  fished_on: string
  fishing_spot: string
  started_at?: string | null
  ended_at?: string | null
  description?: string | null
  image_url?: string | null
  catches: JournalCatch[]
  total_catches: number
  created_at: string
}

export type JournalCatchInput = {
  fish_id?: number
  fish_name: string
  count: number
  total_length?: number
  weight?: number
}

export type FishingJournalInput = {
  user_id?: number
  fished_on: string
  fishing_spot: string
  started_at?: string
  ended_at?: string
  description?: string
  image_url?: string | null
  catches: JournalCatchInput[]
}
