import { Archetype, Dimension } from './types'

export const archetypes: Archetype[] = [
  {
    name: 'The Quiet Strategist',
    sub: 'Thinks before moving. Reads the room. Often mistaken for passive — almost always calculating.',
    detect: (scores: Record<Dimension, number>) => scores.selfAware >= 4 && scores.confidence < 2,
  },
  {
    name: 'The Reluctant Leader',
    sub: 'Steps up when it matters, then wonders why they always end up responsible.',
    detect: (scores: Record<Dimension, number>) => scores.leadership >= 4 && scores.confidence < 3,
  },
  {
    name: 'The Consistent Builder',
    sub: "Doesn't peak loudly. Just keeps showing up. Quietly formidable over time.",
    detect: (scores: Record<Dimension, number>) => scores.consistency >= 5,
  },
  {
    name: 'The Spark Without Follow-Through',
    sub: 'Energy, ideas, potential — and a pattern of not finishing what they start.',
    detect: (scores: Record<Dimension, number>) => scores.confidence >= 3 && scores.consistency < 0,
  },
  {
    name: 'The Self-Aware Drifter',
    sub: "Knows exactly what they're doing and why. Still does it anyway.",
    detect: (scores: Record<Dimension, number>) => scores.selfAware >= 5 && scores.consistency < 2,
  },
  {
    name: 'The Grounded Realist',
    sub: 'Clear-eyed about limitations and strengths. Not flashy. Quietly reliable.',
    detect: () => true,
  },
]

export function detectArchetype(scores: Record<Dimension, number>): Archetype {
  return archetypes.find(a => a.detect(scores)) ?? archetypes[archetypes.length - 1]
}
