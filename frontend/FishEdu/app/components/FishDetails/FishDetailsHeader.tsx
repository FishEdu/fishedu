import BackButton from "@/app/components/ui/BackButton";
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";
import { getTranslation } from "@/app/utils/translation/getTranslation";
import { router } from "expo-router";
import { Image, StyleSheet } from "react-native";

export default function FishDetailsHeader() {
  const { languageCode } = useLanguage();
  return (
    <>
      <BackButton variant="filled" label={getTranslation("fishDetails.back", languageCode)} onPress={() => router.back()} />
      <Image source={require("../../../assets/images/fish.jpg")} alt="Fish image" style={styles.heroImage} />
    </>
  );
}

const styles = StyleSheet.create({
  heroImage: {
    borderRadius: 16,
    height: 160,
    marginTop: 28,
    width: "100%",
  },
});
