import Ionicons from "@expo/vector-icons/Ionicons";
import { AppColors } from "@/app/constants/theme";
import { useTheme } from "@/app/hooks/useTheme/useTheme";
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";
import { getTranslation } from "@/app/utils/translation/getTranslation";
import { router, useLocalSearchParams } from "expo-router";
import { VideoView, useVideoPlayer } from "expo-video";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function EducationVideoPlayer() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const { language } = useLanguage();
  const { title, url } = useLocalSearchParams<{ title: string; url: string }>();
  const player = useVideoPlayer(url, videoPlayer => {
    videoPlayer.loop = false;
  });

  const goBackToMaterial = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace("/(tabs)/education");
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" onPress={goBackToMaterial} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.primary} />
        </Pressable>
        <Text numberOfLines={1} style={styles.title}>{title || getTranslation("education.video.defaultTitle", language)}</Text>
      </View>
      {url ? (
        <VideoView
          contentFit="contain"
          fullscreenOptions={{ enable: true }}
          nativeControls
          player={player}
          style={styles.video}
        />
      ) : (
        <View style={styles.feedback}>
          <Ionicons name="videocam-off-outline" size={38} color={colors.text.muted} />
          <Text style={styles.feedbackText}>{getTranslation("education.video.notFound", language)}</Text>
        </View>
      )}
    </View>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  screen: { backgroundColor: colors.background.app, flex: 1 },
  header: { alignItems: "center", backgroundColor: colors.background.card, borderBottomColor: colors.border.card, borderBottomWidth: 1, flexDirection: "row", gap: 8, minHeight: 58, paddingHorizontal: 12 },
  backButton: { alignItems: "center", height: 40, justifyContent: "center", width: 40 },
  title: { color: colors.text.main, flex: 1, fontSize: 17, fontWeight: "600" },
  video: { aspectRatio: 960 / 544, backgroundColor: colors.background.media, width: "100%" },
  feedback: { alignItems: "center", flex: 1, gap: 12, justifyContent: "center", padding: 24 },
  feedbackText: { color: colors.text.muted, fontSize: 16, textAlign: "center" },
});
