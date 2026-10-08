import { AppColors } from "@/app/constants/theme";
import { useTheme } from "@/app/hooks/useTheme/useTheme";
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";
import { getTranslation } from "@/app/utils/translation/getTranslation";
import { EducationMaterial } from "@/app/api/education";
import { useEducationFavorites } from "@/app/hooks/useEducationFavorites/useEducationFavorites";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function EducationMaterialHeader({ material }: { material: EducationMaterial }) {
  const { colors } = useTheme();
  const { language } = useLanguage();
  const styles = createStyles(colors);
  const { favoriteIds, toggleFavorite } = useEducationFavorites();
  const isFavorite = favoriteIds.includes(material.id);
  return (
    <View style={styles.titleGroup}>

      <View style={styles.titleRow}>
        <Text style={styles.title}>{material.title}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={getTranslation(isFavorite ? "education.favorite.remove" : "education.favorite.add", language)}
          onPress={() => toggleFavorite(material.id)}
          style={styles.favoriteButton}
        >
          <Ionicons
            name={isFavorite ? "star" : "star-outline"}
            size={21}
            color={colors.favorite}
          />
        </Pressable>
      </View>
      <Text style={styles.description}>{material.description}</Text>
    </View>

  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  titleGroup: { gap: 8 },
  titleRow: { alignItems: "flex-start", flexDirection: "row", gap: 12, justifyContent: "space-between" },
  title: { color: colors.text.main, flex: 1, fontSize: 28, fontWeight: "700" },
  favoriteButton: { alignItems: "center", height: 36, justifyContent: "center", width: 36 },
  description: { color: colors.text.muted, fontSize: 17, lineHeight: 25 },
});
