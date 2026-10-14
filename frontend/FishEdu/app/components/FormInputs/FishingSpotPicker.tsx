import { AppColors } from "@/app/constants/theme"
import { useTheme } from "@/app/hooks/useTheme/useTheme"
import { StyleSheet, View } from "react-native"
import { Picker } from "@react-native-picker/picker"
import { getTranslation } from "@/app/utils/translation/getTranslation"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect, useState } from "react"
import { LanguageCode } from "@/app/constants/language"

type Props = {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

const fishingSpots = [
  { key: "lake", value: "lake" },
  { key: "pond", value: "pond" },
  { key: "river", value: "river" },
  { key: "sea", value: "sea" },
]

export default function FishingSpotPicker({
  value,
  onChange,
  disabled = false,
}: Props) {
  const { colors } = useTheme()
  const styles = createStyles(colors)
  const [language, setLanguage] = useState<LanguageCode>(
    LanguageCode.PL
  )

  useEffect(() => {
    const loadLanguage = async () => {
      const savedLanguage = await AsyncStorage.getItem("language")

      if (savedLanguage === LanguageCode.EN) {
        setLanguage(LanguageCode.EN)
      } else {
        setLanguage(LanguageCode.PL)
      }
    }

    loadLanguage()
  }, [])

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={value}
        onValueChange={(itemValue) => onChange(itemValue)}
        enabled={!disabled}
        style={{ color: colors.text.main, backgroundColor: colors.background.app }}
        dropdownIconColor={colors.text.muted}
      >
        <Picker.Item
          style={{ color: colors.text.main, backgroundColor: colors.background.app }}
          label={getTranslation(
            "records.selectFishingSpot",
            language
          )}
          value=""
        />

        {fishingSpots.map((spot) => (
          <Picker.Item
            key={spot.value}
            style={{ color: colors.text.main, backgroundColor: colors.background.app }}
            label={getTranslation(
              `records.fishingSpot.${spot.key}` as any,
              language
            )}
            value={spot.value}
          />
        ))}
      </Picker>
    </View>
  )
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    backgroundColor: colors.background.app,
    borderRadius: 6,
    marginBottom: 8,
    overflow: "hidden",
  },
})
