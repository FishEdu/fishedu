import { useEffect, useState } from "react";
import { Text } from "react-native";
import FishList from "@components/FishSearch/FishList"
import Container from "@components/Container";
import { fetchFish, FishGetResponse} from "@utils/fetch/fish/fetchFish";
import FishSearchInput from "@components/FishSearch/FishSearchInput";
import { useLanguage } from "../hooks/useLanguage/useLanguage";

export default function FishSearch() {
  const [ fish, setFish ] = useState<FishGetResponse[]>([])
  const { language } = useLanguage()
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetchFish()
    .then(
      (data) => setFish(data)
    )
    .finally(() => setLoading(false))
  }, [language])
  
  return (
    <Container>
      <>
        <FishSearchInput
          setFish={setFish} 
        />
        
        {loading ? (
          <Text>Ładowanie...</Text>
        ) : fish?.length === 0 || undefined ? (
          <Text>Brak ryb</Text>
        ) : (
          <FishList fish={fish} />
        )}
      </>
    </Container>
  )
}
