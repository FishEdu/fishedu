import { AppColors } from "@/app/constants/theme"
import { useTheme } from "@/app/hooks/useTheme/useTheme"
import { useCallback, useState } from "react"
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import { router, useFocusEffect } from "expo-router"

import Container from "@/app/components/ui/Container"
import RecordModeSelector from "@/app/components/Records/RecordModeSelector"
import RecordSearchInput from "@/app/components/Records/RecordSearchInput"
import RecordsList from "@/app/components/Records/RecordsList"

import { CatchRecordGetResponse, RecordViewMode } from "@/app/api/records"
import { fetchRecords } from "@/app/utils/fetch/records/fetchRecords"

import { getTranslation } from "@/app/utils/translation/getTranslation"
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage"
import Ionicons from "@expo/vector-icons/Ionicons"
import { SafeAreaView } from "react-native-safe-area-context"

export default function Records() {
  const { languageCode } = useLanguage()
  const { colors } = useTheme()
  const styles = createStyles(colors)

  const [selectedMode, setSelectedMode] =
    useState<RecordViewMode>("recent")

  const [records, setRecords] =
    useState<CatchRecordGetResponse[]>([])

  const [loading, setLoading] = useState(true)

  const loadRecords = useCallback(
    async (mode = selectedMode, query = "") => {
      setLoading(true)

      const fetchedRecords = await fetchRecords({
        mode,
        query: query.trim(),
      })

      setRecords(fetchedRecords)
      setLoading(false)
    },
    [selectedMode]
  )

  useFocusEffect(
    useCallback(() => {
      loadRecords()
    }, [loadRecords])
  )

  const handleModeChange = (mode: RecordViewMode) => {
    setSelectedMode(mode)
    loadRecords(mode)
  }

  const searchPlaceholder =
    selectedMode === "spots"
      ? getTranslation("records.searchSpot", languageCode)
      : getTranslation("records.searchFishInput", languageCode)

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
    <Container>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.header}>
          <Text style={styles.heading}>
            {getTranslation("records.yourRecords", languageCode)}
          </Text>
        </View>

        <RecordModeSelector
          selectedMode={selectedMode}
          setSelectedMode={handleModeChange}
        />

        {selectedMode !== "recent" && (
          <RecordSearchInput
            placeholder={searchPlaceholder}
            onChangeText={(value) =>
              loadRecords(selectedMode, value)
            }
          />
        )}

        {selectedMode === "recent" && (
          <Text style={styles.sectionTitle}>
            {getTranslation(
              "records.recentlyAdded",
              languageCode
            )}
          </Text>
        )}

        {loading ? (
          <Text style={styles.statusText}>
            {getTranslation("common.loading", languageCode)}
          </Text>
        ) : (
          <RecordsList
            records={records}
            emptyText={getTranslation(
              "records.noRecords",
              languageCode
            )}
          />
        )}
      </ScrollView>

      {selectedMode === "recent" && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={getTranslation("records.addRecord", languageCode)}
          onPress={() =>
            router.push(
              "/(tabs)/records/add" as Parameters<
                typeof router.push
              >[0]
            )
          }
          style={({ pressed }) => [
            styles.floatingButton,
            pressed && styles.addButtonPressed,
          ]}
        >
          <Ionicons name="add" size={32} color={colors.text.onPrimary} />
        </Pressable>
      )}
    </Container>
    </SafeAreaView>
  )
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  header: {
    marginBottom: 12,
  },

  heading: {
    color: colors.text.main,
    fontSize: 24,
    fontWeight: "700",
  },

  sectionTitle: {
    color: colors.text.main,
    fontSize: 18,
    marginBottom: 12,
  },

  statusText: {
    color: colors.text.muted,
    fontSize: 16,
  },

  addButtonPressed: {
    opacity: 0.8,
  },

  floatingButton: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",

    width: 60,
    height: 60,

    borderRadius: 30,
    backgroundColor: colors.primary,

    alignItems: "center",
    justifyContent: "center",

    elevation: 8,
    zIndex: 999,
  },

})
