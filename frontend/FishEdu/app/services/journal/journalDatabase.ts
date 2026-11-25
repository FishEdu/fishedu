
import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'fishedu-journal.db';

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

export async function getJournalDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!databasePromise) {
    databasePromise = (async () => {
      const db = await SQLite.openDatabaseAsync(DATABASE_NAME);

      await db.execAsync(`
        PRAGMA foreign_keys = ON;
        PRAGMA journal_mode = WAL;

        CREATE TABLE IF NOT EXISTS journal_entries (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          fished_on TEXT NOT NULL,
          fishing_spot TEXT NOT NULL,
          started_at TEXT,
          ended_at TEXT,
          method TEXT,
          temperature REAL,
          description TEXT,
          image_uri TEXT,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS journal_catches (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          journal_id INTEGER NOT NULL,
          fish_id INTEGER,
          fish_name TEXT,
          count INTEGER NOT NULL DEFAULT 1,
          total_length REAL,
          weight REAL,
          position INTEGER NOT NULL DEFAULT 0,

          FOREIGN KEY (journal_id)
            REFERENCES journal_entries(id)
            ON DELETE CASCADE
        );

        CREATE INDEX IF NOT EXISTS idx_journal_entries_fished_on
          ON journal_entries(fished_on);

        CREATE INDEX IF NOT EXISTS idx_journal_catches_journal_id
          ON journal_catches(journal_id);
      `);

      // Migracja: dodanie metody połowu do starszej bazy
      const columns = await db.getAllAsync<{ name: string }>(
        'PRAGMA table_info(journal_entries)'
      );

      const hasMethodColumn = columns.some(
        (column) => column.name === 'method'
      );

      if (!hasMethodColumn) {
        await db.execAsync(`
          ALTER TABLE journal_entries
          ADD COLUMN method TEXT;
        `);
      }

      await db.execAsync('PRAGMA user_version = 2;');

      return db;
    })().catch((error) => {
      databasePromise = null;
      throw error;
    });
  }

  return databasePromise;
}
