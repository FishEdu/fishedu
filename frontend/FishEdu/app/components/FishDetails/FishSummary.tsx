import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";
import { getTranslation } from "@/app/utils/translation/getTranslation";
import { FishGetResponse } from "@/app/api/fish";
import { useFishFavorite } from "@/app/hooks/useFishFavorite/useFishFavorite";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = { fish?: FishGetResponse; fishId: number };

export default function FishSummary({ fish, fishId }: Props) {
  const { languageCode } = useLanguage();
  const { isFavorite, toggleFavorite } = useFishFavorite(fishId);
  if (!fish) {
    return (
      <View style={styles.mainCard}>

        <Text style={styles.emptyText}>
          {getTranslation('fishDetails.noFishData', languageCode)}
        </Text>
      </View>

    );
  }
  return (
    <View style={styles.mainCard}>

      <View style={styles.titleRow}>
        <Text style={styles.fishName}>{fish.name}</Text>
        <Pressable
          onPress={toggleFavorite}
          style={styles.favoriteButton}
          accessibilityRole="button"
          accessibilityLabel={getTranslation('fishDetails.favorite', languageCode)}
        >
          <Ionicons
            name={isFavorite ? "star" : "star-outline"}
            size={34}
            color="hsl(0, 0%, 0%)"
          />
        </Pressable>
      </View>

      <Text style={styles.description}>
        {fish.description}
      </Text>
    </View>

  );
}

const styles = StyleSheet.create({
  mainCard: {
    backgroundColor: "hsl(0, 0%, 100%)",
    borderRadius: 16,
    gap: 6,
    padding: 14,
  },
  titleRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
  fishName: {
    flex: 1,
    fontSize: 40,
    fontWeight: 700,
  },
  favoriteButton: {
    alignItems: "center",
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  description: {
    color: "hsl(0, 0%, 18%)",
    fontSize: 16,
    lineHeight: 21,
  },
  emptyText: {
    fontSize: 16,
  },
});
