import { useEffect, useMemo, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { FishGetResponse } from "@/app/utils/fetch/fish/fetchFish";
import { getTranslation } from "@/app/utils/translation/getTranslation";
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";

const FAVORITE_FISH_IDS_KEY = "favoriteFishIds";

type FishParams = {
  id: string;
  fish?: string;
}

type DetailSectionProps = {
  title: string;
  children: string | string[];
}

const normalizeParam = (param?: string | string[]) => (
  Array.isArray(param) ? param[0] : param
)

const parseFishParam = (param?: string | string[]) => {
  const rawFish = normalizeParam(param);

  if (!rawFish) {
    return undefined;
  }

  try {
    return JSON.parse(rawFish) as FishGetResponse;
  } catch {
    return undefined;
  }
}

function DetailSection({ title, children }: DetailSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const content = Array.isArray(children) ? children.filter(Boolean) : [children];

  return (
    <View style={styles.sectionCard}>
      <Pressable
        onPress={() => setIsOpen((current) => !current)}
        style={styles.sectionHeader}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={24}
          color="hsl(0, 0%, 45%)"
        />
      </Pressable>

      {isOpen && (
        <View style={styles.sectionContent}>
          {content.map((paragraph, index) => (
            <Text key={`${title}-${index}`} style={styles.sectionText}>
              {paragraph}
            </Text>
          ))}
        </View>
      )}
    </View>
  )
}

export default function FishDetails() {
  const params = useLocalSearchParams<FishParams>();
  const { languageCode } = useLanguage();
  const fish = useMemo(() => parseFishParam(params.fish), [params.fish]);
  const [isFavorite, setIsFavorite] = useState(false);
  const fishId = Number(normalizeParam(params.id) ?? fish?.id);

  useEffect(() => {
    const loadFavorite = async () => {
      const rawFavoriteIds = await AsyncStorage.getItem(FAVORITE_FISH_IDS_KEY);
      const favoriteIds = rawFavoriteIds ? JSON.parse(rawFavoriteIds) as number[] : [];
      setIsFavorite(favoriteIds.includes(fishId));
    }

    if (!Number.isNaN(fishId)) {
      loadFavorite();
    }
  }, [fishId]);

  const toggleFavorite = async () => {
    const rawFavoriteIds = await AsyncStorage.getItem(FAVORITE_FISH_IDS_KEY);
    const favoriteIds = rawFavoriteIds ? JSON.parse(rawFavoriteIds) as number[] : [];
    const nextFavoriteIds = favoriteIds.includes(fishId)
      ? favoriteIds.filter((id) => id !== fishId)
      : [...favoriteIds, fishId];

    await AsyncStorage.setItem(FAVORITE_FISH_IDS_KEY, JSON.stringify(nextFavoriteIds));
    setIsFavorite(nextFavoriteIds.includes(fishId));
  }

  const protectionLength = fish
    ? `${fish.min_protection_length} - ${fish.max_protection_length ? fish.max_protection_length : getTranslation('fishDetails.protectionLength.none', languageCode)}`
    : "";

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ headerShown: false }} />

      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={24} color="hsl(0, 0%, 100%)" />
        <Text style={styles.backButtonText}>
          {getTranslation('fishDetails.back', languageCode)}
        </Text>
      </Pressable>

      <Image
        source={require("../../../assets/images/fish.jpg")}
        alt="Fish image"
        style={styles.heroImage}
      />

      {!fish ? (
        <View style={styles.mainCard}>
          <Text style={styles.emptyText}>
            {getTranslation('fishDetails.noFishData', languageCode)}
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.mainCard}>
            <View style={styles.titleRow}>
              <Text style={styles.fishName}>{fish.name}</Text>
              <Pressable
                onPress={toggleFavorite}
                style={styles.favoriteButton}
                accessibilityRole="button"
                accessibilityLabel={getTranslation('fishDetails.favorite', languageCode)}
              >
                <Ionicons
                  name={isFavorite ? "star" : "star-outline"}
                  size={34}
                  color="hsl(0, 0%, 0%)"
                />
              </Pressable>
            </View>

            <Text style={styles.description}>
              {fish.description}
            </Text>
          </View>

          <DetailSection title={getTranslation('fishDetails.occurrence', languageCode)}>
            {fish.feeding_places}
          </DetailSection>

          <DetailSection title={getTranslation('fishDetails.appearance', languageCode)}>
            {fish.appearance}
          </DetailSection>

          <DetailSection title={getTranslation('fishDetails.preferences', languageCode)}>
            {fish.preferences}
          </DetailSection>

          <DetailSection title={getTranslation('fishDetails.handling', languageCode)}>
            {fish.handling}
          </DetailSection>

          <DetailSection title={getTranslation('fishDetails.protectionInPoland', languageCode)}>
            {[
              `${getTranslation('fishDetails.protectionLength', languageCode)}: ${protectionLength}`,
              `${getTranslation('fishSearch.endangered', languageCode)}: ${
                fish.is_endangered
                  ? getTranslation('common.yes', languageCode)
                  : getTranslation('common.no', languageCode)
              }`,
            ]}
          </DetailSection>
        </>
      )}
    </ScrollView>
  )
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
  backButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "hsl(226, 75%, 59%)",
    borderRadius: 24,
    flexDirection: "row",
    gap: 4,
    paddingBlock: 10,
    paddingInline: 20,
  },
  backButtonText: {
    color: "hsl(0, 0%, 100%)",
    fontSize: 18,
    fontWeight: 500,
  },
  heroImage: {
    borderRadius: 16,
    height: 160,
    marginTop: 28,
    width: "100%",
  },
  mainCard: {
    backgroundColor: "hsl(0, 0%, 100%)",
    borderRadius: 16,
    gap: 6,
    padding: 14,
  },
  titleRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
  fishName: {
    flex: 1,
    fontSize: 40,
    fontWeight: 700,
  },
  favoriteButton: {
    alignItems: "center",
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  description: {
    color: "hsl(0, 0%, 18%)",
    fontSize: 16,
    lineHeight: 21,
  },
  sectionCard: {
    backgroundColor: "hsl(0, 0%, 100%)",
    borderRadius: 16,
    padding: 16,
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: 700,
  },
  sectionContent: {
    gap: 10,
    marginTop: 10,
  },
  sectionText: {
    color: "hsl(0, 0%, 22%)",
    fontSize: 15,
    lineHeight: 20,
  },
  emptyText: {
    fontSize: 16,
  },
})
