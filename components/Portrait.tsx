'use client'
import { useEffect, useRef } from 'react'
import { StrokeRecord } from '@/lib/types'
import { drawPortrait, animatePortrait } from '@/lib/portrait'

interface PortraitProps {
  strokes: StrokeRecord[]
  size: number
  bgColour?: string
}

export default function Portrait({ strokes, size, bgColour = '#0D0B1A' }: PortraitProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      drawPortrait(canvasRef.current, strokes, size, bgColour)
    }
  }, [strokes, size, bgColour])

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{ borderRadius: '50%', display: 'block' }}
    />
  )
}

interface AnimatedPortraitProps extends PortraitProps {
  onComplete?: () => void
}

export function AnimatedPortrait({ strokes, size, bgColour = '#0D0B1A', onComplete }: AnimatedPortraitProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    const cancel = animatePortrait(canvasRef.current, strokes, size, bgColour, onComplete ?? (() => {}))
    return cancel
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      style={{ borderRadius: '50%', display: 'block' }}
    />
  )
}
