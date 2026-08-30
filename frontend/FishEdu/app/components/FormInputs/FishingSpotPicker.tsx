import { StyleSheet, View } from "react-native"
import { Picker } from "@react-native-picker/picker"
import { getTranslation } from "@/app/utils/translation/getTranslation"
import { LanguageCode } from "@/app/(tabs)/settings"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect, useState } from "react"

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
      >
        <Picker.Item
          label={getTranslation(
            "records.selectFishingSpot",
            language
          )}
          value=""
        />

        {fishingSpots.map((spot) => (
          <Picker.Item
            key={spot.value}
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: "hsl(0,0%,96%)",
    borderRadius: 6,
    marginBottom: 8,
    overflow: "hidden",
  },
})