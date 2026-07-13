import { FishGetResponse } from "@/app/api/fish"
import { FlatList, StyleSheet } from "react-native"
import FishListElement from "./FishListElement"

type fishListProps = {
  fish?: FishGetResponse[]
}

export default function FishList({ fish }: fishListProps) {
  return (
    <FlatList
      contentContainerStyle={styles.list}
      data={fish}
      renderItem={({item}) => 
        <FishListElement
          fish={item}
          name={item.name} 
          isEndangered={item.is_endangered}
          feedingPlaces={item.feeding_places}
          imageUrl={''}
        />
      }
      keyExtractor={item => String(item.id)}
    />
  )
}

const styles = StyleSheet.create({
  list: {
    display: 'flex',
    gap: 16
  }
})
