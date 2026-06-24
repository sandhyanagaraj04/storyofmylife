import type { CatName, EntryCat } from '../types'

/** Fixed category palette — ported verbatim from the prototype */
export const CATS: Record<CatName, string> = {
  Financial: '#34d399',
  Career: '#22d3ee',
  Health: '#fb7185',
  Spiritual: '#a78bfa',
  Relationships: '#fbbf24',
  Adventure: '#f97316',
}

export const CAT_NAMES = Object.keys(CATS) as CatName[]

/** Keyword auto-classification for new entries (editable later). */
export function guessCat(text: string): EntryCat {
  const t = text.toLowerCase()
  if (/(pay|salar|invest|saved|money|bought|sold|raise|bonus)/.test(t)) return 'Financial'
  if (/(job|work|promot|launch|project|client|meeting|career)/.test(t)) return 'Career'
  if (/(gym|run|health|doctor|sleep|meditat|yoga|workout)/.test(t)) return 'Health'
  if (/(pray|temple|church|grateful|soul|spirit|reflect)/.test(t)) return 'Spiritual'
  if (/(family|friend|love|date|wedding|partner|mom|dad)/.test(t)) return 'Relationships'
  if (/(travel|trip|hike|flight|explore|adventure)/.test(t)) return 'Adventure'
  return ''
}
