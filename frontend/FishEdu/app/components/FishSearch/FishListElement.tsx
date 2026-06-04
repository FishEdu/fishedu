import { View } from "react-native"
import FishInfoGroup from "./FishInfoGroup"
import { fishListElementProps } from "./fishListElementProps"

export default function FishListElement({
  name, 
  environment, 
  isEndangered,
  imageUrl }: fishListElementProps
  ) {
    return (
      <View>
        <View>
          {/* <Image></Image> */}
        </View>
        <FishInfoGroup
          title='Name'
          text={name}
        />
        <FishInfoGroup
          title='Environment'
          text={environment}
        />
        <FishInfoGroup
          title='Endangered'
          text={isEndangered ? 'Yes' : 'No'}
        />
      </View>
    )
}
