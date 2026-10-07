import { CatchRecordCreateRequest } from "@/app/api/records"
import { getBaseApiUrl } from "@/app/utils/getBaseApiUrl"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { File } from "expo-file-system"
import { ImagePickerAsset } from "expo-image-picker"
import { Platform } from "react-native"

export const MAX_RECORD_PHOTO_SIZE = 5 * 1024 * 1024

const photoTypes: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
}

export const resolveRecordPhotoUrl = (uri?: string | null) => {
  if (!uri) return undefined
  return uri.startsWith("/") ? new URL(uri, getBaseApiUrl()).toString() : uri
}

export const getSelectedRecordPhotoUri = async (asset: ImagePickerAsset): Promise<string> => {
  if (asset.mimeType && !Object.values(photoTypes).includes(asset.mimeType)) {
    throw new Error("photo-unsupported")
  }
  if (asset.fileSize && asset.fileSize > MAX_RECORD_PHOTO_SIZE) {
    throw new Error("photo-too-large")
  }

  if (Platform.OS === "web") {
    const file = asset.file ?? await (await fetch(asset.uri)).blob()
    if (file.size > MAX_RECORD_PHOTO_SIZE) throw new Error("photo-too-large")
    return asset.uri
  }

  const source = new File(asset.uri)
  if (source.size > MAX_RECORD_PHOTO_SIZE) throw new Error("photo-too-large")
  return asset.uri
}

export const prepareRecordPhotoForApi = async (
  record: CatchRecordCreateRequest
): Promise<CatchRecordCreateRequest> => {
  const uri = record.image_url
  if (!uri || uri.startsWith("/") || /^https?:\/\//i.test(uri)) return record

  const uploadCacheKey = Platform.OS !== "web"
    ? `recordPhotoUpload:${getBaseApiUrl()}:${uri}` : null
  if (uploadCacheKey) {
    try {
      const uploadedUri = await AsyncStorage.getItem(uploadCacheKey)
      if (uploadedUri) return { ...record, image_url: uploadedUri }
    } catch {
      // Cache failures must not prevent uploading the photo.
    }
  }

  const formData = new FormData()
  if (Platform.OS === "web") {
    const blob = await (await fetch(uri)).blob()
    const extension = Object.keys(photoTypes).find(key => photoTypes[key] === blob.type) ?? "jpg"
    formData.append("file", blob, `record.${extension}`)
  } else {
    formData.append("file", new File(uri))
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)
  try {
    const response = await fetch(`${getBaseApiUrl()}/records/photos`, {
      method: "POST",
      body: formData,
      signal: controller.signal,
    })
    if (!response.ok) throw new Error("photo-upload-error")
    const result: { image_url: string } = await response.json()
    if (uploadCacheKey) {
      try {
        await AsyncStorage.setItem(uploadCacheKey, result.image_url)
      } catch {
        // The uploaded photo can still be attached without a cached URL.
      }
    }
    return { ...record, image_url: result.image_url }
  } finally {
    clearTimeout(timeout)
  }
}
