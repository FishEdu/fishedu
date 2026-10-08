import { AppColors } from "@/app/constants/theme";
import { useTheme } from "@/app/hooks/useTheme/useTheme";
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";
import { getTranslation } from "@/app/utils/translation/getTranslation";
import { EducationQuizResult } from "@/app/api/education";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = { result: EducationQuizResult; onRetry: () => void };

export default function QuizResult({ result, onRetry }: Props) {
  const { colors } = useTheme();
  const { language } = useLanguage();
  const styles = createStyles(colors);
  return (
    <View style={styles.resultCard}>

      <Ionicons name={result.passed ? "checkmark-circle" : "refresh-circle"} size={56} color={result.passed ? colors.secondary : colors.primary} />
      <Text style={styles.resultTitle}>{getTranslation("education.quiz.result", language)}</Text>
      <Text style={styles.score}>{result.score}%</Text>
      <Text style={styles.resultText}>{result.correct_answers}/{result.total_questions}</Text>
      <Text style={styles.resultText}>{getTranslation(result.passed ? "education.quiz.passed" : "education.quiz.notPassed", language)}</Text>
      <Pressable accessibilityRole="button" onPress={onRetry} style={styles.primaryButton}>
        <Text style={styles.primaryButtonText}>{getTranslation("education.quiz.retry", language)}</Text>
      </Pressable>
    </View>

  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  resultCard: { alignItems: "center", alignSelf: "stretch", backgroundColor: colors.background.card, borderColor: colors.border.card, borderRadius: 8, borderWidth: 1, gap: 12, justifyContent: "center", marginTop: 36, padding: 28 },
  resultTitle: { color: colors.text.main, fontSize: 22, fontWeight: "700" },
  score: { color: colors.primary, fontSize: 42, fontWeight: "700" },
  resultText: { color: colors.text.muted, fontSize: 16 },
  primaryButton: { alignItems: "center", backgroundColor: colors.primary, borderRadius: 8, flex: 1, flexDirection: "row", gap: 8, justifyContent: "center", minHeight: 50, paddingHorizontal: 16 },
  primaryButtonText: { color: colors.text.onPrimary, fontSize: 16, fontWeight: "600" },
});
