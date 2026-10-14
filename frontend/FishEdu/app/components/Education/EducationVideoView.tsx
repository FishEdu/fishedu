import { AppColors } from "@/app/constants/theme";
import { useTheme } from "@/app/hooks/useTheme/useTheme";
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";
import { getTranslation } from "@/app/utils/translation/getTranslation";
import EducationFeedback from "./EducationFeedback";
import { VideoView, useVideoPlayer } from "expo-video";
import { StyleSheet } from "react-native";

export default function EducationVideoView({ url }: { url: string }) {
  const { colors } = useTheme();
  const { language } = useLanguage();
  const styles = createStyles(colors);
  const player = useVideoPlayer(url, videoPlayer => { videoPlayer.loop = false; });

  return url ? (
    <VideoView contentFit="contain" fullscreenOptions={{ enable: true }} nativeControls player={player} style={styles.video} />
  ) : (
    <EducationFeedback fullScreen={false} icon="videocam-off-outline" message={getTranslation("education.video.notFound", language)} />
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  video: { aspectRatio: 960 / 544, backgroundColor: colors.background.media, width: "100%" },
});
