import { FishGetResponse } from "@/app/api/fish";
import Container from "@/app/components/ui/Container";
import { AppColors } from "@/app/constants/theme";
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";
import { useTheme } from "@/app/hooks/useTheme/useTheme";
import FishList from "@components/FishSearch/FishList";
import FishSearchInput from "@components/FishSearch/FishSearchInput";
import { fetchFish } from "@utils/fetch/fish/fetchFish";
import { getTranslation } from "@utils/translation/getTranslation";
import { useFocusEffect } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useCallback, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

type EndangeredFilter = "all" | "endangered" | "notEndangered";

const filters: EndangeredFilter[] = ["all", "endangered", "notEndangered"];
const filterTranslationKeys = {
  all: "fishSearch.filter.all",
  endangered: "fishSearch.filter.endangered",
  notEndangered: "fishSearch.filter.notEndangered",
} as const;

export default function FishSearch() {
  const { language } = useLanguage()
  const { colors } = useTheme()
  const styles = createStyles(colors)
  const [ lastFishQuery, setLastFishQuery ] = useState<string>('')
  const [ fish, setFish ] = useState<FishGetResponse[]>([])
  const [ loading, setLoading ] = useState(true)
  const [endangeredFilter, setEndangeredFilter] = useState<EndangeredFilter>("all")
  const previousLanguage = useRef(language)
  const hasLoaded = useRef(false)

  const filteredFish = useMemo(() => {
    if (endangeredFilter === "all") return fish
    return fish.filter(item => endangeredFilter === "endangered" ? item.is_endangered : !item.is_endangered)
  }, [endangeredFilter, fish])

    useFocusEffect(
      useCallback(() => {
        let isActive = true

        const load = async () => {
          setLoading(true)

          const { fish } = await fetchFish()

          if (!isActive) return

          setFish(fish)
          previousLanguage.current = language
          hasLoaded.current = true
          setLoading(false)
        }

        if (previousLanguage.current !== language || !hasLoaded.current) {
          void load()
        }

        return () => {
          isActive = false
        }
      }, [language])
  )
  
  return (
    <Container>
      <View style={styles.page}>
        <FishSearchInput
          lastFishQuery={lastFishQuery}
          setLastFishQuery={setLastFishQuery}
          setFish={setFish} 
        />
        {loading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.feedback}>{getTranslation('common.loading', language)}</Text>
          </View>
        ) : fish.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="fish-outline" size={40} color={colors.text.muted} />
            <Text style={styles.feedback}>{getTranslation('fishSearch.fishNotFound', language)}</Text>
          </View>
        ) : (
          <>
            <View style={styles.filterList}>
              {filters.map(filter => {
                const isActive = endangeredFilter === filter
                return (
                  <Pressable
                    key={filter}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isActive }}
                    onPress={() => setEndangeredFilter(filter)}
                    style={[
                      styles.filter,
                      isActive && filter === "all" && styles.filterAllActive,
                      isActive && filter === "endangered" && styles.filterEndangeredActive,
                      isActive && filter === "notEndangered" && styles.filterNotEndangeredActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterText,
                        isActive && filter === "all" && styles.filterTextAllActive,
                        isActive && filter === "endangered" && styles.filterTextEndangeredActive,
                        isActive && filter === "notEndangered" && styles.filterTextNotEndangeredActive,
                      ]}
                    >
                      {getTranslation(filterTranslationKeys[filter], language)}
                    </Text>
                  </Pressable>
                )
              })}
            </View>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>{getTranslation('fishSearch.results', language)}</Text>
            </View>
            {filteredFish.length ? (
              <FishList fish={filteredFish} />
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="fish-outline" size={40} color={colors.text.muted} />
                <Text style={styles.feedback}>{getTranslation('fishSearch.fishNotFound', language)}</Text>
              </View>
            )}
          </>
        )}
      </View>
    </Container>
  )
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  page: { flex: 1, gap: 14, paddingTop: 100 },
  filterList: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  filter: { backgroundColor: colors.background.card, borderColor: colors.border.subtle, borderRadius: 16, borderWidth: 1, paddingHorizontal: 11, paddingVertical: 7 },
  filterAllActive: { backgroundColor: colors.background.primarySoft, borderColor: colors.primary },
  filterEndangeredActive: { backgroundColor: colors.background.dangerSoft, borderColor: colors.danger },
  filterNotEndangeredActive: { backgroundColor: colors.background.secondarySoft, borderColor: colors.secondary },
  filterText: { color: colors.text.muted, fontSize: 13, fontWeight: "600" },
  filterTextAllActive: { color: colors.primary },
  filterTextEndangeredActive: { color: colors.danger },
  filterTextNotEndangeredActive: { color: colors.secondary },
  resultsHeader: { marginTop: 2 },
  resultsTitle: { color: colors.text.main, fontSize: 18, fontWeight: "700" },
  loadingState: { alignItems: "center", flex: 1, gap: 10, justifyContent: "center" },
  emptyState: { alignItems: "center", flex: 1, gap: 10, justifyContent: "center", paddingBottom: 80 },
  feedback: { color: colors.text.muted, fontSize: 16, textAlign: "center" },
});
