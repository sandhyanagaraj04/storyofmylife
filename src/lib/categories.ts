import type { CategoryName, Horizon } from '../types'

export const CATEGORIES: Record<CategoryName, string> = {
  Financial: '#34d399',
  Career: '#22d3ee',
  Health: '#fb7185',
  Spiritual: '#a78bfa',
  Relationships: '#fbbf24',
  Adventure: '#f97316',
}

export const CATEGORY_NAMES = Object.keys(CATEGORIES) as CategoryName[]

export const HORIZONS: Horizon[] = [5, 10, 20, 30]

export const HORIZON_LABELS: Record<Horizon, string> = {
  5: 'Near horizon',
  10: 'Building',
  20: 'Legacy',
  30: 'Lifetime',
}

/**
 * Keyword-based auto-classification of an entry into a category.
 * Editable later by the user.
 */
export function guessCat(text: string): CategoryName | null {
  const t = text.toLowerCase()
  const map: Record<CategoryName, string[]> = {
    Financial: [
      'money',
      'salary',
      'invest',
      'savings',
      'client',
      'retainer',
      'paid',
      'income',
      'revenue',
      'budget',
      'stock',
      'crypto',
      'net worth',
      'raise',
      '₹',
      '$',
    ],
    Career: [
      'job',
      'work',
      'promotion',
      'project',
      'launch',
      'meeting',
      'interview',
      'startup',
      'career',
      'ship',
      'deploy',
      'hired',
      'team',
      'deadline',
    ],
    Health: [
      'gym',
      'run',
      'workout',
      'sleep',
      'doctor',
      'meditat',
      'yoga',
      'health',
      'sick',
      'diet',
      'weight',
      'walk',
      'hike',
      'marathon',
    ],
    Spiritual: [
      'pray',
      'spiritual',
      'temple',
      'church',
      'gratitude',
      'reflect',
      'journal',
      'purpose',
      'soul',
      'faith',
      'mantra',
    ],
    Relationships: [
      'friend',
      'family',
      'love',
      'date',
      'partner',
      'mom',
      'dad',
      'wedding',
      'married',
      'dinner',
      'call',
      'kids',
      'baby',
    ],
    Adventure: [
      'travel',
      'trip',
      'flight',
      'beach',
      'mountain',
      'explore',
      'adventure',
      'vacation',
      'road',
      'dive',
      'climb',
      'festival',
    ],
  }
  for (const cat of Object.keys(map) as CategoryName[]) {
    if (map[cat].some((kw) => t.includes(kw))) return cat
  }
  return null
}
