import EducationQuizSession from "@/app/components/Education/Quiz/EducationQuizSession";
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";
import { useLocalSearchParams } from "expo-router";

export default function EducationQuiz() {
  const { language } = useLanguage();
  const { id } = useLocalSearchParams<{ id: string }>();
  return <EducationQuizSession key={`${id}:${language}`} id={id} language={language} />;
}
