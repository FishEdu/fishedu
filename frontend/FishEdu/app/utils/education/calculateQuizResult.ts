import type { EducationQuiz, EducationQuizResult } from "@/app/api/education";

export function canGradeQuiz(quiz: EducationQuiz | null | undefined): quiz is EducationQuiz {
  return Boolean(
    quiz &&
    Number.isFinite(quiz.passing_score) &&
    quiz.passing_score >= 0 && quiz.passing_score <= 100 &&
    Array.isArray(quiz.questions) && quiz.questions.length > 0 &&
    quiz.questions.every(question =>
      Array.isArray(question.options) && question.options.length > 0 &&
      question.options.every(option => typeof option.is_correct === "boolean") &&
      question.options.some(option => option.is_correct)
    )
  );
}

export function calculateQuizResult(
  quiz: EducationQuiz,
  answers: Record<number, number>,
): EducationQuizResult {
  if (!canGradeQuiz(quiz)) throw new Error("Quiz data is incomplete");

  const correctAnswers = quiz.questions.filter(question =>
    question.options.some(option => option.id === answers[question.id] && option.is_correct)
  ).length;
  const totalQuestions = quiz.questions.length;
  const percentage = (correctAnswers / totalQuestions) * 100;
  const rounded = Math.round(percentage);
  // Match the existing server's ties-to-even percentage rounding.
  const score = percentage % 1 === 0.5 && rounded % 2 === 1 ? rounded - 1 : rounded;

  return {
    correct_answers: correctAnswers,
    total_questions: totalQuestions,
    score,
    passed: score >= quiz.passing_score,
  };
}
