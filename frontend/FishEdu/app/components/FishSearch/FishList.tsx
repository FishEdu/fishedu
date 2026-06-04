import { FlatList } from "react-native"
import FishListElement from "./FishListElement"
import { fishListElementProps } from "./fishListElementProps"

type fishListProps = {
  data: fishListElementProps[]
}

export default function FishList({ data }: fishListProps) {
  return (
    <FlatList 
      data={data}
      renderItem={({item}) => 
        <FishListElement
          name={item.name} 
          environment={item.environment}
          isEndangered={item.isEndangered}
          imageUrl={item.imageUrl}
        />
      }
      keyExtractor={item => item.name}
    />
  )
}
