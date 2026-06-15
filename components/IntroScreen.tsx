'use client'
import { useEffect, useRef } from 'react'

interface IntroScreenProps {
  onStart: () => void
}

export default function IntroScreen({ onStart }: IntroScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()

    const stars: { x: number; y: number; r: number; o: number; speed: number }[] = []
    for (let i = 0; i < 60; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 0.3 + Math.random() * 1.5,
        o: 0.2 + Math.random() * 0.6,
        speed: 0.002 + Math.random() * 0.003,
      })
    }

    let frame = 0
    let raf: number

    function draw() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#26215C'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      for (const s of stars) {
        const opacity = s.o + Math.sin(frame * s.speed) * 0.15
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${opacity})`
        ctx.fill()
      }
      frame++
      raf = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="relative z-10 max-w-md w-full mx-auto px-6 py-12 flex flex-col gap-8">
        <div className="flex flex-col gap-6">
          <p className="text-xs tracking-widest uppercase" style={{ color: 'rgba(196,187,255,0.8)' }}>
            xedu · student self-assessment
          </p>
          <h1 className="text-3xl font-medium text-white leading-tight">
            We won&apos;t ask you to describe yourself.
          </h1>
          <div className="flex flex-col gap-4 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
            <p>
              Instead, you&apos;ll live through six moments in a school day. At each one, you&apos;ll make a choice. Those choices will build an abstract portrait of you — in real time.
            </p>
            <p>
              This tool is built on Ecological Momentary Assessment — a method from clinical psychology that captures behaviour in context rather than asking you to recall it. How you respond to a situation tells us far more than how you&apos;d describe yourself in a form.
            </p>
          </div>
          <div
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl w-fit text-xs"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            <span>📖</span>
            <span className="italic">Shiffman, Stone &amp; Hufford, 2008 · Annual Review of Clinical Psychology</span>
          </div>
        </div>
        <button
          onClick={onStart}
          className="w-full py-4 font-medium text-sm tracking-wide text-white transition-all duration-150 hover:opacity-90 active:scale-[0.98]"
          style={{ background: '#7F77DD', borderRadius: 99 }}
        >
          Begin your day
        </button>
      </div>
    </div>
  )
}
