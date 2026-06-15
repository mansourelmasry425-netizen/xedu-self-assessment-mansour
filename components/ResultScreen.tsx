'use client'
import { useEffect, useRef, useState } from 'react'
import { AssessmentResult, StrokeRecord } from '@/lib/types'
import { AnimatedPortrait } from './Portrait'

interface ResultScreenProps {
  result: AssessmentResult
  strokes: StrokeRecord[]
  studentName: string
  onReplay: () => void
}

export default function ResultScreen({ result, strokes, onReplay }: ResultScreenProps) {
  const [typedName, setTypedName] = useState('')
  const [showSub, setShowSub] = useState(false)
  const [portraitDone, setPortraitDone] = useState(false)
  const [showBody, setShowBody] = useState(false)
  const [barsVisible, setBarsVisible] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Starfield
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const stars: { x: number; y: number; r: number; o: number; sp: number }[] = []
    for (let i = 0; i < 60; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 0.3 + Math.random() * 1.5,
        o: 0.2 + Math.random() * 0.6,
        sp: 0.002 + Math.random() * 0.003,
      })
    }

    let frame = 0
    let raf: number

    function draw() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#0D0B1A'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      for (const s of stars) {
        const op = s.o + Math.sin(frame * s.sp) * 0.15
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${op})`
        ctx.fill()
      }
      frame++
      raf = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(raf)
  }, [])

  // Typing animation — starts at 300ms
  useEffect(() => {
    const name = result.archetype
    let i = 0
    const start = setTimeout(() => {
      const interval = setInterval(() => {
        i++
        setTypedName(name.slice(0, i))
        if (i >= name.length) {
          clearInterval(interval)
          setTimeout(() => setShowSub(true), 100)
        }
      }, 45)
    }, 300)
    return () => clearTimeout(start)
  }, [result.archetype])

  useEffect(() => {
    if (portraitDone) {
      setTimeout(() => {
        setShowBody(true)
        setTimeout(() => setBarsVisible(true), 400)
      }, 200)
    }
  }, [portraitDone])

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0D0B1A' }}>
      {/* Hero with starfield */}
      <div
        className="relative flex flex-col items-center justify-center pt-16 pb-12 px-6 overflow-hidden"
        style={{ minHeight: 340 }}
      >
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        <div className="relative z-10 flex flex-col items-center gap-6 text-center">
          <AnimatedPortrait strokes={strokes} size={90} bgColour="#0D0B1A" onComplete={() => setPortraitDone(true)} />
          <div>
            <h1 className="text-2xl font-medium text-white" style={{ minHeight: '2rem' }}>
              {typedName}
            </h1>
            <p
              className="text-sm mt-1"
              style={{
                color: 'rgba(255,255,255,0.5)',
                opacity: showSub ? 1 : 0,
                transition: 'opacity 0.5s ease',
              }}
            >
              {result.archetypeSub}
            </p>
          </div>
        </div>
      </div>

      {/* Result body */}
      <div
        className="flex-1 flex flex-col gap-6 px-5 pb-12 max-w-lg mx-auto w-full"
        style={{
          opacity: showBody ? 1 : 0,
          transform: showBody ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}
      >
        {/* Art reading */}
        <div
          className="p-5 rounded-xl flex gap-3 items-start"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <span className="text-lg">🎨</span>
          <div>
            <p
              className="text-xs uppercase tracking-widest mb-2"
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              what your portrait shows
            </p>
            <p className="text-sm italic leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
              {result.artReading}
            </p>
          </div>
        </div>

        {/* Trait bars */}
        <div className="flex flex-col gap-3">
          {result.traits.map((trait, i) => (
            <div key={i}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {trait.label}
                </span>
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {trait.pct}%
                </span>
              </div>
              <div
                className="rounded-full overflow-hidden"
                style={{ height: 6, background: 'rgba(255,255,255,0.1)' }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: barsVisible ? `${trait.pct}%` : '0%',
                    background: trait.colour,
                    transition: `width 1200ms ease-out ${i * 120}ms`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Insight cards */}
        <div className="flex flex-col gap-3">
          <div
            className="p-4 rounded-xl"
            style={{
              borderLeft: '2px solid #1D9E75',
              background: 'rgba(255,255,255,0.03)',
            }}
          >
            <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#1D9E75' }}>
              what you do well
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
              {result.strength}
            </p>
          </div>
          <div
            className="p-4 rounded-xl"
            style={{
              borderLeft: '2px solid #EF9F27',
              background: 'rgba(255,255,255,0.03)',
            }}
          >
            <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#EF9F27' }}>
              your biggest gap
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
              {result.gap}
            </p>
          </div>
          <div
            className="p-4 rounded-xl"
            style={{
              background: 'rgba(127,119,221,0.15)',
              border: '1px solid rgba(127,119,221,0.25)',
            }}
          >
            <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'rgba(127,119,221,0.7)' }}>
              do this first
            </p>
            <p className="text-sm font-medium leading-relaxed text-white">{result.nextStep}</p>
          </div>
        </div>

        {/* Method footer */}
        <div
          className="p-4 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.3)' }}>
            This portrait was built using Situational Judgment Testing (McDaniel et al., 2001) and Ecological
            Momentary Assessment (Shiffman et al., 2008). Six moments. Six choices. One abstract composition
            that captures not what you said about yourself — but what you did.
          </p>
        </div>

        {/* Replay */}
        <button
          onClick={onReplay}
          className="w-full py-4 text-sm transition-all duration-150"
          style={{
            borderRadius: 99,
            border: '1px solid rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.5)',
          }}
          onMouseEnter={e => {
            ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.3)'
            ;(e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.8)'
          }}
          onMouseLeave={e => {
            ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.15)'
            ;(e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.5)'
          }}
        >
          Live a different day
        </button>
      </div>
    </div>
  )
}
