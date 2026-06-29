import Container from "@/app/components/Container";
import EcoTipsList from "@/app/components/EcoTips/EcoTipsList";
import { useFetchEcoTips } from "@/app/hooks/useFetchEcoTips/useFetchEcoTips";
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";
import { getTranslation } from "@/app/utils/translation/getTranslation";
import { useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function EcoTips() {
  const { data: ecoTips } = useFetchEcoTips()
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
      <View style={{ flex: 1 }}>
        <Text style={styles.heading}>
          { getTranslation('ecoTips.heading', language) }
        </Text>
        {
          isLoading ? (
            <Text>{ getTranslation('common.loading', language) }</Text>
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

const styles = StyleSheet.create({
  heading: {
    fontWeight: 800,
    fontSize: 40,
    marginBlock: 20
  } 
})