export type Dimension = 'drive' | 'confidence' | 'consistency' | 'leadership' | 'extracurricular' | 'selfAware'

export type ScoreDelta = Partial<Record<Dimension, number>>

export type Choice = {
  letter: string
  main: string
  sub: string
  reveal: string
  revealSub: string
  scores: ScoreDelta
  energy: number
}

export type Scene = {
  skyBg: string
  time: string
  timeSub: string
  question: string
  context: string
  researchNote: string
  researchRef: string
  portraitStroke: 'arc' | 'eye' | 'line' | 'ground' | 'reach' | 'close'
  strokeColour: string
  choices: Choice[]
}

export type Archetype = {
  name: string
  sub: string
  detect: (scores: Record<Dimension, number>) => boolean
}

export type AssessmentResult = {
  archetype: string
  archetypeSub: string
  artReading: string
  traits: Array<{ label: string; pct: number; colour: string }>
  strength: string
  gap: string
  nextStep: string
}

export type StrokeRecord = {
  type: Scene['portraitStroke']
  energy: number
  colour: string
  sceneIndex: number
}

export type Screen = 'intro' | 'name' | 'scene' | 'heartbeat' | 'loading' | 'result'
