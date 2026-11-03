
import { FishingJournal } from "@/app/api/journal"
import JournalDetails from "@/app/components/Journal/JournalDetails"
import Container from "@/app/components/ui/Container"
import { AppColors } from "@/app/constants/theme"
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage"
import { useTheme } from "@/app/hooks/useTheme/useTheme"
import { deleteJournal, fetchJournal } from "@/app/utils/fetch/journal/fetchJournals"
import { getTranslation } from "@/app/utils/translation/getTranslation"

import Ionicons from "@expo/vector-icons/Ionicons"
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router"

import { useCallback, useState } from "react"

import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native"


const JOURNAL_LIST_ROUTE =
  "/(tabs)/journal" as Parameters<typeof router.replace>[0]


export default function JournalEntry() {
  const { colors } = useTheme()
  const { languageCode } = useLanguage()

  const { id } = useLocalSearchParams<{ id: string }>()

  const styles = createStyles(colors)

  const [journal, setJournal] = useState<FishingJournal | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)


  // Pobieranie szczegółów wpisu
  const loadJournal = useCallback(async () => {
    setLoading(true)

    try {
      const data = await fetchJournal(Number(id))
      setJournal(data)
    } catch (error) {
      console.error("Error loading journal:", error)
      setJournal(null)
    } finally {
      setLoading(false)
    }
  }, [id])


  // Odświeżenie wpisu po powrocie na ekran
  useFocusEffect(
    useCallback(() => {
      void loadJournal()
    }, [loadJournal])
  )


  // Powrót do listy dziennika
  const goToJournalList = () => {
    router.replace(JOURNAL_LIST_ROUTE)
  }


  // Otwarcie okienka potwierdzenia usunięcia
  const handleDelete = () => {
    setDeleteModalVisible(true)
  }


  // Potwierdzenie usunięcia wpisu
  const confirmDelete = async () => {
    const deleted = await deleteJournal(Number(id))

    if (deleted) {
      setDeleteModalVisible(false)
      goToJournalList()
    }
  }


  return (
    <Container>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >

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


        {/* Zawartość ekranu */}
        {loading ? (
          <ActivityIndicator color={colors.primary} />

        ) : journal ? (
          <JournalDetails
            journal={journal}
            onEdit={() =>
              router.push({
                pathname: "/(tabs)/journal/edit/[id]",
                params: {
                  id: String(journal.id),
                },
              } as unknown as Parameters<typeof router.push>[0])
            }
            onDelete={handleDelete}
          />

        ) : (
          <View style={styles.notFound}>
            <Text style={styles.notFoundText}>
              {getTranslation("journal.notFound", languageCode)}
            </Text>
          </View>
        )}

      </ScrollView>


      {/* Okienko potwierdzenia usunięcia */}
      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>

            <View style={styles.modalIcon}>
              <Ionicons
                name="trash-outline"
                size={26}
                color={colors.danger}
              />
            </View>

            <Text style={styles.modalTitle}>
              {getTranslation("journal.delete", languageCode)}
            </Text>

            <Text style={styles.modalDescription}>
              {getTranslation("journal.deleteConfirm", languageCode)}
            </Text>

            <View style={styles.modalButtons}>

              <Pressable
                style={styles.cancelButton}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>
                  {getTranslation("journal.cancel", languageCode)}
                </Text>
              </Pressable>

              <Pressable
                style={styles.confirmDeleteButton}
                onPress={confirmDelete}
              >
                <Ionicons
                  name="trash-outline"
                  size={16}
                  color={colors.text.onPrimary}
                />

                <Text style={styles.confirmDeleteText}>
                  {getTranslation("journal.delete", languageCode)}
                </Text>
              </Pressable>

            </View>
          </View>
        </View>
      </Modal>

    </Container>
  )
}


const createStyles = (colors: AppColors) =>
  StyleSheet.create({

    content: {
      gap: 12,
      paddingBottom: 30,
      paddingTop: 36,
    },

    back: {
      alignItems: "center",
      alignSelf: "flex-start",
      flexDirection: "row",
      paddingVertical: 5,
    },

    backText: {
      color: colors.primary,
      fontSize: 15,
      fontWeight: "600",
    },

    notFound: {
      alignItems: "center",
      paddingTop: 45,
    },

    notFoundText: {
      color: colors.text.muted,
      fontSize: 15,
    },

    // Okienko usuwania
    modalOverlay: {
      flex: 1,
      backgroundColor: colors.background.overlay,
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    },

    modalContainer: {
      width: "100%",
      maxWidth: 360,
      backgroundColor: colors.background.card,
      borderRadius: 20,
      padding: 24,
      alignItems: "center",
    },

    modalIcon: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.background.dangerSoft,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 14,
    },

    modalTitle: {
      fontSize: 19,
      fontWeight: "700",
      color: colors.text.main,
      marginBottom: 8,
    },

    modalDescription: {
      textAlign: "center",
      color: colors.text.muted,
      fontSize: 13,
      lineHeight: 19,
      marginBottom: 22,
    },

    modalButtons: {
      width: "100%",
      flexDirection: "row",
      gap: 10,
    },

    cancelButton: {
      flex: 1,
      borderWidth: 1,
      borderColor: colors.border.card,
      borderRadius: 10,
      paddingVertical: 11,
      alignItems: "center",
      justifyContent: "center",
    },

    cancelButtonText: {
      color: colors.text.main,
      fontSize: 13,
      fontWeight: "600",
    },

    confirmDeleteButton: {
      flex: 1,
      backgroundColor: colors.danger,
      borderRadius: 10,
      paddingVertical: 11,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
    },

    confirmDeleteText: {
      color: colors.text.onPrimary,
      fontSize: 13,
      fontWeight: "600",
    },

  })
