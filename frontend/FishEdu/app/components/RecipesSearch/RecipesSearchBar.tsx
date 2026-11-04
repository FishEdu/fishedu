
import { RecipesGetResponse } from "@/app/api/recipes";
import { useLanguage } from "@/app/hooks/useLanguage/useLanguage";
import { getTranslation } from "@/app/utils/translation/getTranslation";
import { useState } from "react";
import Search from "../ui/Search";

type LocalProps = {
  allRecipes: RecipesGetResponse[];
  setRecipes: React.Dispatch<
    React.SetStateAction<RecipesGetResponse[]>
  >;
};

export default function RecipesSearchBar({
  allRecipes,
  setRecipes,
}: LocalProps) {
  const { language } = useLanguage();
  const [lastRecipeQuery, setLastRecipeQuery] = useState("");

  const searchRecipes = async (query: string) => {
    const result = allRecipes.filter((recipe) => {
      const name = (recipe.name ?? "").toLowerCase();
      const content = (recipe.content ?? "").toLowerCase();

      return name.includes(query) || content.includes(query);
    });

    return { result };
  };

  return (
    <Search
      lastQuery={lastRecipeQuery}
      placeholder={getTranslation("recipes.search", language)}
      setLastQuery={setLastRecipeQuery}
      setItems={setRecipes}
      fetchFn={searchRecipes}
    />
  );
}
