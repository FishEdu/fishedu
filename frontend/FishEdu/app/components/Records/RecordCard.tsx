import { CatchRecordGetResponse } from "@/app/api/records"
import { useState } from "react"
import { Image, Pressable, StyleSheet, Text, View } from "react-native"
import Ionicons from "@expo/vector-icons/Ionicons"
import { router } from "expo-router"


type LocalProps = {
  record: CatchRecordGetResponse
}

export default function RecordCard({ record }: LocalProps) {
  const [descriptionExpanded, setDescriptionExpanded] = useState(false)
  const [descriptionLong, setDescriptionLong] = useState(false)

  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/images/fish.jpg")}
        alt="Fish record image"
        style={styles.image}
      />

      <Text style={styles.date}>
        {new Date(record.created_at).toLocaleDateString("pl-PL")}
      </Text>


      <View style={styles.infoRow}>
        <Text style={styles.label}>Gatunek ryby</Text>
        <Text style={styles.value}>
          {record.fish_name ?? "-"}
        </Text>
      </View>


      <View style={styles.infoRow}>
        <Text style={styles.label}>Łowisko</Text>
        <Text style={styles.value}>
          {record.fishing_spot}
        </Text>
      </View>


      <View style={styles.infoRow}>
        <Text style={styles.label}>Wymiary</Text>
        <Text style={styles.value}>
          TL: {record.total_length ?? "-"}cm{"   "}
          FL: {record.fork_length ?? "-"}cm
        </Text>
      </View>


      <View style={styles.infoRow}>
        <Text style={styles.label}>Waga</Text>
        <Text style={styles.value}>
          {record.weight ? `${record.weight} kg` : "-"}
        </Text>
      </View>


        {record.description && (
          <View style={styles.descriptionRow}>
            <Text style={styles.label}>Opis</Text>

            <View style={styles.descriptionContainer}>
              {/* Tekst widoczny */}
              <Text
                style={styles.description}
                numberOfLines={descriptionExpanded ? undefined : 2}
              >
                {record.description}
              </Text>

              {/* Ukryty tekst do sprawdzenia długości */}
              {!descriptionExpanded && (
                <Text
                  style={styles.hiddenDescription}
                  onTextLayout={(event) => {
                    setDescriptionLong(event.nativeEvent.lines.length > 2)
                  }}
                >
                  {record.description}
                </Text>
              )}

              {descriptionLong && (
                <Pressable
                  onPress={() => setDescriptionExpanded(!descriptionExpanded)}
                >
                  <Text style={styles.expandText}>
                    {descriptionExpanded ? "Zwiń" : "Pokaż więcej"}
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        )}
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
        <Ionicons name="pencil-outline" size={20} color="#4a6cf7" />
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
    color: "#4a6cf7",
    fontSize: 11,
    fontWeight: "600",
  },

  hiddenDescription: {
    position: "absolute",
    opacity: 0,
    width: "100%",
  },
})