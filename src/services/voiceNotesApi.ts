import { VoiceNote } from '../types';
import { send, SharedResult } from './memoriesApi';

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function dataUrlToBlob(dataUrl: string): Blob {
  const comma = dataUrl.indexOf(',');
  const mime = dataUrl.slice(5, comma).split(';')[0] || 'audio/webm';
  const binary = atob(dataUrl.slice(comma + 1));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

/** Returns the shared voice notes, or null if the server can't be reached / isn't set up. */
export async function fetchSharedVoiceNotes(): Promise<VoiceNote[] | null> {
  try {
    const res = await fetch('/api/voice-notes', { signal: AbortSignal.timeout(15000) });
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data.voiceNotes)) return null;
    return data.voiceNotes.map((n: any) => ({
      id: n.id,
      title: n.title,
      description: n.description || '',
      audioBlob: dataUrlToBlob(n.audioDataUrl),
      duration: n.duration,
      createdAt: n.createdAt,
    })) as VoiceNote[];
  } catch {
    return null;
  }
}

export async function saveSharedVoiceNote(note: VoiceNote): Promise<SharedResult> {
  let audioDataUrl: string;
  try {
    audioDataUrl = await blobToDataUrl(note.audioBlob);
  } catch {
    return { ok: false, error: 'Could not read the recording. Please record it again.' };
  }
  if (audioDataUrl.length > 7_000_000) {
    return { ok: false, error: 'This recording is too long to save. Try a shorter one.' };
  }
  return send('/api/voice-notes', 'POST', {
    id: note.id,
    title: note.title,
    description: note.description,
    audioDataUrl,
    duration: note.duration,
    createdAt: note.createdAt,
  });
}

export function deleteSharedVoiceNote(id: string): Promise<SharedResult> {
  return send(`/api/voice-notes/${encodeURIComponent(id)}`, 'DELETE');
}
