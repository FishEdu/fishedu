import { RecipesGetResponse } from "@/app/api/recipes"
import { AppColors } from "@/app/constants/theme"
import { useTheme } from "@/app/hooks/useTheme/useTheme"
import { router } from "expo-router"
import { Pressable, StyleSheet, Text, View } from "react-native"

export default function RecipesListElement({ id, content, name }: RecipesGetResponse) {
  const { colors } = useTheme()
  const styles = createStyles(colors)
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

const createStyles = (colors: AppColors) => StyleSheet.create({
   container: {
    backgroundColor: colors.background.card,
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
    color: colors.text.main,
    fontSize: 18
  }
})
