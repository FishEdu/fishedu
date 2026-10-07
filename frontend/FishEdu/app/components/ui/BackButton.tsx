import { AppColors } from "@/app/constants/theme";
import { useTheme } from "@/app/hooks/useTheme/useTheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text } from "react-native";

type Props = { label: string; onPress: () => void; variant?: "text" | "filled" };

export default function BackButton({ label, onPress, variant = "text" }: Props) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={variant === "filled" ? styles.filledButton : styles.backButton}>
      <Ionicons name="chevron-back" size={variant === "filled" ? 24 : 20} color={variant === "filled" ? "hsl(0, 0%, 100%)" : colors.primary} />
      <Text style={variant === "filled" ? styles.filledText : styles.backText}>{label}</Text>
    </Pressable>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  filledButton: { alignItems: "center", alignSelf: "flex-start", backgroundColor: "hsl(226, 75%, 59%)", borderRadius: 24, flexDirection: "row", gap: 4, paddingBlock: 10, paddingInline: 20 },
  filledText: { color: "hsl(0, 0%, 100%)", fontSize: 18, fontWeight: 500 },
  backButton: { alignItems: "center", alignSelf: "flex-start", flexDirection: "row", gap: 2, paddingBlock: 6, paddingEnd: 8 },
  backText: { color: colors.primary, fontSize: 16, fontWeight: "600" },
});
