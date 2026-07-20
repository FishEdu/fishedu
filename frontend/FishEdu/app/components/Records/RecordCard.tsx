import { CatchRecordGetResponse } from "@/app/api/records"
import { Image, StyleSheet, Text, View } from "react-native"

type LocalProps = {
  record: CatchRecordGetResponse
}

export default function RecordCard({ record }: LocalProps) {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/images/fish.jpg")}
        alt="Fish record image"
        style={styles.image}
      />

      <View style={styles.infoGrid}>
        <View style={styles.infoColumn}>
          <Text style={styles.label}>Gatunek ryby</Text>
          <Text style={styles.value}>{record.fish_name ?? "-"}</Text>
        </View>

        <View style={styles.infoColumn}>
          <Text style={styles.label}>Lowisko</Text>
          <Text style={styles.value}>{record.fishing_spot}</Text>
        </View>
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.infoColumn}>
          <Text style={styles.label}>Wymiary</Text>
          <Text style={styles.value}>TL: {record.total_length ?? "-"}cm</Text>
        </View>

        <View style={styles.infoColumn}>
          <Text style={styles.label}>FL: {record.fork_length ?? "-"}cm</Text>
        </View>
      </View>

      {record.description ? (
        <Text style={styles.description}>{record.description}</Text>
      ) : undefined}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 10,
    shadowColor: "hsl(0, 0%, 0%)",
    shadowOpacity: 0.14,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 3,
  },
  image: {
    width: "100%",
    aspectRatio: 1.85,
    borderRadius: 8,
    marginBottom: 8,
  },
  infoGrid: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 6,
  },
  infoColumn: {
    flex: 1,
  },
  label: {
    color: "hsl(0, 0%, 38%)",
    fontSize: 10,
  },
  value: {
    color: "hsl(0, 0%, 5%)",
    fontSize: 11,
    fontWeight: "600",
  },
  description: {
    fontSize: 11,
    lineHeight: 15,
    marginTop: 2,
    textAlign: "center",
  }
})
