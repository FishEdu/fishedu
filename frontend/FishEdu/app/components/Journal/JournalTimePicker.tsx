import { useEffect, useState } from "react"
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native"
import Ionicons from "@expo/vector-icons/Ionicons"

import { AppColors } from "@/app/constants/theme"
import { useTheme } from "@/app/hooks/useTheme/useTheme"

import { padNumber } from "./utils/journalDateUtils"

type Props = {
  visible: boolean
  initialValue: string
  fallbackValue: string
  title: string
  isEnglish: boolean
  onClose: () => void
  onConfirm: (time: string) => void
}

export default function JournalTimePicker({
  visible,
  initialValue,
  fallbackValue,
  title,
  isEnglish,
  onClose,
  onConfirm,
}: Props) {
  const { colors } = useTheme()
  const styles = createStyles(colors)

  const [draftHour, setDraftHour] = useState(6)
  const [draftMinute, setDraftMinute] = useState(30)

  useEffect(() => {
    if (!visible) return

    const valueToParse = /^\d{2}:\d{2}$/.test(initialValue)
      ? initialValue
      : fallbackValue

    const [hourPart, minutePart] = valueToParse.split(":")

    const hour = Number(hourPart)
    const minute = Number(minutePart)

    setDraftHour(
      Number.isInteger(hour) && hour >= 0 && hour <= 23
        ? hour
        : 6
    )

    setDraftMinute(
      Number.isInteger(minute) && minute >= 0 && minute <= 59
        ? minute
        : 30
    )
  }, [visible, initialValue, fallbackValue])

  const changeMinutes = (amount: number) => {
    const totalMinutes =
      (draftHour * 60 + draftMinute + amount + 1440) % 1440

    setDraftHour(Math.floor(totalMinutes / 60))
    setDraftMinute(totalMinutes % 60)
  }

  const confirmSelection = () => {
    const value = `${padNumber(draftHour)}:${padNumber(draftMinute)}`

    onConfirm(value)
    onClose()
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable
          style={styles.modalBackdrop}
          onPress={onClose}
        />

        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />

          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {title}
            </Text>

            <Pressable
              onPress={onClose}
              style={styles.modalClose}
            >
              <Ionicons
                name="close"
                size={20}
                color={colors.text.main}
              />
            </Pressable>
          </View>

          <Text style={styles.timePickerHint}>
            {isEnglish
              ? "Set the fishing time"
              : "Ustaw godzinę połowu"}
          </Text>

          {/* Wybieranie godzin i minut */}
          <View style={styles.timeWheelRow}>
            <View style={styles.timeWheelColumn}>
              <Pressable
                accessibilityLabel={
                  isEnglish ? "Increase hour" : "Zwiększ godzinę"
                }
                onPress={() =>
                  setDraftHour(current => (current + 1) % 24)
                }
                style={styles.wheelArrow}
              >
                <Ionicons
                  name="chevron-up"
                  size={25}
                  color={colors.primary}
                />
              </Pressable>

              <Text style={styles.wheelValue}>
                {padNumber(draftHour)}
              </Text>

              <Text style={styles.wheelLabel}>
                {isEnglish ? "Hour" : "Godzina"}
              </Text>

              <Pressable
                accessibilityLabel={
                  isEnglish ? "Decrease hour" : "Zmniejsz godzinę"
                }
                onPress={() =>
                  setDraftHour(current => (current + 23) % 24)
                }
                style={styles.wheelArrow}
              >
                <Ionicons
                  name="chevron-down"
                  size={25}
                  color={colors.primary}
                />
              </Pressable>
            </View>

            <Text style={styles.timeSeparator}>:</Text>

            <View style={styles.timeWheelColumn}>
              <Pressable
                accessibilityLabel={
                  isEnglish ? "Increase minutes" : "Zwiększ minuty"
                }
                onPress={() => changeMinutes(5)}
                style={styles.wheelArrow}
              >
                <Ionicons
                  name="chevron-up"
                  size={25}
                  color={colors.primary}
                />
              </Pressable>

              <Text style={styles.wheelValue}>
                {padNumber(draftMinute)}
              </Text>

              <Text style={styles.wheelLabel}>
                {isEnglish ? "Minutes" : "Minuty"}
              </Text>

              <Pressable
                accessibilityLabel={
                  isEnglish ? "Decrease minutes" : "Zmniejsz minuty"
                }
                onPress={() => changeMinutes(-5)}
                style={styles.wheelArrow}
              >
                <Ionicons
                  name="chevron-down"
                  size={25}
                  color={colors.primary}
                />
              </Pressable>
            </View>
          </View>

          {/* Szybki wybór minut */}
          <Text style={styles.quickMinuteTitle}>
            {isEnglish ? "Quick minutes" : "Szybki wybór minut"}
          </Text>

          <View style={styles.quickMinuteRow}>
            {[0, 15, 30, 45].map(minute => {
              const selected = draftMinute === minute

              return (
                <Pressable
                  key={minute}
                  onPress={() => setDraftMinute(minute)}
                  style={[
                    styles.minuteChip,
                    selected && styles.minuteChipSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.minuteChipText,
                      selected && styles.minuteChipSelectedText,
                    ]}
                  >
                    {padNumber(minute)}
                  </Text>
                </Pressable>
              )
            })}
          </View>

          {/* Podgląd */}
          <View style={styles.timePreview}>
            <View style={styles.timePreviewLabel}>
              <Ionicons
                name="time-outline"
                size={19}
                color={colors.primary}
              />

              <Text style={styles.timePreviewText}>
                {isEnglish ? "Selected time" : "Wybrana godzina"}
              </Text>
            </View>

            <Text style={styles.timePreviewValue}>
              {padNumber(draftHour)}:{padNumber(draftMinute)}
            </Text>
          </View>

          <View style={styles.modalFooter}>
            <Pressable
              onPress={onClose}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>
                {isEnglish ? "Cancel" : "Anuluj"}
              </Text>
            </Pressable>

            <Pressable
              onPress={confirmSelection}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>
                {isEnglish ? "Confirm time" : "Zatwierdź godzinę"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    modalOverlay: {
      backgroundColor: "rgba(0,0,0,0.48)",
      flex: 1,
      justifyContent: "flex-end",
    },

    modalBackdrop: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },

    modalSheet: {
      backgroundColor: colors.background.card,
      borderTopLeftRadius: 26,
      borderTopRightRadius: 26,
      maxHeight: "88%",
      paddingBottom: 28,
      paddingHorizontal: 20,
      paddingTop: 12,
    },

    modalHandle: {
      alignSelf: "center",
      backgroundColor: colors.border.subtle,
      borderRadius: 3,
      height: 4,
      marginBottom: 17,
      width: 42,
    },

    modalHeader: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 17,
    },

    modalTitle: {
      color: colors.text.main,
      flex: 1,
      fontSize: 18,
      fontWeight: "700",
    },

    modalClose: {
      alignItems: "center",
      backgroundColor: colors.background.primarySoft,
      borderRadius: 20,
      height: 36,
      justifyContent: "center",
      width: 36,
    },

    timePickerHint: {
      color: colors.text.muted,
      fontSize: 13,
      marginTop: -8,
    },

    timeWheelRow: {
      alignItems: "center",
      flexDirection: "row",
      gap: 12,
      justifyContent: "center",
      marginTop: 21,
    },

    timeWheelColumn: {
      alignItems: "center",
      backgroundColor: colors.background.primarySoft,
      borderRadius: 19,
      flex: 1,
      gap: 7,
      paddingVertical: 12,
    },

    wheelArrow: {
      alignItems: "center",
      backgroundColor: colors.background.card,
      borderRadius: 12,
      height: 34,
      justifyContent: "center",
      width: 52,
    },

    wheelValue: {
      color: colors.text.main,
      fontSize: 37,
      fontWeight: "700",
      fontVariant: ["tabular-nums"],
    },

    wheelLabel: {
      color: colors.text.muted,
      fontSize: 11,
      fontWeight: "600",
      marginBottom: 3,
    },

    timeSeparator: {
      color: colors.text.muted,
      fontSize: 30,
      fontWeight: "700",
    },

    quickMinuteTitle: {
      color: colors.text.muted,
      fontSize: 12,
      fontWeight: "600",
      marginTop: 19,
      textAlign: "center",
    },

    quickMinuteRow: {
      flexDirection: "row",
      gap: 9,
      justifyContent: "center",
      marginTop: 10,
    },

    minuteChip: {
      alignItems: "center",
      backgroundColor: colors.background.card,
      borderColor: colors.border.card,
      borderRadius: 11,
      borderWidth: 1,
      minWidth: 54,
      paddingHorizontal: 12,
      paddingVertical: 9,
    },

    minuteChipSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },

    minuteChipText: {
      color: colors.text.main,
      fontSize: 13,
      fontWeight: "600",
    },

    minuteChipSelectedText: {
      color: colors.text.onPrimary,
    },

    timePreview: {
      alignItems: "center",
      backgroundColor: colors.background.card,
      borderColor: colors.border.card,
      borderRadius: 14,
      borderWidth: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 19,
      paddingHorizontal: 14,
      paddingVertical: 12,
    },

    timePreviewLabel: {
      alignItems: "center",
      flexDirection: "row",
      gap: 8,
    },

    timePreviewText: {
      color: colors.text.muted,
      fontSize: 12,
      fontWeight: "600",
    },

    timePreviewValue: {
      color: colors.text.main,
      fontSize: 19,
      fontWeight: "700",
      fontVariant: ["tabular-nums"],
    },

    modalFooter: {
      flexDirection: "row",
      gap: 10,
      marginTop: 18,
    },

    secondaryButton: {
      alignItems: "center",
      backgroundColor: colors.background.card,
      borderColor: colors.border.card,
      borderRadius: 12,
      borderWidth: 1,
      flex: 1,
      justifyContent: "center",
      minHeight: 48,
    },

    secondaryButtonText: {
      color: colors.text.main,
      fontSize: 13,
      fontWeight: "600",
    },

    primaryButton: {
      alignItems: "center",
      backgroundColor: colors.primary,
      borderRadius: 12,
      flex: 1,
      justifyContent: "center",
      minHeight: 48,
    },

    primaryButtonText: {
      color: colors.text.onPrimary,
      fontSize: 13,
      fontWeight: "700",
    },
  })