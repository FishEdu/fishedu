import { EcoTipsGetResponse } from "@/app/utils/fetch/ecoTips/fetchEcoTips"
import { View, Text, StyleSheet } from "react-native"

type LocalProps = {
  ecoTip: EcoTipsGetResponse,
  number: number,
}

export default function EcoTipsListElement({ ecoTip, number }: LocalProps) {
  return (
    <View style={styles.tip}>
      <Text style={styles.title}>
        { `${number}. ${ecoTip.title}` }
      </Text>
      <View>
        {
          ecoTip?.description?.split('\n')
            .map((line, number) => (
              <Text key={number}>
                { line }
              </Text>
            )
          )
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  tip: {
    marginBlock: 16
  },
  title: {
    fontWeight: 600,
    fontSize: 24
  }
})