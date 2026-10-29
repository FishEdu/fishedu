
import { StyleSheet, Text, View } from "react-native"
import Ionicons from "@expo/vector-icons/Ionicons"

import Container from "@/app/components/ui/Container"
import EcoTipsList from "@/app/components/EcoTips/EcoTipsList"
import { AppColors } from "@/app/constants/theme"
import { useTheme } from "@/app/hooks/useTheme/useTheme"
import { useFetchEcoTips } from "@/app/hooks/useFetchEcoTips/useFetchEcoTips"
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage"
import { getTranslation } from "@/app/utils/translation/getTranslation"
import { router } from "expo-router"
import BackButton from "@/app/components/ui/BackButton"

export default function EcoTips() {
  const { data: ecoTips } = useFetchEcoTips()
  const { colors } = useTheme()
  const { language } = useLanguage()
  const styles = createStyles(colors)

  return (
    <Container>
      <View style={styles.content}>
        <View style={styles.backButtonContainer}>
          <BackButton
            variant="text"
            label={getTranslation("common.back", language)}
            onPress={() => router.back()}
          />
        </View>
        <View style={styles.headingRow}>
          <View style={styles.headingIcon}>
            <Ionicons
              name="leaf-outline"
              size={27}
              color={colors.primary}
            />
          </View>

          <Text style={styles.heading}>
            {getTranslation("ecoTips.heading", language)}
          </Text>
        </View>

        <EcoTipsList tips={ecoTips ?? []} />
      </View>
    </Container>
  )
}

const createStyles = (colors: AppColors) =>
  StyleSheet.create({
    content: {
      flex: 1,
      paddingTop: 40,
      paddingBottom: 64,
    },
    headingRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      marginBottom: 24,
    },
    headingIcon: {
      width: 50,
      height: 50,
      borderRadius: 17,
      backgroundColor: colors.background.primarySoft,
      alignItems: "center",
      justifyContent: "center",
    },
    heading: {
      flex: 1,
      color: colors.text.main,
      fontWeight: "800",
      fontSize: 30,
      lineHeight: 36,
    },
    backButtonContainer: {
      marginBottom: 20,
    },
  })
