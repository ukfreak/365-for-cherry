import { Reason } from '../types';
import reasons from '../../server/reasons.json';

// Single source of truth: server/reasons.json (edit that file, not this one)
export const DEFAULT_REASONS: Reason[] = (reasons as Reason[])
  .slice()
  .sort((a, b) => a.day - b.day);

// Changes whenever any reason changes; used to refresh the copy saved in the browser
function hash(str: string): string {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0;
  return (h >>> 0).toString(16);
}
export const DEFAULT_REASONS_VERSION = hash(JSON.stringify(DEFAULT_REASONS));
