import { Memory } from '../types';

// Talks to the shared memories storage on the server (see server/index.js).

let rememberedPassword: string | null = null;

function askPassword(): string | null {
  if (!rememberedPassword) {
    const typed = window.prompt('Only Yasasri, the great can change memories 👑\nEnter the secret password:');
    rememberedPassword = typed ? typed : null;
  }
  return rememberedPassword;
}

/** Returns the shared memories, or null if the server can't be reached / isn't set up. */
export async function fetchSharedMemories(): Promise<Memory[] | null> {
  try {
    const res = await fetch('/api/memories', { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data.memories) ? (data.memories as Memory[]) : null;
  } catch {
    return null;
  }
}

export type SharedResult = { ok: true } | { ok: false; error: string };

export async function send(url: string, method: 'POST' | 'DELETE', body?: unknown): Promise<SharedResult> {
  const password = askPassword();
  if (!password) return { ok: false, error: 'Password needed to change memories.' };
  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'x-memories-password': password },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (res.ok) return { ok: true };
    if (res.status === 401) {
      rememberedPassword = null;
      return { ok: false, error: 'Wrong password.' };
    }
    const data = await res.json().catch(() => ({}));
    return { ok: false, error: data.error || 'Something went wrong on the server.' };
  } catch {
    return { ok: false, error: 'Could not reach the server. Check your internet and try again.' };
  }
}

export function saveSharedMemory(memory: Memory): Promise<SharedResult> {
  return send('/api/memories', 'POST', memory);
}

export function deleteSharedMemory(id: string): Promise<SharedResult> {
  return send(`/api/memories/${encodeURIComponent(id)}`, 'DELETE');
}
