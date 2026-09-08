import { FishGetResponse } from "@/app/api/fish";
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";
import { getTranslation } from "@/app/utils/translation/getTranslation";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const FAVORITE_FISH_IDS_KEY = "favoriteFishIds";

type FishParams = {
  id: string;
  fish?: string;
};

type DetailSectionProps = {
  title: string;
  children: string | string[];
  icon: keyof typeof Ionicons.glyphMap;
};

const normalizeParam = (param?: string | string[]) =>
  Array.isArray(param) ? param[0] : param;

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
};

function DetailSection({
  title,
  children,
  icon,
}: DetailSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const content = Array.isArray(children)
    ? children.filter(Boolean)
    : [children];

  return (
    <View style={styles.sectionCard}>
      <Pressable
        onPress={() => setIsOpen((current) => !current)}
        style={styles.sectionHeader}
      >
        <View style={styles.sectionIconContainer}>
          <Ionicons
            name={icon}
            size={28}
            color="hsl(210, 35%, 35%)"
          />
        </View>

        <Text style={styles.sectionTitle}>
          {title}
        </Text>

        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={24}
          color="hsl(0, 0%, 45%)"
        />
      </Pressable>

      {isOpen && (
        <View style={styles.sectionContent}>
          {content.map((paragraph, index) => (
            <Text
              key={`${title}-${index}`}
              style={styles.sectionText}
            >
              {paragraph}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

export default function FishDetails() {
  const params = useLocalSearchParams<FishParams>();
  const { languageCode } = useLanguage();

  const fish = useMemo(
    () => parseFishParam(params.fish),
    [params.fish]
  );

  const [isFavorite, setIsFavorite] = useState(false);

  const fishId = Number(
    normalizeParam(params.id) ?? fish?.id
  );

  useEffect(() => {
    const loadFavorite = async () => {
      const rawFavoriteIds = await AsyncStorage.getItem(
        FAVORITE_FISH_IDS_KEY
      );

      const favoriteIds = rawFavoriteIds
        ? (JSON.parse(rawFavoriteIds) as number[])
        : [];

      setIsFavorite(favoriteIds.includes(fishId));
    };

    if (!Number.isNaN(fishId)) {
      loadFavorite();
    }
  }, [fishId]);

  const toggleFavorite = async () => {
    const rawFavoriteIds = await AsyncStorage.getItem(
      FAVORITE_FISH_IDS_KEY
    );

    const favoriteIds = rawFavoriteIds
      ? (JSON.parse(rawFavoriteIds) as number[])
      : [];

    const nextFavoriteIds = favoriteIds.includes(fishId)
      ? favoriteIds.filter((id) => id !== fishId)
      : [...favoriteIds, fishId];

    await AsyncStorage.setItem(
      FAVORITE_FISH_IDS_KEY,
      JSON.stringify(nextFavoriteIds)
    );

    setIsFavorite(nextFavoriteIds.includes(fishId));
  };

  const protectionLength = fish
    ? `${fish.min_protection_length} - ${
        fish.max_protection_length
          ? fish.max_protection_length
          : getTranslation(
              "fishDetails.protectionLength.none",
              languageCode
            )
      }`
    : "";

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
    >
      <Stack.Screen options={{ headerShown: false }} />

      {/* PRZYCISK POWROTU */}
      <Pressable
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <Ionicons
          name="chevron-back"
          size={24}
          color="hsl(0, 0%, 100%)"
        />

        <Text style={styles.backButtonText}>
          {getTranslation(
            "fishDetails.back",
            languageCode
          )}
        </Text>
      </Pressable>

      {!fish ? (
        <>
          <View style={styles.heroImageContainer}>
            <Image
              source={require("../../../assets/images/fish.jpg")}
              alt="Fish image"
              style={styles.heroImage}
            />
          </View>

          <View style={styles.mainCard}>
            <Text style={styles.emptyText}>
              {getTranslation(
                "fishDetails.noFishData",
                languageCode
              )}
            </Text>
          </View>
        </>
      ) : (
        <>
          {/* ZDJĘCIE + NAZWA + ULUBIONE */}
          <View style={styles.heroImageContainer}>
            <Image
              source={require("../../../assets/images/fish.jpg")}
              alt="Fish image"
              style={styles.heroImage}
            />

            {/* DELIKATNE PRZYCIEMNIENIE DOLNEJ CZĘŚCI ZDJĘCIA */}
            <View style={styles.imageOverlay} />

            {/* NAZWA RYBY */}
            <Text style={styles.fishName}>
              {fish.name}
            </Text>

            {/* GWIAZDKA */}
            <Pressable
              onPress={toggleFavorite}
              style={styles.favoriteButton}
              accessibilityRole="button"
              accessibilityLabel={getTranslation(
                "fishDetails.favorite",
                languageCode
              )}
            >
              <Ionicons
                name={
                  isFavorite
                    ? "star"
                    : "star-outline"
                }
                size={34}
                color="hsl(50, 96%, 49%)"
              />
            </Pressable>
          </View>

          {/* GŁÓWNA KARTA Z INFORMACJAMI */}
          <View style={styles.mainCard}>

            {/* OPIS */}
            <View style={styles.infoBlock}>
              <Text style={styles.infoTitle}>
                {getTranslation(
                  "fish.description",
                  languageCode
                )}
              </Text>

              <Text style={styles.description}>
                {fish.description}
              </Text>
            </View>

            {/* WYSTĘPOWANIE */}
            <View style={styles.infoBlock}>
              <Text style={styles.infoTitle}>
                {getTranslation(
                  "fishDetails.occurrence",
                  languageCode
                )}
              </Text>

              <Text style={styles.description}>
                {fish.feeding_places}
              </Text>
            </View>

            {/* WYGLĄD */}
            <View style={styles.infoBlock}>
              <Text style={styles.infoTitle}>
                {getTranslation(
                  "fishDetails.appearance",
                  languageCode
                )}
              </Text>

              <Text style={styles.description}>
                {fish.appearance}
              </Text>
            </View>
          </View>

          {/* PREFERENCJE */}
          <DetailSection
            title={getTranslation(
              "fishDetails.preferences",
              languageCode
            )}
            icon="fish-outline"
          >
            {fish.preferences}
          </DetailSection>

          {/* SPOSÓB OBCHODZENIA SIĘ */}
          <DetailSection
            title={getTranslation(
              "fishDetails.handling",
              languageCode
            )}
            icon="hand-left-outline"
          >
            {fish.handling}
          </DetailSection>

          {/* OCHRONA W POLSCE */}
          <DetailSection
            title={getTranslation(
              "fishDetails.protectionInPoland",
              languageCode
            )}
            icon="shield-checkmark-outline"
          >
            {[
              `${getTranslation(
                "fishDetails.protectionLength",
                languageCode
              )}: ${protectionLength}`,

              `${getTranslation(
                "fishSearch.endangered",
                languageCode
              )}: ${
                fish.is_endangered
                  ? getTranslation(
                      "common.yes",
                      languageCode
                    )
                  : getTranslation(
                      "common.no",
                      languageCode
                    )
              }`,
            ]}
          </DetailSection>
        </>
      )}
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

  /* POWRÓT */

  backButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "hsl(226, 75%, 59%)",
    borderRadius: 20,
    flexDirection: "row",
    gap: 2,
    paddingBlock: 7,
    paddingInline: 14,
  },

  backButtonText: {
    color: "hsl(0, 0%, 100%)",
    fontSize: 16,
    fontWeight: "500",
  },

  /* ZDJĘCIE */

  heroImageContainer: {
    borderRadius: 16,
    height: 200,
    marginTop: 8,
    overflow: "hidden",
    position: "relative",
    width: "100%",
  },

  heroImage: {
    height: "100%",
    width: "100%",
  },

  /*
   * Delikatne przyciemnienie dolnej części zdjęcia.
   * Dzięki temu biały napis "Pstrąg" jest dobrze widoczny.
   */
  imageOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.18)",
    bottom: 0,
    height: 60,
    left: 0,
    position: "absolute",
    right: 0,
  },


  fishName: {
    bottom: 10,
    color: "hsl(0, 0%, 100%)",
    fontSize: 36,
    fontWeight: "700",
    left: 20,
    position: "absolute",
    textShadowColor: "rgba(0, 0, 0, 0.35)",
    textShadowOffset: {
      width: 1,
      height: 2,
    },
    textShadowRadius: 4,
  },


  favoriteButton: {
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    position: "absolute",
    right: 16,
    bottom: 12,
    width: 48,
  },

  /* GŁÓWNA KARTA */

  mainCard: {
    backgroundColor: "hsl(0, 0%, 100%)",
    borderRadius: 16,
    gap: 6,
    padding: 18,
  },

  infoBlock: {
    gap: 4,
    marginTop: 6,
  },

  infoTitle: {
    color: "hsl(0, 0%, 10%)",
    fontSize: 18,
    fontWeight: "700",
  },

  description: {
    color: "hsl(0, 0%, 18%)",
    fontSize: 16,
    lineHeight: 21,
  },

  /* SEKCJE ROZWIJANE */

  sectionCard: {
    backgroundColor: "hsl(0, 0%, 100%)",
    borderRadius: 16,
    padding: 16,
  },

  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
  },

  sectionIconContainer: {
    alignItems: "center",
    backgroundColor: "hsl(205, 55%, 94%)",
    borderRadius: 28,
    height: 42,
    justifyContent: "center",
    width: 42,
  },

  sectionTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: "700",
  },

  sectionContent: {
    gap: 10,
    marginLeft: 66,
    marginTop: 14,
  },

  sectionText: {
    color: "hsl(0, 0%, 22%)",
    fontSize: 15,
    lineHeight: 20,
  },

  emptyText: {
    fontSize: 16,
  },
});