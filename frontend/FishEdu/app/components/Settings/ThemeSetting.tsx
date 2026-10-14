import { AppColors } from "@/app/constants/theme";
import { useTheme } from "@/app/hooks/useTheme/useTheme";
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";
import { getTranslation } from "@/app/utils/translation/getTranslation";
import { StyleSheet, Switch, Text, View } from "react-native";

export default function ThemeSetting() {
  const { colors, mode, setMode } = useTheme();
  const { languageCode } = useLanguage();
  const styles = createStyles(colors);
  return (
    <View style={styles.themeOption}>

      <Text style={styles.themeLabel}>{getTranslation('settings.darkMode', languageCode)}</Text>
      <Switch
        value={mode === 'dark'}
        onValueChange={enabled => void setMode(enabled ? 'dark' : 'light')}
        trackColor={{ false: colors.border.subtle, true: colors.primary }}
        thumbColor={colors.text.onPrimary}
        ios_backgroundColor={colors.border.subtle}
        accessibilityLabel={getTranslation('settings.darkMode', languageCode)}
      />
    </View>

  );
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  themeLabel: {
    color: colors.text.main,
    fontSize: 16,
    flexShrink: 1,
  },
});
