export type ReasonCategory =
  | 'personality'
  | 'smile'
  | 'habits'
  | 'kindness'
  | 'efforts'
  | 'imperfections'
  | 'memories'
  | 'feelings'
  | 'admiration'
  | 'future';

export interface Reason {
  day: number;
  category: ReasonCategory;
  text: string;
  isFavorite?: boolean;
  revealedAt?: string | null;
  customNote?: string;
}

export interface Memory {
  id: string;
  title: string;
  date: string;
  caption: string;
  imageDataUrl: string; // Base64 or Blob URL stored in IndexedDB
  tag?: string;
  createdAt: number;
}

export interface VoiceNote {
  id: string;
  title: string;
  description: string;
  audioBlob: Blob;
  audioUrl?: string;
  duration: number; // in seconds
  createdAt: number;
}

export interface AppSettings {
  recipientName: string;
  senderName: string;
  journeyStartDate: string; // ISO date string YYYY-MM-DD
  notificationTime: string; // HH:MM (24h)
  notificationsEnabled: boolean;
  previewMode: boolean; // Enables inspecting/editing without locking
  previewDayOverride: number | null; // For testing specific days
  finalMessage: string;
  finalPhotoDataUrl: string | null;
  serverUrl: string;
}

export interface CategoryInfo {
  id: ReasonCategory;
  label: string;
  iconName: string;
  color: string;
  description: string;
}
