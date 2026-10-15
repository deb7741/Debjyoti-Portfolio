"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

interface GraphNode {
  id: string
  label: string
  x: number
  y: number
  category: "core" | "analog" | "computing" | "security" | "rri"
  description: string
  related: string[]
}

interface GraphEdge {
  from: string
  to: string
}

const nodes: GraphNode[] = [
  // Core research identity
  {
    id: "analog-ic",
    label: "Analog IC Design",
    x: 50,
    y: 30,
    category: "core",
    description: "Core expertise in designing analog integrated circuits for various applications including biomedical, IoT, and computing systems.",
    related: ["subthreshold", "adaptive-biasing", "45nm", "65nm"],
  },
  // Analog design cluster
  {
    id: "subthreshold",
    label: "Subthreshold Circuits",
    x: 25,
    y: 15,
    category: "analog",
    description: "Ultra-low-power circuit design operating in the subthreshold region of MOSFETs, enabling nano-watt power consumption for implantables and sensors.",
    related: ["analog-ic", "adaptive-biasing", "low-power"],
  },
  {
    id: "adaptive-biasing",
    label: "Adaptive Biasing",
    x: 30,
    y: 45,
    category: "analog",
    description: "Novel biasing techniques that automatically adjust to process, voltage, and temperature variations, improving circuit robustness.",
    related: ["analog-ic", "subthreshold", "45nm"],
  },
  {
    id: "45nm",
    label: "45nm CMOS",
    x: 15,
    y: 55,
    category: "analog",
    description: "Design experience in 45nm technology node, addressing short-channel effects and gate leakage challenges.",
    related: ["analog-ic", "adaptive-biasing", "65nm"],
  },
  {
    id: "65nm",
    label: "65nm Design",
    x: 10,
    y: 35,
    category: "analog",
    description: "Circuit design in 65nm node for low-power analog applications.",
    related: ["analog-ic", "45nm", "subthreshold"],
  },
  {
    id: "low-power",
    label: "Low Power",
    x: 40,
    y: 12,
    category: "analog",
    description: "Techniques for minimizing power consumption while maintaining performance specifications.",
    related: ["subthreshold", "adaptive-biasing", "ising-machines"],
  },
  // Computing cluster
  {
    id: "ising-machines",
    label: "Ising Machines",
    x: 70,
    y: 20,
    category: "computing",
    description: "Current-mode analog circuits that solve combinatorial optimization problems by emulating spin dynamics, offering exponential speedup for NP-hard problems.",
    related: ["analog-ic", "spin-detection", "neuromorphic"],
  },
  {
    id: "spin-detection",
    label: "Spin Detection",
    x: 85,
    y: 35,
    category: "computing",
    description: "Threshold detection circuits for determining spin states in analog Ising machine implementations.",
    related: ["ising-machines", "neuromorphic"],
  },
  {
    id: "neuromorphic",
    label: "Neuromorphic",
    x: 78,
    y: 50,
    category: "computing",
    description: "Brain-inspired computing primitives and stochastic circuits for energy-efficient AI acceleration.",
    related: ["ising-machines", "spin-detection", "analog-ic"],
  },
  // Security cluster
  {
    id: "side-channel",
    label: "Side-Channel Analysis",
    x: 55,
    y: 70,
    category: "security",
    description: "Characterizing electromagnetic and power emanations from cryptographic implementations to identify security vulnerabilities.",
    related: ["em-leakage", "aes", "tls"],
  },
  {
    id: "em-leakage",
    label: "EM Leakage",
    x: 40,
    y: 85,
    category: "security",
    description: "Electromagnetic cartography and near-field probing techniques to map leakage points in secure hardware.",
    related: ["side-channel", "aes"],
  },
  {
    id: "aes",
    label: "AES / Crypto",
    x: 70,
    y: 82,
    category: "security",
    description: "Security evaluation of AES implementations on embedded platforms through correlation power analysis.",
    related: ["side-channel", "em-leakage", "tls"],
  },
  {
    id: "tls",
    label: "TLS 1.3 Security",
    x: 60,
    y: 92,
    category: "security",
    description: "Physical security analysis of TLS handshake implementations, identifying potential vulnerabilities in secure communication protocols.",
    related: ["side-channel", "aes"],
  },
  // RRI cluster
  {
    id: "rri-digital",
    label: "Digital Backend",
    x: 88,
    y: 68,
    category: "rri",
    description: "FPGA/Verilog-based digital backend design for radio astronomy instrumentation at Raman Research Institute.",
    related: ["radiometer", "signal-dsp", "fpga"],
  },
  {
    id: "radiometer",
    label: "Radiometer Systems",
    x: 92,
    y: 85,
    category: "rri",
    description: "Instrumentation systems for radio telescope receivers, integrating analog signal conditioning with digital processing.",
    related: ["rri-digital", "signal-dsp"],
  },
  {
    id: "signal-dsp",
    label: "Signal / DSP",
    x: 75,
    y: 92,
    category: "rri",
    description: "Digital signal processing pipelines for astronomical data acquisition and real-time analysis.",
    related: ["rri-digital", "radiometer", "fpga"],
  },
  {
    id: "fpga",
    label: "FPGA Prototyping",
    x: 95,
    y: 52,
    category: "rri",
    description: "Rapid prototyping and implementation of digital systems on FPGA platforms.",
    related: ["rri-digital", "signal-dsp"],
  },
]

const edges: GraphEdge[] = [
  // Core connections
  { from: "analog-ic", to: "subthreshold" },
  { from: "analog-ic", to: "adaptive-biasing" },
  { from: "analog-ic", to: "45nm" },
  { from: "analog-ic", to: "ising-machines" },
  // Analog cluster
  { from: "subthreshold", to: "adaptive-biasing" },
  { from: "subthreshold", to: "low-power" },
  { from: "adaptive-biasing", to: "45nm" },
  { from: "45nm", to: "65nm" },
  { from: "65nm", to: "subthreshold" },
  { from: "low-power", to: "ising-machines" },
  // Computing cluster
  { from: "ising-machines", to: "spin-detection" },
  { from: "ising-machines", to: "neuromorphic" },
  { from: "spin-detection", to: "neuromorphic" },
  // Security cluster
  { from: "side-channel", to: "em-leakage" },
  { from: "side-channel", to: "aes" },
  { from: "side-channel", to: "tls" },
  { from: "em-leakage", to: "aes" },
  { from: "aes", to: "tls" },
  // RRI cluster
  { from: "rri-digital", to: "radiometer" },
  { from: "rri-digital", to: "signal-dsp" },
  { from: "rri-digital", to: "fpga" },
  { from: "radiometer", to: "signal-dsp" },
  { from: "signal-dsp", to: "fpga" },
  // Cross-cluster connections
  { from: "neuromorphic", to: "side-channel" },
  { from: "analog-ic", to: "side-channel" },
  { from: "fpga", to: "neuromorphic" },
]

const nodeById = new Map(nodes.map((n) => [n.id, n]))

const categoryColors: Record<GraphNode["category"], { bg: string; border: string; text: string }> = {
  core: { bg: "bg-primary/20", border: "border-primary", text: "text-primary" },
  analog: { bg: "bg-indigo-500/20", border: "border-indigo-500/50", text: "text-indigo-700 dark:text-indigo-400" },
  computing: { bg: "bg-violet-500/20", border: "border-violet-500/50", text: "text-violet-700 dark:text-violet-400" },
  security: { bg: "bg-amber-500/20", border: "border-amber-500/50", text: "text-amber-700 dark:text-amber-400" },
  rri: { bg: "bg-emerald-500/20", border: "border-emerald-500/50", text: "text-emerald-700 dark:text-emerald-400" },
}

const categoryLabels: Record<GraphNode["category"], string> = {
  core: "Core Expertise",
  analog: "Analog Design",
  computing: "Analog Computing",
  security: "Hardware Security",
  rri: "RRI / Digital Systems",
}

/** Graph is drawn at least this wide; narrower screens scroll horizontally. */
const MIN_GRAPH_WIDTH = 720

export function ResearchGraph() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [width, setWidth] = useState(MIN_GRAPH_WIDTH)
  const containerRef = useRef<HTMLDivElement>(null)

  // Track the container's width (ResizeObserver also catches layout changes, not just window resizes).
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.max(MIN_GRAPH_WIDTH, entry.contentRect.width))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const height = Math.max(420, Math.min(520, width * 0.6))
  // Node coordinates are 0–100; map them into a padded box so edge labels never clip.
  const pos = (node: GraphNode) => ({
    x: (0.08 + (node.x / 100) * 0.84) * width,
    y: (0.07 + (node.y / 100) * 0.86) * height,
  })

  // Neighbours of the hovered/focused node, computed once per hover change.
  const highlightedIds = useMemo(() => {
    if (!hoveredNode) return null
    const set = new Set<string>([hoveredNode])
    nodeById.get(hoveredNode)?.related.forEach((id) => set.add(id))
    edges.forEach((e) => {
      if (e.from === hoveredNode) set.add(e.to)
      if (e.to === hoveredNode) set.add(e.from)
    })
    return set
  }, [hoveredNode])

  useEffect(() => {
    if (!selectedNode) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelectedNode(null)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [selectedNode])

  return (
    <section id="research-map" className="py-24 md:py-32 px-6 scroll-mt-16" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-sm tracking-[0.3em] text-primary uppercase mb-4">Research Map</h2>
          <p className="font-serif text-3xl md:text-4xl font-semibold mb-4 text-balance">
            Knowledge Graph
          </p>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            An interactive visualization of research areas and their interconnections.
            Hover over nodes to explore relationships.
          </p>
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-8"
        >
          {(Object.keys(categoryLabels) as GraphNode["category"][]).map((key) => (
            <div key={key} className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${categoryColors[key].bg} border ${categoryColors[key].border}`}
                aria-hidden="true"
              />
              <span className="text-xs text-muted-foreground">{categoryLabels[key]}</span>
            </div>
          ))}
        </motion.div>

        <div className="relative">
          {/* Scrollable on narrow screens so labels never overlap or clip */}
          <div className="overflow-x-auto rounded-lg border border-border bg-card/30">
            <motion.div
              ref={containerRef}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
              style={{ height, minWidth: MIN_GRAPH_WIDTH }}
            >
              <svg width={width} height={height} className="absolute inset-0" aria-hidden="true">
                {edges.map((edge, index) => {
                  const fromNode = nodeById.get(edge.from)
                  const toNode = nodeById.get(edge.to)
                  if (!fromNode || !toNode) return null
                  const from = pos(fromNode)
                  const to = pos(toNode)
                  const highlighted =
                    hoveredNode !== null && (edge.from === hoveredNode || edge.to === hoveredNode)
                  return (
                    <motion.line
                      key={`${edge.from}-${edge.to}`}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={
                        isInView ? { pathLength: 1, opacity: highlighted ? 0.8 : hoveredNode ? 0.08 : 0.3 } : {}
                      }
                      transition={{ duration: 0.5, delay: hoveredNode ? 0 : 0.5 + index * 0.02 }}
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      stroke={highlighted ? "var(--primary)" : "var(--muted-foreground)"}
                      strokeWidth={highlighted ? 2 : 1}
                    />
                  )
                })}
              </svg>

              {nodes.map((node, index) => {
                const p = pos(node)
                const colors = categoryColors[node.category]
                const highlighted = !highlightedIds || highlightedIds.has(node.id)
                return (
                  <motion.button
                    key={node.id}
                    type="button"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isInView ? { opacity: highlighted ? 1 : 0.3, scale: 1 } : {}}
                    transition={{ duration: 0.3, delay: hoveredNode ? 0 : 0.6 + index * 0.03 }}
                    style={{ position: "absolute", left: p.x, top: p.y, x: "-50%", y: "-50%" }}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onFocus={() => setHoveredNode(node.id)}
                    onBlur={() => setHoveredNode(null)}
                    onClick={() => setSelectedNode(node)}
                    aria-pressed={selectedNode?.id === node.id}
                    className={`px-2.5 py-1.5 rounded-md border text-xs font-medium whitespace-nowrap bg-card transition-shadow duration-200 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${colors.border} ${colors.text}`}
                  >
                    <span className={`absolute inset-0 rounded-md ${colors.bg}`} aria-hidden="true" />
                    <span className="relative">{node.label}</span>
                  </motion.button>
                )
              })}
            </motion.div>
          </div>

          {/* Detail panel sits outside the scroller so it's always fully visible */}
          <AnimatePresence>
            {selectedNode && (
              <motion.div
                key={selectedNode.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                role="dialog"
                aria-label={selectedNode.label}
                className="absolute top-4 right-4 left-4 sm:left-auto sm:w-72 z-10 bg-card border border-border rounded-lg p-4 shadow-xl"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className={`text-xs font-medium ${categoryColors[selectedNode.category].text}`}>
                      {categoryLabels[selectedNode.category]}
                    </span>
                    <h3 className="font-semibold text-card-foreground">{selectedNode.label}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedNode(null)}
                    className="p-1 hover:bg-secondary rounded transition-colors"
                    aria-label="Close details"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  {selectedNode.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {selectedNode.related.map((relId) => {
                    const relNode = nodeById.get(relId)
                    if (!relNode) return null
                    return (
                      <button
                        key={relId}
                        type="button"
                        onClick={() => setSelectedNode(relNode)}
                        className={`text-xs px-2 py-0.5 rounded ${categoryColors[relNode.category].bg} ${categoryColors[relNode.category].text} hover:opacity-80 transition-opacity`}
                      >
                        {relNode.label}
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Click or tab to any node to see details. Hover or focus to highlight connections.
          <span className="sm:hidden"> Swipe sideways to see the whole map.</span>
        </p>
      </div>
    </section>
  )
}
