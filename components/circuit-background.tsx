"use client"

import { useEffect, useRef } from "react"

/**
 * Animated printed-circuit-board background.
 *
 * A procedurally routed board — IC footprints with pins, copper traces with
 * 45° bends, pads and vias — is drawn once to an offscreen layer. Signal
 * pulses then travel along random traces like data on a bus.
 *
 * Colours follow the theme tokens --trace and --signal; the board is
 * re-routed on resize; animation pauses in hidden tabs and is replaced by a
 * static board for visitors who prefer reduced motion.
 */

const GRID = 26 // routing pitch in CSS px
const DIRS: [number, number][] = [
  [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1],
]

interface Trace {
  pts: { x: number; y: number }[]
  cum: number[] // cumulative length at each point
  length: number
}

interface Chip {
  x: number
  y: number
  w: number
  h: number
}

interface Pulse {
  trace: Trace
  pos: number
  speed: number
  dir: 1 | -1
}

function rand(n: number) {
  return Math.floor(Math.random() * n)
}

function routeBoard(width: number, height: number) {
  const cols = Math.ceil(width / GRID) + 1
  const rows = Math.ceil(height / GRID) + 1
  const used = new Uint8Array(cols * rows)
  const idx = (c: number, r: number) => r * cols + c
  const inside = (c: number, r: number) => c >= 0 && r >= 0 && c < cols && r < rows
  const free = (c: number, r: number) => inside(c, r) && !used[idx(c, r)]

  const traces: Trace[] = []
  const chips: Chip[] = []

  const walk = (c: number, r: number, dir: number, maxLen: number) => {
    const cells: [number, number][] = [[c, r]]
    used[idx(c, r)] = 1
    for (let step = 0; step < maxLen; step++) {
      let d = dir
      if (Math.random() < 0.18) d = (dir + (Math.random() < 0.5 ? 1 : 7)) % 8 // 45° turn
      const [dx, dy] = DIRS[d]
      const nc = c + dx
      const nr = r + dy
      // diagonal moves must not cut across another trace
      if (!free(nc, nr) || (dx && dy && (!free(c + dx, r) && !free(c, r + dy)))) break
      c = nc
      r = nr
      dir = d
      used[idx(c, r)] = 1
      cells.push([c, r])
    }
    return cells
  }

  const addTrace = (cells: [number, number][]) => {
    if (cells.length < 3) return
    // keep only the corners so lines are crisp
    const pts: { x: number; y: number }[] = []
    for (let i = 0; i < cells.length; i++) {
      const prev = cells[i - 1]
      const cur = cells[i]
      const next = cells[i + 1]
      if (prev && next && cur[0] - prev[0] === next[0] - cur[0] && cur[1] - prev[1] === next[1] - cur[1]) continue
      pts.push({ x: cur[0] * GRID, y: cur[1] * GRID })
    }
    const cum = [0]
    for (let i = 1; i < pts.length; i++) {
      cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y))
    }
    traces.push({ pts, cum, length: cum[cum.length - 1] })
  }

  // 1) IC footprints with pins fanning out
  const chipCount = Math.max(2, Math.min(5, Math.round((width * height) / 380000)))
  for (let n = 0; n < chipCount * 4 && chips.length < chipCount; n++) {
    const w = 4 + rand(4)
    const h = 3 + rand(3)
    const c0 = 2 + rand(Math.max(1, cols - w - 4))
    const r0 = 2 + rand(Math.max(1, rows - h - 4))
    let ok = true
    for (let c = c0 - 2; c <= c0 + w + 2 && ok; c++)
      for (let r = r0 - 2; r <= r0 + h + 2 && ok; r++) if (!free(c, r)) ok = false
    if (!ok) continue
    for (let c = c0; c <= c0 + w; c++) for (let r = r0; r <= r0 + h; r++) used[idx(c, r)] = 1
    chips.push({ x: c0 * GRID, y: r0 * GRID, w: w * GRID, h: h * GRID })
    for (let c = c0 + 1; c < c0 + w; c++) {
      if (Math.random() < 0.75 && free(c, r0 - 1)) addTrace(walk(c, r0 - 1, 6, 6 + rand(16)))
      if (Math.random() < 0.75 && free(c, r0 + h + 1)) addTrace(walk(c, r0 + h + 1, 2, 6 + rand(16)))
    }
    for (let r = r0 + 1; r < r0 + h; r++) {
      if (Math.random() < 0.75 && free(c0 - 1, r)) addTrace(walk(c0 - 1, r, 4, 6 + rand(16)))
      if (Math.random() < 0.75 && free(c0 + w + 1, r)) addTrace(walk(c0 + w + 1, r, 0, 6 + rand(16)))
    }
  }

  // 2) free-running traces filling the rest of the board (mostly orthogonal starts)
  const attempts = Math.floor((cols * rows) / 14)
  for (let n = 0; n < attempts; n++) {
    const c = rand(cols)
    const r = rand(rows)
    if (!free(c, r)) continue
    const dir = Math.random() < 0.8 ? rand(4) * 2 : rand(8)
    addTrace(walk(c, r, dir, 4 + rand(18)))
  }

  return { traces, chips }
}

function pointAt(t: Trace, s: number) {
  s = Math.max(0, Math.min(t.length, s))
  let i = 1
  while (i < t.cum.length - 1 && t.cum[i] < s) i++
  const a = t.pts[i - 1]
  const b = t.pts[i]
  const seg = t.cum[i] - t.cum[i - 1] || 1
  const k = (s - t.cum[i - 1]) / seg
  return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k }
}

function cssColor(name: string): [number, number, number] {
  const probe = document.createElement("canvas").getContext("2d")
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  if (!probe || !value) return [180, 120, 60]
  probe.fillStyle = value
  probe.fillRect(0, 0, 1, 1)
  const [r, g, b] = probe.getImageData(0, 0, 1, 1).data
  return [r, g, b]
}

export function CircuitBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const layer = document.createElement("canvas")
    const lctx = layer.getContext("2d")!
    let width = 0
    let height = 0
    let dpr = 1
    let board = { traces: [] as Trace[], chips: [] as Chip[] }
    let pulses: Pulse[] = []
    let trace: [number, number, number] = [180, 120, 60]
    let signal: [number, number, number] = [60, 90, 200]
    let frame = 0
    let last = 0

    const rgba = (c: [number, number, number], a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`

    const paintBoard = () => {
      lctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      lctx.clearRect(0, 0, width, height)
      lctx.lineCap = "round"
      lctx.lineJoin = "round"

      // ground-plane dot grid
      lctx.fillStyle = rgba(trace, 0.09)
      for (let x = 0; x <= width; x += GRID) for (let y = 0; y <= height; y += GRID) lctx.fillRect(x - 0.5, y - 0.5, 1, 1)

      // traces
      lctx.strokeStyle = rgba(trace, 0.28)
      lctx.lineWidth = 1.6
      for (const t of board.traces) {
        lctx.beginPath()
        lctx.moveTo(t.pts[0].x, t.pts[0].y)
        for (let i = 1; i < t.pts.length; i++) lctx.lineTo(t.pts[i].x, t.pts[i].y)
        lctx.stroke()
      }
      // pads at both ends (vias at free ends)
      for (const t of board.traces) {
        for (const p of [t.pts[0], t.pts[t.pts.length - 1]]) {
          lctx.beginPath()
          lctx.arc(p.x, p.y, 3.2, 0, Math.PI * 2)
          lctx.strokeStyle = rgba(trace, 0.38)
          lctx.lineWidth = 1.4
          lctx.stroke()
          lctx.beginPath()
          lctx.arc(p.x, p.y, 1.1, 0, Math.PI * 2)
          lctx.fillStyle = rgba(trace, 0.38)
          lctx.fill()
        }
      }
      // IC packages
      for (const c of board.chips) {
        const pad = GRID * 0.35
        lctx.fillStyle = rgba(trace, 0.07)
        lctx.strokeStyle = rgba(trace, 0.35)
        lctx.lineWidth = 1.2
        lctx.beginPath()
        lctx.roundRect(c.x + pad, c.y + pad, c.w - 2 * pad, c.h - 2 * pad, 4)
        lctx.fill()
        lctx.stroke()
        // pin-1 marker
        lctx.beginPath()
        lctx.arc(c.x + pad + 7, c.y + pad + 7, 2.2, 0, Math.PI * 2)
        lctx.fillStyle = rgba(trace, 0.4)
        lctx.fill()
        // pins
        lctx.fillStyle = rgba(trace, 0.35)
        for (let x = c.x + GRID; x < c.x + c.w; x += GRID) {
          lctx.fillRect(x - 2.5, c.y - 2, 5, pad + 2)
          lctx.fillRect(x - 2.5, c.y + c.h - pad, 5, pad + 2)
        }
        for (let y = c.y + GRID; y < c.y + c.h; y += GRID) {
          lctx.fillRect(c.x - 2, y - 2.5, pad + 2, 5)
          lctx.fillRect(c.x + c.w - pad, y - 2.5, pad + 2, 5)
        }
      }
    }

    const spawnPulse = (): Pulse | null => {
      const long = board.traces.filter((t) => t.length > GRID * 5)
      const pool = long.length ? long : board.traces
      if (!pool.length) return null
      const t = pool[rand(pool.length)]
      const dir = Math.random() < 0.5 ? 1 : -1
      return { trace: t, pos: dir === 1 ? 0 : t.length, speed: 70 + Math.random() * 110, dir }
    }

    const setup = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      for (const c of [canvas, layer]) {
        c.width = Math.floor(width * dpr)
        c.height = Math.floor(height * dpr)
      }
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      board = routeBoard(width, height)
      trace = cssColor("--trace")
      signal = cssColor("--signal")
      paintBoard()
      const count = Math.min(22, Math.max(6, Math.round(board.traces.length / 10)))
      pulses = []
      for (let i = 0; i < count; i++) {
        const p = spawnPulse()
        if (p) {
          p.pos = Math.random() * p.trace.length
          pulses.push(p)
        }
      }
    }

    const draw = (dt: number) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(layer, 0, 0)
      if (dt < 0) return // static frame
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.lineCap = "round"
      for (let i = 0; i < pulses.length; i++) {
        const p = pulses[i]
        p.pos += p.dir * p.speed * dt
        if (p.pos < 0 || p.pos > p.trace.length) {
          const np = spawnPulse()
          if (np) pulses[i] = np
          continue
        }
        // glowing trail behind the head
        const TRAIL = 46
        const STEPS = 10
        for (let k = STEPS; k >= 0; k--) {
          const s = p.pos - p.dir * (TRAIL * k) / STEPS
          if (s < 0 || s > p.trace.length) continue
          const q = pointAt(p.trace, s)
          const a = 0.55 * (1 - k / STEPS)
          ctx.fillStyle = rgba(signal, a)
          ctx.beginPath()
          ctx.arc(q.x, q.y, 1.4 + 1.2 * (1 - k / STEPS), 0, Math.PI * 2)
          ctx.fill()
        }
        const h = pointAt(p.trace, p.pos)
        const g = ctx.createRadialGradient(h.x, h.y, 0, h.x, h.y, 9)
        g.addColorStop(0, rgba(signal, 0.55))
        g.addColorStop(1, rgba(signal, 0))
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(h.x, h.y, 9, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const loop = (now: number) => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0
      last = now
      draw(dt)
      frame = requestAnimationFrame(loop)
    }

    const start = () => {
      cancelAnimationFrame(frame)
      last = 0
      if (reduceMotion.matches || document.hidden) draw(-1)
      else frame = requestAnimationFrame(loop)
    }

    let resizeTimer: ReturnType<typeof setTimeout> | undefined
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        setup()
        start()
      }, 150)
    }

    const themeObserver = new MutationObserver(() => {
      trace = cssColor("--trace")
      signal = cssColor("--signal")
      paintBoard()
      if (reduceMotion.matches) draw(-1)
    })
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })

    setup()
    start()
    window.addEventListener("resize", onResize)
    document.addEventListener("visibilitychange", start)
    reduceMotion.addEventListener("change", start)

    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(resizeTimer)
      themeObserver.disconnect()
      window.removeEventListener("resize", onResize)
      document.removeEventListener("visibilitychange", start)
      reduceMotion.removeEventListener("change", start)
    }
  }, [])

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true" />
}
