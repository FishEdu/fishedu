import { AppColors } from "@/app/constants/theme";
import { useTheme } from "@/app/hooks/useTheme/useTheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image, StyleSheet, View } from "react-native";

export default function EducationMaterialImage({ uri }: { uri: string | null }) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return uri ? (
    <Image source={{ uri }} style={styles.image} />
  ) : (
    <View style={styles.imageFallback}>
      <Ionicons name="library-outline" size={48} color={colors.primary} />
    </View>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  image: { aspectRatio: 1.65, borderRadius: 8, width: "100%" },
  imageFallback: { alignItems: "center", aspectRatio: 1.65, backgroundColor: colors.background.primarySoft, borderRadius: 8, justifyContent: "center" },
});
