
import JSZip from "jszip";

import * as Sharing from "expo-sharing";
import * as FileSystemLegacy from "expo-file-system/legacy";

import {
  Directory,
  File,
  Paths,
} from "expo-file-system";

import { Platform } from "react-native";

import { getJournalDatabase } from "./journalDatabase";

const BACKUP_FORMAT = "fishedu-journal-backup";
const BACKUP_VERSION = 1;
const MANIFEST_FILE = "journal-backup.json";

type JournalEntryRow = {
  id: number;
  fished_on: string;
  fishing_spot: string;
  started_at: string | null;
  ended_at: string | null;
  method: string | null;
  temperature: number | null;
  description: string | null;
  image_uri: string | null;
  created_at: string;
  updated_at: string;
};

type JournalCatchRow = {
  id: number;
  journal_id: number;
  fish_id: number | null;
  fish_name: string | null;
  count: number;
  total_length: number | null;
  weight: number | null;
  position: number;
};

type BackupCatch = {
  id: number;
  fish_id: number | null;
  fish_name: string | null;
  count: number;
  total_length: number | null;
  weight: number | null;
  position: number;
};

type BackupEntry = {
  id: number;
  fished_on: string;
  fishing_spot: string;
  started_at: string | null;
  ended_at: string | null;
  method: string | null;
  temperature: number | null;
  description: string | null;
  image_file: string | null;
  created_at: string;
  updated_at: string;
  catches: BackupCatch[];
};

type BackupManifest = {
  format: typeof BACKUP_FORMAT;
  version: typeof BACKUP_VERSION;
  created_at: string;
  entries: BackupEntry[];
};

type ArchiveResult = {
  bytes: Uint8Array;
  entriesCount: number;
  catchesCount: number;
  photosCount: number;
  missingPhotosCount: number;
};

export type JournalBackupImportResult = {
  entriesCount: number;
  catchesCount: number;
  photosCount: number;
  safetyBackupFileName: string | null;
};

function getFileExtension(uri: string): string {
  const extension = uri
    .split("?")[0]
    .split(".")
    .pop()
    ?.toLowerCase();

  return ["jpg", "jpeg", "png", "webp"].includes(extension ?? "")
    ? extension!
    : "jpg";
}

async function readPhotoBytes(uri: string): Promise<Uint8Array> {
  if (/^https?:\/\//i.test(uri)) {
    const response = await fetch(uri);

    if (!response.ok) {
      throw new Error("Nie udało się pobrać zdjęcia.");
    }

    return new Uint8Array(await response.arrayBuffer());
  }

  const file = new File(uri);

  if (!file.exists) {
    throw new Error("Plik zdjęcia nie istnieje.");
  }

  return await file.bytes();
}

async function buildJournalArchive(
  allowMissingPhotos = false
): Promise<ArchiveResult> {
  const db = await getJournalDatabase();

  const entries = await db.getAllAsync<JournalEntryRow>(
    `
      SELECT *
      FROM journal_entries
      ORDER BY id ASC
    `
  );

  const catches = await db.getAllAsync<JournalCatchRow>(
    `
      SELECT *
      FROM journal_catches
      ORDER BY journal_id ASC, position ASC, id ASC
    `
  );

  const catchesByJournal = new Map<number, BackupCatch[]>();

  for (const item of catches) {
    const current = catchesByJournal.get(item.journal_id) ?? [];

    current.push({
      id: item.id,
      fish_id: item.fish_id,
      fish_name: item.fish_name,
      count: item.count,
      total_length: item.total_length,
      weight: item.weight,
      position: item.position,
    });

    catchesByJournal.set(item.journal_id, current);
  }

  const zip = new JSZip();

  const backupEntries: BackupEntry[] = [];

  let photosCount = 0;
  let missingPhotosCount = 0;

  for (const entry of entries) {
    let imageFile: string | null = null;

    if (entry.image_uri) {
      const extension = getFileExtension(entry.image_uri);

      imageFile = `photos/entry_${entry.id}.${extension}`;

      try {
        const photoBytes = await readPhotoBytes(entry.image_uri);

        zip.file(imageFile, photoBytes, {
          compression: "STORE",
        });

        photosCount += 1;
      } catch {
        if (!allowMissingPhotos) {
          throw new Error(
            `Nie udało się dołączyć zdjęcia z wpisu nr ${entry.id}. ` +
            "Sprawdź, czy zdjęcie jest nadal dostępne."
          );
        }

        imageFile = null;
        missingPhotosCount += 1;
      }
    }

    backupEntries.push({
      id: entry.id,
      fished_on: entry.fished_on,
      fishing_spot: entry.fishing_spot,
      started_at: entry.started_at,
      ended_at: entry.ended_at,
      method: entry.method,
      temperature: entry.temperature,
      description: entry.description,
      image_file: imageFile,
      created_at: entry.created_at,
      updated_at: entry.updated_at,
      catches: catchesByJournal.get(entry.id) ?? [],
    });
  }

  const manifest: BackupManifest = {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    created_at: new Date().toISOString(),
    entries: backupEntries,
  };

  zip.file(
    MANIFEST_FILE,
    JSON.stringify(manifest, null, 2)
  );

  const bytes = await zip.generateAsync({
    type: "uint8array",
    compression: "DEFLATE",
    compressionOptions: {
      level: 6,
    },
  });

  return {
    bytes,
    entriesCount: entries.length,
    catchesCount: catches.length,
    photosCount,
    missingPhotosCount,
  };
}

async function saveArchive(
  directory: Directory,
  fileName: string,
  bytes: Uint8Array
): Promise<File> {
  directory.create({
    intermediates: true,
    idempotent: true,
  });

  const file = new File(directory, fileName);

  if (file.exists) {
    file.delete();
  }

  file.create({
    intermediates: true,
  });

  file.write(bytes);

  return file;
}

function createFileStamp(): string {
  return new Date()
    .toISOString()
    .replace(/[:.]/g, "-");
}

function isPickerCancelled(error: unknown): boolean {
  if (
    typeof error !== "object" ||
    error === null ||
    !("code" in error)
  ) {
    return false;
  }

  const code = (error as { code?: unknown }).code;

  return (
    code === "ERR_PICKER_CANCELLED" ||
    code === "ERR_CANCELED"
  );
}

// =====================================================
// EKSPORT DZIENNIKA
// =====================================================

export async function exportJournalBackup() {
  const fileName = `fishedu-dziennik-${createFileStamp()}.zip`;

  // ANDROID – wybór folderu i zapis na urządzeniu.
  if (Platform.OS === "android") {
    let selectedDirectory: Directory;

    try {
      selectedDirectory = await Directory.pickDirectoryAsync();
    } catch (error) {
      if (isPickerCancelled(error)) {
        return null;
      }

      throw error;
    }

    const archive = await buildJournalArchive();

    const destinationFile = selectedDirectory.createFile(
      fileName,
      "application/zip"
    );

    destinationFile.write(archive.bytes);

    return {
      fileName,
      entriesCount: archive.entriesCount,
      catchesCount: archive.catchesCount,
      photosCount: archive.photosCount,
      savedTo: "device" as const,
      directoryName: selectedDirectory.name,
    };
  }

  // IOS – systemowe okno udostępniania.
  const archive = await buildJournalArchive();

  const file = await saveArchive(
    Paths.cache,
    fileName,
    archive.bytes
  );

  const sharingAvailable = await Sharing.isAvailableAsync();

  if (!sharingAvailable) {
    throw new Error(
      "Udostępnianie plików nie jest dostępne na tym urządzeniu."
    );
  }

  await Sharing.shareAsync(file.uri, {
    mimeType: "application/zip",
    dialogTitle: "Eksportuj Dziennik",
    UTI: "public.zip-archive",
  });

  return {
    fileName,
    entriesCount: archive.entriesCount,
    catchesCount: archive.catchesCount,
    photosCount: archive.photosCount,
    savedTo: "sharing" as const,
    directoryName: null,
  };
}

// =====================================================
// WALIDACJA KOPII ZAPASOWEJ
// =====================================================

function requiredString(value: unknown, field: string): string {
  if (typeof value !== "string") {
    throw new Error(
      `Nieprawidłowe pole kopii zapasowej: ${field}`
    );
  }

  return value;
}

function nullableString(
  value: unknown,
  field: string
): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value !== "string") {
    throw new Error(
      `Nieprawidłowe pole kopii zapasowej: ${field}`
    );
  }

  return value;
}

function nullableNumber(
  value: unknown,
  field: string
): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    throw new Error(
      `Nieprawidłowe pole kopii zapasowej: ${field}`
    );
  }

  return value;
}

function parseBackupManifest(value: unknown): BackupManifest {
  if (!value || typeof value !== "object") {
    throw new Error("Nieprawidłowy plik kopii zapasowej.");
  }

  const raw = value as Record<string, any>;

  if (
    raw.format !== BACKUP_FORMAT ||
    raw.version !== BACKUP_VERSION ||
    !Array.isArray(raw.entries)
  ) {
    throw new Error(
      "Plik nie jest obsługiwaną kopią zapasową FishEdu."
    );
  }

  const entryIds = new Set<number>();
  const catchIds = new Set<number>();

  const entries: BackupEntry[] = raw.entries.map((item: any) => {
    if (
      !Number.isSafeInteger(item.id) ||
      item.id <= 0 ||
      entryIds.has(item.id)
    ) {
      throw new Error(
        "Kopia zawiera nieprawidłowe identyfikatory wpisów."
      );
    }

    entryIds.add(item.id);

    if (!Array.isArray(item.catches)) {
      throw new Error("Nieprawidłowa lista złowionych ryb.");
    }

    const imageFile = item.image_file ?? null;

    if (
      imageFile !== null &&
      (
        typeof imageFile !== "string" ||
        !new RegExp(
          `^photos/entry_${item.id}\\.(jpg|jpeg|png|webp)$`,
          "i"
        ).test(imageFile)
      )
    ) {
      throw new Error(
        "Nieprawidłowa ścieżka zdjęcia w kopii."
      );
    }

    const entryCatches: BackupCatch[] = item.catches.map(
      (fish: any) => {
        if (
          !Number.isSafeInteger(fish.id) ||
          fish.id <= 0 ||
          catchIds.has(fish.id)
        ) {
          throw new Error(
            "Kopia zawiera nieprawidłowe dane ryb."
          );
        }

        catchIds.add(fish.id);

        if (
          !Number.isSafeInteger(fish.count) ||
          fish.count < 1 ||
          !Number.isSafeInteger(fish.position) ||
          fish.position < 0
        ) {
          throw new Error(
            "Nieprawidłowa liczba lub kolejność ryb."
          );
        }

        return {
          id: fish.id,
          fish_id: nullableNumber(
            fish.fish_id,
            "fish_id"
          ),
          fish_name: nullableString(
            fish.fish_name,
            "fish_name"
          ),
          count: fish.count,
          total_length: nullableNumber(
            fish.total_length,
            "total_length"
          ),
          weight: nullableNumber(
            fish.weight,
            "weight"
          ),
          position: fish.position,
        };
      }
    );

    return {
      id: item.id,
      fished_on: requiredString(
        item.fished_on,
        "fished_on"
      ),
      fishing_spot: requiredString(
        item.fishing_spot,
        "fishing_spot"
      ),
      started_at: nullableString(
        item.started_at,
        "started_at"
      ),
      ended_at: nullableString(
        item.ended_at,
        "ended_at"
      ),
      method: nullableString(
        item.method,
        "method"
      ),
      temperature: nullableNumber(
        item.temperature,
        "temperature"
      ),
      description: nullableString(
        item.description,
        "description"
      ),
      image_file: imageFile,
      created_at: requiredString(
        item.created_at,
        "created_at"
      ),
      updated_at: requiredString(
        item.updated_at,
        "updated_at"
      ),
      catches: entryCatches,
    };
  });

  return {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    created_at: requiredString(
      raw.created_at,
      "created_at"
    ),
    entries,
  };
}

// =====================================================
// KOPIA BEZPIECZEŃSTWA PRZED IMPORTEM
// =====================================================

async function createSafetyBackup(): Promise<string | null> {
  const db = await getJournalDatabase();

  const result = await db.getFirstAsync<{ total: number }>(
    "SELECT COUNT(*) AS total FROM journal_entries"
  );

  if (!result || result.total === 0) {
    return null;
  }

  // Brakujące stare zdjęcia nie blokują utworzenia kopii.
  const archive = await buildJournalArchive(true);

  const fileName =
    `fishedu-before-import-${createFileStamp()}.zip`;

  const backupDirectory = new Directory(
    Paths.document,
    "journal-backups"
  );

  await saveArchive(
    backupDirectory,
    fileName,
    archive.bytes
  );

  return fileName;
}

// =====================================================
// IMPORT DZIENNIKA
// =====================================================

export async function importJournalBackup():
  Promise<JournalBackupImportResult | null> {

  // Systemowy wybór pliku.
  const selection = await File.pickFileAsync({
    mimeTypes: ["*/*"],
  });

  if (selection.canceled) {
    return null;
  }

  const selectedFile = selection.result;

  const cacheDirectory = FileSystemLegacy.cacheDirectory;

  if (!cacheDirectory) {
    throw new Error(
      "Nie można uzyskać dostępu do pamięci tymczasowej aplikacji."
    );
  }

  const temporaryZipUri =
    `${cacheDirectory}fishedu-import-${Date.now()}.zip`;

  let zipBase64: string;

  try {
    // Kopiujemy plik z systemowego wyboru do pamięci aplikacji.
    // Obsługuje również źródła content:// na Androidzie.
    await FileSystemLegacy.copyAsync({
      from: selectedFile.uri,
      to: temporaryZipUri,
    });

    // Odczytujemy lokalną kopię jako Base64.
    zipBase64 = await FileSystemLegacy.readAsStringAsync(
      temporaryZipUri,
      {
        encoding: "base64",
      }
    );
  } catch (error) {
    throw new Error(
      "Nie udało się odczytać wybranego pliku ZIP. " +
      (error instanceof Error ? error.message : "")
    );
  } finally {
    // Usuwamy tymczasowy plik.
    await FileSystemLegacy.deleteAsync(
      temporaryZipUri,
      {
        idempotent: true,
      }
    ).catch(() => {});
  }

  let zip: JSZip;

  try {
    zip = await JSZip.loadAsync(zipBase64, {
      base64: true,
    });
  } catch {
    throw new Error(
      "Nie udało się otworzyć wybranego pliku ZIP."
    );
  }

  const manifestFile = zip.file(MANIFEST_FILE);

  if (!manifestFile) {
    throw new Error(
      "W pliku ZIP nie znaleziono danych Dziennika."
    );
  }

  let rawManifest: unknown;

  try {
    rawManifest = JSON.parse(
      await manifestFile.async("string")
    );
  } catch {
    throw new Error(
      "Dane kopii zapasowej są uszkodzone."
    );
  }

  const manifest = parseBackupManifest(rawManifest);

  // Sprawdzamy wszystkie zdjęcia przed zmianą bazy danych.
  for (const entry of manifest.entries) {
    if (
      entry.image_file &&
      !zip.file(entry.image_file)
    ) {
      throw new Error(
        `W kopii brakuje zdjęcia z wpisu nr ${entry.id}.`
      );
    }
  }

  // Zachowujemy obecną zawartość Dziennika przed importem.
  const safetyBackupFileName = await createSafetyBackup();

  const photoDirectory = new Directory(
    Paths.document,
    "journal-photos"
  );

  photoDirectory.create({
    intermediates: true,
    idempotent: true,
  });

  const photoUris = new Map<number, string>();

  const importStamp = createFileStamp();

  let photosCount = 0;

  // Najpierw zapisujemy zdjęcia w trwałym katalogu aplikacji.
  for (const [index, entry] of manifest.entries.entries()) {
    if (!entry.image_file) {
      continue;
    }

    const photoInZip = zip.file(entry.image_file)!;

    const photoBytes = await photoInZip.async("uint8array");

    const extension = getFileExtension(entry.image_file);

    const fileName =
      `journal_${importStamp}_${entry.id}_${index}.${extension}`;

    const destination = new File(
      photoDirectory,
      fileName
    );

    destination.create({
      intermediates: true,
    });

    destination.write(photoBytes);

    photoUris.set(entry.id, destination.uri);

    photosCount += 1;
  }

  const db = await getJournalDatabase();

  // Dopiero teraz zastępujemy dane w SQLite.
  await db.withTransactionAsync(async () => {
    await db.runAsync("DELETE FROM journal_catches");
    await db.runAsync("DELETE FROM journal_entries");

    for (const entry of manifest.entries) {
      await db.runAsync(
        `
          INSERT INTO journal_entries (
            id,
            fished_on,
            fishing_spot,
            started_at,
            ended_at,
            method,
            temperature,
            description,
            image_uri,
            created_at,
            updated_at
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        entry.id,
        entry.fished_on,
        entry.fishing_spot,
        entry.started_at,
        entry.ended_at,
        entry.method,
        entry.temperature,
        entry.description,
        photoUris.get(entry.id) ?? null,
        entry.created_at,
        entry.updated_at
      );

      for (const fish of entry.catches) {
        await db.runAsync(
          `
            INSERT INTO journal_catches (
              id,
              journal_id,
              fish_id,
              fish_name,
              count,
              total_length,
              weight,
              position
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `,
          fish.id,
          entry.id,
          fish.fish_id,
          fish.fish_name,
          fish.count,
          fish.total_length,
          fish.weight,
          fish.position
        );
      }
    }
  });

  return {
    entriesCount: manifest.entries.length,
    catchesCount: manifest.entries.reduce(
      (total, entry) => total + entry.catches.length,
      0
    ),
    photosCount,
    safetyBackupFileName,
  };
}
