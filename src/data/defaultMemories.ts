import { Memory } from '../types';

/**
 * YOUR MEMORIES — edit this file (and add photos to public/memories/).
 *
 * For each memory:
 *  - id:           unique, keep the "default-" prefix, never reuse one
 *  - imageDataUrl: path of the photo, e.g. '/memories/1.jpg'
 *                  (upload the photo to the public/memories/ folder in GitHub)
 *  - date:         YYYY-MM-DD
 *  - createdAt:    controls the order (bigger number = shown first). Keep it unique.
 */
export const DEFAULT_MEMORIES: Memory[] = [
  {
    id: 'default-1',
    title: 'Our cute memory at Pepino',
    date: '2026-07-10',
    caption: 'The day when we sang songs together in pepino & enjoyed each others presence and company a lot.. I loved the way you looked at me, the way you sang songs while admiring me, looking at me is just something I can never forget..',
    imageDataUrl: '/memories/1.jpg',
    tag: 'Special Moment',
    createdAt: 1,
  }
];
