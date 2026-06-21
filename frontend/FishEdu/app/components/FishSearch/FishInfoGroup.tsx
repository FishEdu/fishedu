import { View, Text, StyleSheet, ViewStyle } from "react-native"

type localProps = {
  title: string,
  text: string,
  containerStyles?: ViewStyle
}

export default function FishInfoGroup({ title, text, containerStyles }: localProps) {
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

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    flexWrap: 'nowrap'
  },
  title: {
    fontSize: 14,
    color: 'hsl(0, 0%, 40%)'
  },
  text: {
    fontSize: 18,
    fontWeight: 600,
    wordWrap: 'break-word'
  }
})
