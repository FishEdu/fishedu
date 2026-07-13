import { EcoTipsGetResponse } from "@/app/api/ecoTips"
import { FlatList } from "react-native"
import EcoTipsListElement from "./EcoTipsListElement"

type LocalProps = {
  tips: EcoTipsGetResponse[]
}

export default function EcoTipsList({ tips }: LocalProps) {
  
  return (
    <FlatList
      data={tips}
      renderItem={({ item, index}) => (
        <EcoTipsListElement
          ecoTip={item}
          number={index + 1}
        />
      )}
      keyExtractor={tip => String(tip.id)}
    />
  )
}