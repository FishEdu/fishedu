import { Stack } from "expo-router";
import { LanguageProvider } from "./hooks/useLanguage/LangaugeProvider";

export default function RootLayout() {
  return (
    <LanguageProvider>
      <Stack>
        <Stack.Screen name="(tabs)"></Stack.Screen>
      </Stack>
    </LanguageProvider>
  ) 
}
