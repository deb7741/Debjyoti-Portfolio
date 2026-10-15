/**
 * Single source of truth for all portfolio content.
 *
 * Every section on the page AND the interactive research terminal read from
 * this file, so adding a paper, job, project or award here updates the whole
 * site at once. Nothing else needs to be edited for routine content updates.
 */

export const profile = {
  name: "Debjyoti Chowbey",
  initials: "DC",
  role: "Research Associate",
  affiliation: "Indian Institute of Science (IISc), Bangalore",
  affiliationShort: "IISc Bangalore",
  headline: "Analog & Mixed-Signal IC Design Researcher",
  focusAreas: ["Low-Power CMOS Design", "Analog Computing", "Physical Security"],
  tagline:
    "Exploring subthreshold circuits, current-mode Ising machines, and electromagnetic side-channel analysis through analog innovation.",
  description:
    "Research Associate at IISc Bangalore specializing in Analog & Mixed-Signal IC Design, Analog Computing, and Hardware Security. Exploring low-power CMOS design, neuromorphic circuits, and side-channel analysis.",
  education: {
    degree: "B.Tech, Electronics & Communication Engineering",
    institution: "Tezpur University",
    detail: "CGPA: 8.06/10.0 • Rank 4 in Department",
  },
} as const

export const contact = {
  email: "chowbeydebjyoti@gmail.com",
  linkedin: "https://linkedin.com/in/debjyotichowbey",
  github: "https://github.com/deb7741",
} as const

/* ------------------------------------------------------------------ */
/* Publications                                                        */
/* ------------------------------------------------------------------ */

export interface Publication {
  /** Short id used by the terminal, e.g. `cat publications/devic-2025.txt` */
  id: string
  title: string
  authors: string[]
  venue: string
  location: string
  year: string
  status: "Published" | "Accepted" | "Under Review" | "In Preparation"
  doi: string | null
  abstract: string
}

export const publications: Publication[] = [
  {
    id: "devic-2025",
    title: "Low-Power CMOS Operational Amplifier Design in 45nm Technology",
    authors: ["D. Chowbey", "R. K. Baruah"],
    venue: "IEEE DevIC 2025",
    location: "Kalyani, India",
    year: "Apr 2025",
    status: "Published",
    doi: "10.1109/DevIC63749.2025.11012572",
    abstract:
      "This paper presents a low-power operational amplifier design in 45nm CMOS technology, targeting short-channel effects and gate leakage. The design achieves 67dB DC gain, 3.7MHz GBW, and sub-10μW power consumption with complete post-layout verification across PVT corners.",
  },
  {
    id: "gcon-2026",
    title:
      "A 45nm Subthreshold CMOS Op-Amp with Adaptive Biasing for Ultra-Low-Power Implantable Applications",
    authors: ["D. Chowbey", "R. K. Baruah"],
    venue: "IEEE GCON 2026",
    location: "IIT Guwahati, India",
    year: "2026",
    status: "Accepted",
    doi: null,
    abstract:
      "This work presents a novel subthreshold CMOS operational amplifier with adaptive biasing technique optimized for ultra-low-power implantable biomedical applications. The design achieves significant power reduction while maintaining adequate performance for sensing applications.",
  },
]

export const publicationsNote =
  "Additional journal submission on TLS 1.3 side-channel analysis (IEEE TSG) currently under preparation."

/* ------------------------------------------------------------------ */
/* Experience                                                          */
/* ------------------------------------------------------------------ */

export interface Experience {
  id: string
  title: string
  organization: string
  lab: string
  supervisor: string | null
  location: string
  period: string
  description: string
  details: string[]
}

export const experiences: Experience[] = [
  {
    id: "iisc",
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
    id: "rri",
    title: "Research Assistant — Digital Backend & FPGA",
    organization: "Raman Research Institute",
    lab: "SARAS Project",
    supervisor: "Dr. Saurabh Singh",
    location: "Bangalore, India",
    period: "Jul 2025 — Jan 2026",
    description: "Developed digital measurement backend for precision radiometer instrumentation.",
    details: [
      "Developed the digital measurement backend for a precision radiometer, encompassing high-speed data-acquisition pipelines and signal-integrity analysis.",
      "Implemented a 16,384-point full-precision spectrometer on Xilinx RFSoC ZCU216 via real-time auto/cross-correlation in Verilog/VHDL — providing hands-on experience in analog-to-digital interface design at RF speeds.",
    ],
  },
  {
    id: "tezpur",
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
    id: "iitkgp",
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

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

export type ProjectIcon = "cpu" | "camera"

export interface ProjectImage {
  id: string
  /** Path under /public, e.g. "/projects/opamp-45nm/layout.png" */
  src: string
  alt: string
  caption?: string
}

export interface Project {
  id: string
  icon: ProjectIcon
  title: string
  category: string
  tools: string
  period: string
  tags: string[]
  highlight: boolean
  overview: {
    problem: string
    approach: string
    results: { label: string; value: string }[]
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
  /** Add images to /public/projects/<id>/ and list them here — the gallery appears automatically. */
  images: ProjectImage[]
}

export const projects: Project[] = [
  {
    id: "opamp-45nm",
    icon: "cpu",
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
    images: [],
  },
  {
    id: "ccd-sensor",
    icon: "camera",
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
    images: [],
  },
]

/* ------------------------------------------------------------------ */
/* Skills                                                              */
/* ------------------------------------------------------------------ */

export const skillCategories: { name: string; skills: string[] }[] = [
  {
    name: "Analog & Mixed-Signal",
    skills: [
      "Op-Amp Design (Two-Stage, Folded-Cascode)",
      "Subthreshold/Adaptive Biasing",
      "Current-Mode Circuits",
      "Flash ADC Design",
      "LDO Concepts",
      "Full-Custom Layout",
    ],
  },
  {
    name: "Analog Computing",
    skills: [
      "Current-Mode Ising Machines",
      "Spin-Threshold Detection",
      "Differential-Amplifier Comparators",
      "Coupled Oscillator Networks",
      "65nm CMOS Design",
    ],
  },
  {
    name: "Physical Security",
    skills: [
      "Power/EM Side-Channel Analysis",
      "Correlation Power Analysis (CPA)",
      "EM Cartography",
      "Embedded AES Evaluation",
      "Analog Signal Acquisition",
    ],
  },
  {
    name: "EDA Tools",
    skills: [
      "Cadence Virtuoso (ADE L/XL)",
      "Layout XL",
      "Spectre Simulator",
      "Quantus Extraction",
      "Xilinx Vivado/ISE",
      "ModelSim",
    ],
  },
  {
    name: "Digital & FPGA",
    skills: [
      "RTL (Verilog/VHDL)",
      "FSM Design",
      "Static Timing Analysis",
      "Clock-Domain Crossing",
      "RFSoC ZCU216",
    ],
  },
  {
    name: "Device Fundamentals",
    skills: [
      "MOS Capacitor Physics",
      "Short-Channel Effects",
      "CMOS Scaling Challenges",
      "Leakage Mechanisms",
    ],
  },
  {
    name: "Programming",
    skills: ["Python", "MATLAB", "C", "Verilog HDL", "VHDL", "Linux", "Git"],
  },
]

export const coursework = [
  "Semiconductor Devices",
  "Analog & Mixed-Signal IC Design",
  "Digital System Design",
  "Digital Signal Processing",
  "VHDL",
]

/* ------------------------------------------------------------------ */
/* Honours                                                             */
/* ------------------------------------------------------------------ */

export type HonourIcon = "trophy" | "medal" | "award" | "star" | "users"

export const honours: {
  icon: HonourIcon
  title: string
  description: string
  year: string
  highlight: string
}[] = [
  {
    icon: "trophy",
    title: "GATE EC — Qualified 2025 & 2026",
    description: "Graduate Aptitude Test in Engineering, Electronics & Communication",
    year: "2025, 2026",
    highlight: "Qualified",
  },
  {
    icon: "medal",
    title: "Rank 4, ECE Department",
    description: "Tezpur University, Class of 2025",
    year: "2025",
    highlight: "Top 5%",
  },
  {
    icon: "award",
    title: "University Best Project Award 2025",
    description: "Low-Power 45nm CMOS Op-Amp — Full-custom design with 2 IEEE publications",
    year: "2025",
    highlight: "Best Project",
  },
  {
    icon: "star",
    title: "2nd Place, IEEE Texplorer Research Fair",
    description: "Oral presentation at IEEE DevIC 2025, Kalyani, India",
    year: "2025",
    highlight: "2nd Place",
  },
  {
    icon: "users",
    title: "Coordinator, Astronomy Club",
    description: "Tezpur University — Organised technical seminars and public outreach programmes",
    year: "2022—2024",
    highlight: "Leadership",
  },
]

/* ------------------------------------------------------------------ */
/* Research philosophy                                                 */
/* ------------------------------------------------------------------ */

export const philosophy = {
  summary:
    "Good analog design requires understanding both the physics and the art of tradeoffs. My approach combines rigorous device-level analysis with practical design intuition, always validated through measurement and silicon verification.",
  principles: [
    { label: "Physics-driven", description: "First-principles device understanding" },
    { label: "Constraint-aware", description: "Working within real-world limits" },
    { label: "Design-focused", description: "Practical implementation priority" },
    { label: "Experimental", description: "Silicon and measurement validation" },
    { label: "Rigorous", description: "Systematic verification methodology" },
  ],
}

/* ------------------------------------------------------------------ */
/* Navigation — the ids here must match each section's `id` attribute  */
/* ------------------------------------------------------------------ */

export const sections = [
  { id: "about", label: "About" },
  { id: "publications", label: "Publications" },
  { id: "experience", label: "Experience" },
  { id: "research-map", label: "Research Map" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "honours", label: "Honours" },
  { id: "contact", label: "Contact" },
] as const

export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return explicit.replace(/\/$/, "")
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL
  if (vercel) return `https://${vercel}`
  return "http://localhost:3000"
}
