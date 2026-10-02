import { Stack, DefaultTheme, ThemeProvider as NavigationThemeProvider } from "expo-router";
import { LanguageProvider } from "./hooks/useLanguage/LanguageProvider";
import { ThemeProvider } from "./hooks/useTheme/ThemeProvider";
import { useTheme } from "./hooks/useTheme/useTheme";
import { StatusBar } from "expo-status-bar";

function Navigation() {
  const { colors, mode } = useTheme();
  const navigationTheme = {
    ...DefaultTheme,
    dark: mode === "dark",
    colors: {
      ...DefaultTheme.colors,
      primary: colors.primary,
      background: colors.background.app,
      card: colors.background.card,
      text: colors.text.main,
      border: colors.border.card,
      notification: colors.danger,
    },
  };
  return (
    <NavigationThemeProvider value={navigationTheme}>
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <Stack screenOptions={{
        contentStyle: { backgroundColor: colors.background.app },
        headerStyle: { backgroundColor: colors.background.card },
        headerTintColor: colors.primary,
        headerTitleStyle: { color: colors.text.main },
      }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <Navigation />
      </ThemeProvider>
    </LanguageProvider>
  ) 
}
