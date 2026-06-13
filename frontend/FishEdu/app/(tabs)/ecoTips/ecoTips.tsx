import { useCallback, useRef, useState } from "react";
import { EcoTipsGetResponse, fetchEcoTips } from "@utils/fetch/ecoTips/fetchEcoTips";
import { useFocusEffect } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";
import Container from "@/app/components/Container";
import { getTranslation } from "@/app/utils/translation/getTranslation";
import EcoTipsList from "@/app/components/EcoTips/EcoTipsList";

export default function EcoTips() {
  const [ tips, setTips ] = useState<EcoTipsGetResponse[]>([])
  const [ isLoading, setIsLoading ] = useState<boolean>(false)
  const { language } = useLanguage()
  const previousLanguage = useRef(language)

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        setIsLoading(true)

        const { ecoTips } = await fetchEcoTips()
        setTips(ecoTips)
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
              tips={tips}
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