
import JournalForm from "@/app/components/Journal/JournalForm"
import Container from "@/app/components/ui/Container"
import { AppColors } from "@/app/constants/theme"
import { useTheme } from "@/app/hooks/useTheme/useTheme"
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage"
import { getTranslation } from "@/app/utils/translation/getTranslation"
import { router, useFocusEffect } from "expo-router"
import Ionicons from "@expo/vector-icons/Ionicons"
import { useCallback, useState } from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"

export default function AddJournal() {
  const { colors } = useTheme()
  const { languageCode } = useLanguage()
  const styles = createStyles(colors)

  // Klucz pozwalający utworzyć formularz od nowa
  const [formKey, setFormKey] = useState(0)

  // Przy każdym wejściu na ekran formularz jest resetowany
  useFocusEffect(
    useCallback(() => {
      setFormKey(current => current + 1)
    }, [])
  )

  return (
    <Container>
      <View style={styles.page}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.back()}
          style={styles.back}
        >
          <Ionicons
            name="chevron-back"
            size={20}
            color={colors.primary}
          />
          <Text style={styles.backText}>
            {getTranslation("journal.back", languageCode)}
          </Text>
        </Pressable>

        <Text style={styles.title}>
          {getTranslation("journal.add", languageCode)}
        </Text>

        <JournalForm key={formKey} />
      </View>
    </Container>
  )
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  page: {
    flex: 1,
    gap: 14,
    paddingTop: 36,
  },
  back: {
    alignItems: "center",
    alignSelf: "flex-start",
    flexDirection: "row",
    paddingVertical: 5,
  },
  backText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "600",
  },
  title: {
    color: colors.text.main,
    fontSize: 24,
    fontWeight: "700",
  },
})
