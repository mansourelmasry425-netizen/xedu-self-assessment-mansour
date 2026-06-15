import { StrokeRecord } from './types'

export function drawPortrait(
  canvas: HTMLCanvasElement,
  strokes: StrokeRecord[],
  size: number,
  bgColour: string
): void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const cx = size / 2
  const cy = size / 2
  const r = size / 2

  ctx.clearRect(0, 0, size, size)

  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.clip()

  ctx.fillStyle = bgColour
  ctx.fillRect(0, 0, size, size)

  for (const stroke of strokes) {
    drawStroke(ctx, stroke, cx, cy, r, size)
  }

  ctx.restore()
}

function drawStroke(
  ctx: CanvasRenderingContext2D,
  stroke: StrokeRecord,
  cx: number,
  cy: number,
  r: number,
  size: number
): void {
  const angle = (stroke.sceneIndex / 6) * Math.PI * 2 - Math.PI / 2
  const alpha = 0.45 + stroke.energy * 0.45
  const lw = (size / 130) * (1 + stroke.energy * 1.5)

  ctx.save()
  ctx.globalAlpha = alpha
  ctx.strokeStyle = stroke.colour
  ctx.fillStyle = stroke.colour
  ctx.lineWidth = lw
  ctx.lineCap = 'round'

  switch (stroke.type) {
    case 'arc': {
      const arcR = r * (0.4 + stroke.energy * 0.35)
      const sweep = (0.4 + stroke.energy * 0.6) * Math.PI
      ctx.beginPath()
      ctx.arc(cx, cy, arcR, angle - sweep / 2, angle + sweep / 2)
      ctx.stroke()
      break
    }
    case 'eye': {
      const dist = r * (0.35 + stroke.energy * 0.3)
      const ex = cx + Math.cos(angle) * dist
      const ey = cy + Math.sin(angle) * dist
      const eyeR = r * (0.06 + stroke.energy * 0.06)
      ctx.beginPath()
      ctx.arc(ex, ey, eyeR * 0.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(ex, ey, eyeR, 0, Math.PI * 2)
      ctx.stroke()
      break
    }
    case 'line': {
      const lineLen = r * (0.3 + stroke.energy * 0.55)
      const x1 = cx + Math.cos(angle) * r * 0.1
      const y1 = cy + Math.sin(angle) * r * 0.1
      const x2 = cx + Math.cos(angle) * lineLen
      const y2 = cy + Math.sin(angle) * lineLen
      ctx.beginPath()
      ctx.moveTo(x1, y1)
      ctx.lineTo(x2, y2)
      ctx.stroke()
      break
    }
    case 'ground': {
      const baseDist = r * 0.5
      const bx = cx + Math.cos(angle) * baseDist
      const by = cy + Math.sin(angle) * baseDist
      const rootLen = r * (0.08 + stroke.energy * 0.14)
      const spread = (0.3 + stroke.energy * 0.4) * Math.PI
      for (let i = 0; i < 5; i++) {
        const a = angle + spread * (i / 4 - 0.5)
        ctx.beginPath()
        ctx.moveTo(bx, by)
        ctx.lineTo(bx + Math.cos(a) * rootLen, by + Math.sin(a) * rootLen)
        ctx.stroke()
      }
      break
    }
    case 'reach': {
      const reachLen = r * (0.55 + stroke.energy * 0.4)
      const rx2 = cx + Math.cos(angle) * reachLen
      const ry2 = cy + Math.sin(angle) * reachLen
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(rx2, ry2)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(rx2, ry2, lw * 1.2, 0, Math.PI * 2)
      ctx.fill()
      break
    }
    case 'close': {
      const outerR = r * 0.85
      const innerR = r * 0.45
      for (let i = 0; i < 7; i++) {
        const a1 = angle + ((i * 2) / 7) * Math.PI * 2
        const a2 = angle + (((i + 3) % 7) * 2 / 7) * Math.PI * 2
        const ox = cx + Math.cos(a1) * outerR
        const oy = cy + Math.sin(a1) * outerR
        const ix = cx + Math.cos(a2) * innerR
        const iy = cy + Math.sin(a2) * innerR
        ctx.beginPath()
        ctx.moveTo(ox, oy)
        ctx.lineTo(ix, iy)
        ctx.stroke()
      }
      break
    }
  }

  ctx.restore()
}

export function animatePortrait(
  canvas: HTMLCanvasElement,
  strokes: StrokeRecord[],
  size: number,
  bgColour: string,
  onComplete: () => void
): () => void {
  let cancelled = false
  let idx = 0

  function step() {
    if (cancelled) return
    drawPortrait(canvas, strokes.slice(0, idx), size, bgColour)
    idx++
    if (idx <= strokes.length) {
      setTimeout(step, 450)
    } else {
      onComplete()
    }
  }

  drawPortrait(canvas, [], size, bgColour)
  setTimeout(step, 300)

  return () => {
    cancelled = true
  }
}
