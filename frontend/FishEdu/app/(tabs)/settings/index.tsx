import Container from "@/app/components/ui/Container";
import LanguageSetting from "@/app/components/Settings/LanguageSetting";
import ThemeSetting from "@/app/components/Settings/ThemeSetting";
import { AppColors } from "@/app/constants/theme";
import { useTheme } from "@/app/hooks/useTheme/useTheme";
import { StyleSheet, View } from "react-native";

export default function Settings() {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return (
    <Container>
      <View style={styles.container}>
        <LanguageSetting />
        <ThemeSetting />
      </View>
    </Container>
  );
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
});
