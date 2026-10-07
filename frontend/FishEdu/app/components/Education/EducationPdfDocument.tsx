import { AppColors } from "@/app/constants/theme";
import { useTheme } from "@/app/hooks/useTheme/useTheme";
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";
import { getTranslation } from "@/app/utils/translation/getTranslation";
import { PdfView } from "@kishannareshpal/expo-pdf";
import { useEducationPdf } from "@/app/hooks/useEducationPdf/useEducationPdf";
import EducationFeedback from "./EducationFeedback";
import { StyleSheet } from "react-native";

export default function EducationPdfDocument({ url }: { url: string }) {
  const { colors } = useTheme();
  const { language } = useLanguage();
  const styles = createStyles(colors);
  const { loading, localUri, hasError, onError } = useEducationPdf(url);

  if (hasError) return <EducationFeedback fullScreen={false} icon="document-text-outline" message={getTranslation("education.pdf.error", language)} />;
  if (loading) return <EducationFeedback fullScreen={false} loading message={getTranslation("education.pdf.downloading", language)} />;
  return localUri ? <PdfView uri={localUri} style={styles.pdf} onError={onError} /> : null;
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  pdf: { backgroundColor: colors.background.app, flex: 1 },
});
