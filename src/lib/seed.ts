import type { Entry, Milestone } from '../types'
import { uid } from './format'

/** A requirement with a fresh id. */
function r(t: string, d = '') {
  return { id: uid(), t, d }
}

/**
 * Starter template board for a brand-new account. These are deliberately
 * generic prompts with placeholders (e.g. "X") for the user to personalize —
 * no concrete values are baked in. Everything starts as "pending" so the
 * board reads as a fresh plan at 0%.
 */
export function seedMilestones(): Milestone[] {
  return [
    {
      id: uid(), title: 'Reach ₹X Cr savings in 2 years',
      why: 'Financial security and the freedom to choose.', cat: 'Financial', hz: '2y',
      have: [],
      need: [
        r('Set your target amount (replace X)'),
        r('Monthly savings / investment plan'),
        r('Build an emergency fund'),
        r('Add a second income stream'),
      ],
    },
    {
      id: uid(), title: 'Family goals',
      why: 'The people who matter most.', cat: 'Relationships', hz: '5y',
      have: [],
      need: [
        r('International family vacations'),
        r('Large gift for spouse'),
        r('Large gift for children'),
        r('Large gift for parents'),
        r('Large gift for siblings'),
        r('Large gift for in-laws'),
      ],
    },
    {
      id: uid(), title: 'Career goals',
      why: 'Work that grows with you.', cat: 'Career', hz: '5y',
      have: [],
      need: [
        r('Target role or title (name it)'),
        r('A skill to master'),
        r('Build a portfolio / track record'),
        r('Grow your network'),
      ],
    },
    {
      id: uid(), title: 'Health goals',
      why: 'A body that keeps up with the ambition.', cat: 'Health', hz: '1y',
      have: [],
      need: [
        r('A fitness target (define it)'),
        r('A consistent exercise routine'),
        r('A nutrition plan'),
        r('Regular health checkups'),
      ],
    },
    {
      id: uid(), title: 'Spiritual goals',
      why: 'A steady mind underneath a full life.', cat: 'Spiritual', hz: '1y',
      have: [],
      need: [
        r('A daily practice (meditation / prayer)'),
        r('A regular reflection habit'),
        r('A quiet time and place to be still'),
      ],
    },
    {
      id: uid(), title: 'Adventure goals',
      why: 'Collect perspectives, not just stamps.', cat: 'Adventure', hz: '10y',
      have: [],
      need: [
        r('Places to visit (list them)'),
        r('An experience to try'),
        r('A trip to plan this year'),
      ],
    },
  ]
}

/** New accounts start with an empty timeline — entries are the user's to log. */
export function seedEntries(): Record<string, Entry[]> {
  return {}
}
