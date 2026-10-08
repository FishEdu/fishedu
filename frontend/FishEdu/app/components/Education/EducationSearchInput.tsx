import { AppColors } from "@/app/constants/theme";
import { useTheme } from "@/app/hooks/useTheme/useTheme";
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";
import { getTranslation } from "@/app/utils/translation/getTranslation";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, TextInput, View } from "react-native";

type Props = { value: string; onChangeText: (value: string) => void };

export default function EducationSearchInput({ value, onChangeText }: Props) {
  const { colors } = useTheme();
  const { language } = useLanguage();
  const styles = createStyles(colors);
  return (
    <View style={styles.search}>
      <Ionicons name="search" size={21} color={colors.text.main} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={getTranslation("education.search", language)}
        placeholderTextColor={colors.text.muted}
        selectionColor={colors.primary}
        style={styles.searchInput}
      />
    </View>
  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  search: {
    alignItems: "center",
    backgroundColor: colors.background.card,
    borderColor: colors.border.card,
    borderRadius: 14,
    borderWidth: 1,
    elevation: 1,
    flexDirection: "row",
    gap: 9,
    minHeight: 48,
    paddingHorizontal: 13,
    shadowColor: colors.background.photoOverlay,
    shadowOpacity: 0.06,
    shadowRadius: 6
  },
  searchInput: { color: colors.text.main, flex: 1, fontSize: 16, fontWeight: "600", paddingVertical: 10 },
});
