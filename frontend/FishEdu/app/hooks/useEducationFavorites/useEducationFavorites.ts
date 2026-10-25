import { useFavorites } from "@/app/hooks/useFavorites/useFavorites";


export const useEducationFavorites = () => {
  const {
    favorites,
    ready,
    toggleFavorite,
  } = useFavorites();

  return {
    favoriteIds: favorites.material_ids,
    isReady: ready,
    toggleFavorite: (materialId: number) =>
      toggleFavorite("material", materialId),
  };
};