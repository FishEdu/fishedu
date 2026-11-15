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

import {
  formatDateToIso,
  getCalendarDays,
  isSameDay,
  parseDateFromIso,
} from "./utils/journalDateUtils"

type Props = {
  visible: boolean
  value: string
  locale: string
  isEnglish: boolean
  onClose: () => void
  onConfirm: (date: string) => void
}

export default function JournalDatePicker({
  visible,
  value,
  locale,
  isEnglish,
  onClose,
  onConfirm,
}: Props) {
  const { colors } = useTheme()
  const styles = createStyles(colors)

  const [draftDate, setDraftDate] = useState(
    () => parseDateFromIso(value)
  )

  const [visibleMonth, setVisibleMonth] = useState(() => {
    const date = parseDateFromIso(value)

    return new Date(date.getFullYear(), date.getMonth(), 1)
  })

  useEffect(() => {
    if (!visible) return

    const date = parseDateFromIso(value)

    setDraftDate(date)
    setVisibleMonth(
      new Date(date.getFullYear(), date.getMonth(), 1)
    )
  }, [visible, value])

  const monthLabel = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(visibleMonth)

  const weekDays = isEnglish
    ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    : ["Pn", "Wt", "Śr", "Cz", "Pt", "Sb", "Nd"]

  const calendarDays = getCalendarDays(visibleMonth)
  const today = new Date()

  const confirmSelection = () => {
    onConfirm(formatDateToIso(draftDate))
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
              {isEnglish ? "Choose fishing date" : "Wybierz datę połowu"}
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

          {/* Nawigacja miesiąca */}
          <View style={styles.monthNavigation}>
            <Pressable
              accessibilityLabel={
                isEnglish ? "Previous month" : "Poprzedni miesiąc"
              }
              onPress={() =>
                setVisibleMonth(current =>
                  new Date(
                    current.getFullYear(),
                    current.getMonth() - 1,
                    1
                  )
                )
              }
              style={styles.monthArrow}
            >
              <Ionicons
                name="chevron-back"
                size={20}
                color={colors.text.main}
              />
            </Pressable>

            <Text style={styles.monthTitle}>
              {monthLabel}
            </Text>

            <Pressable
              accessibilityLabel={
                isEnglish ? "Next month" : "Następny miesiąc"
              }
              onPress={() =>
                setVisibleMonth(current =>
                  new Date(
                    current.getFullYear(),
                    current.getMonth() + 1,
                    1
                  )
                )
              }
              style={styles.monthArrow}
            >
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.text.main}
              />
            </Pressable>
          </View>

          {/* Dni tygodnia */}
          <View style={styles.weekdays}>
            {weekDays.map(day => (
              <Text key={day} style={styles.weekday}>
                {day}
              </Text>
            ))}
          </View>

          {/* Dni miesiąca */}
          <View style={styles.calendarGrid}>
            {calendarDays.map((day, index) => {
              if (!day) {
                return (
                  <View
                    key={`empty-${index}`}
                    style={styles.calendarDay}
                  />
                )
              }

              const selected = isSameDay(day, draftDate)
              const isToday = isSameDay(day, today)

              return (
                <Pressable
                  key={formatDateToIso(day)}
                  onPress={() => setDraftDate(day)}
                  style={styles.calendarDay}
                >
                  <View
                    style={[
                      styles.calendarDayCircle,
                      isToday && styles.calendarDayToday,
                      selected && styles.calendarDaySelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.calendarDayText,
                        selected && styles.calendarDaySelectedText,
                      ]}
                    >
                      {day.getDate()}
                    </Text>
                  </View>
                </Pressable>
              )
            })}
          </View>

          <View style={styles.calendarSelectedInfo}>
            <Ionicons
              name="calendar"
              size={17}
              color={colors.primary}
            />

            <Text style={styles.calendarSelectedText}>
              {new Intl.DateTimeFormat(locale, {
                day: "numeric",
                month: "long",
                year: "numeric",
              }).format(draftDate)}
            </Text>
          </View>

          {/* Przyciski */}
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
                {isEnglish ? "Confirm date" : "Zatwierdź datę"}
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

    monthNavigation: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 17,
    },

    monthArrow: {
      alignItems: "center",
      backgroundColor: colors.background.primarySoft,
      borderRadius: 12,
      height: 38,
      justifyContent: "center",
      width: 38,
    },

    monthTitle: {
      color: colors.text.main,
      fontSize: 16,
      fontWeight: "700",
      textTransform: "capitalize",
    },

    weekdays: {
      flexDirection: "row",
      marginBottom: 8,
    },

    weekday: {
      color: colors.text.muted,
      fontSize: 11,
      fontWeight: "700",
      textAlign: "center",
      width: "14.2857%",
    },

    calendarGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
    },

    calendarDay: {
      alignItems: "center",
      aspectRatio: 1,
      justifyContent: "center",
      width: "14.2857%",
    },

    calendarDayCircle: {
      alignItems: "center",
      borderColor: "transparent",
      borderRadius: 19,
      borderWidth: 1.5,
      height: 38,
      justifyContent: "center",
      width: 38,
    },

    calendarDayToday: {
      borderColor: colors.primary,
    },

    calendarDaySelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },

    calendarDayText: {
      color: colors.text.main,
      fontSize: 13,
      fontWeight: "500",
    },

    calendarDaySelectedText: {
      color: colors.text.onPrimary,
      fontWeight: "700",
    },

    calendarSelectedInfo: {
      alignItems: "center",
      backgroundColor: colors.background.primarySoft,
      borderRadius: 12,
      flexDirection: "row",
      gap: 9,
      marginTop: 12,
      paddingHorizontal: 13,
      paddingVertical: 11,
    },

    calendarSelectedText: {
      color: colors.text.main,
      fontSize: 13,
      fontWeight: "600",
      textTransform: "capitalize",
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