import { router } from "expo-router";

export const goBackToEducationMaterial = () => {
  if (router.canGoBack()) {
    router.back();
    return;
  }
  router.replace("/(tabs)/education");
};
