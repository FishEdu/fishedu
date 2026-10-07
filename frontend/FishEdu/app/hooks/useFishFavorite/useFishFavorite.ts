import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const FAVORITE_FISH_IDS_KEY = "favoriteFishIds";

export const useFishFavorite = (fishId: number) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    let isActive = true;
    const loadFavorite = async () => {
      const rawFavoriteIds = await AsyncStorage.getItem(FAVORITE_FISH_IDS_KEY);
      const favoriteIds = rawFavoriteIds ? JSON.parse(rawFavoriteIds) as number[] : [];
      if (isActive) setIsFavorite(favoriteIds.includes(fishId));
    };
    if (!Number.isNaN(fishId)) void loadFavorite();
    return () => { isActive = false; };
  }, [fishId]);

  const toggleFavorite = async () => {
    const rawFavoriteIds = await AsyncStorage.getItem(FAVORITE_FISH_IDS_KEY);
    const favoriteIds = rawFavoriteIds ? JSON.parse(rawFavoriteIds) as number[] : [];
    const nextFavoriteIds = favoriteIds.includes(fishId)
      ? favoriteIds.filter((id) => id !== fishId)
      : [...favoriteIds, fishId];

    await AsyncStorage.setItem(FAVORITE_FISH_IDS_KEY, JSON.stringify(nextFavoriteIds));
    setIsFavorite(nextFavoriteIds.includes(fishId));
  }

  return { isFavorite, toggleFavorite };
};
