import { AppColors } from "@/app/constants/theme"
import { useTheme } from "@/app/hooks/useTheme/useTheme"
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage"
import { fetchJournalSpots } from "@/app/utils/fetch/journal/fetchJournals"
import { getTranslation } from "@/app/utils/translation/getTranslation"
import Ionicons from "@expo/vector-icons/Ionicons"
import { useEffect, useState } from "react"
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native"

type Props = { value: string, onChange: (value: string) => void }

export default function JournalSpotSearch({ value, onChange }: Props) {
  const { colors } = useTheme()
  const { languageCode } = useLanguage()
  const styles = createStyles(colors)
  const [isFocused, setIsFocused] = useState(false)
  const [spots, setSpots] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isFocused) return
    const timer = setTimeout(async () => {
      setLoading(true)
      setSpots(await fetchJournalSpots(value))
      setLoading(false)
    }, 200)
    return () => clearTimeout(timer)
  }, [isFocused, value])

  const visibleSpots = spots.filter(spot => spot.toLocaleLowerCase() !== value.trim().toLocaleLowerCase())

  return (
    <View style={styles.wrapper}>
      <View style={styles.inputRow}>
        <Ionicons name="search-outline" size={18} color={colors.text.muted} />
        <TextInput
          value={value}
          onChangeText={onChange}
          onFocus={() => setIsFocused(true)}
          placeholder={getTranslation("journal.spotPlaceholder", languageCode)}
          placeholderTextColor={colors.text.muted}
          selectionColor={colors.primary}
          style={styles.input}
        />
        {loading ? <ActivityIndicator size="small" color={colors.primary} /> : null}
      </View>
      {isFocused ? (
        <View style={styles.suggestions}>
          {value.trim() ? (
            <Pressable accessibilityRole="button" style={styles.suggestion} onPress={() => setIsFocused(false)}>
              <Ionicons name="add-circle-outline" size={18} color={colors.primary} />
              <Text style={styles.customText}>{getTranslation("journal.useCustomSpot", languageCode)}: {value.trim()}</Text>
            </Pressable>
          ) : null}
          {visibleSpots.map(spot => (
            <Pressable key={spot} accessibilityRole="button" style={styles.suggestion} onPress={() => { onChange(spot); setIsFocused(false) }}>
              <Ionicons name="location-outline" size={18} color={colors.text.muted} />
              <Text style={styles.suggestionText}>{spot}</Text>
            </Pressable>
          ))}
          {!loading && !value.trim() && !visibleSpots.length ? <Text style={styles.empty}>{getTranslation("journal.noSavedSpots", languageCode)}</Text> : null}
        </View>
      ) : null}
    </View>
  )
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  wrapper: { position: "relative", zIndex: 10 },
  inputRow: { alignItems: "center", backgroundColor: colors.background.app, borderColor: colors.border.card, borderRadius: 10, borderWidth: 1, flexDirection: "row", gap: 8, minHeight: 48, paddingHorizontal: 11 },
  input: { color: colors.text.main, flex: 1, fontSize: 14, paddingVertical: 8 },
  suggestions: { backgroundColor: colors.background.card, borderColor: colors.border.card, borderRadius: 10, borderWidth: 1, elevation: 6, marginTop: 5, overflow: "hidden", shadowColor: colors.background.overlay, shadowOpacity: 0.16, shadowRadius: 10 },
  suggestion: { alignItems: "center", flexDirection: "row", gap: 9, minHeight: 44, paddingHorizontal: 12 },
  suggestionText: { color: colors.text.main, fontSize: 14 },
  customText: { color: colors.primary, flex: 1, fontSize: 13, fontWeight: "600" },
  empty: { color: colors.text.muted, fontSize: 13, padding: 12 },
})
