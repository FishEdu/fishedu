import { AppColors } from "@/app/constants/theme";
import { useTheme } from "@/app/hooks/useTheme/useTheme";
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";
import { getTranslation } from "@/app/utils/translation/getTranslation";
import { EducationMaterial } from "@/app/api/education";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

export default function EducationMaterialActions({ material }: { material: EducationMaterial }) {
  const { colors } = useTheme();
  const { language } = useLanguage();
  const styles = createStyles(colors);
  const openMaterial = () => {
    if (!material?.file_name) return;

    if (material.type === "pdf") {
      const pdfHref = {
        pathname: "/(tabs)/education/pdf",
        params: { id: String(material.id), title: material.title, url: material.file_name }
      } as unknown as Parameters<typeof router.push>[0];
      router.push(pdfHref);
      return;
    }

    if (material.type === "video") {
      const videoHref = {
        pathname: "/(tabs)/education/video",
        params: { id: String(material.id), title: material.title, url: material.file_name }
      } as unknown as Parameters<typeof router.push>[0];
      router.push(videoHref);
      return;
    }

    Linking.openURL(material.file_name);
  };

  const openQuiz = () => {
    if (!material?.quiz) return;
    const quizHref = {
      pathname: "/(tabs)/education/quiz",
      params: { id: String(material.id) }
    } as unknown as Parameters<typeof router.push>[0];
    router.push(quizHref);
  };

  return (
    <>
      {material.file_name && material.type !== "quiz" ? (
        <Pressable accessibilityRole="button" style={styles.openButton} onPress={openMaterial}>
          <Ionicons name="open-outline" size={20} color={colors.text.onPrimary} />
          <Text style={styles.openButtonText}>{getTranslation("education.detail.open", language)}</Text>
        </Pressable>
      ) : null}
      {material.quiz ? (
        <View style={styles.quiz}>
          <Pressable accessibilityRole="button" onPress={openQuiz} style={styles.openButton}>
            <Ionicons name="play-outline" size={20} color={colors.text.onPrimary} />
            <Text style={styles.openButtonText}>{getTranslation("education.detail.startQuiz", language)}</Text>
          </Pressable>
        </View>
      ) : null}

    </>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  openButton: { alignItems: "center", backgroundColor: colors.primary, borderRadius: 8, flexDirection: "row", gap: 8, justifyContent: "center", padding: 14 },
  openButtonText: { color: colors.text.onPrimary, fontSize: 16, fontWeight: "600" },
  quiz: { gap: 20 },
});
