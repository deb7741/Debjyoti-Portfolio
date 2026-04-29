"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { ChevronDown, MapPin } from "lucide-react"

const experiences = [
  {
    title: "Research Associate",
    organization: "Indian Institute of Science (IISc), Bangalore",
    lab: "Circuits & Security Research Lab (CSRL), DESE",
    supervisor: "Dr. Debayan Das",
    location: "Bangalore, India",
    period: "Feb 2026 — Present",
    description:
      "Leading research on analog Ising machines and physical security analysis at the Circuits & Security Research Lab.",
    details: [
      "Analog Ising Machine (65nm CMOS): Designing current-mode Ising circuit primitives for combinatorial optimization — including stacked-inverter current couplers (±7 signed coupling weights, 15 levels via binary-weighted enable slices) and a Spin Threshold Detector (STD) built around a diode-connected PMOS bias network, open-loop differential amplifier, and source-follower DC-shift stage.",
      "Physical Security / SCA: Architected a Side-Channel Analysis framework for TLS 1.3 (AES-128-GCM) on an ARM Cortex-M33 running a live RTOS/wolfSSL stack; executed Last-Round CPA and EM attacks over 20,000 traces to recover the session key.",
      "Performed localised EM cartography exposing a 32-bit microarchitectural leakage site — work contributing directly to a first-author journal submission (IEEE TSG, under preparation).",
    ],
  },
  {
    title: "Research Assistant — Digital Backend & FPGA",
    organization: "Raman Research Institute",
    lab: "SARAS Project",
    supervisor: "Dr. Saurabh Singh",
    location: "Bangalore, India",
    period: "Jul 2025 — Jan 2026",
    description:
      "Developed digital measurement backend for precision radiometer instrumentation.",
    details: [
      "Developed the digital measurement backend for a precision radiometer, encompassing high-speed data-acquisition pipelines and signal-integrity analysis.",
      "Implemented a 16,384-point full-precision spectrometer on Xilinx RFSoC ZCU216 via real-time auto/cross-correlation in Verilog/VHDL — providing hands-on experience in analog-to-digital interface design at RF speeds.",
    ],
  },
  {
    title: "Undergraduate Research Assistant",
    organization: "VLSI Lab, Tezpur University",
    lab: "Focus: CMOS Analog & Mixed-Signal Design",
    supervisor: null,
    location: "Assam, India",
    period: "Aug 2024 — Jun 2025",
    description:
      "Conducted research on CMOS analog circuit design with focus on operational amplifiers and data converters.",
    details: [
      "Designed and simulated Op-Amp topologies (two-stage, folded-cascode) in Cadence Virtuoso (ADE L/XL); contributed to circuit-level design of a 3-bit Flash ADC in 180nm CMOS, analysing comparator offset, power, and linearity trade-offs.",
      "Teaching Assistant, CMOS Analog Design Lab — mentored 10+ M.Tech students through schematic entry, layout, and DRC/LVS verification.",
    ],
  },
  {
    title: "Summer Research Intern",
    organization: "IEEE AP-MTTS SBC — IIT Kharagpur",
    lab: "Focus: DSP, Adaptive Filtering, MATLAB",
    supervisor: null,
    location: "Kharagpur, India",
    period: "Jun 2024 — Jul 2024",
    description:
      "Conducted research on adaptive signal processing algorithms for beamforming applications.",
    details: [
      "Implemented MVDR beamforming in MATLAB for undersampled signal reconstruction; achieved a 20% improvement in low-SNR detection accuracy over the baseline.",
      "This work motivated interest in the analog front-end constraints that limit DSP performance.",
    ],
  },
]

function ExperienceCard({
  experience,
  index,
}: {
  experience: (typeof experiences)[0]
  index: number
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="relative pl-8 pb-12 last:pb-0"
    >
      {/* Timeline line */}
      <div className="absolute left-0 top-2 bottom-0 w-px bg-border" />
      
      {/* Timeline dot */}
      <div className="absolute left-0 top-2 w-2 h-2 -translate-x-1/2 rounded-full bg-primary" />

      <div className="space-y-2">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="font-semibold text-lg text-foreground">
            {experience.title}
          </h3>
          <span className="text-sm text-muted-foreground">
            {experience.period}
          </span>
        </div>

        <p className="font-medium text-primary">{experience.organization}</p>
        
        <p className="text-sm text-muted-foreground">
          {experience.lab}
          {experience.supervisor && (
            <span> • Supervisor: {experience.supervisor}</span>
          )}
        </p>
        
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3 w-3" />
          {experience.location}
        </div>

        <p className="text-muted-foreground leading-relaxed pt-2">
          {experience.description}
        </p>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors mt-2"
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          />
          {isExpanded ? "Hide" : "Show"} Details
        </button>

        {isExpanded && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-3 space-y-3"
          >
            {experience.details.map((detail, i) => (
              <li
                key={i}
                className="text-sm text-muted-foreground pl-4 border-l-2 border-border leading-relaxed"
              >
                {detail}
              </li>
            ))}
          </motion.ul>
        )}
      </div>
    </motion.div>
  )
}

export function ExperienceSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="experience" className="py-24 md:py-32 px-6" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-sm tracking-[0.3em] text-primary uppercase mb-4">
            Experience
          </h2>
          <p className="font-serif text-3xl md:text-4xl font-semibold text-balance">
            Research Journey
          </p>
        </motion.div>

        <div className="relative">
          {experiences.map((experience, index) => (
            <ExperienceCard
              key={experience.organization}
              experience={experience}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
