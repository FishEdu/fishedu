import { CatchRecordGetResponse } from "@/app/api/records"
import { fetchFish } from "@/app/utils/fetch/fish/fetchFish"
import { useEffect, useState } from "react"
import { Image, Pressable, StyleSheet, Text, View } from "react-native"
import Ionicons from "@expo/vector-icons/Ionicons"
import { router } from "expo-router"
import { getTranslation } from "@/app/utils/translation/getTranslation"
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage"

type LocalProps = {
  record: CatchRecordGetResponse
}

export default function RecordCard({ record }: LocalProps) {
  const [descriptionExpanded, setDescriptionExpanded] = useState(false)
  const [descriptionLong, setDescriptionLong] = useState(false)

  const { languageCode } = useLanguage()
  const [translatedFishName, setTranslatedFishName] = useState(
  record.fish_name ?? "-"
)

useEffect(() => {
  const loadFishName = async () => {
    if (!record.fish_id) {
      setTranslatedFishName(record.fish_name ?? "-")
      return
    }

    try {
      const result = await fetchFish()

      const fish = result.fish.find(
        fish => fish.id === record.fish_id
      )

      setTranslatedFishName(
        fish?.name ?? record.fish_name ?? "-"
      )
    } catch (error) {
      console.error("Failed to translate fish name", error)
      setTranslatedFishName(record.fish_name ?? "-")
    }
  }

  loadFishName()
}, [record.fish_id, record.fish_name, languageCode])

  // Tłumaczenie rodzaju łowiska
  const fishingSpotKey: Record<string, string> = {
    lake: "records.fishingSpot.lake",
    jezioro: "records.fishingSpot.lake",

    pond: "records.fishingSpot.pond",
    staw: "records.fishingSpot.pond",

    river: "records.fishingSpot.river",
    rzeka: "records.fishingSpot.river",

    sea: "records.fishingSpot.sea",
    morze: "records.fishingSpot.sea",
  }

  const translatedFishingSpot = fishingSpotKey[record.fishing_spot]
    ? getTranslation(
        fishingSpotKey[record.fishing_spot] as any,
        languageCode
      )
    : record.fishing_spot

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/images/fish.jpg")}
        alt="Fish record image"
        style={styles.image}
      />

      <Text style={styles.date}>
        {new Date(record.created_at).toLocaleDateString(
          languageCode === "en" ? "en-GB" : "pl-PL"
        )}
      </Text>

      {/* FISH */}
      <View style={styles.infoRow}>
        <Text style={styles.label}>
          {getTranslation("records.fish", languageCode)}
        </Text>

        <Text style={styles.value}>
          {translatedFishName}
        </Text>
      </View>

      {/* FISHING SPOT */}
      <View style={styles.infoRow}>
        <Text style={styles.label}>
          {getTranslation("records.fishingSpot", languageCode)}
        </Text>

        <Text style={styles.value}>
          {translatedFishingSpot}
        </Text>
      </View>

      {/* DIMENSIONS */}
      <View style={styles.infoRow}>
        <Text style={styles.label}>
          {getTranslation("records.dimensions", languageCode)}
        </Text>

        <Text style={styles.value}>
          TL: {record.total_length ?? "-"}cm{"   "}
          FL: {record.fork_length ?? "-"}cm
        </Text>
      </View>

      {/* WEIGHT */}
      <View style={styles.infoRow}>
        <Text style={styles.label}>
          {getTranslation("records.weight", languageCode)}
        </Text>

        <Text style={styles.value}>
          {record.weight ? `${record.weight} kg` : "-"}
        </Text>
      </View>

      {/* DESCRIPTION */}
      {record.description && (
        <View style={styles.descriptionRow}>
          <Text style={styles.label}>
            {getTranslation("records.description", languageCode)}
          </Text>

          <View style={styles.descriptionContainer}>
            <Text
              style={styles.description}
              numberOfLines={descriptionExpanded ? undefined : 2}
            >
              {record.description}
            </Text>

            {!descriptionExpanded && (
              <Text
                style={styles.hiddenDescription}
                onTextLayout={(event) => {
                  setDescriptionLong(
                    event.nativeEvent.lines.length > 2
                  )
                }}
              >
                {record.description}
              </Text>
            )}

            {descriptionLong && (
              <Pressable
                onPress={() =>
                  setDescriptionExpanded(!descriptionExpanded)
                }
              >
                <Text style={styles.expandText}>
                  {descriptionExpanded
                    ? getTranslation(
                        "records.showLess",
                        languageCode
                      )
                    : getTranslation(
                        "records.showMore",
                        languageCode
                      )}
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      )}

      {/* EDIT */}
      <Pressable
        style={styles.editButton}
        onPress={() =>
          router.push({
            pathname: "/records/edit/[id]",
            params: {
              id: record.id.toString(),
            },
          })
        }
      >
        <Ionicons
          name="pencil-outline"
          size={20}
          color="hsla(200, 75%, 52%, 0.96)"
        />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 12,

    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 4,
  },

  image: {
    width: "100%",
    height: 140,
    borderRadius: 12,
    marginBottom: 6,
  },

  date: {
    textAlign: "center",
    color: "#999",
    fontSize: 11,
    marginBottom: 12,
  },

  infoRow: {
    flexDirection: "row",
    marginBottom: 5,
  },

  label: {
    width: 85,
    color: "#777",
    fontSize: 11,
  },

  value: {
    flex: 1,
    color: "#111",
    fontSize: 12,
    fontWeight: "600",
  },

  descriptionRow: {
    flexDirection: "row",
    marginTop: 8,
  },

  descriptionContainer: {
    flex: 1,
    paddingRight: 45,
    position: "relative",
  },

  description: {
    color: "#333",
    fontSize: 12,
    lineHeight: 16,
  },

  expandText: {
    marginTop: 4,
    color: "hsla(200, 75%, 52%, 0.96)",
    fontSize: 11,
    fontWeight: "600",
  },

  hiddenDescription: {
    position: "absolute",
    opacity: 0,
    width: "100%",
  },

  editButton: {
    position: "absolute",
    right: 12,
    bottom: 12,

    width: 36,
    height: 36,

    borderRadius: 18,
    backgroundColor: "#eef2ff",

    alignItems: "center",
    justifyContent: "center",
  },
})