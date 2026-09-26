import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const FAVORITE_EDUCATION_MATERIAL_IDS_KEY = "favoriteEducationMaterialIds";

export const useEducationFavorites = () => {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(FAVORITE_EDUCATION_MATERIAL_IDS_KEY)
      .then(rawValue => setFavoriteIds(rawValue ? JSON.parse(rawValue) as number[] : []))
      .finally(() => setIsReady(true));
  }, []);

  const toggleFavorite = async (materialId: number) => {
    const nextFavoriteIds = favoriteIds.includes(materialId)
      ? favoriteIds.filter(id => id !== materialId)
      : [...favoriteIds, materialId];

    setFavoriteIds(nextFavoriteIds);
    await AsyncStorage.setItem(FAVORITE_EDUCATION_MATERIAL_IDS_KEY, JSON.stringify(nextFavoriteIds));
  };

  return { favoriteIds, isReady, toggleFavorite };
};
