import { FishGetResponse } from "@/app/api/fish";
import Container from "@/app/components/ui/Container";
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";
import FishList from "@components/FishSearch/FishList";
import FishSearchInput from "@components/FishSearch/FishSearchInput";
import { fetchFish } from "@utils/fetch/fish/fetchFish";
import { getTranslation } from "@utils/translation/getTranslation";
import { useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { Text } from "react-native";

export default function FishSearch() {
  const { language } = useLanguage()
  const [ lastFishQuery, setLastFishQuery ] = useState<string>('')
  const [ fish, setFish ] = useState<FishGetResponse[]>([])
  const [ loading, setLoading ] = useState(true)
  const previousLanguage = useRef(language)

    useFocusEffect(
      useCallback(() => {
        const load = async () => {
          setLoading(true)

          const { fish } = await fetchFish()

          setFish(fish)
          previousLanguage.current = language
          setLoading(false)
        }

        if (previousLanguage.current !== language || fish.length === 0) {
          load()
        }
      }, [language])
  )
  
  return (
    <Container>
      <>
        <FishSearchInput
          lastFishQuery={lastFishQuery}
          setLastFishQuery={setLastFishQuery}
          setFish={setFish} 
        />
        
        {loading ? (
          <Text>
            { getTranslation('common.loading', language) }
          </Text>
        ) : fish?.length === 0 || undefined ? (
            <Text>
              { getTranslation('fishSearch.fishNotFound', language) }
            </Text>
        ) : (
          <FishList fish={fish} />
        )}
      </>
    </Container>
  )
}
