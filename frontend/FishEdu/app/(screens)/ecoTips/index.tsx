import Container from "@/app/components/ui/Container";
import EcoTipsList from "@/app/components/EcoTips/EcoTipsList";
import { AppColors } from "@/app/constants/theme";
import { useTheme } from "@/app/hooks/useTheme/useTheme";
import { useFetchEcoTips } from "@/app/hooks/useFetchEcoTips/useFetchEcoTips";
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";
import { getTranslation } from "@/app/utils/translation/getTranslation";
import { useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function EcoTips() {
  const { data: ecoTips } = useFetchEcoTips()
  const { colors } = useTheme()
  const styles = createStyles(colors)
  const [ isLoading, setIsLoading ] = useState<boolean>(false)
  const { language } = useLanguage()
  const previousLanguage = useRef(language)

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        setIsLoading(true)
        setIsLoading(false)
      }

      if(previousLanguage.current !== language || EcoTips.length === 0) {
        load()
      }
    }, [language])
  )

  return (
    <Container>
      <View style={{ flex: 1, paddingBottom: 64 }}>
        <Text style={styles.heading}>
          { getTranslation('ecoTips.heading', language) }
        </Text>
        {
          isLoading ? (
            <Text style={styles.feedback}>{ getTranslation('common.loading', language) }</Text>
          ) :
          (
            <EcoTipsList
              tips={ecoTips}
            />
          )
        }
      </View>
    </Container>
  )
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  heading: {
    color: colors.text.main,
    fontWeight: 800,
    fontSize: 40,
    marginBlock: 20
  },
  feedback: { color: colors.text.muted },
})
