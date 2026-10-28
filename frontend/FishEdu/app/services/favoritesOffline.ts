
import AsyncStorage from "@react-native-async-storage/async-storage";

export type OfflineFavoriteKind = "fish" | "material";

export type OfflineFavorites = {
  fish_ids: number[];
  material_ids: number[];
};

export type PendingFavoriteChange = {
  changeId: string;
  kind: OfflineFavoriteKind;
  id: number;
  saved: boolean;
};

type OfflineState = {
  favorites: OfflineFavorites;
  pending: PendingFavoriteChange[];
};

const STORAGE_KEY = "@fishedu/favorites/offline-v1";

const emptyState = (): OfflineState => ({
  favorites: {
    fish_ids: [],
    material_ids: [],
  },
  pending: [],
});

let writeQueue: Promise<unknown> = Promise.resolve();

function serialize<T>(operation: () => Promise<T>): Promise<T> {
  const result = writeQueue.then(operation);
  writeQueue = result.then(
    () => undefined,
    () => undefined
  );
  return result;
}

async function readState(): Promise<OfflineState> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);

  if (!raw) return emptyState();

  const parsed = JSON.parse(raw) as OfflineState;

  return {
    favorites: {
      fish_ids: parsed.favorites?.fish_ids ?? [],
      material_ids: parsed.favorites?.material_ids ?? [],
    },
    pending: parsed.pending ?? [],
  };
}

async function writeState(state: OfflineState) {
  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(state)
  );
}

export async function getOfflineFavorites() {
  const state = await readState();
  return state.favorites;
}

export async function getPendingFavoriteChanges() {
  const state = await readState();
  return state.pending;
}

export async function saveFavoriteOffline(
  kind: OfflineFavoriteKind,
  id: number,
  saved: boolean
) {
  return serialize(async () => {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("Invalid favorite ID");
    }

    const state = await readState();

    const field =
      kind === "fish" ? "fish_ids" : "material_ids";

    const ids = state.favorites[field];

    state.favorites[field] = saved
      ? [...new Set([...ids, id])]
      : ids.filter(value => value !== id);

    // Zachowujemy tylko ostatnią zmianę dla tego elementu.
    state.pending = state.pending.filter(
      change => !(change.kind === kind && change.id === id)
    );

    state.pending.push({
      changeId: `${Date.now()}-${Math.random()}`,
      kind,
      id,
      saved,
    });

    await writeState(state);

    return state.favorites;
  });
}

export async function mergeServerFavorites(
  serverFavorites: OfflineFavorites
) {
  return serialize(async () => {
    const state = await readState();

    const result: OfflineFavorites = {
      fish_ids: [...serverFavorites.fish_ids],
      material_ids: [...serverFavorites.material_ids],
    };

    // Lokalne, niewysłane zmiany mają pierwszeństwo.
    for (const change of state.pending) {
      const field =
        change.kind === "fish"
          ? "fish_ids"
          : "material_ids";

      if (change.saved) {
        result[field] = [
          ...new Set([...result[field], change.id]),
        ];
      } else {
        result[field] = result[field].filter(
          id => id !== change.id
        );
      }
    }

    state.favorites = result;
    await writeState(state);

    return result;
  });
}

export async function confirmFavoriteSynced(
  changeId: string
) {
  return serialize(async () => {
    const state = await readState();

    state.pending = state.pending.filter(
      change => change.changeId !== changeId
    );

    await writeState(state);
  });
}
