import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { detectArchetype } from '@/lib/archetypes'
import { Dimension, AssessmentResult, StrokeRecord } from '@/lib/types'

const client = new Anthropic()

const DIMENSION_COLOURS: Record<Dimension, string> = {
  drive: '#7F77DD',
  confidence: '#1D9E75',
  consistency: '#EF9F27',
  leadership: '#D85A30',
  extracurricular: '#D4537E',
  selfAware: '#378ADD',
}

const DIMENSION_LABELS: Record<Dimension, string> = {
  drive: 'Drive',
  confidence: 'Confidence',
  consistency: 'Consistency',
  leadership: 'Leadership',
  extracurricular: 'Extracurricular',
  selfAware: 'Self-Awareness',
}

const STROKE_COLOUR_NAMES: Record<string, string> = {
  '#7F77DD': 'purple',
  '#1D9E75': 'green',
  '#D85A30': 'coral',
  '#EF9F27': 'amber',
  '#D4537E': 'pink',
  '#378ADD': 'blue',
}

function energyLabel(e: number): string {
  if (e >= 0.75) return 'bold'
  if (e >= 0.45) return 'medium'
  return 'faint'
}

function buildFallback(scores: Record<Dimension, number>): AssessmentResult {
  const archetype = detectArchetype(scores)
  const maxScore = 9
  const traits = (Object.keys(scores) as Dimension[])
    .filter(d => d !== 'extracurricular')
    .map(dim => ({
      label: DIMENSION_LABELS[dim],
      pct: Math.max(0, Math.min(100, Math.round(((scores[dim] + maxScore) / (maxScore * 2)) * 100))),
      colour: DIMENSION_COLOURS[dim],
    }))

  const dims = Object.keys(scores) as Dimension[]
  const topDim = dims.reduce((a, b) => (scores[a] > scores[b] ? a : b))
  const bottomDim = dims.reduce((a, b) => (scores[a] < scores[b] ? a : b))

  return {
    archetype: archetype.name,
    archetypeSub: archetype.sub,
    artReading:
      'The portrait carries the marks of a complex day — some strokes bold and reaching, others restrained and careful. Together they describe someone navigating the tension between what they want to be and what they actually do.',
    traits,
    strength: `Your strongest signal across the day was ${DIMENSION_LABELS[topDim].toLowerCase()} — it came through consistently even in moments where it would have been easy to disengage.`,
    gap: `The dimension that showed the most room for growth was ${DIMENSION_LABELS[bottomDim].toLowerCase()}. This is worth paying attention to — not as a weakness, but as the next edge to work on.`,
    nextStep:
      "Pick one moment tomorrow where you would normally take the safer path — and don't. That's the whole experiment.",
  }
}

export async function POST(req: NextRequest) {
  let scores: Record<Dimension, number> = {
    drive: 0,
    confidence: 0,
    consistency: 0,
    leadership: 0,
    extracurricular: 0,
    selfAware: 0,
  }

  try {
    const body = (await req.json()) as {
      studentName: string
      scores: Record<Dimension, number>
      strokes: StrokeRecord[]
      choiceLog: string[]
    }

    scores = body.scores
    const { studentName, strokes, choiceLog } = body
    const archetype = detectArchetype(scores)

    const strokeDescriptions = strokes
      .map((s, i) => {
        const colourName = STROKE_COLOUR_NAMES[s.colour] ?? s.colour
        return `  Stroke ${i + 1}: ${s.type} — ${colourName}, ${energyLabel(s.energy)}`
      })
      .join('\n')

    const scoreLines = (Object.keys(scores) as Dimension[])
      .map(d => `  ${DIMENSION_LABELS[d]}: ${scores[d]}`)
      .join('\n')

    const prompt = `You are analysing the self-assessment results of a student named ${studentName}.

They made six choices through a simulated school day. Here is what they chose:
${choiceLog.map((l: string) => `  - ${l}`).join('\n')}

Dimension scores (range typically -6 to +9):
${scoreLines}

Their abstract portrait is composed of these strokes (in order drawn):
${strokeDescriptions}

Preliminary archetype detected: "${archetype.name}" — "${archetype.sub}"

Generate a personalised assessment result. Return ONLY valid JSON with no markdown wrapper, no \`\`\`json, nothing else. The JSON must have exactly these fields:

{
  "archetype": "string — the archetype name",
  "archetypeSub": "string — one sentence subtitle for the archetype",
  "artReading": "string — 2-3 sentences describing ${studentName}'s abstract portrait as an art critic. Reference actual strokes — which are bold (energy >= 0.75), which are faint (energy < 0.45), what the overall shape suggests about this person. Be specific and poetic.",
  "traits": [
    { "label": "Drive", "pct": 0-100, "colour": "#7F77DD" },
    { "label": "Confidence", "pct": 0-100, "colour": "#1D9E75" },
    { "label": "Consistency", "pct": 0-100, "colour": "#EF9F27" },
    { "label": "Leadership", "pct": 0-100, "colour": "#D85A30" },
    { "label": "Self-Awareness", "pct": 0-100, "colour": "#378ADD" }
  ],
  "strength": "string — 1-2 sentences about what ${studentName} genuinely does well, grounded in the specific choices made",
  "gap": "string — 1-2 sentences about the most important dimension to develop, honest but not harsh",
  "nextStep": "string — one concrete, specific action ${studentName} can take tomorrow. Not generic advice."
}`

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const parsed = JSON.parse(text) as AssessmentResult
    return NextResponse.json(parsed)
  } catch {
    return NextResponse.json(buildFallback(scores))
  }
}
