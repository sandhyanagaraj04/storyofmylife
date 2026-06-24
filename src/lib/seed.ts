import type { Entry, Milestone } from '../types'
import { uid } from './format'

/** A requirement with a fresh id. */
function r(t: string, d = '') {
  return { id: uid(), t, d }
}

/**
 * The demo board — pre-loads a lively example so a new account / first
 * visit isn't a blank page. Ported from the prototype's seed().
 * Fresh ids on every call so cloud rows don't collide across users.
 */
export function seedMilestones(): Milestone[] {
  return [
    {
      id: uid(), title: 'Run a half-marathon',
      why: 'Prove to myself the body can keep up with the ambition.', cat: 'Health', hz: '6mo',
      have: [r('Run 5k comfortably', '~30 min pace')],
      need: [r('Build to 15k long runs'), r('Strength training 2x/week'), r('Register for a race')],
    },
    {
      id: uid(), title: 'Daily meditation, 90-day streak',
      why: 'A steady mind underneath a fast life.', cat: 'Spiritual', hz: '3mo',
      have: [r('Morning routine exists', 'Wake at 6')],
      need: [r('20 min sit every day'), r('A quiet corner set up')],
    },
    {
      id: uid(), title: 'Land first consulting client',
      why: 'Plant the second income stream early.', cat: 'Career', hz: '2mo',
      have: [r('Portfolio site live')],
      need: [r('Reach out to 20 leads'), r('Define a clear offer')],
    },
    {
      id: uid(), title: 'Hit ₹2 Cr net worth',
      why: 'Financial freedom to choose work I love, not work I need.', cat: 'Financial', hz: '5y',
      have: [r('Emergency fund (6 months)', 'Already parked in liquid funds'), r('SIP of ₹40k/month running', 'Index + flexicap')],
      need: [r('Second income stream', 'Consulting or product'), r('Max out tax-advantaged accounts'), r('Buy first rental property')],
    },
    {
      id: uid(), title: 'Build & sell a product',
      why: 'Turn skills into something that outlives my time.', cat: 'Career', hz: '10y',
      have: [r('Core engineering skills'), r('This life-mapping idea', 'Aeon 🙂')],
      need: [r('First 100 paying users'), r('Co-founder or small team'), r('12 months runway')],
    },
    {
      id: uid(), title: 'Own a home by the sea',
      why: 'A place that feels like a deep exhale.', cat: 'Financial', hz: '10y',
      have: [],
      need: [r('Down payment (₹60L)'), r('Decide the coast'), r('Stable location/work')],
    },
    {
      id: uid(), title: 'See 30 countries',
      why: 'Collect perspectives, not just stamps.', cat: 'Adventure', hz: '20y',
      have: [r('8 countries so far'), r('Remote-friendly work')],
      need: [r('2 trips a year, intentionally'), r('Travel fund')],
    },
    {
      id: uid(), title: 'Write the family memoir',
      why: 'So the people after me know where they came from.', cat: 'Relationships', hz: '30y',
      have: [r('This timeline of memories', 'Aeon captures it')],
      need: [r('Interview parents & elders'), r('Digitize old photos')],
    },
  ]
}

/** A few sample entries in the current month, keyed "Y-M-D". */
export function seedEntries(): Record<string, Entry[]> {
  const y = new Date().getFullYear()
  const m = new Date().getMonth()
  return {
    [`${y}-${m}-3`]: [
      { id: uid(), time: '07:30', t: 'Ran 6k — new personal best 🏃‍♀️', d: 'Felt strong the whole way', cat: 'Health' },
    ],
    [`${y}-${m}-9`]: [
      { id: uid(), time: '14:00', t: 'Closed first consulting client 🎉', d: '₹80k retainer, 3 months', cat: 'Financial' },
      { id: uid(), time: '21:00', t: 'Dinner with parents', d: 'Talked about the memoir idea', cat: 'Relationships' },
    ],
    [`${y}-${m}-15`]: [
      { id: uid(), time: '06:00', t: '20-min meditation, day 12 streak', d: '', cat: 'Spiritual' },
    ],
  }
}
