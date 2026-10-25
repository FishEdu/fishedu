import { AppColors } from "@/app/constants/theme";
import { useTheme } from "@/app/hooks/useTheme/useTheme";
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";
import { getTranslation } from "@/app/utils/translation/getTranslation";
import EducationPdfDocument from "@/app/components/Education/EducationPdfDocument";
import EducationMediaHeader from "@/app/components/Education/EducationMediaHeader";
import { useEducationMaterialURL } from "@/app/hooks/useEducationMaterialURL/useEducationMaterialURL";
import { goBackToEducationMaterial } from "@/app/utils/education/goBackToEducationMaterial";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function EducationPdfViewer() {
  const { colors } = useTheme();
  const { language } = useLanguage();
  const { title } = useLocalSearchParams<{ title: string }>();
  const url = useEducationMaterialURL();
  const styles = createStyles(colors);

  return (
    <View style={styles.screen}>
      <EducationMediaHeader title={title || getTranslation("education.pdf.defaultTitle", language)} onBack={goBackToEducationMaterial} />
      <EducationPdfDocument url={url} />
    </View>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  screen: { backgroundColor: colors.background.app, flex: 1 },
});
