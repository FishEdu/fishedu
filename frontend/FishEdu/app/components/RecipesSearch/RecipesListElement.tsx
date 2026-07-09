import { RecipesGetResponse } from "@/app/api/feeds"
import { Pressable, StyleSheet, Text, View } from "react-native"

export default function RecipesListElement({ id, content, name }: RecipesGetResponse) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.containerPressed
      ]}
    >
      <View>
        <Text>
          { name }
        </Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
   container: {
    backgroundColor: 'hsl(0, 0%, 100%)',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingEnd: 8,
    borderRadius: 24,
    overflow: 'hidden',
    paddingBlock: 8
  },
  containerPressed: {
    opacity: 0.75,
  },
})