import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { AppSettings, Memory, Reason, VoiceNote } from '../types';
import { DEFAULT_MEMORIES } from '../data/defaultMemories';
import { DEFAULT_REASONS, DEFAULT_REASONS_VERSION } from '../data/defaultReasons';

interface AppDB extends DBSchema {
  reasons: {
    key: number; // day number
    value: Reason;
  };
  memories: {
    key: string; // memory id
    value: Memory;
    indexes: { 'by-date': string; 'by-createdAt': number };
  };
  voiceNotes: {
    key: string; // voiceNote id
    value: VoiceNote;
    indexes: { 'by-createdAt': number };
  };
  settings: {
    key: string;
    value: any;
  };
}

const DB_NAME = 'reasons-365-db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<AppDB>> | null = null;

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<AppDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Reasons Store
        if (!db.objectStoreNames.contains('reasons')) {
          db.createObjectStore('reasons', { keyPath: 'day' });
        }
        // Memories Store
        if (!db.objectStoreNames.contains('memories')) {
          const memoryStore = db.createObjectStore('memories', { keyPath: 'id' });
          memoryStore.createIndex('by-date', 'date');
          memoryStore.createIndex('by-createdAt', 'createdAt');
        }
        // Voice Notes Store
        if (!db.objectStoreNames.contains('voiceNotes')) {
          const voiceStore = db.createObjectStore('voiceNotes', { keyPath: 'id' });
          voiceStore.createIndex('by-createdAt', 'createdAt');
        }
        // Settings Store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings');
        }
      },
    });
  }
  return dbPromise;
}

// ----------------- DEFAULT SETTINGS -----------------
export const DEFAULT_SETTINGS: AppSettings = {
  recipientName: 'Cherry',
  senderName: 'Yash',
  journeyStartDate: '2026-11-29', // His birthday!
  notificationTime: '09:00',
  notificationsEnabled: false,
  previewMode: false,
  previewDayOverride: null,
  finalMessage: "365 days. 365 reasons. And somehow, I still haven't run out of reasons to love you. This was never just about counting days. It was about reminding you, every single day, how special you are to me. And if I had another 365 days, I'd choose you all over again.",
  finalPhotoDataUrl: null,
  serverUrl: 'http://localhost:3001',
};

const REASONS_VERSION_KEY = 'reasonsVersion';

async function syncReasonsWithDefaults(): Promise<void> {
  const db = await getDB();
  const storedVersion = await db.get('settings', REASONS_VERSION_KEY);
  if (storedVersion === DEFAULT_REASONS_VERSION) return;

  const existing = new Map((await db.getAll('reasons')).map((r) => [r.day, r]));
  const tx = db.transaction(['reasons', 'settings'], 'readwrite');
  for (const def of DEFAULT_REASONS) {
    const old = existing.get(def.day);
    if (old?.edited) continue;
    const merged: Reason = { ...def };
    if (old?.isFavorite) merged.isFavorite = true;
    if (old?.revealedAt) merged.revealedAt = old.revealedAt;
    if (old?.customNote) merged.customNote = old.customNote;
    await tx.objectStore('reasons').put(merged);
  }
  await tx.objectStore('settings').put(DEFAULT_REASONS_VERSION, REASONS_VERSION_KEY);
  await tx.done;
}

// ----------------- REASONS API -----------------
export async function getAllReasons(): Promise<Reason[]> {
  const db = await getDB();
  await syncReasonsWithDefaults();
  const stored = await db.getAll('reasons');

  if (!stored || stored.length === 0) {
    // Populate with defaults on first run
    const tx = db.transaction('reasons', 'readwrite');
    for (const r of DEFAULT_REASONS) {
      await tx.store.put(r);
    }
    await tx.done;
    return DEFAULT_REASONS;
  }

  // Ensure full 365 coverage
  const map = new Map<number, Reason>();
  for (const r of DEFAULT_REASONS) {
    map.set(r.day, r);
  }
  for (const s of stored) {
    map.set(s.day, { ...map.get(s.day)!, ...s });
  }

  return Array.from(map.values()).sort((a, b) => a.day - b.day);
}

export async function getReasonByDay(day: number): Promise<Reason | undefined> {
  const db = await getDB();
  const reason = await db.get('reasons', day);
  if (reason) return reason;
  return DEFAULT_REASONS.find((r) => r.day === day);
}

export async function updateReason(reason: Reason): Promise<void> {
  const db = await getDB();
  const def = DEFAULT_REASONS.find((r) => r.day === reason.day);
  const edited = !!def && reason.text !== def.text;
  await db.put('reasons', { ...reason, edited });
}

export async function toggleFavoriteReason(day: number): Promise<boolean> {
  const db = await getDB();
  const reason = (await db.get('reasons', day)) || DEFAULT_REASONS.find((r) => r.day === day);
  if (!reason) return false;
  const updated = { ...reason, isFavorite: !reason.isFavorite };
  await db.put('reasons', updated);
  return !!updated.isFavorite;
}

export async function markReasonRevealed(day: number): Promise<void> {
  const db = await getDB();
  const reason = (await db.get('reasons', day)) || DEFAULT_REASONS.find((r) => r.day === day);
  if (reason && !reason.revealedAt) {
    await db.put('reasons', { ...reason, revealedAt: new Date().toISOString() });
  }
}

export async function resetAllReasons(): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('reasons', 'readwrite');
  await tx.store.clear();
  for (const r of DEFAULT_REASONS) {
    await tx.store.put(r);
  }
  await tx.done;
}

// ----------------- MEMORIES API -----------------
export async function getAllMemories(): Promise<Memory[]> {
  const db = await getDB();
  const memories = await db.getAllFromIndex('memories', 'by-createdAt');
  return memories.reverse(); // Most recent first
}

export async function saveMemory(memory: Memory): Promise<void> {
  const db = await getDB();
  await db.put('memories', memory);
}

/**
 * Makes the local copy match the shared memories from the server.
 * Memories defined in src/data/defaultMemories.ts (ids "default-...") are kept as they are.
 */
export async function replaceSharedMemories(shared: Memory[]): Promise<void> {
  const db = await getDB();
  const keep = new Set(shared.map((m) => m.id));
  for (const local of await db.getAll('memories')) {
    if (!local.id.startsWith('default-') && !keep.has(local.id)) {
      await db.delete('memories', local.id);
    }
  }
  for (const m of shared) await db.put('memories', m);
}

export async function deleteMemory(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('memories', id);
}

export async function clearAllMemories(): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('memories', 'readwrite');
  await tx.store.clear();
  await tx.done;
}

export async function resetAllAppData(): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(['reasons', 'memories', 'voiceNotes', 'settings'], 'readwrite');
  await tx.objectStore('reasons').clear();
  await tx.objectStore('memories').clear();
  await tx.objectStore('voiceNotes').clear();
  await tx.objectStore('settings').clear();
  for (const r of DEFAULT_REASONS) {
    await tx.objectStore('reasons').put(r);
  }
  await tx.objectStore('settings').put(DEFAULT_SETTINGS, 'config');
  await tx.done;
}

// ----------------- VOICE NOTES API -----------------
export async function getAllVoiceNotes(): Promise<VoiceNote[]> {
  const db = await getDB();
  const notes = await db.getAllFromIndex('voiceNotes', 'by-createdAt');
  // Generate object URLs for audio blobs
  return notes.reverse().map((note) => ({
    ...note,
    audioUrl: URL.createObjectURL(note.audioBlob),
  }));
}

export async function saveVoiceNote(note: VoiceNote): Promise<void> {
  const db = await getDB();
  await db.put('voiceNotes', {
    id: note.id,
    title: note.title,
    description: note.description,
    audioBlob: note.audioBlob,
    duration: note.duration,
    createdAt: note.createdAt,
  });
}
const SYNCED_VOICE_IDS_KEY = 'syncedVoiceNoteIds';

/**
 * Makes the local voice notes match the shared ones from the server.
 * Notes that were never synced (recorded only on this device) are kept.
 * Only notes that were on the server before and are gone now get removed.
 */
export async function replaceSharedVoiceNotes(shared: VoiceNote[]): Promise<void> {
  const db = await getDB();
  const onServer = new Set(shared.map((n) => n.id));
  const previouslySynced: string[] = (await db.get('settings', SYNCED_VOICE_IDS_KEY)) || [];
  for (const id of previouslySynced) {
    if (!onServer.has(id)) await db.delete('voiceNotes', id);
  }
  for (const n of shared) {
    await db.put('voiceNotes', {
      id: n.id,
      title: n.title,
      description: n.description,
      audioBlob: n.audioBlob,
      duration: n.duration,
      createdAt: n.createdAt,
    });
  }
  await db.put('settings', Array.from(onServer), SYNCED_VOICE_IDS_KEY);
}

export async function deleteVoiceNote(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('voiceNotes', id);
}

// ----------------- SETTINGS API -----------------
export async function getSettings(): Promise<AppSettings> {
  const db = await getDB();
  const settings = await db.get('settings', 'config');
  if (!settings) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...settings, previewMode: false, previewDayOverride: null };
}

export async function saveSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
  const db = await getDB();
  const current = (await db.get('settings', 'config')) || {};
  const updated: AppSettings = { ...DEFAULT_SETTINGS, ...current, ...settings };
  await db.put('settings', updated, 'config');
  return updated;
}

export async function seedInitialDemoData(): Promise<void> {
  const db = await getDB();
  // Remove the old placeholder memories from earlier versions of the app
  await db.delete('memories', 'sample-1');
  await db.delete('memories', 'sample-2');
  // Memories in src/data/defaultMemories.ts always match that file.
  // Memories added inside the app (other ids) are left untouched.
  for (const memory of DEFAULT_MEMORIES) {
    await db.put('memories', memory);
  }
}

function createHeartPlaceholderImage(label: string, bg: string, text: string): string {
  // SVG Data URL for default sample memory photo
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
    <rect width="100%" height="100%" fill="${bg}"/>
    <circle cx="300" cy="200" r="140" fill="#FFF9F5" opacity="0.6"/>
    <path d="M300 290 C300 290 190 220 170 150 C150 80 230 50 300 120 C370 50 450 80 430 150 C410 220 300 290 300 290 Z" fill="${text}" opacity="0.8"/>
    <text x="300" y="380" font-family="'Playfair Display', serif" font-size="28" font-weight="600" fill="${text}" text-anchor="middle">${label}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
