import { AppColors } from "@/app/constants/theme";
import { useTheme } from "@/app/hooks/useTheme/useTheme";
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";
import { getTranslation } from "@/app/utils/translation/getTranslation";
import { EducationLevel } from "@/app/api/education";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";

const levels: EducationLevel[] = ["beginner", "advanced"];
const levelTranslationKeys = {
  beginner: "education.level.beginner",
  advanced: "education.level.advanced",
} as const;

type Props = { value: EducationLevel | "all"; onChange: (level: EducationLevel | "all") => void };

export default function EducationLevelFilters({ value, onChange }: Props) {
  const { colors } = useTheme();
  const { language } = useLanguage();
  const styles = createStyles(colors);
  return (
    <View style={styles.levelSection}>
      <Text style={styles.levelTitle}>{getTranslation("education.level.title", language)}</Text>
      <View style={styles.levelSelector}>
        {levels.map(item => (
          <Pressable
            key={item}
            onPress={() => onChange(value === item ? "all" : item)}
            style={[
              styles.levelButton,
              value === item && item === "beginner" && styles.levelButtonBeginnerActive,
              value === item && item === "advanced" && styles.levelButtonAdvancedActive,
            ]}
          >
            {value === item ? (
              <Ionicons name="close" size={13} color={colors.badges[item].text} />
            ) : <View style={styles.levelDot} />}
            <Text
              style={[
                styles.levelText,
                value === item && item === "beginner" && styles.levelTextBeginnerActive,
                value === item && item === "advanced" && styles.levelTextAdvancedActive,
              ]}
            >
              {getTranslation(levelTranslationKeys[item], language)}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  levelSection: { gap: 8 },
  levelTitle: { color: colors.text.main, fontSize: 14, fontWeight: "700" },
  levelSelector: { flexDirection: "row", gap: 8 },
  levelButton: { alignItems: "center", backgroundColor: colors.background.card, borderColor: colors.badges.all.border, borderRadius: 16, borderWidth: 1, flexDirection: "row", gap: 4, paddingHorizontal: 10, paddingVertical: 6 },
  levelButtonBeginnerActive: { backgroundColor: colors.badges.beginner.background, borderColor: colors.badges.beginner.border },
  levelButtonAdvancedActive: { backgroundColor: colors.badges.advanced.background, borderColor: colors.badges.advanced.border },
  levelDot: { borderColor: colors.badges.all.border, borderRadius: 4, borderWidth: 1, height: 8, width: 8 },
  levelText: { color: colors.badges.all.text, fontSize: 13, fontWeight: "600" },
  levelTextBeginnerActive: { color: colors.badges.beginner.text },
  levelTextAdvancedActive: { color: colors.badges.advanced.text },
});
