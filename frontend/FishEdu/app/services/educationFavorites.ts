import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITE_EDUCATION_MATERIAL_IDS_KEY = "favoriteEducationMaterialIds";

export type EducationFavoritesRepository = {
  getFavoriteIds: () => Promise<number[]>;
  addFavorite: (materialId: number) => Promise<void>;
  removeFavorite: (materialId: number) => Promise<void>;
};

const getLocalFavoriteIds = async () => {
  const rawValue = await AsyncStorage.getItem(FAVORITE_EDUCATION_MATERIAL_IDS_KEY);
  return rawValue ? JSON.parse(rawValue) as number[] : [];
};

const saveLocalFavoriteIds = async (favoriteIds: number[]) => {
  await AsyncStorage.setItem(FAVORITE_EDUCATION_MATERIAL_IDS_KEY, JSON.stringify(favoriteIds));
};

export const educationFavoritesRepository: EducationFavoritesRepository = {
  getFavoriteIds: getLocalFavoriteIds,
  addFavorite: async materialId => {
    const favoriteIds = await getLocalFavoriteIds();
    if (!favoriteIds.includes(materialId)) {
      await saveLocalFavoriteIds([...favoriteIds, materialId]);
    }
  },
  removeFavorite: async materialId => {
    const favoriteIds = await getLocalFavoriteIds();
    await saveLocalFavoriteIds(favoriteIds.filter(id => id !== materialId));
  },
};
