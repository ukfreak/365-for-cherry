import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { AppSettings, Memory, Reason, VoiceNote } from '../types';
import { DEFAULT_REASONS } from '../data/defaultReasons';

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

// ----------------- REASONS API -----------------
export async function getAllReasons(): Promise<Reason[]> {
  const db = await getDB();
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
  await db.put('reasons', reason);
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

export async function deleteVoiceNote(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('voiceNotes', id);
}

// ----------------- SETTINGS API -----------------
export async function getSettings(): Promise<AppSettings> {
  const db = await getDB();
  const settings = await db.get('settings', 'config');
  if (!settings) return DEFAULT_SETTINGS;
  return { ...DEFAULT_SETTINGS, ...settings };
}

export async function saveSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
  const db = await getDB();
  const current = (await db.get('settings', 'config')) || {};
  const updated: AppSettings = { ...DEFAULT_SETTINGS, ...current, ...settings };
  await db.put('settings', updated, 'config');
  return updated;
}

// ----------------- SAMPLE INITIAL MEMORIES -----------------
export async function seedInitialDemoData(): Promise<void> {
  const memories = await getAllMemories();
  if (memories.length === 0) {
    // Add warm sample memories so the scrapbook looks charming immediately
    const sample1: Memory = {
      id: 'sample-1',
      title: 'Our First Sunset Coffee',
      date: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
      caption: 'The day we sat talking until the barista had to turn the sign to closed. I still smile every time I pass that corner café.',
      imageDataUrl: createHeartPlaceholderImage('Sunset Coffee', '#F3C6D5', '#C77D98'),
      tag: 'Café Date',
      createdAt: Date.now() - 30 * 24 * 3600 * 1000,
    };
    const sample2: Memory = {
      id: 'sample-2',
      title: 'The Rainy Day Escape',
      date: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString().split('T')[0],
      caption: 'We were soaked from head to toe, sharing a tiny pastry under the bakery awning, laughing so hard my ribs ached.',
      imageDataUrl: createHeartPlaceholderImage('Rainy Day Joy', '#F8DDE6', '#59434A'),
      tag: 'Spontaneous',
      createdAt: Date.now() - 15 * 24 * 3600 * 1000,
    };
    await saveMemory(sample1);
    await saveMemory(sample2);
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
