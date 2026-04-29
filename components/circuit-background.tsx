"use client"

import { useEffect, useRef } from "react"

export function CircuitBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Circuit node class
    class Node {
      x: number
      y: number
      vx: number
      vy: number
      connections: Node[]

      constructor(x: number, y: number) {
        this.x = x
        this.y = y
        this.vx = (Math.random() - 0.5) * 0.3
        this.vy = (Math.random() - 0.5) * 0.3
        this.connections = []
      }

      update(width: number, height: number) {
        this.x += this.vx
        this.y += this.vy

        if (this.x < 0 || this.x > width) this.vx *= -1
        if (this.y < 0 || this.y > height) this.vy *= -1
      }
    }

    // Create nodes
    const nodes: Node[] = []
    const nodeCount = Math.floor((canvas.width * canvas.height) / 25000)
    
    for (let i = 0; i < nodeCount; i++) {
      nodes.push(new Node(Math.random() * canvas.width, Math.random() * canvas.height))
    }

    // Animation loop
    let animationId: number
    const animate = () => {
      ctx.fillStyle = "rgba(26, 22, 37, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw nodes
      nodes.forEach((node) => {
        node.update(canvas.width, canvas.height)

        // Draw node
        ctx.beginPath()
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(139, 92, 246, 0.5)"
        ctx.fill()
      })

      // Draw connections
      nodes.forEach((node, i) => {
        nodes.slice(i + 1).forEach((otherNode) => {
          const dx = node.x - otherNode.x
          const dy = node.y - otherNode.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(otherNode.x, otherNode.y)
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.15 * (1 - distance / 150)})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        })
      })

      animationId = requestAnimationFrame(animate)
    }

    // Initial clear
    ctx.fillStyle = "rgba(26, 22, 37, 1)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 opacity-60"
      aria-hidden="true"
    />
  )
}
