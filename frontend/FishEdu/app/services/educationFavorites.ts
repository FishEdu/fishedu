import { fetchFavorites, setFavorite } from "./favorites";


export type EducationFavoritesRepository = {
  getFavoriteIds: () => Promise<number[]>;
  addFavorite: (materialId: number) => Promise<void>;
  removeFavorite: (materialId: number) => Promise<void>;
};


export const educationFavoritesRepository: EducationFavoritesRepository = {
  getFavoriteIds: async () => {
    const favorites = await fetchFavorites("pl");

    return favorites.material_ids;
  },

  addFavorite: async (materialId) => {
    await setFavorite("material", materialId, true);
  },

  removeFavorite: async (materialId) => {
    await setFavorite("material", materialId, false);
  },
};