
import { Stack } from "expo-router";
import { useTheme } from "@/app/hooks/useTheme/useTheme";

export default function EducationLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.background.app,
        },
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
