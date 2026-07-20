import { RecipesGetResponse } from "@/app/api/recipes"
import { router } from "expo-router"
import { Pressable, StyleSheet, Text, View } from "react-native"

export default function RecipesListElement({ id, content, name }: RecipesGetResponse) {
  const handlePress = () => {
    const recipeDetailsHref = {
      pathname: "/(screens)/recipes/[id]",
      params: {
        id: String(id),
        name: name,
        content: content
      }
    } as unknown as Parameters<typeof router.push>[0]

    router.push(recipeDetailsHref)
  }
  
  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.containerPressed
      ]}
    >
      <View>
        <Text style={styles.name}>
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
    paddingBlock: 24,
    paddingInline: 16
  },
  containerPressed: {
    opacity: 0.75,
  },
  name: {
    fontSize: 18
  }
})