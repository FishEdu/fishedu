import { RecipesGetResponse } from "@/app/api/recipes"
import { useFetchQuery } from "../useFetchQuery/useFetchQuery"
import { useLanguage } from "../useLanguage/useLanguage"

export const useFetchRecipes = () => {
  const { language } = useLanguage()
  const endpoint = 'recipes'
  const localStorageId = 'recipes'

  const { data: recipes } = useFetchQuery<RecipesGetResponse>({ endpoint, localStorageId, language })

  console.log(recipes)

  return recipes
}