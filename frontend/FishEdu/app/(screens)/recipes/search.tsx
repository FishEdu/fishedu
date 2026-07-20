import RecipesList from "@/app/components/RecipesSearch/RecipesList";
import RecipesSearchBar from "@/app/components/RecipesSearch/RecipesSearchBar";
import Container from "@/app/components/ui/Container";
import { useFetchRecipes } from "@/app/hooks/useFetchRecipes/useFetchRecipes";

export default function RecipesSearch() {
  const recipes = useFetchRecipes()
  
  return (
    <Container>
      <>
        <RecipesSearchBar />
        <RecipesList 
          recipes={recipes}
        />
      </>
    </Container>
  )
}