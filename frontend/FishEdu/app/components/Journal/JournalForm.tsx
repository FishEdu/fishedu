import { FishingJournal, FishingJournalInput } from "@/app/api/journal"
import { AppColors } from "@/app/constants/theme"
import { useTheme } from "@/app/hooks/useTheme/useTheme"
import { createJournal, updateJournal } from "@/app/utils/fetch/journal/fetchJournals"
import {
  getSelectedRecordPhotoUri,
  resolveRecordPhotoUrl,
} from "@/app/utils/fetch/records/recordPhoto"
import { getTranslation } from "@/app/utils/translation/getTranslation"
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage"

import Ionicons from "@expo/vector-icons/Ionicons"
import * as ImagePicker from "expo-image-picker"
import { router } from "expo-router"
import { useState } from "react"

import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native"

import JournalCatchEditor, {
  JournalCatchDraft,
} from "./JournalCatchEditor"

import JournalSpotSearch from "./JournalSpotSearch"
import JournalDatePicker from "./JournalDatePicker"
import JournalTimePicker from "./JournalTimePicker"

import {
  formatDateToIso,
  isValidDate,
  parseDateFromIso,
} from "./utils/journalDateUtils"

type Props = {
  journal?: FishingJournal
}

type TimePickerField = "start" | "end" | null

const createCatchDraft = (
  catchItem?: FishingJournal["catches"][number]
): JournalCatchDraft => ({
  key: String(catchItem?.id ?? `${Date.now()}-${Math.random()}`),
  fish_id: catchItem?.fish_id ?? 0,
  fish_name: catchItem?.fish_name ?? "",
  count: String(catchItem?.count ?? 1),
  total_length: catchItem?.total_length?.toString() ?? "",
  weight: catchItem?.weight?.toString() ?? "",
})

export default function JournalForm({ journal }: Props) {
  const { colors } = useTheme()
  const { languageCode } = useLanguage()

  const styles = createStyles(colors)

  const locale = languageCode === "en" ? "en-GB" : "pl-PL"
  const isEnglish = languageCode === "en"

  // Dane formularza
  const [fishedOn, setFishedOn] = useState(
    journal?.fished_on ?? formatDateToIso(new Date())
  )

  const [fishingSpot, setFishingSpot] = useState(
    journal?.fishing_spot ?? ""
  )

  const [startedAt, setStartedAt] = useState(
    journal?.started_at ?? ""
  )

  const [endedAt, setEndedAt] = useState(
    journal?.ended_at ?? ""
  )

  const [description, setDescription] = useState(
    journal?.description ?? ""
  )

  const [imageUrl, setImageUrl] = useState<string | null>(
    journal?.image_url ?? null
  )

  const [catches, setCatches] = useState<JournalCatchDraft[]>(() =>
    journal?.catches.length
      ? journal.catches.map(createCatchDraft)
      : [createCatchDraft()]
  )

  // Stan formularza
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)
  const [photoLoading, setPhotoLoading] = useState(false)

  // Widoczność selektorów
  const [datePickerVisible, setDatePickerVisible] = useState(false)
  const [timePickerField, setTimePickerField] =
    useState<TimePickerField>(null)

  const updateCatch = (
    key: string,
    nextCatch: JournalCatchDraft
  ) => {
    setCatches(current =>
      current.map(catchItem =>
        catchItem.key === key ? nextCatch : catchItem
      )
    )
  }

  // Wybieranie zdjęcia
  const selectPhoto = async () => {
    if (saving || photoLoading) return

    setPhotoLoading(true)

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      })

      if (!result.canceled) {
        setImageUrl(
          await getSelectedRecordPhotoUri(result.assets[0])
        )
      }
    } catch (photoError) {
      const key =
        photoError instanceof Error &&
        photoError.message === "photo-too-large"
          ? "records.photoTooLarge"
          : "records.photoError"

      setError(getTranslation(key, languageCode))
    } finally {
      setPhotoLoading(false)
    }
  }

  // Otwieranie kalendarza
  const openDatePicker = () => {
    setDatePickerVisible(true)
  }

  // Otwieranie selektora godzin
  const openTimePicker = (field: "start" | "end") => {
    setTimePickerField(field)
  }

  // Zapis wybranej godziny
  const handleTimeConfirm = (value: string) => {
    if (timePickerField === "start") {
      setStartedAt(value)
    } else if (timePickerField === "end") {
      setEndedAt(value)
    }

    setTimePickerField(null)
  }

  // Zapisywanie formularza
  const handleSubmit = async () => {
    const completeCatches = catches.filter(
      catchItem => catchItem.fish_name.trim()
    )

    if (
      !isValidDate(fishedOn) ||
      !fishingSpot.trim() ||
      !completeCatches.length ||
      completeCatches.length !== catches.length
    ) {
      setError(
        getTranslation("journal.completeRequired", languageCode)
      )
      return
    }

    const input: FishingJournalInput = {
      fished_on: fishedOn,
      fishing_spot: fishingSpot.trim(),
      started_at: startedAt.trim() || undefined,
      ended_at: endedAt.trim() || undefined,
      description: description.trim() || undefined,
      image_url: imageUrl,

      catches: completeCatches.map(catchItem => ({
        fish_id: catchItem.fish_id || undefined,
        fish_name: catchItem.fish_name.trim(),
        count: Math.max(1, Number(catchItem.count) || 1),
        total_length:
          Number(catchItem.total_length.replace(",", ".")) || undefined,
        weight:
          Number(catchItem.weight.replace(",", ".")) || undefined,
      })),
    }

    setSaving(true)
    setError("")

    try {
      const savedJournal = journal
        ? await updateJournal(journal.id, input)
        : await createJournal(input)

      if (!savedJournal) {
        throw new Error("Could not save journal")
      }

      router.replace(
        "/(tabs)/journal" as Parameters<typeof router.replace>[0]
      )
    } catch {
      setError(
        getTranslation("journal.saveError", languageCode)
      )
    } finally {
      setSaving(false)
    }
  }

  const displayDate = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parseDateFromIso(fishedOn))

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Zdjęcie wyprawy */}
        <View style={styles.photoSection}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={getTranslation(
              imageUrl ? "records.changePhoto" : "records.addPhoto",
              languageCode
            )}
            disabled={saving || photoLoading}
            onPress={() => void selectPhoto()}
            style={styles.photoInput}
          >
            {photoLoading ? (
              <ActivityIndicator color={colors.primary} />
            ) : imageUrl ? (
              <Image
                source={{ uri: resolveRecordPhotoUrl(imageUrl) }}
                style={styles.photo}
              />
            ) : (
              <>
                <Ionicons
                  name="camera-outline"
                  size={30}
                  color={colors.text.muted}
                />

                <Text style={styles.photoText}>
                  {getTranslation("journal.addTripPhoto", languageCode)}
                </Text>
              </>
            )}
          </Pressable>

          {imageUrl ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={getTranslation(
                "records.removePhoto",
                languageCode
              )}
              onPress={() => setImageUrl(null)}
              style={styles.removePhoto}
            >
              <Ionicons
                name="close"
                size={18}
                color={colors.text.onPrimary}
              />
            </Pressable>
          ) : null}
        </View>

        {/* Szczegóły wyprawy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {getTranslation("journal.tripDetails", languageCode)}
          </Text>

          {/* Data */}
          <Text style={styles.label}>
            {getTranslation("journal.date", languageCode)}
          </Text>

          <Pressable
            accessibilityRole="button"
            onPress={openDatePicker}
            style={styles.pickerField}
          >
            <View style={styles.pickerFieldLeft}>
              <View style={styles.pickerIconWrap}>
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={colors.primary}
                />
              </View>

              <Text style={styles.pickerValue}>
                {displayDate}
              </Text>
            </View>

            <Ionicons
              name="chevron-down"
              size={19}
              color={colors.text.muted}
            />
          </Pressable>

          {/* Łowisko */}
          <Text style={styles.label}>
            {getTranslation("journal.fishingSpot", languageCode)}
          </Text>

          <JournalSpotSearch
            value={fishingSpot}
            onChange={setFishingSpot}
          />

          {/* Godziny */}
          <View style={styles.smallRow}>
            <View style={styles.smallField}>
              <Text style={styles.label}>
                {getTranslation("journal.startTime", languageCode)}
              </Text>

              <Pressable
                accessibilityRole="button"
                onPress={() => openTimePicker("start")}
                style={styles.pickerField}
              >
                <View style={styles.pickerFieldLeft}>
                  <View style={styles.pickerIconWrap}>
                    <Ionicons
                      name="time-outline"
                      size={20}
                      color={colors.primary}
                    />
                  </View>

                  <Text
                    style={[
                      styles.pickerValue,
                      !startedAt && styles.pickerPlaceholder,
                    ]}
                  >
                    {startedAt || "--:--"}
                  </Text>
                </View>

                <Ionicons
                  name="chevron-down"
                  size={17}
                  color={colors.text.muted}
                />
              </Pressable>
            </View>

            <View style={styles.smallField}>
              <Text style={styles.label}>
                {getTranslation("journal.endTime", languageCode)}
              </Text>

              <Pressable
                accessibilityRole="button"
                onPress={() => openTimePicker("end")}
                style={styles.pickerField}
              >
                <View style={styles.pickerFieldLeft}>
                  <View style={styles.pickerIconWrap}>
                    <Ionicons
                      name="time-outline"
                      size={20}
                      color={colors.primary}
                    />
                  </View>

                  <Text
                    style={[
                      styles.pickerValue,
                      !endedAt && styles.pickerPlaceholder,
                    ]}
                  >
                    {endedAt || "--:--"}
                  </Text>
                </View>

                <Ionicons
                  name="chevron-down"
                  size={17}
                  color={colors.text.muted}
                />
              </Pressable>
            </View>
          </View>
        </View>

        {/* Złowione ryby */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {getTranslation("journal.catches", languageCode)}
            </Text>

            <Text style={styles.catchCount}>
              {catches.reduce(
                (total, catchItem) =>
                  total + (Number(catchItem.count) || 0),
                0
              )}{" "}
              {getTranslation("journal.items", languageCode)}
            </Text>
          </View>

          <View style={styles.catchList}>
            {catches.map(catchItem => (
              <JournalCatchEditor
                key={catchItem.key}
                value={catchItem}
                removable={catches.length > 1}
                onChange={nextCatch =>
                  updateCatch(catchItem.key, nextCatch)
                }
                onRemove={() =>
                  setCatches(current =>
                    current.filter(item => item.key !== catchItem.key)
                  )
                }
              />
            ))}
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() =>
              setCatches(current => [
                ...current,
                createCatchDraft(),
              ])
            }
            style={styles.addCatch}
          >
            <Ionicons
              name="add"
              size={18}
              color={colors.primary}
            />

            <Text style={styles.addCatchText}>
              {getTranslation("journal.addCatch", languageCode)}
            </Text>
          </Pressable>
        </View>

        {/* Notatka */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {getTranslation("journal.note", languageCode)}
          </Text>

          <TextInput
            value={description}
            onChangeText={setDescription}
            multiline
            placeholder={getTranslation(
              "journal.notePlaceholder",
              languageCode
            )}
            placeholderTextColor={colors.text.muted}
            textAlignVertical="top"
            style={styles.noteInput}
          />
        </View>

        {error ? (
          <Text style={styles.error}>{error}</Text>
        ) : null}

        {/* Zapis */}
        <Pressable
          accessibilityRole="button"
          disabled={saving || photoLoading}
          onPress={() => void handleSubmit()}
          style={[
            styles.saveButton,
            (saving || photoLoading) && styles.saveButtonDisabled,
          ]}
        >
          <Ionicons
            name="checkmark-circle-outline"
            size={20}
            color={colors.text.onPrimary}
          />

          <Text style={styles.saveText}>
            {saving
              ? getTranslation("journal.saving", languageCode)
              : getTranslation(
                  journal ? "journal.saveChanges" : "journal.save",
                  languageCode
                )}
          </Text>
        </Pressable>
      </ScrollView>

      {/* Własny kalendarz */}
      <JournalDatePicker
        visible={datePickerVisible}
        value={fishedOn}
        locale={locale}
        isEnglish={isEnglish}
        onClose={() => setDatePickerVisible(false)}
        onConfirm={setFishedOn}
      />

      {/* Własny selektor godzin */}
      <JournalTimePicker
        visible={timePickerField !== null}
        initialValue={
          timePickerField === "start" ? startedAt : endedAt
        }
        fallbackValue={
          timePickerField === "start" ? "06:30" : "11:00"
        }
        title={
          timePickerField === "start"
            ? getTranslation("journal.startTime", languageCode)
            : getTranslation("journal.endTime", languageCode)
        }
        isEnglish={isEnglish}
        onClose={() => setTimePickerField(null)}
        onConfirm={handleTimeConfirm}
      />
    </>
  )
}

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    content: {
      gap: 15,
      paddingBottom: 34,
    },

    photoSection: {
      position: "relative",
    },

    photoInput: {
      alignItems: "center",
      backgroundColor: colors.background.card,
      borderColor: colors.border.card,
      borderRadius: 10,
      borderWidth: 1,
      height: 200,
      justifyContent: "center",
      overflow: "hidden",
    },

    photo: {
      height: "100%",
      resizeMode: "cover",
      width: "100%",
    },

    photoText: {
      color: colors.text.muted,
      fontSize: 13,
      marginTop: 7,
    },

    removePhoto: {
      alignItems: "center",
      backgroundColor: colors.background.overlay,
      borderRadius: 16,
      height: 32,
      justifyContent: "center",
      position: "absolute",
      right: 8,
      top: 8,
      width: 32,
    },

    section: {
      gap: 8,
    },

    sectionHeader: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
    },

    sectionTitle: {
      color: colors.text.main,
      fontSize: 16,
      fontWeight: "700",
    },

    label: {
      color: colors.text.muted,
      fontSize: 12,
      fontWeight: "600",
      marginTop: 4,
    },

    pickerField: {
      alignItems: "center",
      backgroundColor: colors.background.card,
      borderColor: colors.border.card,
      borderRadius: 13,
      borderWidth: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      minHeight: 55,
      paddingHorizontal: 10,
    },

    pickerFieldLeft: {
      alignItems: "center",
      flexDirection: "row",
      gap: 10,
      flex: 1,
      minWidth: 0,
    },

    pickerIconWrap: {
      alignItems: "center",
      backgroundColor: colors.background.primarySoft,
      borderRadius: 10,
      height: 36,
      justifyContent: "center",
      width: 36,
    },

    pickerValue: {
      color: colors.text.main,
      flexShrink: 1,
      fontSize: 13,
      fontWeight: "600",
    },

    pickerPlaceholder: {
      color: colors.text.muted,
    },

    smallRow: {
      flexDirection: "row",
      gap: 9,
    },

    smallField: {
      flex: 1,
      gap: 5,
      minWidth: 0,
    },

    catchCount: {
      color: colors.secondary,
      fontSize: 12,
      fontWeight: "700",
    },

    catchList: {
      gap: 9,
    },

    addCatch: {
      alignItems: "center",
      borderColor: colors.primary,
      borderRadius: 10,
      borderStyle: "dashed",
      borderWidth: 1,
      flexDirection: "row",
      gap: 6,
      justifyContent: "center",
      minHeight: 44,
    },

    addCatchText: {
      color: colors.primary,
      fontSize: 13,
      fontWeight: "700",
    },

    noteInput: {
      backgroundColor: colors.background.card,
      borderColor: colors.border.card,
      borderRadius: 10,
      borderWidth: 1,
      color: colors.text.main,
      fontSize: 14,
      minHeight: 100,
      padding: 11,
    },

    error: {
      color: colors.danger,
      fontSize: 13,
      textAlign: "center",
    },

    saveButton: {
      alignItems: "center",
      backgroundColor: colors.primary,
      borderRadius: 10,
      flexDirection: "row",
      gap: 7,
      justifyContent: "center",
      minHeight: 50,
    },

    saveButtonDisabled: {
      opacity: 0.65,
    },

    saveText: {
      color: colors.text.onPrimary,
      fontSize: 14,
      fontWeight: "700",
    },
  })