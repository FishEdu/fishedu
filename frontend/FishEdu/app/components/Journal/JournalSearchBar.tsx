import { JournalSearchMode } from "@/app/api/journal"
import { AppColors } from "@/app/constants/theme"
import { useTheme } from "@/app/hooks/useTheme/useTheme"
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage"
import { getTranslation } from "@/app/utils/translation/getTranslation"
import Ionicons from "@expo/vector-icons/Ionicons"
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native"

type Props = {
  query: string
  mode: JournalSearchMode
  onQueryChange: (query: string) => void
  onModeChange: (mode: JournalSearchMode) => void
}

export default function JournalSearchBar({ query, mode, onQueryChange, onModeChange }: Props) {
  const { colors } = useTheme()
  const { languageCode } = useLanguage()
  const styles = createStyles(colors)
  const modes: { value: JournalSearchMode, key: "journal.filter.all" | "journal.filter.fish" | "journal.filter.spot", icon: "search" | "fish-outline" | "location-outline" }[] = [
    { value: "all", key: "journal.filter.all", icon: "search" },
    { value: "fish", key: "journal.filter.fish", icon: "fish-outline" },
    { value: "spot", key: "journal.filter.spot", icon: "location-outline" },
  ]

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <Ionicons name="search-outline" size={19} color={colors.text.muted} />
        <TextInput
          value={query}
          onChangeText={onQueryChange}
          placeholder={getTranslation("journal.search", languageCode)}
          placeholderTextColor={colors.text.muted}
          selectionColor={colors.primary}
          style={styles.input}
        />
        {query ? (
          <Pressable accessibilityRole="button" accessibilityLabel={getTranslation("journal.clearSearch", languageCode)} onPress={() => onQueryChange("")}>
            <Ionicons name="close-circle" size={18} color={colors.text.muted} />
          </Pressable>
        ) : null}
      </View>
      <View style={styles.filters}>
        {modes.map(item => (
          <Pressable
            key={item.value}
            accessibilityRole="button"
            onPress={() => onModeChange(mode === item.value ? "all" : item.value)}
            style={[styles.filter, mode === item.value && styles.filterActive]}
          >
            <Ionicons name={item.icon} size={15} color={mode === item.value ? colors.primary : colors.text.muted} />
            <Text style={[styles.filterText, mode === item.value && styles.filterTextActive]}>{getTranslation(item.key, languageCode)}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  )
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  container: { gap: 10, marginBottom: 16 },
  inputRow: { alignItems: "center", backgroundColor: colors.background.card, borderColor: colors.border.card, borderRadius: 12, borderWidth: 1, flexDirection: "row", gap: 9, minHeight: 48, paddingHorizontal: 12 },
  input: { color: colors.text.main, flex: 1, fontSize: 15, paddingVertical: 9 },
  filters: { flexDirection: "row", gap: 8 },
  filter: { alignItems: "center", backgroundColor: colors.background.card, borderColor: colors.border.card, borderRadius: 14, borderWidth: 1, flexDirection: "row", gap: 5, paddingHorizontal: 10, paddingVertical: 6 },
  filterActive: { backgroundColor: colors.background.primarySoft, borderColor: colors.primary },
  filterText: { color: colors.text.muted, fontSize: 12, fontWeight: "600" },
  filterTextActive: { color: colors.primary },
})
