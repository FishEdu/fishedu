import { RecipesGetResponse } from "@/app/api/feeds"
import { FlatList, StyleSheet } from "react-native"
import RecipesListElement from "./RecipesListElement"

type localProps = {
  recipes: RecipesGetResponse[]
}

export default function RecipesList({ recipes }: localProps) {
  return (
    <FlatList 
      contentContainerStyle={styles.list}
      data={recipes}
      renderItem={
        ({ item }) => (
          <RecipesListElement
            id={item.id}
            name={item.name}
            content={item.content}
          />
        )
      }
      keyExtractor={item => item.name}
    />
  )
}

const styles = StyleSheet.create({
  list: {
    display: 'flex',
    gap: 16
  }
})