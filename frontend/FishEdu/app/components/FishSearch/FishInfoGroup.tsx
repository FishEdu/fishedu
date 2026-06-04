import { View, Text } from "react-native"

type localProps = {
  title: string,
  text: string
}

export default function FishInfoGroup({ title, text }: localProps) {
  return (
    <View>
      <Text>
        { title }
      </Text>
      <Text>
        { text }
      </Text>
    </View>
  )
}
