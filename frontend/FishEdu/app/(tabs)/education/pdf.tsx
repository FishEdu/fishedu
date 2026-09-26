import { PdfView } from "@kishannareshpal/expo-pdf";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Directory, File, Paths } from "expo-file-system";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

export default function EducationPdfViewer() {
  const { id, title, url } = useLocalSearchParams<{ id: string; title: string; url: string }>();
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [localUri, setLocalUri] = useState<string | null>(null);

  const goBackToMaterial = () => {
    const destination = id
      ? { pathname: "/(tabs)/education/[id]", params: { id } }
      : "/(tabs)/education";
    router.replace(destination as Parameters<typeof router.replace>[0]);
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
          <Ionicons name="chevron-back" size={24} color="hsl(226, 75%, 52%)" />
        </Pressable>
        <Text numberOfLines={1} style={styles.title}>{title || "PDF"}</Text>
      </View>
      {loading && !hasError ? (
        <View style={styles.feedback}>
          <ActivityIndicator color="hsl(226, 75%, 52%)" />
          <Text style={styles.feedbackText}>Pobieranie dokumentu...</Text>
        </View>
      ) : null}
      {hasError ? (
        <View style={styles.feedback}>
          <Ionicons name="document-text-outline" size={38} color="hsl(210, 8%, 42%)" />
          <Text style={styles.feedbackText}>Nie udało się wczytać dokumentu.</Text>
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
  screen: { backgroundColor: "hsl(210, 5%, 96%)", flex: 1 },
  header: { alignItems: "center", backgroundColor: "hsl(0, 0%, 100%)", borderBottomColor: "hsl(210, 12%, 88%)", borderBottomWidth: 1, flexDirection: "row", gap: 8, minHeight: 58, paddingHorizontal: 12 },
  backButton: { alignItems: "center", height: 40, justifyContent: "center", width: 40 },
  title: { color: "hsl(210, 15%, 14%)", flex: 1, fontSize: 17, fontWeight: "600" },
  pdf: { flex: 1 },
  feedback: { alignItems: "center", flex: 1, gap: 12, justifyContent: "center", padding: 24 },
  feedbackText: { color: "hsl(210, 8%, 42%)", fontSize: 16, textAlign: "center" }
});
