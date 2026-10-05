export type EducationMaterialType = "video" | "pdf" | "course" | "quiz" | "guide";
export type EducationLevel = "beginner" | "advanced";

export type EducationMaterial = {
  id: number;
  type: EducationMaterialType;
  title: string;
  description: string;
  content?: string | null;
  image_url: string | null;
  file_url: string | null;
  duration_minutes: number | null;
  levels: EducationLevel[];
  is_favorite: boolean;
  quiz?: {
    id: number;
    passing_score: number;
    questions: {
      id: number;
      content: string;
      options: { id: number; content: string }[];
    }[];
  } | null;
};
