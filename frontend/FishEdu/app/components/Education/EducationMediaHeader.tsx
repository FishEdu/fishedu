import { AppColors } from "@/app/constants/theme";
import { useTheme } from "@/app/hooks/useTheme/useTheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = { title: string; onBack: () => void };

export default function EducationMediaHeader({ title, onBack }: Props) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return (
    <View style={styles.header}>
      <Pressable accessibilityRole="button" onPress={onBack} style={styles.backButton}>
        <Ionicons name="chevron-back" size={24} color={colors.primary} />
      </Pressable>
      <Text numberOfLines={1} style={styles.title}>{title}</Text>
    </View>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  header: { alignItems: "center", backgroundColor: colors.background.card, borderBottomColor: colors.border.card, borderBottomWidth: 1, flexDirection: "row", gap: 8, minHeight: 58, paddingHorizontal: 12 },
  backButton: { alignItems: "center", height: 40, justifyContent: "center", width: 40 },
  title: { color: colors.text.main, flex: 1, fontSize: 17, fontWeight: "600" },
});
