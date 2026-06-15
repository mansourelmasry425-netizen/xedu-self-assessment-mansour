'use client'
import { Scene, Choice, Dimension, StrokeRecord } from '@/lib/types'
import Portrait from './Portrait'

interface SceneScreenProps {
  scene: Scene
  sceneIndex: number
  scores: Record<Dimension, number>
  strokes: StrokeRecord[]
  studentName: string
  onChoice: (choice: Choice) => void
}

function observerNote(sceneIndex: number, scores: Record<Dimension, number>, name: string): string {
  switch (sceneIndex) {
    case 1:
      return scores.drive >= 2
        ? `${name} went into the test with something behind them. Baseline drive is active from the first moment.`
        : "The first move was to let go. Whether that's peace or avoidance — the day will show us."
    case 2:
      return scores.confidence >= 3
        ? `${name} is showing up actively. Two scenes in and there's already a pattern forming.`
        : "Staying at the edges so far. It could be strategy. It could be habit. The rest of the day will tell us which."
    case 3:
      return scores.leadership >= 3
        ? `${name} moves toward friction instead of away from it. That's less common than it sounds.`
        : "Social energy is being conserved today. That's a data point — not a judgment."
    case 4:
      return scores.consistency >= 3
        ? `The afternoon is where most intentions collapse. ${name}'s didn't. That's the most predictive signal so far.`
        : "The gap between intention and action is widening. This is the dimension that matters most in the long run."
    case 5:
      return scores.confidence >= 4
        ? `${name} backs themselves when it matters. In this dataset, that's genuinely rare.`
        : `Opportunities appeared throughout the day. ${name}'s relationship with them is becoming the clearest signal we have.`
    default:
      return ''
  }
}

export default function SceneScreen({ scene, sceneIndex, scores, strokes, studentName, onChoice }: SceneScreenProps) {
  const note = sceneIndex > 0 ? observerNote(sceneIndex, scores, studentName) : null

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0D0B1A' }}>
      {/* Sky banner */}
      <div className="relative flex-shrink-0" style={{ background: scene.skyBg, height: 96 }}>
        {/* Progress pips */}
        <div className="absolute top-0 left-0 right-0 flex gap-1 p-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 rounded-full transition-all duration-300"
              style={{
                height: 2,
                background:
                  i < sceneIndex
                    ? 'rgba(255,255,255,0.8)'
                    : i === sceneIndex
                    ? 'rgba(255,255,255,0.5)'
                    : 'rgba(255,255,255,0.15)',
              }}
            />
          ))}
        </div>
        {/* Time */}
        <div className="absolute bottom-3 left-4">
          <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>
            {scene.time}
          </p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {scene.timeSub}
          </p>
        </div>
        {/* Mini portrait */}
        <div className="absolute bottom-3 right-4">
          <Portrait strokes={strokes} size={46} bgColour="#0D0B1A" />
        </div>
      </div>

      <div className="flex-1 flex flex-col px-5 pb-8 max-w-lg mx-auto w-full">
        {/* Observer note */}
        {note && (
          <div
            className="mt-5 pl-4"
            style={{ borderLeft: '2px solid rgba(255,255,255,0.2)' }}
          >
            <p
              className="text-xs uppercase tracking-widest mb-1"
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              observer note
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
              {note}
            </p>
          </div>
        )}

        {/* Scene content */}
        <div className={note ? 'mt-6' : 'mt-8'}>
          <h2 className="text-lg font-medium text-white leading-snug">{scene.question}</h2>
          <p className="mt-2 text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {scene.context}
          </p>
        </div>

        {/* Research hook */}
        <div
          className="mt-5 flex gap-2 items-start p-3 rounded-xl"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <span className="text-sm mt-0.5">📖</span>
          <div>
            <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {scene.researchNote}
            </p>
            <p className="text-xs italic mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
              {scene.researchRef}
            </p>
          </div>
        </div>

        {/* Choices */}
        <div className="mt-6 flex flex-col gap-3">
          {scene.choices.map(choice => (
            <button
              key={choice.letter}
              onClick={() => onChoice(choice)}
              className="w-full text-left p-4 rounded-xl flex gap-3 items-start transition-all duration-150 active:scale-[0.99]"
              style={{
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.03)',
              }}
              onMouseEnter={e => {
                ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.07)'
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.2)'
              }}
              onMouseLeave={e => {
                ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.03)'
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)'
              }}
            >
              <span
                className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mt-0.5"
                style={{
                  background: scene.strokeColour + '33',
                  color: scene.strokeColour,
                }}
              >
                {choice.letter}
              </span>
              <div>
                <p className="text-sm font-medium leading-snug text-white">{choice.main}</p>
                {choice.sub && (
                  <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {choice.sub}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
