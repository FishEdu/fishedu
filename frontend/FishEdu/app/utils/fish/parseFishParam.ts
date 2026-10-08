import { FishGetResponse } from "@/app/api/fish";

export const normalizeParam = (param?: string | string[]) => (
  Array.isArray(param) ? param[0] : param
)

export const parseFishParam = (param?: string | string[]) => {
  const rawFish = normalizeParam(param);

  if (!rawFish) {
    return undefined;
  }

  try {
    return JSON.parse(rawFish) as FishGetResponse;
  } catch {
    return undefined;
  }
}
