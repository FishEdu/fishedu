import { useCallback, useState } from "react"
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native"
import { router, useFocusEffect } from "expo-router"
import Container from "@/app/components/ui/Container"
import RecordModeSelector from "@/app/components/Records/RecordModeSelector"
import RecordSearchInput from "@/app/components/Records/RecordSearchInput"
import RecordsList from "@/app/components/Records/RecordsList"
import { CatchRecordGetResponse, RecordViewMode } from "@/app/api/records"
import { fetchRecords } from "@/app/utils/fetch/records/fetchRecords"

export default function Records() {
  const [selectedMode, setSelectedMode] = useState<RecordViewMode>("recent")
  const [records, setRecords] = useState<CatchRecordGetResponse[]>([])
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
      ? "Wyszukaj łowisko"
      : "Wyszukaj rybę"

  return (
    <Container>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.header}>
          <Text style={styles.heading}>Twoje rekordy</Text>
        </View>

        <RecordModeSelector
          selectedMode={selectedMode}
          setSelectedMode={handleModeChange}
        />

        {selectedMode !== "recent" && (
          <RecordSearchInput
            placeholder={searchPlaceholder}
            onChangeText={(value) => loadRecords(selectedMode, value)}
          />
        )}

        {selectedMode === "recent" && (
          <Text style={styles.sectionTitle}>Ostatnio dodane</Text>
        )}

        {loading ? (
          <Text style={styles.statusText}>Ładowanie...</Text>
        ) : (
          <RecordsList
            records={records}
            emptyText="Nie masz jeszcze rekordów"
          />
        )}
      </ScrollView>

      {selectedMode === "recent" && (
        <Pressable
          onPress={() =>
            router.push(
              "/(tabs)/records/add" as Parameters<typeof router.push>[0]
            )
          }
          style={({ pressed }) => [
            styles.floatingButton,
            pressed && styles.addButtonPressed,
          ]}
        >
          <Text style={styles.floatingButtonText}>DODAJ</Text>
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

    paddingHorizontal: 20,
    paddingVertical: 10,

    borderRadius: 20,
    backgroundColor: "hsl(226, 75%, 59%)",

    elevation: 8,
    zIndex: 999,
  },

  floatingButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
  },
})