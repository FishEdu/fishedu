import BaseDropdownMenu from "@/app/components/Settings/Dropdown";
import Container from "@/app/components/ui/Container";
import { AppColors } from "@/app/constants/theme";
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";
import { useTheme } from "@/app/hooks/useTheme/useTheme";
import { getTranslation } from "@/app/utils/translation/getTranslation";
import { StyleSheet, Switch, Text, View } from "react-native";


export enum LanguageCode {
  PL = 'pl',
  EN = 'en',
}

export const LanguageLabels: Record<LanguageCode, string> = {
  [LanguageCode.PL]: 'Polski',
  [LanguageCode.EN]: 'English',
}

export default function Settings() {
  const { language } = useLanguage();
  const { colors, mode, setMode } = useTheme();
  const styles = createStyles(colors);

  return (
    <Container>
      <View style={styles.container}>
        <View style={styles.optionContainer}>
          <View style={styles.themeRow}>
            <Text style={styles.themeText}>{getTranslation('settings.darkMode', language)}</Text>
            <Switch
              value={mode === "dark"}
              onValueChange={value => void setMode(value ? "dark" : "light")}
              thumbColor={colors.background.card}
              trackColor={{ false: colors.border.subtle, true: colors.primary }}
            />
          </View>
          <BaseDropdownMenu
            buttonText='Choose language'
            menuItems={
              LanguageLabels
            }
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
    paddingTop: 70,
    paddingBottom: 16,
    paddingInline: 8,
    alignItems: 'stretch'
  },
  title: {
    fontSize: 24,
    fontWeight: '600'
  },
  button: {
    backgroundColor: colors.background.card,
    fontSize: 32,
    marginLeft: 'auto'
  },
  optionContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16
  },
  themeRow: { alignItems: 'center', backgroundColor: colors.background.card, borderColor: colors.border.card, borderRadius: 8, borderWidth: 1, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10 },
  themeText: { color: colors.text.main, fontSize: 16, fontWeight: '600' },
})
