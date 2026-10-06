import { EducationMaterial } from "@/app/api/education";
import Container from "@/app/components/ui/Container";
import { AppColors } from "@/app/constants/theme";
import { useTheme } from "@/app/hooks/useTheme/useTheme";
import { useEducationFavorites } from "@/app/hooks/useEducationFavorites/useEducationFavorites";
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";
import { getBaseApiUrl } from "@/app/utils/getBaseApiUrl";
import { getTranslation } from "@/app/utils/translation/getTranslation";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function EducationMaterialDetails() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { language } = useLanguage();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [material, setMaterial] = useState<EducationMaterial | null>(null);
  const [loading, setLoading] = useState(true);
  const { favoriteIds, toggleFavorite } = useEducationFavorites();

  useEffect(() => {
    const controller = new AbortController();

    const loadMaterial = async () => {
      try {
        const response = await fetch(
          `${getBaseApiUrl()}/education-materials/${id}?language=${language}`,
          { signal: controller.signal }
        );
        if (!response.ok) throw new Error("Could not fetch education material");
        setMaterial(await response.json());
      } catch (error) {
        if ((error as Error).name !== "AbortError") setMaterial(null);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadMaterial();
    return () => controller.abort();
  }, [id, language]);

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

  if (loading) {
    return <View style={styles.centered}><ActivityIndicator color={colors.primary} /><Text style={styles.feedbackText}>{getTranslation("education.detail.loading", language)}</Text></View>;
  }

  if (!material) {
    return <View style={styles.centered}><Text style={styles.feedbackText}>{getTranslation("education.detail.unavailable", language)}</Text></View>;
  }

  const isFavorite = favoriteIds.includes(material.id);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Container>
        <View style={styles.page}>
          <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={20} color={colors.primary} />
            <Text style={styles.backText}>{getTranslation("education.detail.back", language)}</Text>
          </Pressable>
          {material.image_url ? (
            <Image source={{ uri: material.image_url }} style={styles.image} />
          ) : (
            <View style={styles.imageFallback}>
              <Ionicons name="library-outline" size={48} color={colors.primary} />
            </View>
          )}
          <View style={styles.titleGroup}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{material.title}</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={getTranslation(isFavorite ? "education.favorite.remove" : "education.favorite.add", language)}
                onPress={() => toggleFavorite(material.id)}
                style={styles.favoriteButton}
              >
                <Ionicons
                  name={isFavorite ? "star" : "star-outline"}
                  size={21}
                  color={colors.favorite}
                />
              </Pressable>
            </View>
            <Text style={styles.description}>{material.description}</Text>
          </View>
          {material.content ? <Text style={styles.contentText}>{material.content}</Text> : null}
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
        </View>
      </Container>
    </ScrollView>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  feedbackText: { color: colors.text.muted, fontSize: 16, textAlign: "center" },
  screen: { backgroundColor: colors.background.app, flex: 1 },
  content: { flexGrow: 1 },
  centered: { alignItems: "center", backgroundColor: colors.background.app, flex: 1, gap: 12, justifyContent: "center" },
  page: { gap: 20, paddingBlock: 12, paddingBottom: 28 },
  backButton: { alignItems: "center", alignSelf: "flex-start", flexDirection: "row", gap: 2, paddingBlock: 6, paddingEnd: 8 },
  backText: { color: colors.primary, fontSize: 16, fontWeight: "600" },
  image: { aspectRatio: 1.65, borderRadius: 8, width: "100%" },
  imageFallback: { alignItems: "center", aspectRatio: 1.65, backgroundColor: colors.background.primarySoft, borderRadius: 8, justifyContent: "center" },
  titleGroup: { gap: 8 },
  titleRow: { alignItems: "flex-start", flexDirection: "row", gap: 12, justifyContent: "space-between" },
  title: { color: colors.text.main, flex: 1, fontSize: 28, fontWeight: "700" },
  favoriteButton: { alignItems: "center", height: 36, justifyContent: "center", width: 36 },
  description: { color: colors.text.muted, fontSize: 17, lineHeight: 25 },
  contentText: { color: colors.text.main, fontSize: 16, lineHeight: 25 },
  openButton: { alignItems: "center", backgroundColor: colors.primary, borderRadius: 8, flexDirection: "row", gap: 8, justifyContent: "center", padding: 14 },
  openButtonText: { color: colors.text.onPrimary, fontSize: 16, fontWeight: "600" },
  quiz: { gap: 20 },
});
