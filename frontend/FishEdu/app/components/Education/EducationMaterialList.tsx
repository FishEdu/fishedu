import { AppColors } from "@/app/constants/theme";
import { useTheme } from "@/app/hooks/useTheme/useTheme";
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";
import { getTranslation } from "@/app/utils/translation/getTranslation";
import { EducationMaterial, EducationMaterialType } from "@/app/api/education";
import EducationMaterialCard from "./EducationMaterialCard";
import { router } from "expo-router";
import { ActivityIndicator, FlatList, StyleSheet, Text } from "react-native";

const materialTypeTranslationKeys: Record<EducationMaterialType, Parameters<typeof getTranslation>[0]> = {
  video: "education.tab.video",
  pdf: "education.tab.pdf",
  course: "education.tab.course",
  quiz: "education.tab.quiz",
  guide: "education.type.guide",
};

type Props = { data: EducationMaterial[]; loading: boolean; error: boolean; favoriteIds: number[] };

export default function EducationMaterialList({ data, loading, error, favoriteIds }: Props) {
  const { colors } = useTheme();
  const { language } = useLanguage();
  const styles = createStyles(colors);
  return (
    <>
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

    </>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  materialListView: { flex: 1, zIndex: 0 },
  materialList: { gap: 26, paddingBottom: 28 },
  row: { gap: 26 },
  feedback: { color: colors.text.muted, fontSize: 16, paddingTop: 20, textAlign: "center" }
});
