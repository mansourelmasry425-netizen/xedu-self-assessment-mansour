'use client'
import { useEffect, useState } from 'react'
import { Choice, StrokeRecord } from '@/lib/types'
import Portrait from './Portrait'

interface HeartbeatScreenProps {
  choice: Choice
  strokes: StrokeRecord[]
  skyBg: string
  strokeColour: string
  onContinue: () => void
}

export default function HeartbeatScreen({ choice, strokes, skyBg, strokeColour, onContinue }: HeartbeatScreenProps) {
  const [showReveal, setShowReveal] = useState(false)
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setShowReveal(true), 400)
    const t2 = setTimeout(() => setShowButton(true), 900)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  // Parse skyBg hex to rgb for tint
  const hex = skyBg.replace('#', '')
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  const bgStyle = `linear-gradient(180deg, rgba(${r},${g},${b},0.15) 0%, #0D0B1A 100%)`

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
      style={{ background: bgStyle }}
    >
      <div className="flex flex-col items-center gap-6 max-w-xs w-full text-center">
        <Portrait strokes={strokes} size={130} bgColour="#0D0B1A" />

        <div
          style={{
            opacity: showReveal ? 1 : 0,
            transform: showReveal ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}
          className="flex flex-col items-center gap-3"
        >
          <p className="text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.9)' }}>
            {choice.reveal}
          </p>
          <p
            className="text-xs uppercase tracking-widest"
            style={{ color: strokeColour }}
          >
            {choice.revealSub}
          </p>
        </div>

        <button
          onClick={onContinue}
          className="px-6 py-3 text-sm transition-all duration-150 active:scale-[0.98]"
          style={{
            borderRadius: 99,
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'rgba(255,255,255,0.7)',
            opacity: showButton ? 1 : 0,
            transition: 'opacity 0.4s ease, border-color 0.15s, color 0.15s, transform 0.15s',
          }}
          onMouseEnter={e => {
            ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.4)'
            ;(e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,1)'
          }}
          onMouseLeave={e => {
            ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.2)'
            ;(e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.7)'
          }}
        >
          Continue →
        </button>
      </div>
    </div>
  )
}
