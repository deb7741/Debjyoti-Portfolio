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
    id: "ams-ic",
    label: "Mixed-Signal IC Design",
    x: 45,
    y: 32,
    category: "core",
    description:
      "Transistor-level analog and mixed-signal circuit design in 45–180 nm CMOS, from primitives to silicon-ready receive chains.",
    related: ["subthreshold", "ultrasound", "sar-adc", "ising-machines", "snn"],
  },
  // Analog front-end cluster
  {
    id: "subthreshold",
    label: "Subthreshold Op-Amps",
    x: 15,
    y: 12,
    category: "analog",
    description:
      "Ultra-low-power op-amps operating in weak inversion with adaptive biasing — the subject of the DevIC 2025 and GCON 2026 papers.",
    related: ["ams-ic", "45nm", "low-power"],
  },
  {
    id: "45nm",
    label: "45 nm CMOS",
    x: 5,
    y: 36,
    category: "analog",
    description: "Op-amp design addressing short-channel effects and gate leakage, with full post-layout PVT verification.",
    related: ["subthreshold", "ams-ic"],
  },
  {
    id: "low-power",
    label: "Ultra-Low Power",
    x: 32,
    y: 4,
    category: "analog",
    description: "Sensing and computation at the edge on micro- to pico-joule budgets: implantables, ultrasound, neuromorphic.",
    related: ["subthreshold", "snn", "ultrasound"],
  },
  {
    id: "ultrasound",
    label: "Ultrasound AFE",
    x: 14,
    y: 62,
    category: "analog",
    description:
      "Low-power ultrasound imaging receive chain in 180 nm CMOS (IISc), with analog envelope-based feature extraction (submitted to DATE 2027).",
    related: ["ams-ic", "vga", "sar-adc"],
  },
  {
    id: "vga",
    label: "Variable-Gain Amp",
    x: 3,
    y: 82,
    category: "analog",
    description: "The variable-gain amplifier stage of the ultrasound receive chain, 180 nm CMOS.",
    related: ["ultrasound", "sar-adc"],
  },
  {
    id: "sar-adc",
    label: "10-bit SAR ADC",
    x: 28,
    y: 84,
    category: "analog",
    description: "A 10-bit successive-approximation ADC digitising the ultrasound receive chain, 180 nm CMOS.",
    related: ["ultrasound", "vga", "ams-ic"],
  },
  // Analog computing cluster
  {
    id: "ising-machines",
    label: "Ising Machines",
    x: 70,
    y: 14,
    category: "computing",
    description:
      "Current-mode CMOS primitives (65 nm) that map NP-hard combinatorial problems — 3-SAT, Max-Cut, prime factorization — onto circuit dynamics.",
    related: ["ams-ic", "spin-detection", "prime-factor"],
  },
  {
    id: "spin-detection",
    label: "Spin-Threshold Detector",
    x: 92,
    y: 8,
    category: "computing",
    description: "Threshold detection circuit that resolves spin states in the current-mode Ising machine.",
    related: ["ising-machines", "prime-factor"],
  },
  {
    id: "prime-factor",
    label: "IMPEDE",
    x: 93,
    y: 28,
    category: "computing",
    description:
      "Ising-based prime factorization circuit using current coupling and spin-threshold detection (submitted to AsianHOST 2026).",
    related: ["ising-machines", "spin-detection"],
  },
  {
    id: "snn",
    label: "Spiking Neural Nets",
    x: 66,
    y: 44,
    category: "computing",
    description:
      "Subthreshold LIF neurons and current-mode synapses (180 nm) characterised by Monte-Carlo; 2.17 pJ/spike, with hardware-aware retraining recovering 97.17% MNIST accuracy.",
    related: ["ams-ic", "lif", "ising-machines"],
  },
  {
    id: "lif",
    label: "LIF Neuron & Synapse",
    x: 88,
    y: 50,
    category: "computing",
    description: "Subthreshold integrate-and-fire silicon neuron and current-mode synapse circuits.",
    related: ["snn"],
  },
  // Security cluster
  {
    id: "side-channel",
    label: "Side-Channel Analysis",
    x: 48,
    y: 66,
    category: "security",
    description:
      "Power and EM side-channel analysis of embedded cryptography — session-key recovery from TLS 1.3 (under review, IEEE TSG).",
    related: ["em-leakage", "tls"],
  },
  {
    id: "em-leakage",
    label: "EM Leakage",
    x: 44,
    y: 90,
    category: "security",
    description: "Localised EM cartography to map microarchitectural leakage sites.",
    related: ["side-channel", "tls"],
  },
  {
    id: "tls",
    label: "TLS 1.3 / AES-GCM",
    x: 64,
    y: 82,
    category: "security",
    description: "TLS 1.3 (AES-128-GCM) on an ARM Cortex-M33 running a live RTOS/wolfSSL stack.",
    related: ["side-channel", "em-leakage"],
  },
  // RRI cluster
  {
    id: "fft-spectrometer",
    label: "16K-pt FFT Spectrometer",
    x: 88,
    y: 72,
    category: "rri",
    description:
      "Full-precision 16K-point spectrometer using a parallel FFT architecture in Verilog (Raman Research Institute, SARAS).",
    related: ["rfsoc", "radiometer"],
  },
  {
    id: "rfsoc",
    label: "RFSoC ZCU216",
    x: 82,
    y: 92,
    category: "rri",
    description: "Xilinx RFSoC platform hosting the spectrometer and the RF data-acquisition chain.",
    related: ["fft-spectrometer"],
  },
  {
    id: "radiometer",
    label: "21-cm Radiometry",
    x: 97,
    y: 88,
    category: "rri",
    description: "Recovering the faint spectral signature of neutral hydrogen from the early universe.",
    related: ["fft-spectrometer"],
  },
]

const edges: GraphEdge[] = [
  { from: "ams-ic", to: "subthreshold" },
  { from: "ams-ic", to: "ultrasound" },
  { from: "ams-ic", to: "ising-machines" },
  { from: "ams-ic", to: "snn" },
  { from: "ams-ic", to: "side-channel" },
  { from: "subthreshold", to: "45nm" },
  { from: "subthreshold", to: "low-power" },
  { from: "low-power", to: "ising-machines" },
  { from: "ultrasound", to: "vga" },
  { from: "ultrasound", to: "sar-adc" },
  { from: "vga", to: "sar-adc" },
  { from: "ising-machines", to: "spin-detection" },
  { from: "ising-machines", to: "prime-factor" },
  { from: "spin-detection", to: "prime-factor" },
  { from: "snn", to: "lif" },
  { from: "ising-machines", to: "snn" },
  { from: "side-channel", to: "em-leakage" },
  { from: "side-channel", to: "tls" },
  { from: "em-leakage", to: "tls" },
  { from: "fft-spectrometer", to: "rfsoc" },
  { from: "fft-spectrometer", to: "radiometer" },
  { from: "rfsoc", to: "radiometer" },
  { from: "sar-adc", to: "fft-spectrometer" },
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
  analog: "Analog Front-Ends",
  computing: "Analog Computing",
  security: "Hardware Security",
  rri: "Digital Backend / FPGA",
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
