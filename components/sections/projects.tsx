"use client"

import { useState, useRef } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Cpu, Camera, Award, ChevronDown, ExternalLink, Layers } from "lucide-react"
import { ImageGalleryPlaceholder, type GalleryImage } from "@/components/image-gallery"
import { Button } from "@/components/ui/button"

interface ProjectResult {
  label: string
  value: string
}

interface Project {
  id: string
  icon: typeof Cpu
  title: string
  category: string
  tools: string
  period: string
  tags: string[]
  highlight: boolean
  overview: {
    problem: string
    approach: string
    results: ProjectResult[]
  }
  deepDive: {
    problemStatement: string
    designRationale: string
    tradeoffs: string
    verification: string
    keyResults: string
    lessonsLearned: string
    futureWork: string
  }
  images: GalleryImage[]
}

const projects: Project[] = [
  {
    id: "opamp-45nm",
    icon: Cpu,
    title: "Low-Power Two-Stage Op-Amp in 45nm CMOS",
    category: "Best Project Award, Class of 2025",
    tools: "Cadence Virtuoso / ADE / Quantus",
    period: "Sep 2024 — May 2025",
    tags: ["45nm CMOS", "Full-Custom Layout", "Post-Layout Verification", "PVT Corners"],
    highlight: true,
    overview: {
      problem:
        "Conventional operational amplifiers in advanced nodes suffer from short-channel effects and gate leakage, creating significant design challenges for achieving high gain and low power simultaneously at 45nm.",
      approach:
        "Full-custom design targeting short-channel effects and gate leakage at 45nm with complete post-layout verification via parasitic extraction (Quantus). Phase-margin and slew-rate sign-off performed across all PVT corners.",
      results: [
        { label: "DC Gain", value: "67 dB" },
        { label: "GBW", value: "3.7 MHz" },
        { label: "Power", value: "<10 μW" },
        { label: "Publications", value: "2 IEEE" },
      ],
    },
    deepDive: {
      problemStatement:
        "At the 45nm technology node, MOSFET devices exhibit pronounced short-channel effects including DIBL, threshold voltage roll-off, and increased gate leakage. These effects degrade intrinsic gain (gm/gds) and introduce significant power overhead, making it challenging to design operational amplifiers that simultaneously achieve high DC gain (>60 dB) and ultra-low power consumption (<10 μW) required for biomedical front-ends and IoT sensor interfaces.",
      designRationale:
        "A two-stage Miller-compensated OTA architecture was selected for its ability to achieve high gain while maintaining stability with reasonable compensation capacitance. The first stage uses a folded-cascode topology for high input impedance and moderate gain, while the second stage provides additional gain and output swing. Adaptive biasing was implemented to maintain near-constant transconductance across PVT variations, improving robustness without the area penalty of trimming circuits.",
      tradeoffs:
        "The primary tradeoff was between gain and bandwidth — achieving 67 dB gain required larger device sizes that increased parasitic capacitances, limiting GBW. Power vs. noise also required careful balancing: operating in weak inversion minimized power but increased thermal noise. The final design prioritized low power and PVT robustness over maximum bandwidth, appropriate for low-frequency biomedical applications.",
      verification:
        "Complete post-layout verification was performed using Quantus for parasitic extraction. Simulations covered all 27 PVT corners (3 process × 3 voltage × 3 temperature) with worst-case analysis for gain, phase margin, and power. Monte Carlo analysis (500 runs) confirmed statistical yield >95%. DRC and LVS clean sign-off achieved before final characterization.",
      keyResults:
        "DC Gain: 67 dB (spec: >60 dB) | GBW: 3.7 MHz (spec: >1 MHz) | Power: 8.3 μW (spec: <10 μW) | Phase Margin: 65° (spec: >60°) | PVT Variation: <5% across all corners | CMRR: >80 dB | PSRR: >75 dB. Results published in 2 IEEE conference papers with ongoing journal submission.",
      lessonsLearned:
        "Early parasitic extraction iterations proved critical — the first layout iteration showed 15% gain degradation due to unexpected routing capacitance. Systematic corner analysis from the beginning of the design phase saved significant redesign effort. Layout-aware sizing using extracted capacitance models improved first-pass success.",
      futureWork:
        "Planned tape-out validation through a multi-project wafer run. Future work includes extending the design to 28nm node where gate leakage becomes even more dominant, exploring current-reuse architectures for further power reduction, and adding programmable gain stages for multi-application flexibility.",
    },
    images: [], // Images to be added: layout, schematic, simulation waveforms
  },
  {
    id: "ccd-sensor",
    icon: Camera,
    title: "CCD Sensor Characterisation & Noise Pipeline",
    category: "Instrumentation",
    tools: "Python, Image Sensors",
    period: "May 2024 — Jun 2024",
    tags: ["Python", "Image Sensors", "Noise Analysis", "Calibration"],
    highlight: false,
    overview: {
      problem:
        "CCD sensors for astronomical applications require precise characterisation of noise sources to enable accurate signal recovery in low-light conditions.",
      approach:
        "Characterised dark current, thermal noise, and hot-pixel distributions. Built an automated Python calibration pipeline improving signal fidelity in low-light conditions — reinforcing device-level intuition for noise sources relevant to analog front-end design.",
      results: [
        { label: "Analysis", value: "Dark Current" },
        { label: "Noise", value: "Thermal" },
        { label: "Detection", value: "Hot-Pixels" },
        { label: "Output", value: "Auto Pipeline" },
      ],
    },
    deepDive: {
      problemStatement:
        "Astronomical CCD imaging requires extremely low noise floors to detect faint celestial objects. Understanding and characterizing noise sources — dark current, read noise, thermal noise, and fixed-pattern defects — is essential for developing effective calibration pipelines that can recover weak signals from noisy backgrounds.",
      designRationale:
        "A systematic characterization approach was adopted: first measuring baseline noise statistics, then isolating individual noise components through controlled experiments (dark frames at multiple temperatures, flat-field analysis). Python was chosen for its rich scientific computing ecosystem (NumPy, SciPy, Matplotlib) and rapid prototyping capability.",
      tradeoffs:
        "Processing speed vs. accuracy: more sophisticated noise models improved calibration quality but increased computation time. A tiered approach was implemented — fast approximate correction for real-time preview and detailed statistical correction for final science frames.",
      verification:
        "Calibration quality was verified by comparing signal-to-noise ratio before and after correction on known test targets. Hot-pixel detection was validated against manufacturer defect maps with >98% agreement.",
      keyResults:
        "Comprehensive dark current mapping across -20°C to +25°C temperature range. Identified and flagged 0.3% hot pixels with >3σ deviation. Achieved 15% SNR improvement on low-light test images through optimized calibration pipeline.",
      lessonsLearned:
        "This project reinforced device-level intuition about noise sources that directly applies to analog front-end design. Understanding how temperature affects leakage currents in imaging sensors informed subsequent work on subthreshold biasing circuits.",
      futureWork:
        "Integration with real-time acquisition systems for on-the-fly calibration. Extending the pipeline to handle CMOS image sensors with different noise characteristics.",
    },
    images: [], // Images to be added: noise plots, calibration results
  },
]

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState<"overview" | "deep-dive">("overview")

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className={`group bg-card border rounded-lg overflow-hidden transition-all duration-300 ${
        project.highlight ? "border-primary/30 md:col-span-2" : "border-border"
      } hover:border-primary/50`}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
              project.highlight
                ? "bg-primary text-primary-foreground"
                : "bg-primary/10 text-primary"
            }`}
          >
            <project.icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <p className="text-xs text-primary font-medium uppercase tracking-wider">
                {project.category}
              </p>
              {project.highlight && <Award className="h-3.5 w-3.5 text-primary" />}
            </div>
            <h3 className="font-semibold text-lg text-card-foreground">
              {project.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {project.tools} • {project.period}
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-4 border-b border-border">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3 py-2 text-sm font-medium transition-colors relative ${
              activeTab === "overview"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Overview
            {activeTab === "overview" && (
              <motion.div
                layoutId={`tab-indicator-${project.id}`}
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab("deep-dive")}
            className={`px-3 py-2 text-sm font-medium transition-colors relative flex items-center gap-1.5 ${
              activeTab === "deep-dive"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            Deep Dive
            {activeTab === "deep-dive" && (
              <motion.div
                layoutId={`tab-indicator-${project.id}`}
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              />
            )}
          </button>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div>
                <h4 className="text-sm font-medium text-foreground mb-1">Problem</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {project.overview.problem}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-foreground mb-1">Approach</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {project.overview.approach}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Key Results</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {project.overview.results.map((result) => (
                    <div
                      key={result.label}
                      className="bg-secondary/50 rounded-md p-2 text-center"
                    >
                      <p className="text-sm font-semibold text-foreground">
                        {result.value}
                      </p>
                      <p className="text-xs text-muted-foreground">{result.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="deep-dive"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Collapsible Deep Dive Sections */}
              {[
                { title: "Problem Statement", content: project.deepDive.problemStatement },
                { title: "Design Rationale", content: project.deepDive.designRationale },
                { title: "Tradeoffs", content: project.deepDive.tradeoffs },
                { title: "Verification", content: project.deepDive.verification },
                { title: "Key Results", content: project.deepDive.keyResults },
                { title: "Lessons Learned", content: project.deepDive.lessonsLearned },
                { title: "Future Work", content: project.deepDive.futureWork },
              ].map((section, idx) => (
                <DeepDiveSection
                  key={section.title}
                  title={section.title}
                  content={section.content}
                  defaultOpen={idx === 0}
                />
              ))}

              {/* Image Gallery */}
              <div className="pt-4 border-t border-border">
                <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  Media Gallery
                  <span className="text-xs font-normal text-muted-foreground">
                    (layouts, waveforms, measurements)
                  </span>
                </h4>
                {project.images.length > 0 ? (
                  <ImageGalleryPlaceholder count={3} />
                ) : (
                  <ImageGalleryPlaceholder count={project.highlight ? 4 : 2} />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-4 mt-4 border-t border-border">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  )
}

function DeepDiveSection({
  title,
  content,
  defaultOpen = false,
}: {
  title: string
  content: string
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-secondary/30 hover:bg-secondary/50 transition-colors text-left"
      >
        <span className="text-sm font-medium text-foreground">{title}</span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="px-4 py-3 text-sm text-muted-foreground leading-relaxed">
              {content}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function ProjectsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="projects" className="py-24 md:py-32 px-6 bg-card/50" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-sm tracking-[0.3em] text-primary uppercase mb-4">
            Projects
          </h2>
          <p className="font-serif text-3xl md:text-4xl font-semibold text-balance">
            Technical Case Studies
          </p>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-4 leading-relaxed">
            Deep dives into selected projects showcasing problem formulation,
            design rationale, and verified results.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
