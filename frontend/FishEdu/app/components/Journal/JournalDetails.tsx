import { FishingJournal } from "@/app/api/journal"
import { AppColors } from "@/app/constants/theme"
import { useTheme } from "@/app/hooks/useTheme/useTheme"
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage"
import { resolveRecordPhotoUrl } from "@/app/utils/fetch/records/recordPhoto"
import { getTranslation } from "@/app/utils/translation/getTranslation"
import Ionicons from "@expo/vector-icons/Ionicons"
import { Image, Pressable, StyleSheet, Text, View } from "react-native"

type Props = { journal: FishingJournal, onEdit: () => void, onDelete: () => void }

export default function JournalDetails({ journal, onEdit, onDelete }: Props) {
  const { colors } = useTheme()
  const { languageCode } = useLanguage()
  const styles = createStyles(colors)
  const date = new Date(`${journal.fished_on}T12:00:00`).toLocaleDateString(languageCode === "en" ? "en-GB" : "pl-PL", { day: "numeric", month: "long", year: "numeric" })

  return (
    <View style={styles.content}>
      {journal.image_url ? <Image source={{ uri: resolveRecordPhotoUrl(journal.image_url) }} style={styles.image} /> : <View style={styles.imageFallback}><Ionicons name="fish-outline" size={45} color={colors.primary} /></View>}
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}><Text style={styles.date}>{date}</Text><Text style={styles.title}>{journal.fishing_spot}</Text></View>
        <Pressable accessibilityRole="button" accessibilityLabel={getTranslation("journal.edit", languageCode)} onPress={onEdit} style={styles.editButton}><Ionicons name="pencil-outline" size={20} color={colors.primary} /></Pressable>
      </View>
      <View style={styles.infoGrid}>
        {journal.started_at || journal.ended_at ? <View style={styles.infoItem}><Ionicons name="time-outline" size={18} color={colors.primary} /><Text style={styles.infoText}>{journal.started_at ?? "--:--"}–{journal.ended_at ?? "--:--"}</Text></View> : null}
      </View>
      {journal.description ? <View style={styles.note}><Ionicons name="document-text-outline" size={18} color={colors.primary} /><Text style={styles.noteText}>{journal.description}</Text></View> : null}
      <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>{getTranslation("journal.catches", languageCode)}</Text><Text style={styles.total}>{journal.total_catches} {getTranslation("journal.items", languageCode)}</Text></View>
      <View style={styles.catchList}>
        {journal.catches.map(catchItem => (
          <View key={catchItem.id} style={styles.catchRow}>
            <View style={styles.fishIcon}><Ionicons name="fish-outline" size={21} color={colors.primary} /></View>
            <View style={styles.catchCopy}><Text style={styles.fishName}>{catchItem.fish_name}</Text><Text style={styles.catchMeta}>{[catchItem.total_length ? `${catchItem.total_length} cm` : null, catchItem.weight ? `${catchItem.weight} kg` : null].filter(Boolean).join(" · ") || getTranslation("journal.noMeasurements", languageCode)}</Text></View>
            <Text style={styles.catchCount}>{catchItem.count} {getTranslation("journal.pieces", languageCode)}</Text>
          </View>
        ))}
      </View>
      <Pressable accessibilityRole="button" onPress={onDelete} style={styles.deleteButton}><Ionicons name="trash-outline" size={18} color={colors.danger} /><Text style={styles.deleteText}>{getTranslation("journal.delete", languageCode)}</Text></Pressable>
    </View>
  )
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  content: { gap: 16, paddingBottom: 30 },
  image: { borderRadius: 10, height: 220, resizeMode: "cover", width: "100%" },
  imageFallback: { alignItems: "center", backgroundColor: colors.background.primarySoft, borderRadius: 10, height: 155, justifyContent: "center" },
  headerRow: { alignItems: "flex-start", flexDirection: "row", justifyContent: "space-between" },
  titleGroup: { flex: 1, gap: 3 },
  date: { color: colors.text.muted, fontSize: 13 },
  title: { color: colors.text.main, fontSize: 25, fontWeight: "700" },
  editButton: { alignItems: "center", backgroundColor: colors.background.primarySoft, borderRadius: 18, height: 38, justifyContent: "center", width: 38 },
  infoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 9 },
  infoItem: { alignItems: "center", backgroundColor: colors.background.card, borderColor: colors.border.card, borderRadius: 9, borderWidth: 1, flexDirection: "row", gap: 6, paddingHorizontal: 10, paddingVertical: 8 },
  infoText: { color: colors.text.main, fontSize: 13 },
  note: { alignItems: "flex-start", backgroundColor: colors.background.primarySoft, borderRadius: 10, flexDirection: "row", gap: 8, padding: 12 },
  noteText: { color: colors.text.main, flex: 1, fontSize: 14, lineHeight: 20 },
  sectionHeader: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginTop: 4 },
  sectionTitle: { color: colors.text.main, fontSize: 18, fontWeight: "700" },
  total: { color: colors.secondary, fontSize: 13, fontWeight: "700" },
  catchList: { gap: 9 },
  catchRow: { alignItems: "center", backgroundColor: colors.background.card, borderColor: colors.border.card, borderRadius: 10, borderWidth: 1, flexDirection: "row", gap: 10, minHeight: 62, padding: 10 },
  fishIcon: { alignItems: "center", backgroundColor: colors.background.primarySoft, borderRadius: 8, height: 38, justifyContent: "center", width: 38 },
  catchCopy: { flex: 1 },
  fishName: { color: colors.text.main, fontSize: 15, fontWeight: "700" },
  catchMeta: { color: colors.text.muted, fontSize: 12, marginTop: 2 },
  catchCount: { color: colors.primary, fontSize: 13, fontWeight: "700" },
  deleteButton: { alignItems: "center", alignSelf: "center", flexDirection: "row", gap: 6, marginTop: 4, minHeight: 42, paddingHorizontal: 12 },
  deleteText: { color: colors.danger, fontSize: 13, fontWeight: "700" },
})
