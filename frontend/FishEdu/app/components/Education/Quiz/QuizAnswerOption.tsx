import { AppColors } from "@/app/constants/theme";
import { useTheme } from "@/app/hooks/useTheme/useTheme";
import { EducationQuiz } from "@/app/api/education";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  option: EducationQuiz["questions"][number]["options"][number];
  selected: boolean;
  onPress: () => void;
};

export default function QuizAnswerOption({ option, selected, onPress }: Props) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={[styles.option, selected && styles.optionSelected]}
    >
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected ? <View style={styles.radioDot} /> : null}
      </View>
      <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{option.content}</Text>
    </Pressable>

  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  option: { alignItems: "center", borderColor: colors.badges.all.border, borderRadius: 8, borderWidth: 1, flexDirection: "row", gap: 12, minHeight: 54, paddingHorizontal: 14, paddingVertical: 10 },
  optionSelected: { backgroundColor: colors.background.primarySoft, borderColor: colors.primary },
  radio: { alignItems: "center", borderColor: colors.text.muted, borderRadius: 10, borderWidth: 1, height: 20, justifyContent: "center", width: 20 },
  radioSelected: { borderColor: colors.primary },
  radioDot: { backgroundColor: colors.primary, borderRadius: 5, height: 10, width: 10 },
  optionText: { color: colors.text.main, flex: 1, fontSize: 16, lineHeight: 22 },
  optionTextSelected: { color: colors.primary, fontWeight: "600" },
});
