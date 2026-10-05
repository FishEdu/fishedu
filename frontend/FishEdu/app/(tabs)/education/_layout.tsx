import { Stack } from "expo-router";
import { useTheme } from "@/app/hooks/useTheme/useTheme";

export default function EducationLayout() {
  const { colors } = useTheme();
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background.app } }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="pdf" />
      <Stack.Screen name="video" />
      <Stack.Screen name="quiz" />
    </Stack>
  );
}
