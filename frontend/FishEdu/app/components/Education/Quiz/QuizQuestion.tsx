import { AppColors } from "@/app/constants/theme";
import { useTheme } from "@/app/hooks/useTheme/useTheme";
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";
import { getTranslation } from "@/app/utils/translation/getTranslation";
import { EducationQuiz } from "@/app/api/education";
import QuizAnswerOption from "./QuizAnswerOption";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  question: EducationQuiz["questions"][number];
  selectedOption?: number;
  answerError: boolean;
  onSelect: (optionId: number) => void;
};

export default function QuizQuestion({ question, selectedOption, answerError, onSelect }: Props) {
  const { colors } = useTheme();
  const { language } = useLanguage();
  const styles = createStyles(colors);
  return (
    <View style={styles.questionCard}>
      <Text style={styles.questionText}>{question.content}</Text>
      <View style={styles.options}>
        {question.options.map(option => (
          <QuizAnswerOption key={option.id} option={option} selected={selectedOption === option.id} onPress={() => onSelect(option.id)} />
        ))}
      </View>
      {answerError ? <Text style={styles.errorText}>{getTranslation("education.quiz.selectAnswer", language)}</Text> : null}
    </View>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  questionCard: { backgroundColor: colors.background.card, borderColor: colors.border.card, borderRadius: 8, borderWidth: 1, gap: 22, padding: 20 },
  questionText: { color: colors.text.main, fontSize: 20, fontWeight: "700", lineHeight: 28 },
  options: { gap: 10 },
  errorText: { color: colors.danger, fontSize: 14 },
});
