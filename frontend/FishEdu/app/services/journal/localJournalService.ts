
import * as SQLite from 'expo-sqlite';

import { getJournalDatabase } from './journalDatabase';

// Tryby wyszukiwania wpisów
export type JournalSearchMode = 'all' | 'fish' | 'spot';

// Typ pojedynczego złowionego gatunku
export type JournalCatch = {
  id: number;
  fish_id?: number | null;
  fish_name: string;
  count: number;
  total_length?: number | null;
  weight?: number | null;
};

// Typ całego wpisu Dziennika
export type FishingJournal = {
  id: number;
  fished_on: string;
  fishing_spot: string;
  started_at?: string | null;
  ended_at?: string | null;
  method?: string | null;
  description?: string | null;
  image_url?: string | null;
  catches: JournalCatch[];
  total_catches: number;
  created_at: string;
};

// Dane ryby przekazywane podczas dodawania lub edycji wpisu
export type JournalCatchInput = {
  fish_id?: number;
  fish_name: string;
  count: number;
  total_length?: number;
  weight?: number;
};

// Dane przekazywane podczas dodawania lub edycji wpisu
export type FishingJournalInput = {
  fished_on: string;
  fishing_spot: string;
  started_at?: string;
  ended_at?: string;
  method?: string;
  description?: string;
  image_url?: string | null;
  catches: JournalCatchInput[];
};

// Typ rekordu pobieranego bezpośrednio z SQLite
type JournalEntryRow = {
  id: number;
  fished_on: string;
  fishing_spot: string;
  started_at: string | null;
  ended_at: string | null;
  method: string | null;
  description: string | null;
  image_uri: string | null;
  created_at: string;
};

// Typ rekordu złowionej ryby z SQLite
type JournalCatchRow = {
  id: number;
  fish_id: number | null;
  fish_name: string | null;
  count: number;
  total_length: number | null;
  weight: number | null;
  position: number;
};

// Pobieranie ryb przypisanych do wpisu
async function getJournalCatches(
  db: SQLite.SQLiteDatabase,
  journalId: number
): Promise<JournalCatch[]> {
  const catches = await db.getAllAsync<JournalCatchRow>(
    `
      SELECT *
      FROM journal_catches
      WHERE journal_id = ?
      ORDER BY position ASC, id ASC
    `,
    journalId
  );

  return catches.map((item) => ({
    id: item.id,
    fish_id: item.fish_id,
    fish_name: item.fish_name ?? '',
    count: item.count,
    total_length: item.total_length,
    weight: item.weight,
  }));
}

// Pobieranie pojedynczego wpisu po ID
export async function getLocalJournalById(
  id: number
): Promise<FishingJournal | null> {
  const db = await getJournalDatabase();

  const entry = await db.getFirstAsync<JournalEntryRow>(
    `
      SELECT *
      FROM journal_entries
      WHERE id = ?
    `,
    id
  );

  if (!entry) {
    return null;
  }

  const catches = await getJournalCatches(db, id);

  return {
    id: entry.id,
    fished_on: entry.fished_on,
    fishing_spot: entry.fishing_spot,
    started_at: entry.started_at,
    ended_at: entry.ended_at,
    method: entry.method,
    description: entry.description,
    image_url: entry.image_uri,
    catches,
    total_catches: catches.reduce(
      (total, item) => total + item.count,
      0
    ),
    created_at: entry.created_at,
  };
}

// Pobieranie wpisów z możliwością wyszukiwania
export async function getLocalJournals(
  query = '',
  mode: JournalSearchMode = 'all'
): Promise<FishingJournal[]> {
  const db = await getJournalDatabase();

  const normalizedQuery = query.trim();

  let entries: JournalEntryRow[];

  if (normalizedQuery) {
    const search = `%${normalizedQuery}%`;

    if (mode === 'spot') {
      // Wyszukiwanie wyłącznie po łowisku
      entries = await db.getAllAsync<JournalEntryRow>(
        `
          SELECT *
          FROM journal_entries
          WHERE fishing_spot LIKE ?
          ORDER BY fished_on DESC, created_at DESC
        `,
        search
      );
    } else if (mode === 'fish') {
      // Wyszukiwanie wyłącznie po nazwach złowionych ryb
      entries = await db.getAllAsync<JournalEntryRow>(
        `
          SELECT *
          FROM journal_entries
          WHERE EXISTS (
            SELECT 1
            FROM journal_catches
            WHERE journal_catches.journal_id = journal_entries.id
              AND COALESCE(journal_catches.fish_name, '') LIKE ?
          )
          ORDER BY fished_on DESC, created_at DESC
        `,
        search
      );
    } else {
      // Wyszukiwanie po wszystkich dostępnych polach
      entries = await db.getAllAsync<JournalEntryRow>(
        `
          SELECT *
          FROM journal_entries
          WHERE fishing_spot LIKE ?
            OR COALESCE(description, '') LIKE ?
            OR EXISTS (
              SELECT 1
              FROM journal_catches
              WHERE journal_catches.journal_id = journal_entries.id
                AND COALESCE(journal_catches.fish_name, '') LIKE ?
            )
          ORDER BY fished_on DESC, created_at DESC
        `,
        search,
        search,
        search
      );
    }
  } else {
    // Brak wyszukiwanej frazy – pobieramy wszystkie wpisy
    entries = await db.getAllAsync<JournalEntryRow>(
      `
        SELECT *
        FROM journal_entries
        ORDER BY fished_on DESC, created_at DESC
      `
    );
  }

  return Promise.all(
    entries.map(async (entry) => {
      const catches = await getJournalCatches(db, entry.id);

      return {
        id: entry.id,
        fished_on: entry.fished_on,
        fishing_spot: entry.fishing_spot,
        started_at: entry.started_at,
        ended_at: entry.ended_at,
        method: entry.method,
        description: entry.description,
        image_url: entry.image_uri,
        catches,
        total_catches: catches.reduce(
          (total, item) => total + item.count,
          0
        ),
        created_at: entry.created_at,
      };
    })
  );
}

// Dodawanie ryb do wpisu
async function insertJournalCatches(
  db: SQLite.SQLiteDatabase,
  journalId: number,
  catches: JournalCatchInput[]
): Promise<void> {
  for (const [index, item] of catches.entries()) {
    await db.runAsync(
      `
        INSERT INTO journal_catches (
          journal_id,
          fish_id,
          fish_name,
          count,
          total_length,
          weight,
          position
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      journalId,
      item.fish_id ?? null,
      item.fish_name,
      item.count,
      item.total_length ?? null,
      item.weight ?? null,
      index
    );
  }
}

// Tworzenie nowego wpisu
export async function createLocalJournal(
  input: FishingJournalInput
): Promise<FishingJournal> {
  const db = await getJournalDatabase();

  const now = new Date().toISOString();

  let journalId = 0;

  await db.withTransactionAsync(async () => {
    const result = await db.runAsync(
        `
            INSERT INTO journal_entries (
            fished_on,
            fishing_spot,
            started_at,
            ended_at,
            method,
            description,
            image_uri,
            created_at,
            updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        input.fished_on,
        input.fishing_spot,
        input.started_at ?? null,
        input.ended_at ?? null,
        input.method ?? null,
        input.description ?? null,
        input.image_url ?? null,
        now,
        now
        );

    journalId = result.lastInsertRowId;

    await insertJournalCatches(
      db,
      journalId,
      input.catches ?? []
    );
  });

  const createdJournal = await getLocalJournalById(journalId);

  if (!createdJournal) {
    throw new Error('Nie udało się pobrać utworzonego wpisu.');
  }

  return createdJournal;
}

// Aktualizacja istniejącego wpisu
export async function updateLocalJournal(
  id: number,
  input: FishingJournalInput
): Promise<FishingJournal> {
  const db = await getJournalDatabase();

  const now = new Date().toISOString();

  await db.withTransactionAsync(async () => {
    const result = await db.runAsync(
        `
            UPDATE journal_entries
            SET
            fished_on = ?,
            fishing_spot = ?,
            started_at = ?,
            ended_at = ?,
            method = ?,
            description = ?,
            image_uri = ?,
            updated_at = ?
            WHERE id = ?
        `,
        input.fished_on,
        input.fishing_spot,
        input.started_at ?? null,
        input.ended_at ?? null,
        input.method ?? null,
        input.description ?? null,
        input.image_url ?? null,
        now,
        id
        );

    if (result.changes === 0) {
      throw new Error('Nie znaleziono wpisu do edycji.');
    }

    await db.runAsync(
      'DELETE FROM journal_catches WHERE journal_id = ?',
      id
    );

    await insertJournalCatches(
      db,
      id,
      input.catches ?? []
    );
  });

  const updatedJournal = await getLocalJournalById(id);

  if (!updatedJournal) {
    throw new Error('Nie udało się pobrać zaktualizowanego wpisu.');
  }

  return updatedJournal;
}

// Usuwanie wpisu
export async function deleteLocalJournal(
  id: number
): Promise<boolean> {
  const db = await getJournalDatabase();

  const result = await db.runAsync(
    'DELETE FROM journal_entries WHERE id = ?',
    id
  );

  return result.changes > 0;
}

// Pobieranie unikalnych łowisk zapisanych w lokalnym Dzienniku
export async function getLocalJournalSpots(
  query = ''
): Promise<string[]> {
  const db = await getJournalDatabase();

  const normalizedQuery = query.trim();

  const spots = normalizedQuery
    ? await db.getAllAsync<{ fishing_spot: string }>(
        `
          SELECT DISTINCT TRIM(fishing_spot) AS fishing_spot
          FROM journal_entries
          WHERE TRIM(COALESCE(fishing_spot, '')) <> ''
            AND LOWER(TRIM(fishing_spot)) LIKE LOWER(?)
          ORDER BY fishing_spot COLLATE NOCASE ASC
          LIMIT 15
        `,
        `%${normalizedQuery}%`
      )
    : await db.getAllAsync<{ fishing_spot: string }>(
        `
          SELECT DISTINCT TRIM(fishing_spot) AS fishing_spot
          FROM journal_entries
          WHERE TRIM(COALESCE(fishing_spot, '')) <> ''
          ORDER BY fishing_spot COLLATE NOCASE ASC
          LIMIT 15
        `
      );

  return spots.map((spot) => spot.fishing_spot);
}