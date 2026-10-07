import { AppColors } from "@/app/constants/theme";
import { useTheme } from "@/app/hooks/useTheme/useTheme";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { ComponentProps } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

type Props = {
  message: string;
  loading?: boolean;
  icon?: ComponentProps<typeof Ionicons>["name"];
  fullScreen?: boolean;
};

export default function EducationFeedback({ message, loading = false, icon, fullScreen = true }: Props) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return (
    <View style={fullScreen ? styles.centered : styles.feedback}>
      {loading ? <ActivityIndicator color={colors.primary} /> : null}
      {icon ? <Ionicons name={icon} size={38} color={colors.text.muted} /> : null}
      <Text style={styles.feedbackText}>{message}</Text>
    </View>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  centered: { alignItems: "center", backgroundColor: colors.background.app, flex: 1, gap: 12, justifyContent: "center" },
  feedback: { alignItems: "center", flex: 1, gap: 12, justifyContent: "center", padding: 24 },
  feedbackText: { color: colors.text.muted, fontSize: 16, textAlign: "center" }
});
