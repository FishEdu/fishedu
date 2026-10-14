import type { EducationQuiz, EducationQuizResult } from "@/app/api/education";

export function calculateQuizResult(
  quiz: EducationQuiz,
  answers: Record<number, number>,
): EducationQuizResult {
  const correctAnswers = quiz.questions.filter(question =>
    question.options.some(option => option.id === answers[question.id] && option.is_correct)
  ).length;

  const totalQuestions = quiz.questions.length;
  const percentage = (correctAnswers / totalQuestions) * 100;
  const rounded = Math.round(percentage);
  const score = percentage % 1 === 0.5 && rounded % 2 === 1 ? rounded - 1 : rounded;

  return {
    correct_answers: correctAnswers,
    total_questions: totalQuestions,
    score,
    passed: score >= quiz.passing_score,
  };
}
