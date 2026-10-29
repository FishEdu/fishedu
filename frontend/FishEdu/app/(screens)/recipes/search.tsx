
import { StyleSheet, View } from "react-native"
import { router } from "expo-router"

import RecipesList from "@/app/components/RecipesSearch/RecipesList"
import RecipesSearchBar from "@/app/components/RecipesSearch/RecipesSearchBar"
import Container from "@/app/components/ui/Container"
import BackButton from "@/app/components/ui/BackButton"
import { useFetchRecipes } from "@/app/hooks/useFetchRecipes/useFetchRecipes"

export default function RecipesSearch() {
  const recipes = useFetchRecipes()

  return (
    <Container>
      <View style={styles.content}>
       <View style={styles.backButtonContainer}>
        <BackButton
          variant="text"
          label="Cofnij"
          onPress={() => router.back()}
        />
        </View> 

        <RecipesSearchBar />

        <RecipesList recipes={recipes} />
      </View>
    </Container>
  )
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 40,
    flex: 1,
  },
    backButtonContainer: {
    marginBottom: 20,
  },
})
