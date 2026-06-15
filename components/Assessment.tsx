'use client'
import { useState } from 'react'
import { Screen, Dimension, Choice, StrokeRecord, AssessmentResult } from '@/lib/types'
import { scenes } from '@/lib/scenes'
import IntroScreen from './IntroScreen'
import NameScreen from './NameScreen'
import SceneScreen from './SceneScreen'
import HeartbeatScreen from './HeartbeatScreen'
import ResultScreen from './ResultScreen'
import Portrait from './Portrait'

const initialScores = (): Record<Dimension, number> => ({
  drive: 0,
  confidence: 0,
  consistency: 0,
  leadership: 0,
  extracurricular: 0,
  selfAware: 0,
})

export default function Assessment() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('intro')
  const [studentName, setStudentName] = useState('')
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0)
  const [scores, setScores] = useState<Record<Dimension, number>>(initialScores())
  const [strokes, setStrokes] = useState<StrokeRecord[]>([])
  const [lastChoice, setLastChoice] = useState<Choice | null>(null)
  const [result, setResult] = useState<AssessmentResult | null>(null)
  const [choiceLog, setChoiceLog] = useState<string[]>([])

  function handleChoice(choice: Choice) {
    const scene = scenes[currentSceneIndex]
    const newScores = { ...scores }
    for (const [dim, delta] of Object.entries(choice.scores)) {
      if (delta !== undefined) {
        newScores[dim as Dimension] = (newScores[dim as Dimension] ?? 0) + delta
      }
    }
    const newStroke: StrokeRecord = {
      type: scene.portraitStroke,
      energy: choice.energy,
      colour: scene.strokeColour,
      sceneIndex: currentSceneIndex,
    }
    const newStrokes = [...strokes, newStroke]
    const newLog = [
      ...choiceLog,
      `Scene ${currentSceneIndex + 1} (${scene.time}): "${choice.main}" — energy ${choice.energy}`,
    ]

    setScores(newScores)
    setStrokes(newStrokes)
    setLastChoice(choice)
    setChoiceLog(newLog)
    setCurrentScreen('heartbeat')
  }

  async function handleHeartbeatContinue() {
    const nextIndex = currentSceneIndex + 1
    if (nextIndex < scenes.length) {
      setCurrentSceneIndex(nextIndex)
      setCurrentScreen('scene')
    } else {
      setCurrentScreen('loading')
      try {
        const res = await fetch('/api/assess', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentName, scores, strokes, choiceLog }),
        })
        const data = (await res.json()) as AssessmentResult
        setResult(data)
        setCurrentScreen('result')
      } catch {
        setCurrentScreen('result')
      }
    }
  }

  function handleReplay() {
    setCurrentScreen('intro')
    setStudentName('')
    setCurrentSceneIndex(0)
    setScores(initialScores())
    setStrokes([])
    setLastChoice(null)
    setResult(null)
    setChoiceLog([])
  }

  const currentScene = scenes[currentSceneIndex]

  return (
    <div style={{ animation: 'screenFadeIn 0.35s ease' }}>
      <style>{`
        @keyframes screenFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {currentScreen === 'intro' && <IntroScreen onStart={() => setCurrentScreen('name')} />}

      {currentScreen === 'name' && (
        <NameScreen
          onConfirm={name => {
            setStudentName(name)
            setCurrentScreen('scene')
          }}
        />
      )}

      {currentScreen === 'scene' && (
        <SceneScreen
          scene={currentScene}
          sceneIndex={currentSceneIndex}
          scores={scores}
          strokes={strokes}
          studentName={studentName}
          onChoice={handleChoice}
        />
      )}

      {currentScreen === 'heartbeat' && lastChoice && (
        <HeartbeatScreen
          choice={lastChoice}
          strokes={strokes}
          skyBg={currentScene.skyBg}
          strokeColour={currentScene.strokeColour}
          onContinue={handleHeartbeatContinue}
        />
      )}

      {currentScreen === 'loading' && (
        <div
          className="min-h-screen flex flex-col items-center justify-center gap-8 px-6"
          style={{ background: '#0D0B1A' }}
        >
          <Portrait strokes={strokes} size={110} bgColour="#0D0B1A" />
          <div className="flex flex-col items-center gap-3">
            <div
              className="w-5 h-5 rounded-full animate-spin"
              style={{ border: '2px solid rgba(255,255,255,0.2)', borderTopColor: 'rgba(255,255,255,0.8)' }}
            />
            <p className="text-base font-medium" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Reading your day, {studentName}…
            </p>
            <p className="text-sm text-center max-w-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Looking at the shape of your choices — not just which ones looked good on paper.
            </p>
          </div>
        </div>
      )}

      {currentScreen === 'result' && result && (
        <ResultScreen
          result={result}
          strokes={strokes}
          studentName={studentName}
          onReplay={handleReplay}
        />
      )}
    </div>
  )
}
