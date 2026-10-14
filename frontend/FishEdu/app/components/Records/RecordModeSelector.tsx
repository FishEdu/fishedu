import { AppColors } from "@/app/constants/theme"
import { useTheme } from "@/app/hooks/useTheme/useTheme"
import Ionicons from "@expo/vector-icons/Ionicons"
import { Pressable, StyleSheet, Text, View } from "react-native"
import { RecordViewMode } from "@/app/api/records"
import { getTranslation } from "@/app/utils/translation/getTranslation"
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage"

type LocalProps = {
  selectedMode: RecordViewMode,
  setSelectedMode: (mode: RecordViewMode) => void
}

export default function RecordModeSelector({
  selectedMode,
  setSelectedMode,
}: LocalProps) {
  const { languageCode } = useLanguage()
  const { colors } = useTheme()
  const styles = createStyles(colors)

  const modes = [
    {
      mode: "fish" as const,
      label: getTranslation("records.fish", languageCode),
      icon: "fish" as const,
    },
    {
      mode: "spots" as const,
      label: getTranslation("records.fishingSpot", languageCode),
      icon: "location" as const,
    },
  ]

  return (
    <View style={styles.container}>
      {modes.map(({ mode, label, icon }) => (
        <Pressable
          key={mode}
          onPress={() => {
            if (selectedMode === mode) {
              setSelectedMode("recent")
            } else {
              setSelectedMode(mode)
            }
          }}
          style={[
            styles.button,
            selectedMode === mode && styles.buttonActive
          ]}
        >
          <Ionicons name={icon} size={18} color={selectedMode === mode ? colors.text.onPrimary : colors.text.main} />
          <Text style={[styles.buttonText, selectedMode === mode && styles.buttonTextActive]}>{label}</Text>
        </Pressable>
      ))}
    </View>
  )
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
    borderRadius: 4,
    marginBottom: 16,
  },
  button: {
    flex: 1,
    alignItems: "center",
    gap: 4,
    paddingBlock: 10,
    backgroundColor: colors.border.card,
  },
  buttonActive: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    fontSize: 12,
    color: colors.text.main,
  },
  buttonTextActive: {
    color: colors.text.onPrimary,
  }
})
