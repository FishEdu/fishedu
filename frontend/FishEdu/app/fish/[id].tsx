
import { FishGetResponse } from "@/app/api/fish";
import { AppColors } from "@/app/constants/theme";
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";
import { useTheme } from "@/app/hooks/useTheme/useTheme";
import { useFavorites } from "@/app/hooks/useFavorites/useFavorites";
import { getTranslation } from "@/app/utils/translation/getTranslation";

import Ionicons from "@expo/vector-icons/Ionicons";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";

import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

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

// SEKCJA ROZWIJANA
function DetailSection({
  title,
  children,
  icon,
}: DetailSectionProps) {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [isOpen, setIsOpen] = useState(false);

  const content = Array.isArray(children)
    ? children.filter(Boolean)
    : [children];

  return (
    <View style={styles.sectionCard}>
      <Pressable
        onPress={() => setIsOpen(current => !current)}
        style={styles.sectionHeader}
      >
        <View style={styles.sectionIconContainer}>
          <Ionicons
            name={icon}
            size={28}
            color={colors.primary}
          />
        </View>

        <Text style={styles.sectionTitle}>
          {title}
        </Text>

        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={24}
          color={colors.text.muted}
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

// SZCZEGÓŁY RYBY
export default function FishDetails() {
  const params = useLocalSearchParams<FishParams>();

  const { languageCode } = useLanguage();
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const fish = useMemo(
    () => parseFishParam(params.fish),
    [params.fish]
  );

  const fishId = Number(
    normalizeParam(params.id) ?? fish?.id
  );

  // NOWY SYSTEM ULUBIONYCH
  // Zapis lokalny + synchronizacja z backendem
  const {
    favorites,
    ready,
    toggleFavorite,
  } = useFavorites();

  const isFavorite = favorites.fish_ids.includes(fishId);

  const canToggleFavorite =
    ready &&
    Number.isSafeInteger(fishId) &&
    fishId > 0;

  const handleToggleFavorite = async () => {
    if (!canToggleFavorite) return;

    await toggleFavorite("fish", fishId);
  };

  // WYMIARY OCHRONNE
  const minProtectionLength =
    `${getTranslation(
      "fishDetails.minProtectionLength",
      languageCode
    )}${
      fish?.minProtectionLength != null
        ? `${fish.minProtectionLength} cm`
        : getTranslation(
            "fishDetails.protectionLength.none",
            languageCode
          )
    }`;

  const maxProtectionLength =
    `${getTranslation(
      "fishDetails.maxProtectionLength",
      languageCode
    )}${
      fish?.maxProtectionLength != null
        ? `${fish.maxProtectionLength} cm`
        : getTranslation(
            "fishDetails.protectionLength.none",
            languageCode
          )
    }`;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
    >
      <Stack.Screen options={{ headerShown: false }} />

      {/* POWRÓT */}
      <Pressable
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <Ionicons
          name="chevron-back"
          size={20}
          color={colors.primary}
        />

        <Text style={styles.backButtonText}>
          {getTranslation("common.back", languageCode)}
        </Text>
      </Pressable>

      {!fish ? (
        <>
          <View style={styles.heroImageContainer}>
            <Image
              source={require("../../assets/images/fish.jpg")}
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
              source={require("../../assets/images/fish.jpg")}
              alt="Fish image"
              style={styles.heroImage}
            />

            {/* PRZYCIEMNIENIE ZDJĘCIA */}
            <View style={styles.imageOverlay} />

            {/* NAZWA RYBY */}
            <Text style={styles.fishName}>
              {fish.name}
            </Text>

            {/* GWIAZDKA - NOWY SYSTEM */}
            <Pressable
              onPress={() => {
                void handleToggleFavorite();
              }}
              disabled={!canToggleFavorite}
              style={[
                styles.favoriteButton,
                !canToggleFavorite && { opacity: 0.5 },
              ]}
              accessibilityRole="button"
              accessibilityState={{
                selected: isFavorite,
                disabled: !canToggleFavorite,
              }}
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
                color={colors.favorite}
              />
            </Pressable>
          </View>

          {/* GŁÓWNA KARTA Z INFORMACJAMI */}
          <View style={styles.mainCard}>

            {/* OPIS */}
            <View style={styles.infoBlock}>
              <Text style={styles.infoTitle}>
                {getTranslation(
                  "common.description",
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
                {fish.feedingPlaces}
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
              minProtectionLength,
              maxProtectionLength,
              `${getTranslation(
                "fishSearch.endangered",
                languageCode
              )}: ${
                fish.isEndangered
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

// STYLE - JASNY I CIEMNY MOTYW
const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background.app,
    },

    content: {
      gap: 14,
      padding: 16,
      paddingBottom: 32,
    },

    // POWRÓT
    backButton: {
      alignItems: "center",
      alignSelf: "flex-start",
      flexDirection: "row",
      gap: 2,
      paddingTop: 34,
      paddingEnd: 8,
    },

    backButtonText: {
      color: colors.primary,
      fontSize: 18,
      fontWeight: "600",
    },

    // ZDJĘCIE
    heroImageContainer: {
      borderRadius: 16,
      height: 280,
      marginTop: 8,
      overflow: "hidden",
      position: "relative",
      width: "100%",
    },

    heroImage: {
      height: "100%",
      width: "100%",
    },

    imageOverlay: {
      backgroundColor: colors.background.overlay,
      bottom: 0,
      height: 60,
      left: 0,
      position: "absolute",
      right: 0,
    },

    // NAZWA RYBY
    fishName: {
      bottom: 10,
      color: colors.text.onPrimary,
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

    // ULUBIONE
    favoriteButton: {
      alignItems: "center",
      backgroundColor: colors.background.overlay,
      borderRadius: 24,
      height: 48,
      justifyContent: "center",
      position: "absolute",
      right: 16,
      bottom: 12,
      width: 48,
    },

    // GŁÓWNA KARTA
    mainCard: {
      backgroundColor: colors.background.card,
      borderRadius: 16,
      gap: 6,
      padding: 18,
    },

    infoBlock: {
      gap: 8,
      marginTop: 8,
    },

    infoTitle: {
      color: colors.text.main,
      fontSize: 18,
      fontWeight: "700",
    },

    description: {
      color: colors.text.main,
      fontSize: 16,
      lineHeight: 21,
    },

    // SEKCJE ROZWIJANE
    sectionCard: {
      backgroundColor: colors.background.card,
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
      backgroundColor: colors.background.primarySoft,
      borderRadius: 28,
      height: 42,
      justifyContent: "center",
      width: 42,
    },

    sectionTitle: {
      color: colors.text.main,
      flex: 1,
      fontSize: 22,
      fontWeight: "700",
    },

    sectionContent: {
      gap: 10,
      marginLeft: 57,
      marginTop: 16,
    },

    sectionText: {
      color: colors.text.main,
      fontSize: 15,
      lineHeight: 20,
    },

    emptyText: {
      color: colors.text.muted,
      fontSize: 16,
    },
  });
