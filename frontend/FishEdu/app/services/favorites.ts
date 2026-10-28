
import AsyncStorage from "@react-native-async-storage/async-storage";

import { FishGetResponse } from "@/app/api/fish";
import { EducationMaterial } from "@/app/api/education";
import { getBaseApiUrl } from "@/app/utils/getBaseApiUrl";

import {
  confirmFavoriteSynced,
  getOfflineFavorites,
  getPendingFavoriteChanges,
  mergeServerFavorites,
  saveFavoriteOffline,
} from "./favoritesOffline";

export type FavoriteKind = "fish" | "material";

export type Favorites = {
  fish_ids: number[];
  material_ids: number[];
  fish: FishGetResponse[];
  materials: EducationMaterial[];
};

export const emptyFavorites: Favorites = {
  fish_ids: [],
  material_ids: [],
  fish: [],
  materials: [],
};

const listeners = new Set<() => void>();
const sessions = new Map<string, Promise<string>>();
const migrations = new Map<string, Promise<void>>();

let networkQueue: Promise<void> = Promise.resolve();

function notifyFavorites() {
  listeners.forEach(listener => listener());
}

export function subscribeFavorites(
  listener: () => void
) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

// Zapobiega nakładaniu się synchronizacji i pobierania
// danych z serwera.
function withNetworkLock<T>(
  operation: () => Promise<T>
): Promise<T> {
  const result = networkQueue.then(operation);

  networkQueue = result.then(
    () => undefined,
    () => undefined
  );

  return result;
}

function detailsKey(language: string) {
  return `favorites.details:v1:${getBaseApiUrl()}:${language}`;
}

// Obsługa zapytań HTTP.
async function request(
  base: string,
  path: string,
  method: string,
  token?: string
): Promise<any> {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    15000
  );

  try {
    const response = await fetch(
      `${base}/favorites${path}`,
      {
        method,
        signal: controller.signal,
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : {},
      }
    );

    if (!response.ok) {
      throw new Error(
        `Favorites request failed (${response.status})`
      );
    }

    // PUT i DELETE mogą zwracać 204 bez treści.
    const text = await response.text();

    return text ? JSON.parse(text) : null;
  } finally {
    clearTimeout(timeout);
  }
}

// Anonimowa sesja przechowywana na urządzeniu.
async function getSession(base: string): Promise<string> {
  let session = sessions.get(base);

  if (!session) {
    session = (async () => {
      const key = `favorites.session:${base}`;
      const stored = await AsyncStorage.getItem(key);

      if (stored) return stored;

      const result = await request(
        base,
        "/session",
        "POST"
      );

      if (
        typeof result?.token !== "string" ||
        !result.token
      ) {
        throw new Error("Invalid favorite session");
      }

      await AsyncStorage.setItem(
        key,
        result.token
      );

      return result.token;
    })();

    sessions.set(base, session);
  }

  try {
    return await session;
  } catch (error) {
    sessions.delete(base);
    throw error;
  }
}

// Jednorazowy import starych ulubionych do
// nowego lokalnego magazynu.
async function importLegacyFavorites() {
  const base = getBaseApiUrl();
  let migration = migrations.get(base);

  if (!migration) {
    migration = (async () => {
      const marker = `favorites.offline-imported:${base}`;

      if (await AsyncStorage.getItem(marker)) {
        return;
      }

      // Jeśli wcześniejszy mechanizm już przesłał
      // dane na serwer, nie importujemy ich ponownie.
      const alreadyImported =
        await AsyncStorage.getItem(
          `favorites.imported:${base}`
        );

      if (!alreadyImported) {
        const sources = [
          ["fish", "favoriteFishIds"],
          ["material", "favoriteEducationMaterialIds"],
        ] as const;

        for (const [kind, key] of sources) {
          const raw = await AsyncStorage.getItem(key);
          const ids: unknown = raw
            ? JSON.parse(raw)
            : [];

          if (!Array.isArray(ids)) continue;

          for (const id of ids) {
            if (
              typeof id === "number" &&
              Number.isSafeInteger(id) &&
              id > 0
            ) {
              await saveFavoriteOffline(
                kind,
                id,
                true
              );
            }
          }
        }
      }

      await AsyncStorage.setItem(marker, "1");
    })();

    migrations.set(base, migration);
  }

  try {
    await migration;
  } catch (error) {
    migrations.delete(base);
    throw error;
  }
}

// Odczyt z telefonu, bez wymagania internetu.
export async function getCachedFavorites(
  language: string
): Promise<Favorites> {
  await importLegacyFavorites();

  const [local, raw] = await Promise.all([
    getOfflineFavorites(),
    AsyncStorage.getItem(detailsKey(language)),
  ]);

  let details: Partial<Favorites> = {};

  if (raw) {
    try {
      details = JSON.parse(raw);
    } catch {
      details = {};
    }
  }

  const fish = Array.isArray(details.fish)
    ? details.fish
    : [];

  const materials = Array.isArray(details.materials)
    ? details.materials
    : [];

  return {
    fish_ids: local.fish_ids,
    material_ids: local.material_ids,
    fish: fish.filter(item =>
      local.fish_ids.includes(item.id)
    ),
    materials: materials.filter(item =>
      local.material_ids.includes(item.id)
    ),
  };
}

// Wysyłanie oczekujących zmian do serwera.
// Wywoływane wewnątrz blokady sieciowej.
async function flushPending(
  base: string,
  token: string
) {
  const changes = await getPendingFavoriteChanges();

  for (const change of changes) {
    const current =
      (await getPendingFavoriteChanges()).find(
        item =>
          item.kind === change.kind &&
          item.id === change.id
      );

    if (current?.changeId !== change.changeId) {
      continue;
    }

    try {
      await request(
        base,
        `/${change.kind}/${change.id}`,
        change.saved ? "PUT" : "DELETE",
        token
      );
    } catch (error) {

      const notFound =
        error instanceof Error &&
        error.message.endsWith("(404)");

      if (!notFound) {
        throw error;
      }
    }

    await confirmFavoriteSynced(
      change.changeId
    );
  }
}

async function syncPendingChanges() {
  await withNetworkLock(async () => {
    const base = getBaseApiUrl();
    const token = await getSession(base);

    await flushPending(base, token);
  });
}

async function combineFavorites(
  server: Favorites,
  language: string
): Promise<Favorites> {
  if (
    !Array.isArray(server?.fish_ids) ||
    !Array.isArray(server?.material_ids) ||
    !Array.isArray(server?.fish) ||
    !Array.isArray(server?.materials)
  ) {
    throw new Error("Invalid favorites response");
  }

  const ids = await mergeServerFavorites(server);
  const cached = await getCachedFavorites(language);

  const fishMap = new Map<number, FishGetResponse>();
  const materialMap =
    new Map<number, EducationMaterial>();

  for (const item of [
    ...cached.fish,
    ...server.fish,
  ]) {
    fishMap.set(item.id, item);
  }

  for (const item of [
    ...cached.materials,
    ...server.materials,
  ]) {
    materialMap.set(item.id, item);
  }

  const result: Favorites = {
    fish_ids: ids.fish_ids,
    material_ids: ids.material_ids,
    fish: ids.fish_ids
      .map(id => fishMap.get(id))
      .filter(
        (item): item is FishGetResponse =>
          item !== undefined
      ),
    materials: ids.material_ids
      .map(id => materialMap.get(id))
      .filter(
        (item): item is EducationMaterial =>
          item !== undefined
      ),
  };

  await AsyncStorage.setItem(
    detailsKey(language),
    JSON.stringify({
      fish: result.fish,
      materials: result.materials,
    })
  );

  return result;
}

// Pobranie z serwera i połączenie z pamięcią lokalną.
export async function fetchFavorites(
  language: string
): Promise<Favorites> {
  await importLegacyFavorites();

  return withNetworkLock(async () => {
    const base = getBaseApiUrl();
    const token = await getSession(base);

    await flushPending(base, token);

    const server = (await request(
      base,
      `?language=${encodeURIComponent(language)}`,
      "GET",
      token
    )) as Favorites;

    return combineFavorites(server, language);
  });
}

// Najpierw zapis lokalny, potem synchronizacja.
export async function setFavorite(
  kind: FavoriteKind,
  id: number,
  saved: boolean
): Promise<void> {
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error("Invalid item ID");
  }

  await importLegacyFavorites();

  await saveFavoriteOffline(kind, id, saved);

  // Odświeżamy widoki już po zapisaniu lokalnym.
  notifyFavorites();


  // Kolejka zostanie ponowiona później.
  void syncPendingChanges().then(
    () => notifyFavorites(),
    () => undefined
  );
}
