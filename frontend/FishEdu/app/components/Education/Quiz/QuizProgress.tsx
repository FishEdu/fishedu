import { AppColors } from "@/app/constants/theme";
import { useTheme } from "@/app/hooks/useTheme/useTheme";
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";
import { getTranslation } from "@/app/utils/translation/getTranslation";
import { StyleSheet, Text, View } from "react-native";

type Props = { questionIndex: number; totalQuestions: number };

export default function QuizProgress({ questionIndex, totalQuestions }: Props) {
  const { colors } = useTheme();
  const { language } = useLanguage();
  const styles = createStyles(colors);
  const progress = ((questionIndex + 1) / totalQuestions) * 100;
  return (
    <View style={styles.progressGroup}>
      <Text style={styles.progressLabel}>{getTranslation("education.quiz.question", language)} {questionIndex + 1} / {totalQuestions}</Text>
      <View style={styles.progressTrack}>
        <View style={[styles.progressValue, { width: `${progress}%` }]} />
      </View>
    </View>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  progressGroup: { gap: 8 },
  progressLabel: { color: colors.text.muted, fontSize: 14, fontWeight: "600" },
  progressTrack: { backgroundColor: colors.border.card, borderRadius: 3, height: 6, overflow: "hidden" },
  progressValue: { backgroundColor: colors.primary, height: "100%" },
});
