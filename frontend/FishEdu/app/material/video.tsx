
import { AppColors } from "@/app/constants/theme";
import { useTheme } from "@/app/hooks/useTheme/useTheme";
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";
import { getTranslation } from "@/app/utils/translation/getTranslation";
import EducationVideoView from "@/app/components/Education/EducationVideoView";
import EducationMediaHeader from "@/app/components/Education/EducationMediaHeader";
import { useVideoURL } from "@/app/hooks/useVideoURL/useVideoURL";
import { goBackToEducationMaterial } from "@/app/utils/education/goBackToEducationMaterial";
import { useLocalSearchParams } from "expo-router";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EducationVideoPlayer() {
  const { colors } = useTheme();
  const { language } = useLanguage();
  const { title } = useLocalSearchParams<{ title: string }>();
  const url = useVideoURL();
  const styles = createStyles(colors);

  return (
    <SafeAreaView
      style={styles.screen}
      edges={["top"]}
    >
      <EducationMediaHeader
        title={
          title ||
          getTranslation("education.video.defaultTitle", language)
        }
        onBack={goBackToEducationMaterial}
      />

      <EducationVideoView url={url} />
    </SafeAreaView>
  );
}

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background.app,
    },
  });
