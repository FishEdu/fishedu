import FishList from "@components/FishSearch/FishList"
import Container from "@components/Container";
import { fetchFish, FishGetResponse} from "@utils/fetch/fish/fetchFish";
import { useEffect, useState } from "react";
import FishSearchInput from "../components/FishSearch/FishSearchInput";

export default function FishSearch() {
  const [ fish, setFish ] = useState<FishGetResponse[] | undefined>(undefined)
  
  useEffect(() => {
    fetchFish()
    .then(
      (data) => setFish(data)
    )
  }, [])
  
  return (
    <Container>
      <>
        <FishSearchInput
          setFish={setFish}
        />
        <FishList
          fish={fish}
        />
      </>
    </Container>
  )
}
