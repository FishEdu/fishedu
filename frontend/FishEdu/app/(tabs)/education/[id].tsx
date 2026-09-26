import { EducationMaterial } from "@/app/api/education";
import Container from "@/app/components/ui/Container";
import { useEducationFavorites } from "@/app/hooks/useEducationFavorites/useEducationFavorites";
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";
import { getBaseApiUrl } from "@/app/utils/getBaseApiUrl";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const copy = {
  pl: {
    back: "Edukacja",
    open: "Otwórz materiał",
    startQuiz: "Rozpocznij quiz",
    loading: "Ładowanie materiału...",
    unavailable: "Nie udało się pobrać materiału",
  },
  en: {
    back: "Education",
    open: "Open material",
    startQuiz: "Start quiz",
    loading: "Loading material...",
    unavailable: "Could not load material",
  }
};

export default function EducationMaterialDetails() {
  const { language } = useLanguage();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [material, setMaterial] = useState<EducationMaterial | null>(null);
  const [loading, setLoading] = useState(true);
  const { favoriteIds, toggleFavorite } = useEducationFavorites();
  const text = copy[language];

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
    if (!material?.file_url) return;

    if (material.type === "pdf") {
      const pdfHref = {
        pathname: "/(tabs)/education/pdf",
        params: { id: String(material.id), title: material.title, url: material.file_url }
      } as unknown as Parameters<typeof router.push>[0];
      router.push(pdfHref);
      return;
    }

    Linking.openURL(material.file_url);
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
    return <View style={styles.centered}><ActivityIndicator color="hsl(226, 75%, 45%)" /><Text>{text.loading}</Text></View>;
  }

  if (!material) {
    return <View style={styles.centered}><Text>{text.unavailable}</Text></View>;
  }

  const isFavorite = favoriteIds.includes(material.id);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Container>
        <View style={styles.page}>
          <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={20} color="hsl(226, 75%, 45%)" />
            <Text style={styles.backText}>{text.back}</Text>
          </Pressable>
          {material.image_url ? (
            <Image source={{ uri: material.image_url }} style={styles.image} />
          ) : (
            <View style={styles.imageFallback}>
              <Ionicons name="library-outline" size={48} color="hsl(226, 75%, 45%)" />
            </View>
          )}
          <View style={styles.titleGroup}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{material.title}</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={isFavorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
                onPress={() => toggleFavorite(material.id)}
                style={styles.favoriteButton}
              >
                <Ionicons
                  name={isFavorite ? "star" : "star-outline"}
                  size={25}
                  color="hsl(226, 75%, 52%)"
                />
              </Pressable>
            </View>
            <Text style={styles.description}>{material.description}</Text>
          </View>
          {material.content ? <Text style={styles.contentText}>{material.content}</Text> : null}
          {material.file_url && material.type !== "quiz" ? (
            <Pressable accessibilityRole="button" style={styles.openButton} onPress={openMaterial}>
              <Ionicons name="open-outline" size={20} color="hsl(0, 0%, 100%)" />
              <Text style={styles.openButtonText}>{text.open}</Text>
            </Pressable>
          ) : null}
          {material.quiz ? (
            <View style={styles.quiz}>
              <Pressable accessibilityRole="button" onPress={openQuiz} style={styles.openButton}>
                <Ionicons name="play-outline" size={20} color="hsl(0, 0%, 100%)" />
                <Text style={styles.openButtonText}>{text.startQuiz}</Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      </Container>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: "hsl(180, 5%, 96%)", flex: 1 },
  content: { flexGrow: 1 },
  centered: { alignItems: "center", flex: 1, gap: 12, justifyContent: "center" },
  page: { gap: 20, paddingBlock: 12, paddingBottom: 28 },
  backButton: { alignItems: "center", alignSelf: "flex-start", flexDirection: "row", gap: 2, paddingBlock: 6, paddingEnd: 8 },
  backText: { color: "hsl(226, 75%, 45%)", fontSize: 16, fontWeight: "600" },
  image: { aspectRatio: 1.65, borderRadius: 8, width: "100%" },
  imageFallback: { alignItems: "center", aspectRatio: 1.65, backgroundColor: "hsl(226, 75%, 95%)", borderRadius: 8, justifyContent: "center" },
  titleGroup: { gap: 8 },
  titleRow: { alignItems: "flex-start", flexDirection: "row", gap: 12, justifyContent: "space-between" },
  title: { color: "hsl(210, 15%, 12%)", flex: 1, fontSize: 28, fontWeight: "700" },
  favoriteButton: { alignItems: "center", height: 40, justifyContent: "center", width: 40 },
  description: { color: "hsl(210, 8%, 36%)", fontSize: 17, lineHeight: 25 },
  contentText: { color: "hsl(210, 12%, 22%)", fontSize: 16, lineHeight: 25 },
  openButton: { alignItems: "center", backgroundColor: "hsl(226, 75%, 45%)", borderRadius: 8, flexDirection: "row", gap: 8, justifyContent: "center", padding: 14 },
  openButtonText: { color: "hsl(0, 0%, 100%)", fontSize: 16, fontWeight: "600" },
  quiz: { gap: 20 },
});
