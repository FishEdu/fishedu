import { PdfView } from "@kishannareshpal/expo-pdf";
import { colors } from "@/app/constants/theme";
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";
import { getTranslation } from "@/app/utils/translation/getTranslation";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Directory, File, Paths } from "expo-file-system";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

export default function EducationPdfViewer() {
  const { language } = useLanguage();
  const { title, url } = useLocalSearchParams<{ title: string; url: string }>();
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [localUri, setLocalUri] = useState<string | null>(null);

  const goBackToMaterial = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/(tabs)/education");
  };

  useEffect(() => {
    let isActive = true;

    const downloadPdf = async () => {
      if (!url) {
        setLoading(false);
        setHasError(true);
        return;
      }

      try {
        const directory = new Directory(Paths.cache, "pdfs");
        directory.create({ idempotent: true, intermediates: true });

        const nameFromUrl = url.split("/").pop()?.split("?")[0] || "document.pdf";
        const destination = new File(directory, nameFromUrl);
        const downloadedFile = destination.exists && destination.size > 0
          ? destination
          : await File.downloadFileAsync(url, destination, { idempotent: true });

        if (isActive) {
          setLocalUri(downloadedFile.uri);
        }
      } catch {
        if (isActive) {
          setHasError(true);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void downloadPdf();

    return () => {
      isActive = false;
    };
  }, [url]);

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" onPress={goBackToMaterial} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </Pressable>
        <Text numberOfLines={1} style={styles.title}>{title || getTranslation("education.pdf.defaultTitle", language)}</Text>
      </View>
      {loading && !hasError ? (
        <View style={styles.feedback}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.feedbackText}>{getTranslation("education.pdf.downloading", language)}</Text>
        </View>
      ) : null}
      {hasError ? (
        <View style={styles.feedback}>
          <Ionicons name="document-text-outline" size={38} color={colors.text.muted} />
          <Text style={styles.feedbackText}>{getTranslation("education.pdf.error", language)}</Text>
        </View>
      ) : localUri ? (
        <PdfView
          uri={localUri}
          style={styles.pdf}
          onError={() => {
            setHasError(true);
          }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background.app, flex: 1 },
  header: { alignItems: "center", backgroundColor: colors.background.card, borderBottomColor: colors.border.card, borderBottomWidth: 1, flexDirection: "row", gap: 8, minHeight: 58, paddingHorizontal: 12 },
  backButton: { alignItems: "center", height: 40, justifyContent: "center", width: 40 },
  title: { color: colors.text.main, flex: 1, fontSize: 17, fontWeight: "600" },
  pdf: { flex: 1 },
  feedback: { alignItems: "center", flex: 1, gap: 12, justifyContent: "center", padding: 24 },
  feedbackText: { color: colors.text.muted, fontSize: 16, textAlign: "center" }
});
