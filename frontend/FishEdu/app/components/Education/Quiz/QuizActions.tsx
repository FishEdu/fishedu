import { AppColors } from "@/app/constants/theme";
import { useTheme } from "@/app/hooks/useTheme/useTheme";
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";
import { getTranslation } from "@/app/utils/translation/getTranslation";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = { questionIndex: number; totalQuestions: number; onPrevious: () => void; onContinue: () => void };

export default function QuizActions({ questionIndex, totalQuestions, onPrevious, onContinue }: Props) {
  const { colors } = useTheme();
  const { language } = useLanguage();
  const styles = createStyles(colors);
  return (
    <View style={styles.actions}>

      {questionIndex > 0 ? (
        <Pressable accessibilityRole="button" onPress={onPrevious} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>{getTranslation("education.quiz.previous", language)}</Text>
        </Pressable>
      ) : <View style={styles.actionSpacer} />}
      <Pressable
        accessibilityRole="button"
        onPress={onContinue}
        style={styles.primaryButton}
      >
        <Text style={styles.primaryButtonText}>{getTranslation(questionIndex === totalQuestions - 1 ? "education.quiz.finish" : "education.quiz.next", language)}</Text>
        <Ionicons name="arrow-forward" size={18} color={colors.text.onPrimary} />
      </Pressable>
    </View>

  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  actions: { flexDirection: "row", gap: 12, justifyContent: "space-between" },
  actionSpacer: { flex: 1 },
  secondaryButton: { alignItems: "center", borderColor: colors.primary, borderRadius: 8, borderWidth: 1, flex: 1, justifyContent: "center", minHeight: 50, paddingHorizontal: 16 },
  secondaryButtonText: { color: colors.primary, fontSize: 16, fontWeight: "600" },
  primaryButton: { alignItems: "center", backgroundColor: colors.primary, borderRadius: 8, flex: 1, flexDirection: "row", gap: 8, justifyContent: "center", minHeight: 50, paddingHorizontal: 16 },
  primaryButtonText: { color: colors.text.onPrimary, fontSize: 16, fontWeight: "600" },
});
