"use client"

import { useEffect, useRef } from "react"

const LINK_DISTANCE = 150
const MAX_NODES = 90

/**
 * Animated "circuit" particle network behind the page.
 *
 * Optimisations over the original:
 *  - transparent canvas (no hard-coded dark fill), so it works in light mode
 *  - colour follows the theme's --primary token
 *  - crisp on high-DPI screens, node count capped
 *  - pauses when the tab is hidden; draws one static frame for
 *    visitors who prefer reduced motion
 *  - re-seeds nodes on resize so they never cluster off-screen
 */
export function CircuitBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    let width = 0
    let height = 0
    let nodes: { x: number; y: number; vx: number; vy: number }[] = []
    let rgb = "139, 92, 246"
    let frame = 0

    const readColor = () => {
      // Resolve the CSS colour (oklch) to rgb via a 1px canvas probe.
      const probe = document.createElement("canvas").getContext("2d")
      const primary = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim()
      if (!probe || !primary) return
      probe.fillStyle = primary
      probe.fillRect(0, 0, 1, 1)
      const [r, g, b] = probe.getImageData(0, 0, 1, 1).data
      rgb = `${r}, ${g}, ${b}`
    }

    const seed = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.min(MAX_NODES, Math.floor((width * height) / 25000))
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.lineWidth = 1
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d2 = dx * dx + dy * dy
          if (d2 < LINK_DISTANCE * LINK_DISTANCE) {
            const alpha = 0.18 * (1 - Math.sqrt(d2) / LINK_DISTANCE)
            ctx.strokeStyle = `rgba(${rgb}, ${alpha})`
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }
      ctx.fillStyle = `rgba(${rgb}, 0.5)`
      for (const n of nodes) {
        ctx.beginPath()
        ctx.arc(n.x, n.y, 2, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const step = () => {
      for (const n of nodes) {
        n.x += n.vx
        n.y += n.vy
        if (n.x < 0 || n.x > width) n.vx *= -1
        if (n.y < 0 || n.y > height) n.vy *= -1
      }
      draw()
      frame = requestAnimationFrame(step)
    }

    const start = () => {
      cancelAnimationFrame(frame)
      if (reduceMotion.matches || document.hidden) draw()
      else frame = requestAnimationFrame(step)
    }

    const onResize = () => {
      seed()
      start()
    }

    // Re-read the colour whenever the theme class on <html> changes.
    const themeObserver = new MutationObserver(() => {
      readColor()
      if (reduceMotion.matches) draw()
    })
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })

    readColor()
    seed()
    start()
    window.addEventListener("resize", onResize)
    document.addEventListener("visibilitychange", start)
    reduceMotion.addEventListener("change", start)

    return () => {
      cancelAnimationFrame(frame)
      themeObserver.disconnect()
      window.removeEventListener("resize", onResize)
      document.removeEventListener("visibilitychange", start)
      reduceMotion.removeEventListener("change", start)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10 opacity-60"
      aria-hidden="true"
    />
  )
}
