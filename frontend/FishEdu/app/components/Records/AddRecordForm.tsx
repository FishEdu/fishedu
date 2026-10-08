import { AppColors } from "@/app/constants/theme"
import { useTheme } from "@/app/hooks/useTheme/useTheme"
import { useEffect, useState } from "react"
import {ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View, } from "react-native"
import * as ImagePicker from "expo-image-picker"
import { router } from "expo-router"
import Ionicons from "@expo/vector-icons/Ionicons"
import InputGroup from "../FormInputs/InputGroup"
import FishingSpotPicker from "../FormInputs/FishingSpotPicker"
import {createRecord, updateRecord, } from "@/app/utils/fetch/records/fetchRecords"
import { useFetchFish } from "@/app/hooks/useFetchFish/useFetchFish"
import { CatchRecordGetResponse } from "@/app/api/records"
import { getTranslation } from "@/app/utils/translation/getTranslation"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { resolveRecordPhotoUrl, getSelectedRecordPhotoUri } from "@/app/utils/fetch/records/recordPhoto"
import { LanguageCode } from "@/app/constants/language"


type FormData = {
  fish_id: number
  fish_name: string
  fishing_spot: string
  total_length: string
  fork_length: string
  weight: string
  description: string
  image_url: string | null
}

type Props = {
  record?: CatchRecordGetResponse
}

export default function AddRecordForm({ record }: Props) {
  const { colors } = useTheme()
  const styles = createStyles(colors)
  const inputStyles = createInputStyles(colors)
  const fishInputStyles = createFishInputStyles(colors)
  const measureInputStyles = createMeasureInputStyles(colors)
  const [formData, setFormData] = useState<FormData>(() => ({
    fish_id: record?.fish_id ?? 0,
    fish_name: record?.fish_name ?? "",
    fishing_spot: record?.fishing_spot ?? "",
    total_length: record?.total_length?.toString() ?? "",
    fork_length: record?.fork_length?.toString() ?? "",
    weight: record?.weight?.toString() ?? "",
    description: record?.description ?? "",
    image_url: record?.image_url ?? null,
  }))

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [photoLoading, setPhotoLoading] = useState(false)
  const [showFishList, setShowFishList] = useState(false)

const [language, setLanguage] = useState<LanguageCode>(
  LanguageCode.PL
)

useEffect(() => {
  const loadLanguage = async () => {
    const savedLanguage = await AsyncStorage.getItem("language")

    setLanguage(
      (savedLanguage as LanguageCode) ?? LanguageCode.PL
    )
  }

  loadLanguage()
}, [])

  const { data: fishes } = useFetchFish(formData.fish_name)

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  const selectPhoto = async () => {
    if (loading || photoLoading) return
    setPhotoLoading(true)
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      })
      if (result.canceled) return
      const uri = await getSelectedRecordPhotoUri(result.assets[0])
      updateField("image_url", uri)
      setError("")
    } catch (photoError) {
      const key = photoError instanceof Error && photoError.message === "photo-too-large"
        ? "records.photoTooLarge"
        : photoError instanceof Error && photoError.message === "photo-unsupported"
          ? "records.photoUnsupported" : "records.photoError"
      setError(getTranslation(key, language))
    } finally {
      setPhotoLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (loading || photoLoading) return
    if (
      !formData.fish_name.trim() ||
      !formData.fishing_spot.trim()
    ) {
      setError(getTranslation("records.completeFishAndSpot", language))
      return
    }

    setLoading(true)
    setError("")

    const data = {
      user_id: record?.user_id,
      fish_id: formData.fish_id,
      fish_name: formData.fish_name.trim(),
      fishing_spot: formData.fishing_spot.trim(),
      total_length:
        Number(formData.total_length) || undefined,
      fork_length:
        Number(formData.fork_length) || undefined,
      weight:
        Number(formData.weight.replace(",", ".")) || undefined,
      description:
        formData.description.trim() || undefined,
      image_url: formData.image_url,
    }

    try {
      const result = record
        ? await updateRecord(record.id, data)
        : await createRecord(data)

      if (!result) {
        setError(getTranslation("records.saveError", language))
        return
      }

      if (!record) {
        setFormData({
          fish_id: 0,
          fish_name: "",
          fishing_spot: "",
          total_length: "",
          fork_length: "",
          weight: "",
          description: "",
          image_url: null,
        })
      }

      router.replace("/(tabs)/records")
    } catch (saveError) {
      const key = saveError instanceof Error && saveError.message === "photo-upload-error"
        ? "records.photoUploadError" : "records.saveError"
      setError(getTranslation(key, language))
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>

      {/* IMAGE */}

      <View style={styles.imageSection}>
        <Pressable
          style={styles.imageInput}
          onPress={() => void selectPhoto()}
          disabled={loading || photoLoading}
          accessibilityRole="button"
          accessibilityLabel={getTranslation(formData.image_url ? "records.changePhoto" : "records.addPhoto", language)}
        >
          {photoLoading ? (
            <ActivityIndicator color={colors.primary} />
          ) : formData.image_url ? (
            <Image
              source={{ uri: resolveRecordPhotoUrl(formData.image_url) }}
              style={styles.photoPreview}
            />
          ) : (
            <>
              <View style={styles.imageIconContainer}>
                <Ionicons name="camera-outline" size={30} color={colors.text.muted} />
              </View>
              <Text style={styles.imageTitle}>
                {getTranslation("records.addPhoto", language)}
              </Text>
              <Text style={styles.imageSubtitle}>
                {getTranslation("records.optional", language)}
              </Text>
            </>
          )}
        </Pressable>
        {formData.image_url && (
          <Pressable
            style={styles.removePhotoButton}
            disabled={loading || photoLoading}
            onPress={() => setFormData(prev => ({ ...prev, image_url: null }))}
            accessibilityRole="button"
            accessibilityLabel={getTranslation("records.removePhoto", language)}
          >
            <Ionicons name="close" size={20} color={colors.text.onPrimary} />
          </Pressable>
        )}
      </View>


      {/* FISH */}

      <View style={[styles.section, styles.fishSection]}>
        <View style={styles.sectionHeader}>
          <Ionicons
            name="fish-outline"
            size={18}
            color={colors.primary}
          />

          <Text style={styles.sectionTitle}>
            {getTranslation("records.fish", language)}
          </Text>
        </View>

        <View style={styles.fishWrapper}>

          <View style={styles.fishInputContainer}>
            <Ionicons
              name="search-outline"
              size={18}
              color={colors.text.muted}
            />

            <InputGroup
              styles={fishInputStyles}
              inputProps={{
                placeholder: getTranslation("records.searchFish", language),
                value: formData.fish_name,

                onFocus: () => {
                  setShowFishList(true)
                },

                onChangeText: value => {
                  updateField("fish_name", value)
                  setShowFishList(true)
                },

              }}
            />

            {formData.fish_name && (
              <Pressable
                onPress={() => {
                  setFormData(prev => ({
                    ...prev,
                    fish_id: 0,
                    fish_name: "",
                  }))
                }}
              >
                <Ionicons
                  name="close-circle"
                  size={18}
                  color={colors.text.muted}
                />
              </Pressable>
            )}
          </View>


          {showFishList &&
            Array.isArray(fishes) &&
            fishes.length > 0 && (

              <View style={styles.fishResults}>

                <Text style={styles.resultsTitle}>
                  {getTranslation("records.searchResults", language)}
                </Text>

                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  nestedScrollEnabled
                  style={styles.resultsScroll}
                >
                  {fishes.map(fish => {
                    const selected =
                      fish.id === formData.fish_id

                    return (
                      <Pressable
                        key={fish.id}
                        style={[
                          styles.fishResult,
                          selected &&
                            styles.selectedFishResult,
                        ]}
                        onPress={() => {
                          setFormData(prev => ({
                            ...prev,
                            fish_id: fish.id,
                            fish_name: fish.name,
                          }))

                          setShowFishList(false)
                        }}
                      >
                        <View style={styles.fishResultLeft}>

                          <View style={styles.fishResultIcon}>
                            <Ionicons
                              name="fish-outline"
                              size={18}
                              color={
                                selected
                                  ? colors.primary
                                  : colors.text.muted
                              }
                            />
                          </View>

                          <Text
                            style={[
                              styles.fishResultText,
                              selected &&
                                styles.selectedFishText,
                            ]}
                          >
                            {fish.name}
                          </Text>

                        </View>

                        {selected && (
                          <Ionicons
                            name="checkmark-circle"
                            size={20}
                            color={colors.primary}
                          />
                        )}
                      </Pressable>
                    )
                  })}
                </ScrollView>

              </View>
            )}
        </View>
      </View>


      {/* FISHING SPOT */}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons
            name="location-outline"
            size={18}
            color={colors.primary}
          />

          <Text style={styles.sectionTitle}>
            {getTranslation("records.fishingSpot", language)}
          </Text>
        </View>

        <FishingSpotPicker
          value={formData.fishing_spot}
          onChange={value =>
            updateField("fishing_spot", value)
          }
          disabled={showFishList}
        />
      </View>


      {/* MEASUREMENTS */}

      <View style={styles.section}>

        <View style={styles.sectionHeader}>
          <Ionicons
            name="resize-outline"
            size={18}
            color={colors.primary}
          />

          <Text style={styles.sectionTitle}>
            {getTranslation("records.measurementsAndWeight", language)}
          </Text>
        </View>

        <View style={styles.lengthRow}>

          <View style={styles.measureInput}>
            <Text style={styles.measureLabel}>
              TL
            </Text>

            <InputGroup
              styles={measureInputStyles}
              inputProps={{
                placeholder: "cm",
                keyboardType: "numeric",
                value: formData.total_length,
                onChangeText: value =>
                  updateField(
                    "total_length",
                    value
                  ),
              }}
            />
          </View>


          <View style={styles.measureInput}>
            <Text style={styles.measureLabel}>
              FL
            </Text>

            <InputGroup
              styles={measureInputStyles}
              inputProps={{
                placeholder: "cm",
                keyboardType: "numeric",
                value: formData.fork_length,
                onChangeText: value =>
                  updateField(
                    "fork_length",
                    value
                  ),
              }}
            />
          </View>


          <View style={styles.measureInput}>
            <Text style={styles.measureLabel}>
              Waga
            </Text>

            <InputGroup
              styles={measureInputStyles}
              inputProps={{
                placeholder: "kg",
                keyboardType: "numeric",
                value: formData.weight,
                onChangeText: value =>
                  updateField(
                    "weight",
                    value
                  ),
              }}
            />
          </View>

        </View>
      </View>


      {/* DESCRIPTION */}

      <View style={styles.section}>

        <View style={styles.sectionHeader}>
          <Ionicons
            name="document-text-outline"
            size={18}
            color={colors.primary}
          />

          <Text style={styles.sectionTitle}>
            {getTranslation("records.description", language)}
          </Text>
        </View>

        <InputGroup
          styles={{
            ...inputStyles,
            inputWrapper:
              styles.descriptionWrapper,
          }}
          inputProps={{
            placeholder:
              getTranslation("records.descriptionPlaceholder", language),
            multiline: true,
            value: formData.description,
            onChangeText: value =>
              updateField(
                "description",
                value
              ),
          }}
        />

      </View>


      {/* ERROR */}

      {error ? (
        <View style={styles.errorContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={18}
            color={colors.danger}
          />

          <Text style={styles.error}>
            {error}
          </Text>
        </View>
      ) : null}


      {/* SUBMIT */}

      <Pressable
        onPress={handleSubmit}
        style={({ pressed }) => [
          styles.submitButton,
          pressed &&
            styles.submitButtonPressed,
          loading &&
            styles.submitButtonDisabled,
        ]}
        disabled={loading || photoLoading}
      >
        <Ionicons
          name={
            record
              ? "checkmark-circle-outline"
              : "add-circle-outline"
          }
          size={19}
          color={colors.text.onPrimary}
        />

        <Text style={styles.submitText}>
          {loading
            ? getTranslation("records.saving", language)
            : record
              ? getTranslation("records.saveChanges", language)
              : getTranslation("records.addRecord", language)}
        </Text>
      </Pressable>

    </View>
  )
}


/* INPUT STYLES */

const createInputStyles = (colors: AppColors) => StyleSheet.create({
  containerStyles: {
    marginBottom: 8,
  },

  inputWrapper: {
    backgroundColor: colors.background.app,
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 12,
  },

  inputStyles: {
    fontSize: 13,
    color: colors.text.main,
  },
})


const createFishInputStyles = (colors: AppColors) => StyleSheet.create({
  containerStyles: {
    flex: 1,
    marginBottom: 0,
  },

  inputWrapper: {
    backgroundColor: "transparent",
    paddingVertical: 0,
    paddingHorizontal: 0,
  },

  inputStyles: {
    fontSize: 13,
    color: colors.text.main,
  },
})


const createMeasureInputStyles = (colors: AppColors) => StyleSheet.create({
  containerStyles: {
    width: "100%",
    marginBottom: 0,
  },

  inputWrapper: {
    width: "100%",
    height: 50,
    backgroundColor: colors.background.app,
    borderRadius: 10,
    paddingVertical: 0,
    paddingHorizontal: 8,
    justifyContent: "center",
  },

  inputStyles: {
    width: "100%",
    height: 50,
    fontSize: 14,
    color: colors.text.main,
    textAlign: "center",
    padding: 0,
    margin: 0,
  },
})


/* MAIN STYLES */

const createStyles = (colors: AppColors) => StyleSheet.create({

  container: {
    backgroundColor: colors.background.card,
    borderRadius: 18,
    padding: 14,
    gap: 4,
  },


  /* IMAGE */

  imageSection: {
    position: "relative",
  },

  photoPreview: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  removePhotoButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background.overlay,
    alignItems: "center",
    justifyContent: "center",
  },

  imageInput: {
    height: 240,
    backgroundColor: colors.background.app,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border.card,
    overflow: "hidden",
  },

  imageIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.background.card,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  imageTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text.muted,
  },

  imageSubtitle: {
    fontSize: 10,
    color: colors.text.muted,
    marginTop: 2,
  },


  /* SECTIONS */

  section: {
    marginTop: 14,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 7,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text.muted,
  },


  /* FISH */
  fishSection: {
    position: "relative",
    zIndex: 1000,
    elevation: 1000,
  },

  fishWrapper: {
    position: "relative",
    zIndex: 20,
    elevation: 20,
  },

  fishInputContainer: {
    minHeight: 50,
    backgroundColor: colors.background.app,
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  fishResults: {
    position: "absolute",
    top: 55,
    left: 0,
    right: 0,

    backgroundColor: colors.background.card,
    borderRadius: 12,

    padding: 6,

    shadowColor: colors.background.overlay,
    shadowOpacity: 0.14,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 30,
    zIndex: 100,
  },

  resultsTitle: {
    fontSize: 10,
    color: colors.text.muted,
    fontWeight: "600",
    paddingHorizontal: 9,
    paddingVertical: 7,
  },

  resultsScroll: {
    maxHeight: 210,
  },

  fishResult: {
    minHeight: 48,
    paddingHorizontal: 8,
    borderRadius: 9,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  selectedFishResult: {
    backgroundColor: colors.background.primarySoft,
  },

  fishResultLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  fishResultIcon: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: colors.background.app,
    alignItems: "center",
    justifyContent: "center",
  },

  fishResultText: {
    fontSize: 13,
    color: colors.text.main,
  },

  selectedFishText: {
    color: colors.primary,
    fontWeight: "600",
  },


  /* MEASUREMENTS */

  lengthRow: {
    flexDirection: "row",
    gap: 8,
  },

  measureInput: {
    flex: 1,
    minWidth: 0,
    minHeight: 74,
  },

  measureLabel: {
    fontSize: 10,
    color: colors.text.muted,
    marginBottom: 4,
    textAlign: "center",
    fontWeight: "600",
  },


  /* DESCRIPTION */

  descriptionWrapper: {
    backgroundColor: colors.background.app,
    borderRadius: 10,
    minHeight: 95,
    paddingVertical: 11,
    paddingHorizontal: 12,
  },


  /* ERROR */

  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: colors.background.dangerSoft,
    borderRadius: 9,
    padding: 10,
    marginTop: 5,
  },

  error: {
    flex: 1,
    color: colors.danger,
    fontSize: 12,
    fontWeight: "500",
  },


  /* SUBMIT */

  submitButton: {
    marginTop: 10,
    minHeight: 48,
    borderRadius: 13,
    backgroundColor: colors.primary,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },

  submitButtonPressed: {
    opacity: 0.85,
  },

  submitButtonDisabled: {
    opacity: 0.65,
  },

  submitText: {
    color: colors.text.onPrimary,
    fontSize: 13,
    fontWeight: "700",
  },
})
