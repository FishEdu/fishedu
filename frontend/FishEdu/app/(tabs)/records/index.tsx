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

export default function Records() {
  const { languageCode } = useLanguage()

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
          <Text style={styles.floatingButtonText}>+</Text>
        </Pressable>
      )}
    </Container>
  )
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 12,
  },

  heading: {
    fontSize: 24,
    fontWeight: "700",
  },

  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
  },

  statusText: {
    color: "hsl(0, 0%, 35%)",
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
    backgroundColor: "hsla(200, 75%, 52%, 0.96)",

    alignItems: "center",
    justifyContent: "center",

    elevation: 8,
    zIndex: 999,
  },

  floatingButtonText: {
    color: "white",
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 36,
  },
})