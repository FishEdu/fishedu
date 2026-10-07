import { AppColors } from "@/app/constants/theme";
import { useTheme } from "@/app/hooks/useTheme/useTheme";
import { getTranslation } from "@/app/utils/translation/getTranslation";
import type { LanguageCode } from "@/app/constants/language";
import Container from "@/app/components/ui/Container";
import BackButton from "@/app/components/ui/BackButton";
import EducationFeedback from "../EducationFeedback";
import QuizProgress from "./QuizProgress";
import QuizQuestion from "./QuizQuestion";
import QuizActions from "./QuizActions";
import QuizResult from "./QuizResult";
import { useFetchEducationMaterial } from "@/app/hooks/useFetchEducationMaterial/useFetchEducationMaterial";
import { useEducationQuiz } from "@/app/hooks/useEducationQuiz/useEducationQuiz";
import { canGradeQuiz } from "@/app/utils/education/calculateQuizResult";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

type Props = { id: string; language: LanguageCode };

export default function EducationQuizSession({ id, language }: Props) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { material, loading } = useFetchEducationMaterial(id, language);
  const quiz = material?.type === "quiz" && canGradeQuiz(material.quiz) ? material.quiz : null;
  const session = useEducationQuiz(quiz);
  const backLabel = getTranslation("education.quiz.back", language);

  if (loading) return <EducationFeedback loading message={getTranslation("education.quiz.loading", language)} />;
  if (!quiz || !session.currentQuestion) return <EducationFeedback message={getTranslation("education.quiz.unavailable", language)} />;

  return (
    <View style={styles.screen}>
      <Container>
        <View style={styles.page}>
          <BackButton label={backLabel} onPress={() => router.back()} />
          {session.result ? (
            <QuizResult result={session.result} onRetry={session.restartQuiz} />
          ) : (
            <>
              <Text numberOfLines={2} style={styles.title}>{material?.title}</Text>
              <QuizProgress questionIndex={session.questionIndex} totalQuestions={quiz.questions.length} />
              <QuizQuestion question={session.currentQuestion} selectedOption={session.selectedOption} answerError={session.answerError} onSelect={session.selectAnswer} />
              <QuizActions questionIndex={session.questionIndex} totalQuestions={quiz.questions.length} onPrevious={session.previousQuestion} onContinue={session.continueQuiz} />
            </>
          )}
        </View>
      </Container>
    </View>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  screen: { backgroundColor: colors.background.app, flex: 1 },
  page: { flex: 1, gap: 20, paddingBlock: 12 },
  title: { color: colors.text.main, fontSize: 24, fontWeight: "700", lineHeight: 31 },
});
