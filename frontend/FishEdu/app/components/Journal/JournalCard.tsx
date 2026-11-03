import { FishingJournal } from "@/app/api/journal"
import { AppColors } from "@/app/constants/theme"
import { useTheme } from "@/app/hooks/useTheme/useTheme"
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage"
import Ionicons from "@expo/vector-icons/Ionicons"
import { Pressable, StyleSheet, Text, View } from "react-native"

type Props = { journal: FishingJournal, onPress: () => void }

export default function JournalCard({ journal, onPress }: Props) {
  const { colors } = useTheme()
  const { languageCode } = useLanguage()
  const styles = createStyles(colors)
  const date = new Date(`${journal.fished_on}T12:00:00`)
  const catchesPreview = journal.catches.slice(0, 3).map(catchItem => `${catchItem.fish_name} ${catchItem.count} szt.`).join(" · ")
  const extraCatches = journal.catches.length - 3

  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.dateBlock}>
        <Text style={styles.day}>{date.getDate()}</Text>
        <Text style={styles.month}>{date.toLocaleDateString(languageCode === "en" ? "en-GB" : "pl-PL", { month: "short" }).replace(".", "").toUpperCase()}</Text>
      </View>
      <View style={styles.copy}>
        <Text numberOfLines={1} style={styles.spot}>{journal.fishing_spot}</Text>
        <Text numberOfLines={2} style={styles.catches}>{catchesPreview}{extraCatches > 0 ? ` +${extraCatches}` : ""}</Text>
      </View>
      <View style={styles.total}>
        <Ionicons name="fish-outline" size={19} color={colors.secondary} />
        <Text style={styles.totalText}>{journal.total_catches}</Text>
        <Ionicons name="chevron-forward" size={17} color={colors.text.muted} />
      </View>
    </Pressable>
  )
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  card: { alignItems: "center", backgroundColor: colors.background.card, borderColor: colors.border.card, borderRadius: 10, borderWidth: 1, flexDirection: "row", gap: 12, minHeight: 102, padding: 12 },
  pressed: { opacity: 0.75 },
  dateBlock: { alignItems: "center", backgroundColor: colors.background.primarySoft, borderRadius: 9, justifyContent: "center", minHeight: 67, width: 50 },
  day: { color: colors.primary, fontSize: 25, fontWeight: "700" },
  month: { color: colors.primary, fontSize: 10, fontWeight: "700", marginTop: -2 },
  copy: { flex: 1, gap: 4, minWidth: 0 },
  spot: { color: colors.text.main, fontSize: 16, fontWeight: "700" },
  metaRow: { alignItems: "center", flexDirection: "row", gap: 4 },
  meta: { color: colors.text.muted, fontSize: 12 },
  catches: { color: colors.text.muted, fontSize: 12, lineHeight: 17 },
  total: { alignItems: "center", gap: 1 },
  totalText: { color: colors.secondary, fontSize: 15, fontWeight: "700" },
})
