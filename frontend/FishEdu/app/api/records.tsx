export type RecordViewMode = "recent" | "fish" | "spots"

export type CatchRecordGetResponse = {
  id: number,
  user_id?: number,
  fish_id?: number,
  fish_name?: string,
  fishing_spot: string,
  total_length?: number,
  fork_length?: number,
  weight?: number,
  description?: string,
  image_url?: string,
  created_at: string
}

export type CatchRecordCreateRequest = {
  user_id?: number,
  fish_id?: number,
  fish_name?: string,
  fishing_spot: string,
  total_length?: number,
  fork_length?: number,
  weight?: number,
  description?: string,
  image_url?: string
}
