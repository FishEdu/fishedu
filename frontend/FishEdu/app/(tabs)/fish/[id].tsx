import FishDetailsHeader from "@/app/components/FishDetails/FishDetailsHeader";
import FishSummary from "@/app/components/FishDetails/FishSummary";
import FishDetailSection from "@/app/components/FishDetails/FishDetailSection";
import FishProtectionInfo from "@/app/components/FishDetails/FishProtectionInfo";
import { normalizeParam, parseFishParam } from "@/app/utils/fish/parseFishParam";
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";
import { getTranslation } from "@/app/utils/translation/getTranslation";
import { Stack, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { ScrollView, StyleSheet } from "react-native";

type FishParams = { id: string; fish?: string };

export default function FishDetails() {
  const params = useLocalSearchParams<FishParams>();
  const { languageCode } = useLanguage();
  const fish = useMemo(() => parseFishParam(params.fish), [params.fish]);
  const fishId = Number(normalizeParam(params.id) ?? fish?.id);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ headerShown: false }} />
      <FishDetailsHeader />
      <FishSummary key={fishId} fish={fish} fishId={fishId} />
      {fish ? (
        <>
          <FishDetailSection title={getTranslation('fishDetails.occurrence', languageCode)}>

            {fish.feeding_places}
          </FishDetailSection>

          <FishDetailSection title={getTranslation('fishDetails.appearance', languageCode)}>
            {fish.appearance}
          </FishDetailSection>

          <FishDetailSection title={getTranslation('fishDetails.preferences', languageCode)}>
            {fish.preferences}
          </FishDetailSection>

          <FishDetailSection title={getTranslation('fishDetails.handling', languageCode)}>
            {fish.handling}
          </FishDetailSection>

          <FishProtectionInfo fish={fish} />
        </>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "hsl(180, 5%, 96%)",
  },
  content: {
    gap: 14,
    padding: 16,
    paddingBottom: 32,
  },
});
