import { EducationLevel } from "@/app/api/education";
import EducationMaterialCard from "@/app/components/Education/EducationMaterialCard";
import Container from "@/app/components/ui/Container";
import { useEducationFavorites } from "@/app/hooks/useEducationFavorites/useEducationFavorites";
import { useFetchEducationMaterials } from "@/app/hooks/useFetchEducationMaterials/useFetchEducationMaterials";
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

type EducationTab = "all" | "video" | "guidesPdf" | "course" | "quiz";

const tabs: EducationTab[] = ["all", "video", "guidesPdf", "course", "quiz"];
const levels: EducationLevel[] = ["beginner", "advanced"];

const labels = {
  pl: {
    search: "Wyszukaj...",
    levelTitle: "Poziom zaawansowania",
    empty: "Nie znaleziono materiałów",
    unavailable: "Nie udało się pobrać materiałów",
    all: "Wszystko",
    video: "Filmy",
    guidesPdf: "Poradniki PDF",
    course: "Kursy",
    quiz: "Quizy",
    beginner: "Początkujący",
    advanced: "Zaawansowany",
    pdf: "PDF",
    guide: "Poradnik"
  },
  en: {
    search: "Search...",
    levelTitle: "Experience level",
    empty: "No materials found",
    unavailable: "Could not load materials",
    all: "All",
    video: "Videos",
    guidesPdf: "PDF guides",
    course: "Courses",
    quiz: "Quizzes",
    beginner: "Beginner",
    advanced: "Advanced",
    pdf: "PDF",
    guide: "Guide"
  }
};

export default function Education() {
  const { language } = useLanguage();
  const [type, setType] = useState<EducationTab>("all");
  const [level, setLevel] = useState<EducationLevel | "all">("beginner");
  const [search, setSearch] = useState("");
  const { data, loading, error } = useFetchEducationMaterials({ language, type, level, search });
  const { favoriteIds, toggleFavorite } = useEducationFavorites();
  const text = labels[language];

  return (
    <View style={styles.screen}>
      <Container>
        <View style={styles.page}>
          <View style={styles.search}>
            <Ionicons name="search" size={26} color="hsl(210, 10%, 16%)" />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder={text.search}
              placeholderTextColor="hsl(210, 8%, 40%)"
              style={styles.searchInput}
            />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabList}>
            {tabs.map(item => (
              <Pressable
                key={item}
                onPress={() => setType(current => item === "all" || current === item ? "all" : item)}
                style={[styles.tabButton, type === item && styles.tabButtonActive]}
              >
                <Text style={[styles.tabText, type === item && styles.tabTextActive]}>{text[item]}</Text>
              </Pressable>
            ))}
          </ScrollView>
          <View style={styles.levelSection}>
            <Text style={styles.levelTitle}>{text.levelTitle}</Text>
            <View style={styles.levelSelector}>
              {levels.map(item => (
                <Pressable
                  key={item}
                  onPress={() => setLevel(current => current === item ? "all" : item)}
                  style={[styles.levelButton, level === item && styles.levelButtonActive]}
                >
                  <View style={[styles.levelDot, level === item && styles.levelDotActive]} />
                  <Text style={[styles.levelText, level === item && styles.levelTextActive]}>{text[item]}</Text>
                </Pressable>
              ))}
            </View>
          </View>
          {loading ? <ActivityIndicator color="hsl(226, 75%, 59%)" /> : null}
          {!loading && error ? <Text style={styles.feedback}>{text.unavailable}</Text> : null}
          {!loading && !error ? (
            <FlatList
              data={data}
              keyExtractor={item => String(item.id)}
              numColumns={2}
              columnWrapperStyle={styles.row}
              contentContainerStyle={styles.materialList}
              ListEmptyComponent={<Text style={styles.feedback}>{text.empty}</Text>}
              renderItem={({ item }) => (
                <EducationMaterialCard
                  material={item}
                  typeLabel={text[item.type]}
                  isFavorite={favoriteIds.includes(item.id)}
                  onToggleFavorite={item.type === "quiz" ? () => toggleFavorite(item.id) : undefined}
                  onPress={() => {
                    const detailsHref = {
                      pathname: "/(tabs)/education/[id]",
                      params: { id: String(item.id) }
                    } as unknown as Parameters<typeof router.push>[0];
                    router.push(detailsHref);
                  }}
                />
              )}
            />
          ) : null}
        </View>
      </Container>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: "hsl(210, 5%, 96%)", flex: 1 },
  page: { flex: 1, gap: 20, paddingTop: 36 },
  search: {
    alignItems: "center",
    backgroundColor: "hsl(0, 0%, 100%)",
    borderRadius: 28,
    elevation: 4,
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    shadowColor: "hsl(226, 75%, 59%)",
    shadowOpacity: 0.16,
    shadowRadius: 14
  },
  searchInput: { color: "hsl(210, 10%, 16%)", flex: 1, fontSize: 19, fontWeight: "600", paddingVertical: 16 },
  tabList: { gap: 30 },
  tabButton: { alignSelf: "flex-start", borderBottomColor: "transparent", borderBottomWidth: 4, minHeight: 37, paddingBottom: 9 },
  tabButtonActive: { borderBottomColor: "hsl(226, 75%, 59%)" },
  tabText: { color: "hsl(210, 10%, 12%)", fontSize: 15, fontWeight: "600" },
  tabTextActive: { fontWeight: "700" },
  levelSection: { gap: 10 },
  levelTitle: { color: "hsl(210, 10%, 12%)", fontSize: 15, fontWeight: "700" },
  levelSelector: { flexDirection: "row", gap: 10 },
  levelButton: { alignItems: "center", borderColor: "hsl(210, 8%, 58%)", borderRadius: 20, borderWidth: 1, flexDirection: "row", gap: 5, paddingHorizontal: 14, paddingVertical: 8 },
  levelButtonActive: { backgroundColor: "hsl(226, 75%, 92%)", borderColor: "hsl(226, 75%, 59%)" },
  levelDot: { borderColor: "hsl(210, 8%, 58%)", borderRadius: 5, borderWidth: 1, height: 10, width: 10 },
  levelDotActive: { backgroundColor: "hsl(226, 75%, 59%)", borderColor: "hsl(226, 75%, 59%)" },
  levelText: { color: "hsl(210, 8%, 42%)", fontSize: 14, fontWeight: "600" },
  levelTextActive: { color: "hsl(226, 75%, 52%)" },
  materialList: { gap: 26, paddingBottom: 28 },
  row: { gap: 26 },
  feedback: { color: "hsl(210, 8%, 42%)", fontSize: 16, paddingTop: 20, textAlign: "center" }
});
