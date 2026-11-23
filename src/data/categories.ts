import { CategoryInfo, ReasonCategory } from '../types';

export const CATEGORIES: Record<ReasonCategory, CategoryInfo> = {
  personality: {
    id: 'personality',
    label: 'His Personality',
    iconName: 'Sparkles',
    color: '#C77D98',
    description: 'The unique traits, humor, and depth that make you who you are.',
  },
  smile: {
    id: 'smile',
    label: 'His Smile & Expressions',
    iconName: 'Smile',
    color: '#F3C6D5',
    description: 'The way your eyes light up and the little looks only I get to see.',
  },
  habits: {
    id: 'habits',
    label: 'His Habits & Quirks',
    iconName: 'Coffee',
    color: '#E5B869',
    description: 'The cute, endearing daily routines and little things you do without noticing.',
  },
  kindness: {
    id: 'kindness',
    label: 'His Kindness & Warmth',
    iconName: 'HeartHandshake',
    color: '#A65B77',
    description: 'The genuine tenderness you show to me, to strangers, and the world.',
  },
  efforts: {
    id: 'efforts',
    label: 'His Efforts & Dedication',
    iconName: 'Flame',
    color: '#C77D98',
    description: 'How hard you try for your dreams and for the happiness of our relationship.',
  },
  imperfections: {
    id: 'imperfections',
    label: 'His Little Imperfections',
    iconName: 'HeartCrack',
    color: '#E9E2F5',
    description: 'The sweet flaws and stubborn moments that make me love you even more.',
  },
  memories: {
    id: 'memories',
    label: 'Our Memories',
    iconName: 'Camera',
    color: '#F8DDE6',
    description: 'Unforgettable moments, secret jokes, and milestones we cherish.',
  },
  feelings: {
    id: 'feelings',
    label: 'The Way He Makes Me Feel',
    iconName: 'Heart',
    color: '#C77D98',
    description: 'The peace, butterflies, safety, and overwhelming warmth you give me.',
  },
  admiration: {
    id: 'admiration',
    label: 'Things I Admire About Him',
    iconName: 'Award',
    color: '#59434A',
    description: 'Your intelligence, integrity, patience, and character that inspire me.',
  },
  future: {
    id: 'future',
    label: 'Our Future Together',
    iconName: 'Compass',
    color: '#8E6E78',
    description: 'The adventures, milestones, and quiet golden years waiting for us.',
  },
};

export const CATEGORY_LIST = Object.values(CATEGORIES);
