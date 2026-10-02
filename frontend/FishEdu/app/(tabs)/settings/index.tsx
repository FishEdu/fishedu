import BaseDropdownMenu from "@/app/components/Settings/Dropdown";
import Container from "@/app/components/ui/Container";
import { StyleSheet, Switch, Text, View } from "react-native";
import { AppColors } from "@/app/constants/theme";
import { useTheme } from "@/app/hooks/useTheme/useTheme";
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";
import { getTranslation } from "@/app/utils/translation/getTranslation";


export enum LanguageCode {
  PL = 'pl',
  EN = 'en',
}

export const LanguageLabels: Record<LanguageCode, string> = {
  [LanguageCode.PL]: 'Polski',
  [LanguageCode.EN]: 'English',
}

export default function Settings() {
  const { colors, mode, setMode } = useTheme();
  const { languageCode } = useLanguage();
  const styles = createStyles(colors);
  return (
    <Container>
      <View
        style={styles.container}
      >
        <View style={styles.optionContainer}>
          <BaseDropdownMenu
            buttonText='Choose language'
            menuItems={
              LanguageLabels
            }
          />
        </View>
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
      </View>
    </Container>
  )
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.app,
    minHeight: '100%',
    paddingBlock: 16,
    paddingInline: 8,
    gap: 20,
  },
  optionContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'flex-end',
    gap: 4,
  },
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
})
