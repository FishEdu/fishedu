import { Stack } from "expo-router";
import { LanguageProvider } from "./hooks/useLanguage/LangaugeProvider";
import { ThemeProvider } from "./hooks/useTheme/ThemeProvider";
import { useTheme } from "./hooks/useTheme/useTheme";

function AppNavigation() {
  const { colors } = useTheme();

  return (
    <Stack screenOptions={{ contentStyle: { backgroundColor: colors.background.app } }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }}></Stack.Screen>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppNavigation />
      </LanguageProvider>
    </ThemeProvider>
  ) 
}
