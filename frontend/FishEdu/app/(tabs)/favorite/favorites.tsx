
import { AppColors } from "@/app/constants/theme";
import { useTheme } from "@/app/hooks/useTheme/useTheme";
import { useFavorites } from "@/app/hooks/useFavorites/useFavorites";
import type { FishGetResponse } from "@/app/api/fish";
import type { EducationMaterial } from "@/app/api/education";

import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getTranslation } from "@/app/utils/translation/getTranslation";
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";
import type { LanguageCode } from "@/app/constants/language";

// TYPY MATERIAŁÓW
type MaterialKind =
  | "pdf"
  | "course"
  | "quiz"
  | "guide"
  | "video"
  | "other";



// POBIERANIE ADRESU ZDJĘCIA
function getImageUrl(item: object): string | undefined {
  const data = item as Record<string, unknown>;

  const value =
    data.image_url ??
    data.imageUrl ??
    data.cover_url;

  return typeof value === "string" && value.length > 0
    ? value
    : undefined;
}

// ROZPOZNAWANIE RODZAJU MATERIAŁU


 // ROZPOZNAWANIE RODZAJU MATERIAŁU
function getMaterialKind(
  material: EducationMaterial
): MaterialKind {
  const data = material as unknown as Record<string, unknown>;

  const type = String(
    data.type ?? data.material_type ?? ""
  ).toLowerCase();

  if (type === "pdf" || type === "document") {
    return "pdf";
  }

  if (type === "course" || type === "kurs") {
    return "course";
  }

  if (type === "quiz") {
    return "quiz";
  }

  if (type === "guide" || type === "poradnik") {
    return "guide";
  }

  if (type === "video" || type === "film") {
    return "video";
  }

  return "other";
}

// NAZWA MATERIAŁU
function getMaterialTitle(
  material: EducationMaterial,
  languageCode: LanguageCode
) {
  const data = material as unknown as Record<string, unknown>;

  return String(
    data.title ??
    data.name ??
    `${getTranslation("favorites.materialFallback", languageCode)} #${material.id}`
  );
}


// EKRAN ZAPISANE
export default function FavoritesScreen() {
  const { colors } = useTheme();
  const { languageCode } = useLanguage();
  const styles = createStyles(colors);


    const materialGroups: {
      kind: MaterialKind;
      title: string;
    }[] = [
      {
        kind: "pdf",
        title: getTranslation("favorites.labels.pdf", languageCode),
      },
      {
        kind: "course",
        title: getTranslation("favorites.labels.course", languageCode),
      },
      {
        kind: "quiz",
        title: getTranslation("favorites.labels.quiz", languageCode),
      },
      {
        kind: "guide",
        title: getTranslation("favorites.labels.guide", languageCode),
      },
      {
        kind: "video",
        title: getTranslation("favorites.labels.video", languageCode),
      },
      {
        kind: "other",
        title: getTranslation("favorites.labels.other", languageCode),
      },
    ];


  const {
    favorites,
    loading,
    error,
    refresh,
  } = useFavorites();

  // ZAPISANE RYBY
  const savedFish = favorites.fish.filter(
    fish => favorites.fish_ids.includes(fish.id)
  );

  // ZAPISANE MATERIAŁY
  const savedMaterials = favorites.materials.filter(
    material =>
      favorites.material_ids.includes(material.id)
  );

  const hasFavorites =
    favorites.fish_ids.length > 0 ||
    favorites.material_ids.length > 0;

  // OTWIERANIE SZCZEGÓŁÓW RYBY
  const openFish = (fish: FishGetResponse) => {
    router.push({
      pathname: "/fish/[id]",
      params: {
        id: String(fish.id),
        fish: JSON.stringify(fish),
      },
    });
  };



    const openMaterial = (material: EducationMaterial) => {
    router.push({
        pathname: "/material/[id]",
        params: {
        id: String(material.id),
        },
    });
    };


  // POWRÓT DO STRONY GŁÓWNEJ
  const goHome = () => {
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView
      style={styles.screen}
      edges={["top"]}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* COFNIJ */}
        <Pressable
          onPress={goHome}
          style={styles.backButton}
          accessibilityRole="button"
        >
          <Ionicons
            name="chevron-back"
            size={22}
            color={colors.primary}
          />

          <Text style={styles.backText}>
            {getTranslation("common.back", languageCode)}
          </Text>
        </Pressable>

        {/* TYTUŁ */}
        <View style={styles.titleRow}>
          <Text style={styles.mainTitle}>
            {getTranslation("favorites.title", languageCode)}
          </Text>

          <Ionicons
            name="star"
            size={35}
            color={colors.favorite}
          />
        </View>

        {/* ŁADOWANIE */}
        {loading && !hasFavorites && (
          <ActivityIndicator
            color={colors.primary}
            size="large"
            style={styles.loader}
          />
        )}

        {/* BŁĄD SYNCHRONIZACJI */}
        {error && (
          <Pressable
            onPress={refresh}
            style={styles.errorBox}
          >
            <Ionicons
              name="cloud-offline-outline"
              size={20}
              color={colors.danger}
            />

            <Text style={styles.errorText}>
              {getTranslation("favorites.syncError", languageCode)}
              {" "}
              {getTranslation("favorites.retry", languageCode)}
            </Text>
          </Pressable>
        )}

        {/* PUSTA LISTA */}
        {!loading && !hasFavorites && (
          <View style={styles.emptyBox}>
            <Ionicons
              name="star-outline"
              size={52}
              color={colors.text.muted}
            />

            <Text style={styles.emptyTitle}>
              {getTranslation("favorites.emptyTitle", languageCode)}
            </Text>

            <Text style={styles.emptyText}>
              {getTranslation("favorites.emptyDescription", languageCode)}
            </Text>
          </View>
        )}

        {/* RYBY */}
        {savedFish.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
             {getTranslation("favorites.fish", languageCode)}
            </Text>

            <View style={styles.grid}>
              {savedFish.map(fish => {
                const imageUrl = getImageUrl(fish);

                return (
                  <Pressable
                    key={fish.id}
                    style={({ pressed }) => [
                      styles.gridItem,
                      pressed && styles.pressed,
                    ]}
                    onPress={() => openFish(fish)}
                    accessibilityRole="button"
                  >
                    <View style={styles.fishCircle}>
                      {imageUrl ? (
                        <Image
                          source={{ uri: imageUrl }}
                          style={styles.image}
                          resizeMode="cover"
                        />
                      ) : (
                        <Ionicons
                          name="fish-outline"
                          size={34}
                          color={colors.text.muted}
                        />
                      )}
                    </View>

                    <Text
                      style={styles.fishName}
                      numberOfLines={2}
                    >
                      {fish.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* PDF, KURSY, QUIZY, PORADNIKI, FILMY */}
        {materialGroups.map(group => {
          const items = savedMaterials.filter(
            material =>
              getMaterialKind(material) === group.kind
          );

          if (items.length === 0) {
            return null;
          }

          return (
            <View
              key={group.kind}
              style={styles.section}
            >
              <Text style={styles.sectionTitle}>
                {group.title}
              </Text>

              <View style={styles.grid}>
                {items.map(material => {
                  const imageUrl = getImageUrl(material);

                  return (
                    <Pressable
                      key={material.id}
                      onPress={() => openMaterial(material)}
                      accessibilityRole="button"
                      style={({ pressed }) => [
                        styles.gridItem,
                        pressed && styles.pressed,
                      ]}
                    >
                      <View
                        style={[
                          styles.materialCard,
                          group.kind === "pdf"
                            ? styles.pdfCard
                            : styles.courseCard,
                        ]}
                      >

                        {/* MINIATURKA MATERIAŁU */}
                        <View style={styles.materialThumbnail}>
                          {imageUrl ? (
                            <Image
                              source={{ uri: imageUrl }}
                              style={styles.thumbnailImage}
                              resizeMode="cover"
                            />
                          ) : (
                            <>
                              <Ionicons
                                name={
                                  group.kind === "quiz"
                                    ? "help-circle-outline"
                                    : group.kind === "video"
                                      ? "videocam-outline"
                                      : group.kind === "course"
                                        ? "school-outline"
                                        : "document-text-outline"
                                }
                                size={28}
                                color={colors.primary}
                              />

                              <Text style={styles.pdfLabel}>
                                
                              {group.kind === "quiz"
                                ? getTranslation("favorites.labels.quiz", languageCode)
                                : group.kind === "course"
                                  ? getTranslation("favorites.labels.course", languageCode)
                                  : group.kind === "video"
                                    ? getTranslation("favorites.labels.video", languageCode)
                                    : group.kind === "pdf"
                                      ? getTranslation("favorites.labels.pdf", languageCode)
                                      : getTranslation("favorites.labels.info", languageCode)}

                              </Text>
                            </>
                          )}
                        </View>

                        {/* TYTUŁ MATERIAŁU */}
                        <Text
                          style={styles.materialTitle}
                          numberOfLines={3}
                        >
                          {getMaterialTitle(material, languageCode)}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          );
        })}

        {/* NIEPEŁNE DANE OFFLINE */}
        {hasFavorites &&
          (savedFish.length < favorites.fish_ids.length ||
            savedMaterials.length <
              favorites.material_ids.length) && (
            <Text style={styles.infoText}>
              {getTranslation("favorites.offlineInfo", languageCode)}
            </Text>
          )}

      </ScrollView>
    </SafeAreaView>
  );
}

// STYLE JASNY / CIEMNY MOTYW
const createStyles = (colors: AppColors) =>
  StyleSheet.create({

    // EKRAN
    screen: {
      flex: 1,
      backgroundColor: colors.background.app,
    },

    scroll: {
      flex: 1,
    },

    content: {
      paddingHorizontal: 14,
      paddingTop: 12,
      paddingBottom: 36,
    },

    // COFNIJ
    backButton: {
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingVertical: 8,
      paddingHorizontal: 4,
      marginBottom: 18,
    },

    backText: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: "600",
    },

    // TYTUŁ
    titleRow: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 4,
      marginBottom: 18,
    },

    mainTitle: {
      fontSize: 32,
      fontWeight: "700",
      color: colors.text.main,
    },

    // SEKCJE
    section: {
      marginBottom: 24,
    },

    sectionTitle: {
      fontSize: 19,
      fontWeight: "700",
      color: colors.text.main,
      marginBottom: 13,
      marginLeft: 3,
    },

    // SIATKA - 3 ELEMENTY W RZĘDZIE
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      rowGap: 16,
    },

    gridItem: {
      width: "33.333%",
      alignItems: "center",
      paddingHorizontal: 5,
    },

    pressed: {
      opacity: 0.65,
    },

    // RYBY - OKRĄGŁE ZDJĘCIA
    fishCircle: {
      width: 82,
      height: 82,
      borderRadius: 41,
      backgroundColor: colors.background.card,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.border.card,
      justifyContent: "center",
      alignItems: "center",
    },

    image: {
      width: "100%",
      height: "100%",
    },

    fishName: {
      fontSize: 12,
      fontWeight: "500",
      color: colors.text.main,
      marginTop: 7,
      textAlign: "center",
    },

    // MATERIAŁY
    materialCard: {
      width: "100%",
      minHeight: 115,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.background.card,
      paddingHorizontal: 5,
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: colors.border.card,
    },

    pdfCard: {
      borderRadius: 3,
    },

    courseCard: {
      borderRadius: 16,
    },

    materialThumbnail: {
      width: 52,
      height: 48,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 7,
    },

    thumbnailImage: {
      width: "100%",
      height: "100%",
      borderRadius: 5,
    },

    pdfLabel: {
      fontSize: 9,
      fontWeight: "700",
      color: colors.text.muted,
    },

    materialTitle: {
      fontSize: 10,
      color: colors.text.main,
      textAlign: "center",
      lineHeight: 13,
    },

    // ŁADOWANIE
    loader: {
      marginTop: 40,
    },

    // BRAK ULUBIONYCH
    emptyBox: {
      alignItems: "center",
      marginTop: 65,
      paddingHorizontal: 20,
    },

    emptyTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text.main,
      marginTop: 14,
    },

    emptyText: {
      color: colors.text.muted,
      textAlign: "center",
      marginTop: 8,
      lineHeight: 20,
    },

    // BŁĘDY
    errorBox: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      backgroundColor: colors.background.dangerSoft,
      borderRadius: 10,
      padding: 12,
      marginBottom: 16,
    },

    errorText: {
      flex: 1,
      color: colors.danger,
      fontSize: 12,
    },

    // INFORMACJE
    infoText: {
      color: colors.text.muted,
      fontSize: 12,
      textAlign: "center",
      marginTop: 10,
      lineHeight: 18,
    },
  });
