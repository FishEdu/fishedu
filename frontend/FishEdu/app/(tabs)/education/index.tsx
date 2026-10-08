import { EducationLevel } from "@/app/api/education";
import EducationSearchInput from "@/app/components/Education/EducationSearchInput";
import EducationTypeTabs, { EducationTab } from "@/app/components/Education/EducationTypeTabs";
import EducationLevelFilters from "@/app/components/Education/EducationLevelFilters";
import EducationMaterialList from "@/app/components/Education/EducationMaterialList";
import Container from "@/app/components/ui/Container";
import { AppColors } from "@/app/constants/theme";
import { useTheme } from "@/app/hooks/useTheme/useTheme";
import { useEducationFavorites } from "@/app/hooks/useEducationFavorites/useEducationFavorites";
import { useFetchEducationMaterials } from "@/app/hooks/useFetchEducationMaterials/useFetchEducationMaterials";
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

export default function Education() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { language } = useLanguage();
  const [type, setType] = useState<EducationTab>("all");
  const [level, setLevel] = useState<EducationLevel | "all">("all");
  const [search, setSearch] = useState("");
  const { data, loading, error } = useFetchEducationMaterials({ language, type, level, search });
  const { favoriteIds } = useEducationFavorites();

  return (
    <View style={styles.screen}>
      <Container>
        <View style={styles.page}>
          <EducationSearchInput value={search} onChangeText={setSearch} />
          <EducationTypeTabs value={type} onChange={setType} />
          <EducationLevelFilters value={level} onChange={setLevel} />
          <EducationMaterialList data={data} loading={loading} error={error} favoriteIds={favoriteIds} />
        </View>
      </Container>
    </View>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  screen: { backgroundColor: colors.background.app, flex: 1 },
  page: { flex: 1, gap: 14, paddingTop: 2 },
});
