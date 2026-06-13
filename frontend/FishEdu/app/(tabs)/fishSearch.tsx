import { useCallback, useRef, useState } from "react";
import { Text } from "react-native";
import FishList from "@components/FishSearch/FishList"
import Container from "@components/Container";
import { fetchFish, FishGetResponse} from "@utils/fetch/fish/fetchFish";
import FishSearchInput from "@components/FishSearch/FishSearchInput";
import { useLanguage } from "../hooks/useLanguage/useLanguage";
import { getTranslation } from "../utils/translation/getTranslation";
import { useFocusEffect } from "expo-router";

export default function FishSearch() {
  const { language } = useLanguage()
  const [ lastFishQuery, setLastFishQuery ] = useState<string>('')
  const [ fish, setFish ] = useState<FishGetResponse[]>([])
  const [ loading, setLoading ] = useState(true)
  const [ dataStale, setDateStale ] = useState<boolean>(false)
  const previousLanguage = useRef(language)

    useFocusEffect(
      useCallback(() => {
        const load = async () => {
          setLoading(true)

          const { fish, isDataStale } = await fetchFish()

          setFish(fish)
          previousLanguage.current = language
          setLoading(false)
          setDateStale(isDataStale)
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
