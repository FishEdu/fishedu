import { educationFavoritesRepository } from "@/app/services/educationFavorites";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

export const useEducationFavorites = () => {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [isReady, setIsReady] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadFavoriteIds = async () => {
        try {
          const loadedFavoriteIds = await educationFavoritesRepository.getFavoriteIds();
          if (isActive) setFavoriteIds(loadedFavoriteIds);
        } finally {
          if (isActive) setIsReady(true);
        }
      };

      void loadFavoriteIds();
      return () => {
        isActive = false;
      };
    }, [])
  );

  const toggleFavorite = async (materialId: number) => {
    const isFavorite = favoriteIds.includes(materialId);
    const nextFavoriteIds = isFavorite
      ? favoriteIds.filter(id => id !== materialId)
      : [...favoriteIds, materialId];

    setFavoriteIds(nextFavoriteIds);
    try {
      if (isFavorite) {
        await educationFavoritesRepository.removeFavorite(materialId);
      } else {
        await educationFavoritesRepository.addFavorite(materialId);
      }
    } catch (error) {
      setFavoriteIds(favoriteIds);
      throw error;
    }
  };

  return { favoriteIds, isReady, toggleFavorite };
};
