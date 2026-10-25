
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useFocusEffect,
} from "expo-router";

import { Alert } from "react-native";
import NetInfo from "@react-native-community/netinfo";

import {
  useLanguage,
} from "@/app/hooks/useLanguage/useLanguage";

import {
  emptyFavorites,
  FavoriteKind,
  fetchFavorites,
  getCachedFavorites,
  setFavorite,
  subscribeFavorites,
} from "@/app/services/favorites";

export function useFavorites() {
  const { languageCode } = useLanguage();

  const [favorites, setFavorites] =
    useState(emptyFavorites);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [ready, setReady] = useState(false);

  const busy = useRef(new Set<string>());
  const reload = useRef<() => void>(() => {});

  useFocusEffect(
    useCallback(() => {
      let active = true;
      let generation = 0;

      const load = async () => {
        const current = ++generation;

        setLoading(true);

        // 1. Najpierw dane lokalne.
        try {
          const cached = await getCachedFavorites(
            languageCode
          );

          if (active && current === generation) {
            setFavorites(cached);
            setReady(true);
            setError(false);
            setLoading(false);
          }
        } catch {
          if (active && current === generation) {
            setReady(false);
            setError(true);
          }
        }

        // 2. Potem synchronizacja z serwerem.
        try {
          const remote = await fetchFavorites(
            languageCode
          );

          if (active && current === generation) {
            setFavorites(remote);
            setReady(true);
            setError(false);
          }
        } catch {
          if (active && current === generation) {
            // Pozostawiamy dane lokalne.
            setError(true);
          }
        } finally {
          if (active && current === generation) {
            setLoading(false);
          }
        }
      };

      reload.current = () => {
        void load();
      };

      const unsubscribe =
        subscribeFavorites(reload.current);

      void load();

      return () => {
        active = false;
        unsubscribe();
        reload.current = () => {};
      };
    }, [languageCode])
  );

  // Ponów synchronizację po odzyskaniu internetu.
  useEffect(() => {
    let wasOnline: boolean | null = null;

    const unsubscribe = NetInfo.addEventListener(
      state => {
        const online =
          state.isConnected === true &&
          state.isInternetReachable !== false;

        if (wasOnline === false && online) {
          reload.current();
        }

        wasOnline = online;
      }
    );

    return unsubscribe;
  }, []);

  const toggleFavorite = async (
    kind: FavoriteKind,
    id: number
  ) => {
    const key = `${kind}:${id}`;

    if (busy.current.has(key)) return;

    if (!ready) {
      Alert.alert(
        languageCode === "pl"
          ? "Ulubione"
          : "Favorites",
        languageCode === "pl"
          ? "Nie udało się odczytać lokalnych danych."
          : "Could not read local favorites."
      );
      return;
    }

    busy.current.add(key);

    const ids =
      kind === "fish"
        ? favorites.fish_ids
        : favorites.material_ids;

    const saved = !ids.includes(id);

    try {
      await setFavorite(kind, id, saved);

      setFavorites(current => {
        const field =
          kind === "fish"
            ? "fish_ids"
            : "material_ids";

        return {
          ...current,
          [field]: saved
            ? [
                ...new Set([
                  ...current[field],
                  id,
                ]),
              ]
            : current[field].filter(
                value => value !== id
              ),
        };
      });
    } catch {
      Alert.alert(
        languageCode === "pl"
          ? "Błąd zapisu"
          : "Save error",
        languageCode === "pl"
          ? "Nie udało się zapisać ulubionych na urządzeniu."
          : "Could not save favorites on this device."
      );
    } finally {
      busy.current.delete(key);
    }
  };

  return {
    favorites,
    loading,
    error,
    ready,
    toggleFavorite,
    refresh: () => reload.current(),
  };
}
