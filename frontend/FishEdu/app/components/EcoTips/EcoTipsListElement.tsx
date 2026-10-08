import { EcoTipsGetResponse } from "@/app/api/ecoTips"
import { AppColors } from "@/app/constants/theme"
import { useTheme } from "@/app/hooks/useTheme/useTheme"
import { StyleSheet, Text, View } from "react-native"

type LocalProps = {
  ecoTip: EcoTipsGetResponse,
  number: number,
}

export default function EcoTipsListElement({ ecoTip, number }: LocalProps) {
  const { colors } = useTheme()
  const styles = createStyles(colors)
  return (
    <View style={styles.tip}>
      <Text style={styles.title}>
        { `${number}. ${ecoTip.title}` }
      </Text>
      <View>
        {
          ecoTip?.description?.split('\n')
            .map((line, number) => (
              <Text key={number} style={styles.description}>
                { line }
              </Text>
            )
          )
        }
      </View>
    </View>
  )
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  tip: {
    marginBlock: 16
  },
  title: {
    color: colors.text.main,
    fontWeight: 600,
    fontSize: 24
  },
  description: {
    color: colors.text.muted,
  },
})
