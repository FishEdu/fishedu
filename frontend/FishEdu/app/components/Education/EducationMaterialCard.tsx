import { EducationMaterial } from "@/app/api/education";
import { colors } from "@/app/constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type LocalProps = {
  material: EducationMaterial;
  typeLabel: string;
  onPress: () => void;
  isFavorite?: boolean;
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
            <Ionicons name={typeIcons[material.type]} size={34} color={colors.primary} />
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
      {isFavorite ? (
        <View pointerEvents="none" style={styles.favoriteIndicator}>
          <Ionicons name="star" size={16} color={colors.favorite} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.card,
    borderColor: colors.border.card,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    overflow: "hidden"
  },
  cardContent: { flex: 1 },
  cardPressed: {
    opacity: 0.7
  },
  favoriteIndicator: { alignItems: "center", backgroundColor: colors.background.card, borderRadius: 12, elevation: 1, height: 24, justifyContent: "center", position: "absolute", right: 7, top: 7, width: 24 },
  image: {
    aspectRatio: 1.35,
    width: "100%"
  },
  imageFallback: {
    alignItems: "center",
    aspectRatio: 1.35,
    backgroundColor: colors.background.primarySoft,
    justifyContent: "center"
  },
  copy: {
    gap: 8,
    padding: 12
  },
  title: {
    color: colors.text.main,
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 21
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  type: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "600"
  },
  duration: {
    color: colors.text.muted,
    fontSize: 12
  }
});
