import { EducationQuiz, EducationQuizResult } from "@/app/api/education";
import { calculateQuizResult } from "@/app/utils/education/calculateQuizResult";
import { useState } from "react";

export const useEducationQuiz = (quiz: EducationQuiz | null | undefined) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [answerError, setAnswerError] = useState(false);
  const [result, setResult] = useState<EducationQuizResult | null>(null);
  const currentQuestion = quiz?.questions[questionIndex];

  const selectAnswer = (optionId: number) => {
    if (!currentQuestion) return;
    setAnswers(current => ({ ...current, [currentQuestion.id]: optionId }));
    setAnswerError(false);
  };

  const continueQuiz = () => {
    if (!quiz || !currentQuestion) return;
    if (!currentQuestion.options.some(option => option.id === answers[currentQuestion.id])) {
      setAnswerError(true);
      return;
    }
    setAnswerError(false);
    if (questionIndex === quiz.questions.length - 1) {
      setResult(calculateQuizResult(quiz, answers));
      return;
    }
    setQuestionIndex(current => current + 1);
  };

  const restartQuiz = () => {
    setQuestionIndex(0);
    setAnswers({});
    setAnswerError(false);
    setResult(null);
  };

  return {
    currentQuestion,
    questionIndex,
    selectedOption: currentQuestion ? answers[currentQuestion.id] : undefined,
    answerError,
    result,
    selectAnswer,
    continueQuiz,
    previousQuestion: () => setQuestionIndex(current => Math.max(0, current - 1)),
    restartQuiz,
  };
};
