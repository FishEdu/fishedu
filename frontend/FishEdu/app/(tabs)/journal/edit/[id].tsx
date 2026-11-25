
import type { FishingJournal } from "@/app/services/journal/localJournalService"
import { getLocalJournalById } from "@/app/services/journal/localJournalService"

import JournalForm from "@/app/components/Journal/JournalForm"
import Container from "@/app/components/ui/Container"

import type { AppColors } from "@/app/constants/theme"
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage"
import { useTheme } from "@/app/hooks/useTheme/useTheme"

import { getTranslation } from "@/app/utils/translation/getTranslation"

import Ionicons from "@expo/vector-icons/Ionicons"

import {
  router,
  useLocalSearchParams,
} from "expo-router"

import { useEffect, useState } from "react"

import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native"

const JOURNAL_LIST_ROUTE =
  "/(tabs)/journal" as Parameters<typeof router.replace>[0]

export default function EditJournal() {
  const { colors } = useTheme()
  const { languageCode } = useLanguage()

  const { id } = useLocalSearchParams<{ id: string }>()

  const styles = createStyles(colors)

  const [journal, setJournal] = useState<FishingJournal | null>(null)
  const [loading, setLoading] = useState(true)

  const journalId = Number(id)

  // Pobieranie wpisu do edycji z lokalnej bazy SQLite
  useEffect(() => {
    const loadJournal = async () => {
      setLoading(true)

      try {
        if (!Number.isInteger(journalId)) {
          setJournal(null)
          return
        }

        const data = await getLocalJournalById(journalId)

        setJournal(data)
      } catch (error) {
        console.error("Błąd pobierania lokalnego wpisu:", error)
        setJournal(null)
      } finally {
        setLoading(false)
      }
    }

    void loadJournal()
  }, [journalId])

  // Powrót do listy dziennika
  const goToJournalList = () => {
    router.replace(JOURNAL_LIST_ROUTE)
  }

  return (
    <Container>
      <View style={styles.page}>
        {/* Przycisk powrotu */}
        <Pressable
          accessibilityRole="button"
          onPress={goToJournalList}
          style={styles.back}
        >
          <Ionicons
            name="chevron-back"
            size={20}
            color={colors.primary}
          />

          <Text style={styles.backText}>
            {getTranslation("journal.back", languageCode)}
          </Text>
        </Pressable>

        {/* Nagłówek */}
        <Text style={styles.title}>
          {getTranslation("journal.edit", languageCode)}
        </Text>

        {/* Zawartość ekranu */}
        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : journal ? (
          <JournalForm journal={journal} />
        ) : (
          <Text style={styles.notFound}>
            {getTranslation("journal.notFound", languageCode)}
          </Text>
        )}
      </View>
    </Container>
  )
}

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    page: {
      flex: 1,
      gap: 14,
      paddingBottom: 64,
    },
    back: {
      alignItems: "center",
      alignSelf: "flex-start",
      flexDirection: "row",
    },
    backText: {
      color: colors.primary,
      fontSize: 15,
      fontWeight: "600",
    },
    title: {
      color: colors.text.main,
      fontSize: 24,
      fontWeight: "700",
    },
    notFound: {
      color: colors.text.muted,
      fontSize: 15,
    },
  })
