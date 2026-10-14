import { View, Text, StyleSheet, ViewStyle } from "react-native"
import { AppColors } from "@/app/constants/theme"
import { useTheme } from "@/app/hooks/useTheme/useTheme"

type localProps = {
  title: string,
  text: string,
  containerStyles?: ViewStyle
}

export default function FishInfoGroup({ title, text, containerStyles }: localProps) {
  const { colors } = useTheme()
  const styles = createStyles(colors)
  return (
    <View style={[ styles.container, containerStyles ]}>
      <Text style={styles.title}>
        { title }
      </Text>
      <Text style={styles.text}>
        { text }
      </Text>
    </View>
  )
}

const createStyles = (colors: AppColors) => StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    flexWrap: 'nowrap'
  },
  title: {
    fontSize: 14,
    color: colors.text.muted
  },
  text: {
    color: colors.text.main,
    fontSize: 18,
    fontWeight: 600,
    wordWrap: 'break-word'
  }
})
