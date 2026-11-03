import { FishGetResponse } from "@/app/api/fish"
import { AppColors } from "@/app/constants/theme"
import { useFetchFish } from "@/app/hooks/useFetchFish/useFetchFish"
import { useTheme } from "@/app/hooks/useTheme/useTheme"
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage"
import { getTranslation } from "@/app/utils/translation/getTranslation"
import Ionicons from "@expo/vector-icons/Ionicons"
import { useState } from "react"
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native"

export type JournalCatchDraft = {
  key: string
  fish_id: number
  fish_name: string
  count: string
  total_length: string
  weight: string
}

type Props = {
  value: JournalCatchDraft
  removable: boolean
  onChange: (next: JournalCatchDraft) => void
  onRemove: () => void
}

export default function JournalCatchEditor({ value, removable, onChange, onRemove }: Props) {
  const { colors } = useTheme()
  const { languageCode } = useLanguage()
  const styles = createStyles(colors)
  const [showResults, setShowResults] = useState(false)
  const { data } = useFetchFish(value.fish_name)
  const fishes = Array.isArray(data) ? data as FishGetResponse[] : []

  const update = (field: keyof JournalCatchDraft, fieldValue: string | number) => {
    onChange({ ...value, [field]: fieldValue })
  }

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.title}>{getTranslation("journal.catch", languageCode)}</Text>
        {removable ? (
          <Pressable accessibilityRole="button" accessibilityLabel={getTranslation("journal.removeCatch", languageCode)} onPress={onRemove} style={styles.removeButton}>
            <Ionicons name="trash-outline" size={17} color={colors.danger} />
          </Pressable>
        ) : null}
      </View>
      <View style={styles.fishInput}>
        <Ionicons name="fish-outline" size={18} color={colors.text.muted} />
        <TextInput
          value={value.fish_name}
          onFocus={() => setShowResults(true)}
          onChangeText={name => { onChange({ ...value, fish_name: name, fish_id: 0 }); setShowResults(true) }}
          placeholder={getTranslation("journal.searchFish", languageCode)}
          placeholderTextColor={colors.text.muted}
          selectionColor={colors.primary}
          style={styles.fishTextInput}
        />
        {value.fish_name ? (
          <Pressable accessibilityRole="button" accessibilityLabel={getTranslation("journal.clearFish", languageCode)} onPress={() => onChange({ ...value, fish_name: "", fish_id: 0 })}>
            <Ionicons name="close-circle" size={18} color={colors.text.muted} />
          </Pressable>
        ) : null}
      </View>
      {showResults && fishes.length ? (
        <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled style={styles.results}>
          {fishes.slice(0, 7).map(fish => (
            <Pressable
              key={fish.id}
              accessibilityRole="button"
              onPress={() => { onChange({ ...value, fish_id: fish.id, fish_name: fish.name }); setShowResults(false) }}
              style={[styles.result, fish.id === value.fish_id && styles.resultSelected]}
            >
              <Text style={[styles.resultText, fish.id === value.fish_id && styles.resultTextSelected]}>{fish.name}</Text>
              {fish.id === value.fish_id ? <Ionicons name="checkmark" size={18} color={colors.primary} /> : null}
            </Pressable>
          ))}
        </ScrollView>
      ) : null}
      <View style={styles.measurements}>
        <View style={styles.measurement}>
          <Text style={styles.label}>{getTranslation("journal.count", languageCode)}</Text>
          <TextInput value={value.count} onChangeText={count => update("count", count)} keyboardType="numeric" style={styles.measureInput} />
        </View>
        <View style={styles.measurement}>
          <Text style={styles.label}>{getTranslation("journal.length", languageCode)}</Text>
          <TextInput value={value.total_length} onChangeText={totalLength => update("total_length", totalLength)} keyboardType="numeric" placeholder="cm" placeholderTextColor={colors.text.muted} style={styles.measureInput} />
        </View>
        <View style={styles.measurement}>
          <Text style={styles.label}>{getTranslation("journal.weight", languageCode)}</Text>
          <TextInput value={value.weight} onChangeText={weight => update("weight", weight)} keyboardType="numeric" placeholder="kg" placeholderTextColor={colors.text.muted} style={styles.measureInput} />
        </View>
      </View>
    </View>
  )
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  container: { backgroundColor: colors.background.card, borderColor: colors.border.card, borderRadius: 10, borderWidth: 1, gap: 9, padding: 11 },
  topRow: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  title: { color: colors.text.main, fontSize: 14, fontWeight: "700" },
  removeButton: { alignItems: "center", height: 32, justifyContent: "center", width: 32 },
  fishInput: { alignItems: "center", backgroundColor: colors.background.app, borderColor: colors.border.card, borderRadius: 9, borderWidth: 1, flexDirection: "row", gap: 7, minHeight: 44, paddingHorizontal: 10 },
  fishTextInput: { color: colors.text.main, flex: 1, fontSize: 14, paddingVertical: 8 },
  results: { backgroundColor: colors.background.app, borderColor: colors.border.card, borderRadius: 9, borderWidth: 1, maxHeight: 176 },
  result: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", minHeight: 40, paddingHorizontal: 10 },
  resultSelected: { backgroundColor: colors.background.primarySoft },
  resultText: { color: colors.text.main, fontSize: 13 },
  resultTextSelected: { color: colors.primary, fontWeight: "600" },
  measurements: { flexDirection: "row", gap: 8 },
  measurement: { flex: 1, minWidth: 0 },
  label: { color: colors.text.muted, fontSize: 10, fontWeight: "600", marginBottom: 4 },
  measureInput: { backgroundColor: colors.background.app, borderColor: colors.border.card, borderRadius: 8, borderWidth: 1, color: colors.text.main, fontSize: 13, minHeight: 39, paddingHorizontal: 8, textAlign: "center" },
})
