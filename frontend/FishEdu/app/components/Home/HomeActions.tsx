import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";
import { getTranslation } from "@/app/utils/translation/getTranslation";
import HomeActionCard from "./HomeActionCard";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function HomeActions() {
  const { language } = useLanguage();
  return (
    <View style={styles.buttonsContainer}>
      <HomeActionCard prominent icon="library" label={getTranslation("home.button.begginerGuide", language)} />
      <HomeActionCard icon="leaf" label={getTranslation("home.button.ecoTips", language)} onPress={() => router.push("../(screens)/ecoTips")} />
      <HomeActionCard icon="book" label={getTranslation("home.button.fishingMethods", language)} />
      <HomeActionCard icon="receipt" label={getTranslation("home.button.recipes", language)} onPress={() => router.push("/(screens)/recipes/search")} />
      <HomeActionCard icon="time" label={getTranslation("home.button.fishProtection", language)} />
      <HomeActionCard icon="star" label={getTranslation("home.button.saved", language)} />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonsContainer: {
    // flex: 1,
    flexDirection: 'row',
    flexGrow: 1,
    flexWrap: 'wrap',
    gap: 12
  },
});
