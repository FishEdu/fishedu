import { EducationMaterial } from "@/app/api/education";
import Container from "@/app/components/ui/Container";
import { colors } from "@/app/constants/theme";
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";
import { getBaseApiUrl } from "@/app/utils/getBaseApiUrl";
import { getTranslation } from "@/app/utils/translation/getTranslation";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

type QuizResult = {
  correct_answers: number;
  total_questions: number;
  score: number;
  passed: boolean;
};

export default function EducationQuiz() {
  const { language } = useLanguage();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [material, setMaterial] = useState<EducationMaterial | null>(null);
  const [loading, setLoading] = useState(true);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [answerError, setAnswerError] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadQuiz = async () => {
      try {
        const response = await fetch(
          `${getBaseApiUrl()}/education-materials/${id}?language=${language}`,
          { signal: controller.signal }
        );
        if (!response.ok) throw new Error("Could not fetch quiz");

        const loadedMaterial = await response.json() as EducationMaterial;
        if (loadedMaterial.type !== "quiz" || !loadedMaterial.quiz) {
          throw new Error("Material is not a quiz");
        }
        setMaterial(loadedMaterial);
      } catch (error) {
        if ((error as Error).name !== "AbortError") setMaterial(null);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    void loadQuiz();
    return () => controller.abort();
  }, [id, language]);

  const submitQuiz = async (completedAnswers: Record<number, number>) => {
    if (!material?.quiz) return;

    setSubmitting(true);
    setSubmitError(false);
    try {
      const response = await fetch(`${getBaseApiUrl()}/education-materials/${material.id}/quiz/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: Object.entries(completedAnswers).map(([questionId, optionId]) => ({
            question_id: Number(questionId),
            option_id: optionId,
          })),
        }),
      });
      if (!response.ok) throw new Error("Could not submit quiz");
      setResult(await response.json() as QuizResult);
    } catch {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const continueQuiz = () => {
    if (!material?.quiz) return;

    const currentQuestion = material.quiz.questions[questionIndex];
    const selectedOption = answers[currentQuestion.id];
    if (!selectedOption) {
      setAnswerError(true);
      return;
    }

    setAnswerError(false);
    if (questionIndex === material.quiz.questions.length - 1) {
      void submitQuiz(answers);
      return;
    }
    setQuestionIndex(current => current + 1);
  };

  const restartQuiz = () => {
    setQuestionIndex(0);
    setAnswers({});
    setAnswerError(false);
    setSubmitError(false);
    setResult(null);
  };

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator color={colors.primary} /><Text>{getTranslation("education.quiz.loading", language)}</Text></View>;
  }

  if (!material?.quiz) {
    return <View style={styles.centered}><Text>{getTranslation("education.quiz.unavailable", language)}</Text></View>;
  }

  if (result) {
    return (
      <View style={styles.screen}>
        <Container>
          <View style={styles.resultPage}>
            <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={20} color={colors.primary} />
              <Text style={styles.backText}>{getTranslation("education.quiz.back", language)}</Text>
            </Pressable>
            <View style={styles.resultCard}>
              <Ionicons name={result.passed ? "checkmark-circle" : "refresh-circle"} size={56} color={result.passed ? colors.secondary : colors.primary} />
              <Text style={styles.resultTitle}>{getTranslation("education.quiz.result", language)}</Text>
              <Text style={styles.score}>{result.score}%</Text>
              <Text style={styles.resultText}>{result.correct_answers}/{result.total_questions}</Text>
              <Text style={styles.resultText}>{getTranslation(result.passed ? "education.quiz.passed" : "education.quiz.notPassed", language)}</Text>
              <Pressable accessibilityRole="button" onPress={restartQuiz} style={styles.primaryButton}>
                <Text style={styles.primaryButtonText}>{getTranslation("education.quiz.retry", language)}</Text>
              </Pressable>
            </View>
          </View>
        </Container>
      </View>
    );
  }

  const currentQuestion = material.quiz.questions[questionIndex];
  const selectedOption = answers[currentQuestion.id];
  const progress = ((questionIndex + 1) / material.quiz.questions.length) * 100;

  return (
    <View style={styles.screen}>
      <Container>
        <View style={styles.page}>
          <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={20} color={colors.primary} />
            <Text style={styles.backText}>{getTranslation("education.quiz.back", language)}</Text>
          </Pressable>
          <Text numberOfLines={2} style={styles.title}>{material.title}</Text>
          <View style={styles.progressGroup}>
            <Text style={styles.progressLabel}>{getTranslation("education.quiz.question", language)} {questionIndex + 1} / {material.quiz.questions.length}</Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressValue, { width: `${progress}%` }]} />
            </View>
          </View>
          <View style={styles.questionCard}>
            <Text style={styles.questionText}>{currentQuestion.content}</Text>
            <View style={styles.options}>
              {currentQuestion.options.map(option => (
                <Pressable
                  key={option.id}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selectedOption === option.id }}
                  onPress={() => {
                    setAnswers(current => ({ ...current, [currentQuestion.id]: option.id }));
                    setAnswerError(false);
                  }}
                  style={[styles.option, selectedOption === option.id && styles.optionSelected]}
                >
                  <View style={[styles.radio, selectedOption === option.id && styles.radioSelected]}>
                    {selectedOption === option.id ? <View style={styles.radioDot} /> : null}
                  </View>
                  <Text style={[styles.optionText, selectedOption === option.id && styles.optionTextSelected]}>{option.content}</Text>
                </Pressable>
              ))}
            </View>
            {answerError ? <Text style={styles.errorText}>{getTranslation("education.quiz.selectAnswer", language)}</Text> : null}
            {submitError ? <Text style={styles.errorText}>{getTranslation("education.quiz.submitError", language)}</Text> : null}
          </View>
          <View style={styles.actions}>
            {questionIndex > 0 ? (
              <Pressable accessibilityRole="button" onPress={() => setQuestionIndex(current => current - 1)} style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>{getTranslation("education.quiz.previous", language)}</Text>
              </Pressable>
            ) : <View style={styles.actionSpacer} />}
            <Pressable
              accessibilityRole="button"
              disabled={submitting}
              onPress={continueQuiz}
              style={[styles.primaryButton, submitting && styles.primaryButtonDisabled]}
            >
              <Text style={styles.primaryButtonText}>{getTranslation(questionIndex === material.quiz.questions.length - 1 ? "education.quiz.finish" : "education.quiz.next", language)}</Text>
              {!submitting ? <Ionicons name="arrow-forward" size={18} color={colors.text.onPrimary} /> : <ActivityIndicator color={colors.text.onPrimary} />}
            </Pressable>
          </View>
        </View>
      </Container>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background.app, flex: 1 },
  centered: { alignItems: "center", backgroundColor: colors.background.app, flex: 1, gap: 12, justifyContent: "center" },
  page: { flex: 1, gap: 20, paddingBlock: 12 },
  resultPage: { flex: 1, gap: 20, paddingBlock: 12 },
  backButton: { alignItems: "center", alignSelf: "flex-start", flexDirection: "row", gap: 2, paddingBlock: 6, paddingEnd: 8 },
  backText: { color: colors.primary, fontSize: 16, fontWeight: "600" },
  title: { color: colors.text.main, fontSize: 24, fontWeight: "700", lineHeight: 31 },
  progressGroup: { gap: 8 },
  progressLabel: { color: colors.text.muted, fontSize: 14, fontWeight: "600" },
  progressTrack: { backgroundColor: colors.border.card, borderRadius: 3, height: 6, overflow: "hidden" },
  progressValue: { backgroundColor: colors.primary, height: "100%" },
  questionCard: { backgroundColor: colors.background.card, borderColor: colors.border.card, borderRadius: 8, borderWidth: 1, gap: 22, padding: 20 },
  questionText: { color: colors.text.main, fontSize: 20, fontWeight: "700", lineHeight: 28 },
  options: { gap: 10 },
  option: { alignItems: "center", borderColor: colors.badges.all.border, borderRadius: 8, borderWidth: 1, flexDirection: "row", gap: 12, minHeight: 54, paddingHorizontal: 14, paddingVertical: 10 },
  optionSelected: { backgroundColor: colors.background.primarySoft, borderColor: colors.primary },
  radio: { alignItems: "center", borderColor: colors.text.muted, borderRadius: 10, borderWidth: 1, height: 20, justifyContent: "center", width: 20 },
  radioSelected: { borderColor: colors.primary },
  radioDot: { backgroundColor: colors.primary, borderRadius: 5, height: 10, width: 10 },
  optionText: { color: colors.text.main, flex: 1, fontSize: 16, lineHeight: 22 },
  optionTextSelected: { color: colors.primary, fontWeight: "600" },
  errorText: { color: colors.danger, fontSize: 14 },
  actions: { flexDirection: "row", gap: 12, justifyContent: "space-between" },
  actionSpacer: { flex: 1 },
  secondaryButton: { alignItems: "center", borderColor: colors.primary, borderRadius: 8, borderWidth: 1, flex: 1, justifyContent: "center", minHeight: 50, paddingHorizontal: 16 },
  secondaryButtonText: { color: colors.primary, fontSize: 16, fontWeight: "600" },
  primaryButton: { alignItems: "center", backgroundColor: colors.primary, borderRadius: 8, flex: 1, flexDirection: "row", gap: 8, justifyContent: "center", minHeight: 50, paddingHorizontal: 16 },
  primaryButtonDisabled: { opacity: 0.65 },
  primaryButtonText: { color: colors.text.onPrimary, fontSize: 16, fontWeight: "600" },
  resultCard: { alignItems: "center", alignSelf: "stretch", backgroundColor: colors.background.card, borderColor: colors.border.card, borderRadius: 8, borderWidth: 1, gap: 12, justifyContent: "center", marginTop: 36, padding: 28 },
  resultTitle: { color: colors.text.main, fontSize: 22, fontWeight: "700" },
  score: { color: colors.primary, fontSize: 42, fontWeight: "700" },
  resultText: { color: colors.text.muted, fontSize: 16 },
});
