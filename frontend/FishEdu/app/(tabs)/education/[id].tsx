import { AppColors } from "@/app/constants/theme";
import { useTheme } from "@/app/hooks/useTheme/useTheme";
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";
import { getTranslation } from "@/app/utils/translation/getTranslation";
import Container from "@/app/components/ui/Container";
import BackButton from "@/app/components/ui/BackButton";
import EducationFeedback from "@/app/components/Education/EducationFeedback";
import EducationMaterialImage from "@/app/components/Education/EducationMaterialImage";
import EducationMaterialHeader from "@/app/components/Education/EducationMaterialHeader";
import EducationMaterialActions from "@/app/components/Education/EducationMaterialActions";
import { useFetchEducationMaterial } from "@/app/hooks/useFetchEducationMaterial/useFetchEducationMaterial";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function EducationMaterialDetails() {
  const { colors } = useTheme();
  const { language } = useLanguage();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { material, loading } = useFetchEducationMaterial(id, language);
  const styles = createStyles(colors);

  if (loading) return <EducationFeedback loading message={getTranslation("education.detail.loading", language)} />;
  if (!material) return <EducationFeedback message={getTranslation("education.detail.unavailable", language)} />;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Container>
        <View style={styles.page}>
          <BackButton label={getTranslation("education.detail.back", language)} onPress={() => router.back()} />
          <EducationMaterialImage uri={material.image_url} />
          <EducationMaterialHeader material={material} />
          {material.content ? <Text style={styles.contentText}>{material.content}</Text> : null}
          <EducationMaterialActions material={material} />
        </View>
      </Container>
    </ScrollView>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  screen: { backgroundColor: colors.background.app, flex: 1 },
  content: { flexGrow: 1 },
  page: { gap: 20, paddingBlock: 12, paddingBottom: 28 },
  contentText: { color: colors.text.main, fontSize: 16, lineHeight: 25 },
});
