import { EducationLevel, EducationMaterialType } from "@/app/api/education";
import EducationMaterialCard from "@/app/components/Education/EducationMaterialCard";
import Container from "@/app/components/ui/Container";
import { AppColors } from "@/app/constants/theme";
import { useTheme } from "@/app/hooks/useTheme/useTheme";
import { useEducationFavorites } from "@/app/hooks/useEducationFavorites/useEducationFavorites";
import { useFetchEducationMaterials } from "@/app/hooks/useFetchEducationMaterials/useFetchEducationMaterials";
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";
import { getTranslation } from "@/app/utils/translation/getTranslation";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

type EducationTab = "all" | "video" | "pdf" | "course" | "quiz";

const tabs: EducationTab[] = ["all", "video", "pdf", "course", "quiz"];
const levels: EducationLevel[] = ["beginner", "advanced"];
const tabTranslationKeys = {
  all: "education.tab.all",
  video: "education.tab.video",
  pdf: "education.tab.pdf",
  course: "education.tab.course",
  quiz: "education.tab.quiz",
} as const;
const levelTranslationKeys = {
  beginner: "education.level.beginner",
  advanced: "education.level.advanced",
} as const;
const materialTypeTranslationKeys: Record<EducationMaterialType, typeof tabTranslationKeys[keyof typeof tabTranslationKeys] | "education.type.guide"> = {
  video: "education.tab.video",
  pdf: "education.tab.pdf",
  course: "education.tab.course",
  quiz: "education.tab.quiz",
  guide: "education.type.guide",
};

export default function Education() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { language } = useLanguage();
  const [type, setType] = useState<EducationTab>("all");
  const [level, setLevel] = useState<EducationLevel | "all">("beginner");
  const [search, setSearch] = useState("");
  const { data, loading, error } = useFetchEducationMaterials({ language, type, level, search });
  const { favoriteIds } = useEducationFavorites();

  return (
    <View style={styles.screen}>
      <Container>
        <View style={styles.page}>
          <View style={styles.search}>
            <Ionicons name="search" size={21} color={colors.text.main} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder={getTranslation("education.search", language)}
              placeholderTextColor={colors.text.muted}
              selectionColor={colors.primary}
              style={styles.searchInput}
            />
          </View>
          <View style={styles.tabArea}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.tabScroll}
              contentContainerStyle={styles.tabList}
            >
              {tabs.map(item => (
                <Pressable
                  key={item}
                  onPress={() => setType(current => item === "all" || current === item ? "all" : item)}
                  style={[styles.tabButton, type === item && styles.tabButtonActive]}
                >
                  <Text style={[styles.tabText, type === item && styles.tabTextActive]}>{getTranslation(tabTranslationKeys[item], language)}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
          <View style={styles.levelSection}>
            <Text style={styles.levelTitle}>{getTranslation("education.level.title", language)}</Text>
            <View style={styles.levelSelector}>
              {levels.map(item => (
                <Pressable
                  key={item}
                  onPress={() => setLevel(current => current === item ? "all" : item)}
                  style={[
                    styles.levelButton,
                    level === item && item === "beginner" && styles.levelButtonBeginnerActive,
                    level === item && item === "advanced" && styles.levelButtonAdvancedActive,
                  ]}
                >
                  {level === item ? (
                    <Ionicons name="close" size={13} color={colors.badges[item].text} />
                  ) : <View style={styles.levelDot} />}
                  <Text
                    style={[
                      styles.levelText,
                      level === item && item === "beginner" && styles.levelTextBeginnerActive,
                      level === item && item === "advanced" && styles.levelTextAdvancedActive,
                    ]}
                  >
                    {getTranslation(levelTranslationKeys[item], language)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
          {loading ? <ActivityIndicator color={colors.primary} /> : null}
          {!loading && error ? <Text style={styles.feedback}>{getTranslation("education.materials.unavailable", language)}</Text> : null}
          {!loading && !error ? (
            <FlatList
              data={data}
              keyExtractor={item => String(item.id)}
              numColumns={2}
              columnWrapperStyle={styles.row}
              style={styles.materialListView}
              contentContainerStyle={styles.materialList}
              ListEmptyComponent={<Text style={styles.feedback}>{getTranslation("education.materials.empty", language)}</Text>}
              renderItem={({ item }) => (
                <EducationMaterialCard
                  material={item}
                  typeLabel={getTranslation(materialTypeTranslationKeys[item.type], language)}
                  isFavorite={favoriteIds.includes(item.id)}
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

const createStyles = (colors: AppColors) => StyleSheet.create({
  screen: { backgroundColor: colors.background.app, flex: 1 },
  page: { flex: 1, gap: 14, paddingTop: 2 },
  search: {
    alignItems: "center",
    backgroundColor: colors.background.card,
    borderColor: colors.border.card,
    borderRadius: 14,
    borderWidth: 1,
    elevation: 1,
    flexDirection: "row",
    gap: 9,
    minHeight: 48,
    paddingHorizontal: 13,
    shadowColor: colors.background.photoOverlay,
    shadowOpacity: 0.06,
    shadowRadius: 6
  },
  searchInput: { color: colors.text.main, flex: 1, fontSize: 16, fontWeight: "600", paddingVertical: 10 },
  tabArea: { minHeight: 43, overflow: "visible", position: "relative", zIndex: 1 },
  tabScroll: { flexGrow: 0, overflow: "visible" },
  tabList: { alignItems: "flex-start", gap: 26, paddingBottom: 4 },
  tabButton: { alignSelf: "flex-start", borderBottomColor: "transparent", borderBottomWidth: 3, height: 39, justifyContent: "center" },
  tabButtonActive: { borderBottomColor: colors.primary },
  tabText: { color: colors.text.main, fontSize: 15, fontWeight: "600" },
  tabTextActive: { fontWeight: "700" },
  levelSection: { gap: 8 },
  levelTitle: { color: colors.text.main, fontSize: 14, fontWeight: "700" },
  levelSelector: { flexDirection: "row", gap: 8 },
  levelButton: { alignItems: "center", backgroundColor: colors.background.card, borderColor: colors.badges.all.border, borderRadius: 16, borderWidth: 1, flexDirection: "row", gap: 4, paddingHorizontal: 10, paddingVertical: 6 },
  levelButtonBeginnerActive: { backgroundColor: colors.badges.beginner.background, borderColor: colors.badges.beginner.border },
  levelButtonAdvancedActive: { backgroundColor: colors.badges.advanced.background, borderColor: colors.badges.advanced.border },
  levelDot: { borderColor: colors.badges.all.border, borderRadius: 4, borderWidth: 1, height: 8, width: 8 },
  levelText: { color: colors.badges.all.text, fontSize: 13, fontWeight: "600" },
  levelTextBeginnerActive: { color: colors.badges.beginner.text },
  levelTextAdvancedActive: { color: colors.badges.advanced.text },
  materialListView: { flex: 1, zIndex: 0 },
  materialList: { gap: 26, paddingBottom: 28 },
  row: { gap: 26 },
  feedback: { color: colors.text.muted, fontSize: 16, paddingTop: 20, textAlign: "center" }
});
