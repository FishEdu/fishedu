
import { FishingJournal, JournalSearchMode } from "@/app/api/journal"
import JournalCard from "@/app/components/Journal/JournalCard"
import JournalSearchBar from "@/app/components/Journal/JournalSearchBar"
import Container from "@/app/components/ui/Container"
import { AppColors } from "@/app/constants/theme"
import { useTheme } from "@/app/hooks/useTheme/useTheme"
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage"
import { fetchJournals } from "@/app/utils/fetch/journal/fetchJournals"
import { getTranslation } from "@/app/utils/translation/getTranslation"
import Ionicons from "@expo/vector-icons/Ionicons"
import { router, useFocusEffect } from "expo-router"
import { useCallback, useMemo, useState } from "react"
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function JournalIndex() {
  const { colors } = useTheme()
  const { languageCode } = useLanguage()
  const styles = createStyles(colors)

  const [query, setQuery] = useState("")
  const [mode, setMode] = useState<JournalSearchMode>("all")
  const [journals, setJournals] = useState<FishingJournal[]>([])
  const [loading, setLoading] = useState(true)

  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })

  const [calendarVisible, setCalendarVisible] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const locale = languageCode === "en" ? "en-GB" : "pl-PL"

  const loadJournals = useCallback(async () => {
    setLoading(true)
    setJournals(await fetchJournals({ query, mode }))
    setLoading(false)
  }, [mode, query])

  useFocusEffect(
    useCallback(() => {
      void loadJournals()
    }, [loadJournals])
  )

  // Identyfikator aktualnie wybranego miesiąca
  const monthKey = `${currentMonth.getFullYear()}-${String(
    currentMonth.getMonth() + 1
  ).padStart(2, "0")}`

  // Wpisy tylko z wybranego miesiąca
  const monthJournals = useMemo(
    () => journals.filter(journal => journal.fished_on.slice(0, 7) === monthKey),
    [journals, monthKey]
  )

  // Wpisy z wybranego dnia
  const visibleJournals = useMemo(
    () =>
      selectedDate
        ? monthJournals.filter(journal => journal.fished_on === selectedDate)
        : monthJournals,
    [monthJournals, selectedDate]
  )

  // Łączna liczba złowionych ryb
  const totalCatches = useMemo(
    () =>
      monthJournals.reduce(
        (total, journal) => total + journal.total_catches,
        0
      ),
    [monthJournals]
  )

  // Najczęściej łowiony gatunek
  const mostCaughtFish = useMemo(() => {
    const fishTotals = new Map<string, number>()

    monthJournals.forEach(journal => {
      journal.catches.forEach(catchItem => {
        fishTotals.set(
          catchItem.fish_name,
          (fishTotals.get(catchItem.fish_name) ?? 0) + catchItem.count
        )
      })
    })

    return (
      Array.from(fishTotals.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ??
      "—"
    )
  }, [monthJournals])

  // Dni, w których zapisano przynajmniej jeden połów
  const daysWithJournals = useMemo(
    () => new Set(monthJournals.map(journal => journal.fished_on)),
    [monthJournals]
  )

  // Dni kalendarza. Tydzień zaczyna się od poniedziałku.
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    const firstDay = (new Date(year, month, 1).getDay() + 6) % 7
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const numberOfCells = Math.ceil((firstDay + daysInMonth) / 7) * 7

    return Array.from({ length: numberOfCells }, (_, index) => {
      const day = index - firstDay + 1
      return day > 0 && day <= daysInMonth ? day : null
    })
  }, [currentMonth])

  const monthLabelRaw = currentMonth.toLocaleDateString(locale, {
    month: "long",
    year: "numeric",
  })

  const monthLabel =
    monthLabelRaw.charAt(0).toUpperCase() + monthLabelRaw.slice(1)

  const weekdays =
    languageCode === "en"
      ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      : ["Pn", "Wt", "Śr", "Cz", "Pt", "So", "Nd"]

  const today = new Date()

  const changeMonth = (amount: number) => {
    setCurrentMonth(
      previous =>
        new Date(
          previous.getFullYear(),
          previous.getMonth() + amount,
          1
        )
    )
    setSelectedDate(null)
  }

  const toggleDate = (date: string) => {
    setSelectedDate(previous => (previous === date ? null : date))
  }

  const selectedDateLabel = selectedDate
    ? new Date(`${selectedDate}T12:00:00`).toLocaleDateString(locale, {
        day: "numeric",
        month: "long",
      })
    : ""

  const emptyTitle =
    languageCode === "en" ? "No trips found" : "Nie znaleziono wypraw"

  const emptyMessage = selectedDate
    ? languageCode === "en"
      ? "There are no fishing trips on this day."
      : "Nie masz wypraw zapisanych w tym dniu."
    : languageCode === "en"
      ? "There are no fishing trips in this month."
      : "Nie masz jeszcze wypraw zapisanych w tym miesiącu."

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <Container>
        <View style={styles.page}>
          <View style={styles.header}>
            <View>
              <Text style={styles.heading}>
                {getTranslation("journal.title", languageCode)}
              </Text>
              <Text style={styles.subtitle}>
                {monthJournals.length}{" "}
                {languageCode === "en" ? "trips" : "wypraw"} · {totalCatches}{" "}
                {languageCode === "en" ? "fish" : "ryb"}
              </Text>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Wyszukiwarka */}
            <JournalSearchBar
              query={query}
              mode={mode}
              onQueryChange={setQuery}
              onModeChange={setMode}
            />

            {/* Nawigacja między miesiącami */}
            <View style={styles.monthNavigation}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={
                  languageCode === "en" ? "Previous month" : "Poprzedni miesiąc"
                }
                onPress={() => changeMonth(-1)}
                style={styles.monthArrow}
              >
                <Ionicons
                  name="chevron-back"
                  size={21}
                  color={colors.primary}
                />
              </Pressable>

              <Text style={styles.monthTitle}>{monthLabel}</Text>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel={
                  languageCode === "en" ? "Next month" : "Następny miesiąc"
                }
                onPress={() => changeMonth(1)}
                style={styles.monthArrow}
              >
                <Ionicons
                  name="chevron-forward"
                  size={21}
                  color={colors.primary}
                />
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel={
                  languageCode === "en" ? "Toggle calendar" : "Otwórz kalendarz"
                }
                onPress={() => setCalendarVisible(value => !value)}
                style={[
                  styles.calendarToggle,
                  calendarVisible && styles.calendarToggleActive,
                ]}
              >
                <Ionicons
                  name={calendarVisible ? "list-outline" : "calendar-outline"}
                  size={20}
                  color={colors.primary}
                />
              </Pressable>
            </View>

            {/* Statystyki miesiąca */}
            <View style={styles.statsRow}>
              <View style={styles.statChip}>
                <Text style={styles.statText}>
                  {monthJournals.length}{" "}
                  {languageCode === "en" ? "trips" : "wypraw"}
                </Text>
              </View>

              <View style={styles.statChip}>
                <Text style={styles.statText}>
                  {totalCatches} {languageCode === "en" ? "fish" : "ryb"}
                </Text>
              </View>

              <View style={styles.statChip}>
                <Text style={styles.statText}>
                  {languageCode === "en" ? "Most caught: " : "Najczęściej: "}
                  {mostCaughtFish}
                </Text>
              </View>
            </View>

            {/* Kalendarz miesięczny */}
            {calendarVisible && (
              <View style={styles.calendar}>
                <View style={styles.weekdays}>
                  {weekdays.map(day => (
                    <Text key={day} style={styles.weekday}>
                      {day}
                    </Text>
                  ))}
                </View>

                <View style={styles.calendarGrid}>
                  {calendarDays.map((day, index) => {
                    if (day === null) {
                      return (
                        <View
                          key={`empty-${index}`}
                          style={styles.calendarCell}
                        />
                      )
                    }

                    const dateKey = `${monthKey}-${String(day).padStart(2, "0")}`
                    const hasJournal = daysWithJournals.has(dateKey)
                    const isSelected = selectedDate === dateKey

                    const isToday =
                      day === today.getDate() &&
                      currentMonth.getMonth() === today.getMonth() &&
                      currentMonth.getFullYear() === today.getFullYear()

                    return (
                      <View key={dateKey} style={styles.calendarCell}>
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel={dateKey}
                          onPress={() => toggleDate(dateKey)}
                          style={[
                            styles.calendarDayButton,
                            isToday && styles.calendarToday,
                            isSelected && styles.calendarDaySelected,
                          ]}
                        >
                          <Text
                            style={[
                              styles.calendarDayText,
                              isSelected && styles.calendarDaySelectedText,
                            ]}
                          >
                            {day}
                          </Text>
                        </Pressable>

                        <View
                          style={[
                            styles.calendarDot,
                            !hasJournal && styles.calendarDotHidden,
                          ]}
                        />
                      </View>
                    )
                  })}
                </View>

                <Text style={styles.calendarHint}>
                  {languageCode === "en"
                    ? "Dots mark days with saved fishing trips. Tap a day to filter the list."
                    : "Kropki oznaczają dni z zapisanymi połowami. Kliknij dzień, aby zobaczyć jego wpisy."}
                </Text>
              </View>
            )}

            {/* Lista wypraw */}
            <Text style={styles.sectionTitle}>
              {selectedDate
                ? languageCode === "en"
                  ? `Trips: ${selectedDateLabel}`
                  : `Wyprawy: ${selectedDateLabel}`
                : languageCode === "en"
                  ? "Fishing trips"
                  : "Wyprawy"}
            </Text>

            {loading ? (
              <ActivityIndicator color={colors.primary} style={styles.loader} />
            ) : visibleJournals.length ? (
              <View style={styles.journalList}>
                {visibleJournals.map(journal => (
                  <JournalCard
                    key={journal.id}
                    journal={journal}
                    onPress={() =>
                      router.push({
                        pathname: "/(tabs)/journal/[id]",
                        params: { id: String(journal.id) },
                      } as unknown as Parameters<typeof router.push>[0])
                    }
                  />
                ))}
              </View>
            ) : (
              <View style={styles.empty}>
                <Ionicons
                  name="calendar-outline"
                  size={42}
                  color={colors.text.muted}
                />
                <Text style={styles.emptyTitle}>{emptyTitle}</Text>
                <Text style={styles.emptyText}>{emptyMessage}</Text>
              </View>
            )}
          </ScrollView>

          {/* Dodawanie nowej wyprawy */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={getTranslation("journal.add", languageCode)}
            onPress={() =>
              router.push(
                "/(tabs)/journal/add" as Parameters<typeof router.push>[0]
              )
            }
            style={styles.addButton}
          >
            <Ionicons name="add" size={29} color={colors.text.onPrimary} />
          </Pressable>
        </View>
      </Container>
    </SafeAreaView>
  )
}

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    safeArea: {
      backgroundColor: colors.background.app,
      flex: 1,
    },
    page: {
      flex: 1,
      position: "relative",
    },
    header: {
      marginBottom: 12,
      paddingTop: 3,
    },
    heading: {
      color: colors.text.main,
      fontSize: 25,
      fontWeight: "700",
    },
    subtitle: {
      color: colors.text.muted,
      fontSize: 13,
      marginTop: 3,
    },
    scrollContent: {
      gap: 12,
      paddingBottom: 105,
    },
    monthNavigation: {
      alignItems: "center",
      flexDirection: "row",
      gap: 9,
    },
    monthArrow: {
      alignItems: "center",
      backgroundColor: colors.background.card,
      borderColor: colors.border.card,
      borderRadius: 11,
      borderWidth: 1,
      height: 40,
      justifyContent: "center",
      width: 40,
    },
    monthTitle: {
      color: colors.text.main,
      flex: 1,
      fontSize: 16,
      fontWeight: "700",
      textAlign: "center",
      textTransform: "capitalize",
    },
    calendarToggle: {
      alignItems: "center",
      backgroundColor: colors.background.card,
      borderColor: colors.border.card,
      borderRadius: 11,
      borderWidth: 1,
      height: 40,
      justifyContent: "center",
      width: 40,
    },
    calendarToggleActive: {
      backgroundColor: colors.background.primarySoft,
      borderColor: colors.primary,
    },
    statsRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 7,
    },
    statChip: {
      backgroundColor: colors.background.primarySoft,
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 7,
    },
    statText: {
      color: colors.primary,
      fontSize: 12,
      fontWeight: "600",
    },
    calendar: {
      backgroundColor: colors.background.card,
      borderColor: colors.border.card,
      borderRadius: 13,
      borderWidth: 1,
      padding: 12,
    },
    weekdays: {
      flexDirection: "row",
      marginBottom: 5,
    },
    weekday: {
      color: colors.text.muted,
      fontSize: 11,
      fontWeight: "600",
      textAlign: "center",
      width: "14.2857%",
    },
    calendarGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    calendarCell: {
      alignItems: "center",
      paddingVertical: 3,
      width: "14.2857%",
    },
    calendarDayButton: {
      alignItems: "center",
      borderRadius: 18,
      height: 35,
      justifyContent: "center",
      width: 35,
    },
    calendarToday: {
      borderColor: colors.primary,
      borderWidth: 1,
    },
    calendarDaySelected: {
      backgroundColor: colors.primary,
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
    calendarDot: {
      backgroundColor: colors.secondary,
      borderRadius: 3,
      height: 5,
      marginTop: 2,
      width: 5,
    },
    calendarDotHidden: {
      opacity: 0,
    },
    calendarHint: {
      color: colors.text.muted,
      fontSize: 11,
      lineHeight: 16,
      marginTop: 9,
    },
    sectionTitle: {
      color: colors.text.main,
      fontSize: 17,
      fontWeight: "700",
      marginTop: 2,
    },
    journalList: {
      gap: 10,
    },
    loader: {
      marginTop: 25,
    },
    empty: {
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 30,
      paddingTop: 35,
    },
    emptyTitle: {
      color: colors.text.main,
      fontSize: 17,
      fontWeight: "700",
      textAlign: "center",
    },
    emptyText: {
      color: colors.text.muted,
      fontSize: 13,
      textAlign: "center",
    },
    addButton: {
      alignItems: "center",
      backgroundColor: colors.primary,
      borderRadius: 29,
      bottom: 16,
      elevation: 7,
      height: 58,
      justifyContent: "center",
      position: "absolute",
      width: 58,
      left: "50%",
      transform: [{ translateX: -29 }],
    },
  })
