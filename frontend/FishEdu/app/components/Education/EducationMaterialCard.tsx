import { EducationMaterial } from "@/app/api/education";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type LocalProps = {
  material: EducationMaterial;
  typeLabel: string;
  onPress: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
};

const typeIcons = {
  video: "play-circle-outline",
  pdf: "document-text-outline",
  course: "school-outline",
  quiz: "help-circle-outline",
  guide: "book-outline"
} as const;

export default function EducationMaterialCard({
  material,
  typeLabel,
  onPress,
  isFavorite = false,
  onToggleFavorite,
}: LocalProps) {
  return (
    <View style={styles.card}>
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [styles.cardContent, pressed && styles.cardPressed]}
      >
        {material.image_url ? (
          <Image source={{ uri: material.image_url }} style={styles.image} />
        ) : (
          <View style={styles.imageFallback}>
            <Ionicons name={typeIcons[material.type]} size={34} color="hsl(226, 75%, 45%)" />
          </View>
        )}
        <View style={styles.copy}>
          <Text numberOfLines={2} style={styles.title}>{material.title}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.type}>{typeLabel}</Text>
            {material.duration_minutes ? <Text style={styles.duration}>{material.duration_minutes} min</Text> : null}
          </View>
        </View>
      </Pressable>
      {onToggleFavorite ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={isFavorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
          hitSlop={8}
          onPress={onToggleFavorite}
          style={styles.favoriteButton}
        >
          <Ionicons name={isFavorite ? "star" : "star-outline"} size={21} color="hsl(226, 75%, 45%)" />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "hsl(0, 0%, 100%)",
    borderColor: "hsl(210, 12%, 88%)",
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    overflow: "hidden"
  },
  cardContent: { flex: 1 },
  cardPressed: {
    opacity: 0.7
  },
  favoriteButton: { alignItems: "center", backgroundColor: "hsl(0, 0%, 100%)", borderRadius: 18, elevation: 2, height: 36, justifyContent: "center", position: "absolute", right: 8, shadowOpacity: 0.12, top: 8, width: 36 },
  image: {
    aspectRatio: 1.35,
    width: "100%"
  },
  imageFallback: {
    alignItems: "center",
    aspectRatio: 1.35,
    backgroundColor: "hsl(226, 75%, 95%)",
    justifyContent: "center"
  },
  copy: {
    gap: 8,
    padding: 12
  },
  title: {
    color: "hsl(210, 15%, 14%)",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 21
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  type: {
    color: "hsl(226, 75%, 45%)",
    fontSize: 12,
    fontWeight: "600"
  },
  duration: {
    color: "hsl(210, 8%, 42%)",
    fontSize: 12
  }
});
