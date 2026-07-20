import { RecipesGetResponse } from "@/app/api/recipes";
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";
import { getTranslation } from "@/app/utils/translation/getTranslation";
import { useState } from "react";
import Search from "../ui/Search";

export default function RecipesSearchBar() {
  const { language } = useLanguage()
  const [ lastRecipeQuery, setLastRecipeQuery ] = useState<string>("")
  const [ recipes, setRecipes ] = useState<RecipesGetResponse[]>([])
  
  return (
    <Search
      lastQuery={lastRecipeQuery}
      placeholder={getTranslation('recipes.search', language)}
      setLastQuery={setLastRecipeQuery}
      setItems={setRecipes}
      fetchFn={undefined}
    />
  )
}