
import { EcoTipsGetResponse } from "@/app/api/ecoTips"
import { FlatList, StyleSheet } from "react-native"
import EcoTipsListElement from "./EcoTipsListElement"

type LocalProps = {
  tips: EcoTipsGetResponse[]
}

export default function EcoTipsList({ tips }: LocalProps) {
  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.content}
      data={tips}
      renderItem={({ item, index }) => (
        <EcoTipsListElement
          ecoTip={item}
          number={index + 1}
        />
      )}
      keyExtractor={tip => String(tip.id)}
      showsVerticalScrollIndicator={false}
    />
  )
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  content: {
    gap: 14,
    paddingBottom: 24,
  },
})
