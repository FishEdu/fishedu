import { Stack } from "expo-router";

export default function EducationLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="pdf" />
      <Stack.Screen name="video" />
      <Stack.Screen name="quiz" />
    </Stack>
  );
}
