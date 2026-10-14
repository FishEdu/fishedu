import { AppColors } from "@/app/constants/theme";
import { useTheme } from "@/app/hooks/useTheme/useTheme";
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";
import { getTranslation } from "@/app/utils/translation/getTranslation";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export type EducationTab = "all" | "video" | "pdf" | "course" | "quiz";

const tabs: EducationTab[] = ["all", "video", "pdf", "course", "quiz"];

const tabTranslationKeys = {
  all: "education.tab.all",
  video: "education.tab.video",
  pdf: "education.tab.pdf",
  course: "education.tab.course",
  quiz: "education.tab.quiz",
} as const;

type Props = { value: EducationTab; onChange: (type: EducationTab) => void };

export default function EducationTypeTabs({ value, onChange }: Props) {
  const { colors } = useTheme();
  const { language } = useLanguage();
  const styles = createStyles(colors);
  return (
    <View style={styles.tabArea}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabScroll}
        contentContainerStyle={styles.tabList}
      >
        {tabs.map(item => (
          <Pressable
            key={item}
            onPress={() => onChange(item === "all" || value === item ? "all" : item)}
            style={[styles.tabButton, value === item && styles.tabButtonActive]}
          >
            <Text style={[styles.tabText, value === item && styles.tabTextActive]}>{getTranslation(tabTranslationKeys[item], language)}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  tabArea: { minHeight: 43, overflow: "visible", position: "relative", zIndex: 1 },
  tabScroll: { flexGrow: 0, overflow: "visible" },
  tabList: { alignItems: "flex-start", gap: 26, paddingBottom: 4 },
  tabButton: { alignSelf: "flex-start", borderBottomColor: "transparent", borderBottomWidth: 3, height: 39, justifyContent: "center" },
  tabButtonActive: { borderBottomColor: colors.primary },
  tabText: { color: colors.text.main, fontSize: 15, fontWeight: "600" },
  tabTextActive: { fontWeight: "700" },
});
