// import { View, StyleSheet } from "react-native"
import FishList from "@components/FishSearch/FishList"
import Container from "@components/Container";
import { fetchFish, FishGetResponse } from "@utils/fetch/fish/fetchFish";
import { useEffect, useState } from "react";


export default function FishSearch() {
  const [ fish, setFish ] = useState<FishGetResponse[] | undefined>(undefined)
  
  useEffect(() => {
    fetchFish()
    .then(
      (data) => setFish(data)
    )
  }, [fish])
  
  
  return (
    <Container>
      <FishList
        fish={fish}
      />
    </Container>
  )
}
