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
  focusAreas: ["Mixed-Signal IC Design", "Analog & Neuromorphic Computing", "Low-Power Sensing"],
  tagline:
    "Building the mixed-signal circuits that let sensing and computation happen in the analog domain — at the edge, at ultra-low power.",
  description:
    "Research Associate at IISc Bangalore designing analog and mixed-signal integrated circuits — from subthreshold op-amps, VGAs and SAR ADCs to current-mode Ising machines and silicon neurons — in 45–180 nm CMOS.",
  /** Portrait in /public; set to null to hide. */
  photo: "/headshot.webp",
  /** Shown on the hero badge; set to null to hide. */
  status: "Seeking PhD positions — analog/mixed-signal & non-von-Neumann computing",
  education: {
    degree: "B.Tech, Electronics & Communication Engineering",
    institution: "Tezpur University",
    detail: "Graduated June 2025 • CGPA 8.06/10.0 • Rank 4 in Department (Top 5%)",
  },
} as const

export const contact = {
  email: "chowbeydebjyoti@gmail.com",
  linkedin: "https://linkedin.com/in/debjyotichowbey",
  github: "https://github.com/deb7741",
} as const

/* ------------------------------------------------------------------ */
/* About / research interests                                          */
/* ------------------------------------------------------------------ */

export const researchStatement =
  "I design analog and mixed-signal integrated circuits — from transistor-level primitives to silicon-ready receive chains — and bring that circuit-design skill to emerging, non-von-Neumann computing architectures. In 45–180 nm CMOS I have worked on both conventional signal paths (subthreshold op-amps, a variable-gain amplifier, a 10-bit SAR ADC) and analog compute circuits (a current-mode Ising annealer and LIF neurons & synapses)."

export type DomainIcon = "cpu" | "zap" | "shield"

export const researchDomains: {
  icon: DomainIcon
  title: string
  description: string
  tags: string[]
}[] = [
  {
    icon: "cpu",
    title: "Analog & Mixed-Signal Front-Ends",
    description:
      "Transistor-level design of low-power signal paths — subthreshold op-amps, variable-gain amplifiers and SAR ADCs — up to complete receive chains for ultrasound imaging and implantable devices.",
    tags: ["Subthreshold Op-Amps", "VGA", "10-bit SAR ADC", "45–180 nm CMOS"],
  },
  {
    icon: "zap",
    title: "Analog & Neuromorphic Computing",
    description:
      "Current-mode Ising machines that map NP-hard problems (3-SAT, Max-Cut, prime factorization) onto circuit physics, and subthreshold silicon neurons and synapses for device-aware spiking neural networks.",
    tags: ["Ising Machines", "LIF Neurons", "Current-Mode", "Device-Aware SNNs"],
  },
  {
    icon: "shield",
    title: "Hardware Security",
    description:
      "Power and electromagnetic side-channel analysis of embedded cryptography, including session-key recovery from a live TLS 1.3 stack on an ARM Cortex-M33.",
    tags: ["EM Side-Channel", "CPA", "TLS 1.3", "AES-128-GCM"],
  },
]

/* ------------------------------------------------------------------ */
/* Publications                                                        */
/* ------------------------------------------------------------------ */

export type PublicationStatus = "Published" | "Accepted" | "Under Review" | "Submitted" | "In Preparation"

export interface Publication {
  /** Short id used by the terminal, e.g. `cat publications/devic-2025.txt` */
  id: string
  title: string
  authors: string
  venue: string
  location?: string
  year: string
  status: PublicationStatus
  doi?: string
  /** Optional manuscript / submission id shown next to the venue */
  note?: string
  abstract?: string
}

export const publications: Publication[] = [
  {
    id: "gcon-2026",
    title:
      "A 45 nm Subthreshold CMOS Op-Amp with Adaptive Biasing for Ultra-Low Power Implantable Applications",
    authors: "D. Chowbey et al.",
    venue: "IEEE GCON 2026",
    location: "IIT Guwahati, India",
    year: "2026",
    status: "Published",
    doi: "10.1109/GCON69192.2026.11648889",
    abstract:
      "A subthreshold CMOS operational amplifier with an adaptive biasing technique, optimised for ultra-low-power implantable biomedical applications — reducing power while keeping adequate performance for sensing.",
  },
  {
    id: "devic-2025",
    title: "Low-Power CMOS Operational Amplifier Design in 45 nm Technology",
    authors: "D. Chowbey, R. K. Baruah",
    venue: "IEEE DevIC 2025",
    location: "Kalyani, India",
    year: "2025",
    status: "Published",
    doi: "10.1109/DevIC63749.2025.11012572",
    abstract:
      "A low-power operational amplifier in 45 nm CMOS targeting short-channel effects and gate leakage. The design achieves 67 dB DC gain, 3.7 MHz GBW and sub-10 µW power, with complete post-layout verification across PVT corners.",
  },
  {
    id: "tsg-2026",
    title:
      "Trusted to Leak Secrets: Power and EM Side-Channel Key Recovery from TLS 1.3 on a Smart-Grid IED Representative Device",
    authors: "D. Chowbey et al.",
    venue: "IEEE Transactions on Smart Grid",
    year: "2026",
    status: "Under Review",
    note: "TSG-02423-2026",
  },
  {
    id: "impede-asianhost-2026",
    title: "IMPEDE: Ising-based Prime Factorization Circuit Using Current Coupling and Spin-Threshold Detection",
    authors: "Samarth ST, D. Chowbey et al.",
    venue: "IEEE AsianHOST 2026",
    year: "2026",
    status: "Submitted",
  },
  {
    id: "ultrasound-date-2027",
    title: "Energy-Efficient Ultrasound Receiver with Analog Envelope-Based Feature Extraction",
    authors: "S. Suvankar, D. Chowbey et al.",
    venue: "DATE 2027",
    year: "2027",
    status: "Submitted",
  },
]

/** Papers counted as peer-reviewed (shown first, used in stats). */
export const isPeerReviewed = (p: Publication) => p.status === "Published" || p.status === "Accepted"

/* ------------------------------------------------------------------ */
/* Experience                                                          */
/* ------------------------------------------------------------------ */

export interface Experience {
  id: string
  title: string
  organization: string
  lab: string
  supervisor: string | null
  /** Label shown before the supervisor's name */
  supervisorLabel?: string
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
      "Designing an ultrasound analog front-end and current-mode analog compute circuits, with side-channel security as a secondary thread.",
    details: [
      "Ultrasound Analog Front-End — Receive Signal Chain (180 nm CMOS): designing the analog receiver chain, a Variable-Gain Amplifier (VGA) and a 10-bit SAR ADC, for a low-power ultrasound imaging front-end.",
      "Analog Ising Machine (65 nm CMOS): designed current-mode CMOS primitives that map NP-hard combinatorial problems (3-SAT, Max-Cut, prime factorization) — including stacked-inverter current couplers with signed coupling weights and a Spin-Threshold Detector.",
      "Side-Channel Analysis (secondary): architected a power/EM side-channel framework targeting TLS 1.3 (AES-128-GCM) on an ARM Cortex-M33 running a live RTOS/wolfSSL stack; first-author paper under review at IEEE Transactions on Smart Grid.",
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
    description:
      "Built the digital spectrometer backend for SARAS, a radiometer searching for the faint 21-cm signal of neutral hydrogen from the early universe.",
    details: [
      "Implemented a 16K-point full-precision spectrometer on a Xilinx RFSoC ZCU216 using a parallel FFT architecture in Verilog, to recover the faint spectral signature of neutral hydrogen from the early universe.",
      "Hands-on exposure to the RF data-acquisition chain feeding the data converters.",
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
      "B.Tech thesis research on low-power CMOS op-amps — awarded Best B.Tech Thesis and the basis for two first-author IEEE papers.",
    details: [
      "Designed and simulated op-amp topologies (two-stage, folded-cascode) in Cadence Virtuoso (ADE L/XL) through full-custom layout and post-layout verification.",
      "Teaching Assistant, CMOS Analog Design Lab — mentored 10+ M.Tech students through schematic entry, layout and DRC/LVS verification.",
    ],
  },
  {
    id: "iitkgp",
    title: "Summer Research Intern",
    organization: "IEEE AP-MTTS SBC — IIT Kharagpur",
    lab: "Focus: DSP, Adaptive Filtering, MATLAB",
    supervisor: "Mr. G. Behera",
    supervisorLabel: "Project Guide",
    location: "Kharagpur, India",
    period: "Jun 2024 — Jul 2024",
    description: "Adaptive signal processing for beamforming.",
    details: [
      "Implemented MVDR beamforming in MATLAB for undersampled signal reconstruction; achieved a 20% improvement in low-SNR detection accuracy over the baseline.",
      "This work motivated a focus on the analog front-end constraints that ultimately bound DSP performance.",
    ],
  },
]

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */

export type ProjectIcon = "cpu" | "camera" | "brain"

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
  /** Highlighted projects span the full width */
  highlight: boolean
  /** Shows an award ribbon next to the category */
  award?: boolean
  overview: {
    problem: string
    approach: string
    results: { label: string; value: string }[]
  }
  /** Optional "Deep Dive" tab — any number of titled sections */
  deepDive?: { title: string; content: string }[]
  /** Add images to /public/projects/<id>/ and list them here — the gallery appears automatically. */
  images: ProjectImage[]
}

export const projects: Project[] = [
  {
    id: "device-aware-snn",
    icon: "brain",
    title: "Device-Aware Spiking Neural Networks",
    category: "Current Research Project",
    tools: "Cadence Virtuoso / Python (snntorch)",
    period: "Aug 2026 — Present",
    tags: ["180 nm CMOS", "LIF Neuron", "Monte-Carlo", "snntorch", "Hardware-Aware Training"],
    highlight: true,
    overview: {
      problem:
        "Analog silicon neurons and synapses are energy-efficient but imprecise: device mismatch and limited weight resolution degrade the accuracy of spiking neural networks mapped onto them.",
      approach:
        "Characterised a subthreshold neuron and current-mode synapse in 180 nm CMOS with Monte-Carlo simulation, injected the measured non-idealities into a 2-layer SNN on full MNIST, then recovered accuracy with hardware-aware retraining.",
      results: [
        { label: "Energy", value: "2.17 pJ/spike" },
        { label: "Ideal → silicon", value: "97.5% → 87.8%" },
        { label: "Recovered", value: "9.36 / 9.70 pts" },
        { label: "Final accuracy", value: "97.17%" },
      ],
    },
    deepDive: [
      {
        title: "Circuit Characterisation",
        content:
          "Monte-Carlo simulation of a subthreshold neuron and a current-mode synapse in 180 nm CMOS: 2.17 pJ/spike, 8.5% neuron mismatch, 23.3% synapse mismatch and ~3.5-bit effective weight resolution.",
      },
      {
        title: "Non-Ideality Injection",
        content:
          "The measured mismatch and precision limits were injected into a 2-layer spiking neural network trained on full MNIST. Sweeps across mismatch, bit-precision and timesteps showed a 9.70-point ideal-to-silicon accuracy drop (97.51% → 87.81%).",
      },
      {
        title: "Hardware-Aware Retraining",
        content:
          "Retraining with the device model in the loop recovered 9.36 of the 9.70 lost points — 97.17% ± 0.30% final accuracy, validated across 5 held-out mismatch realisations.",
      },
      {
        title: "Why It Matters",
        content:
          "A compact device model like this lets algorithm and hardware be co-designed for SNN and compute-in-memory accelerators, instead of discovering silicon losses after tape-out.",
      },
    ],
    images: [],
  },
  {
    id: "opamp-45nm",
    icon: "cpu",
    title: "Low-Power Two-Stage Op-Amp in 45 nm CMOS",
    category: "Best B.Tech Thesis, Class of 2025",
    tools: "Cadence Virtuoso / ADE L/XL / Quantus",
    period: "Sep 2024 — May 2025",
    tags: ["45 nm CMOS", "Full-Custom Layout", "Post-Layout Verification", "PVT Corners"],
    highlight: false,
    award: true,
    overview: {
      problem:
        "Op-amps in advanced nodes suffer from short-channel effects and gate leakage, making high gain and low power hard to achieve together at 45 nm.",
      approach:
        "Full-custom design addressing short-channel effects and gate leakage, with complete post-layout verification via parasitic extraction (Quantus) across all PVT corners.",
      results: [
        { label: "DC Gain", value: "67 dB" },
        { label: "GBW", value: "3.7 MHz" },
        { label: "Power", value: "<10 μW" },
        { label: "Papers", value: "2 IEEE" },
      ],
    },
    deepDive: [
      {
        title: "Design Rationale",
        content:
          "A two-stage Miller-compensated architecture was chosen for high gain with stable compensation. Adaptive biasing keeps transconductance near-constant across PVT variation without the area cost of trimming.",
      },
      {
        title: "Verification",
        content:
          "Post-layout verification with Quantus parasitic extraction, validated across all PVT corners, with DRC/LVS-clean sign-off.",
      },
      {
        title: "Outcome",
        content:
          "Best B.Tech Thesis, Dept. of ECE, Tezpur University (2025), and the basis for two first-author IEEE publications (DevIC 2025, GCON 2026).",
      },
    ],
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
        "Low-light imaging needs every noise source in the sensor understood and calibrated out before faint signals can be recovered.",
      approach:
        "Characterised dark current, thermal noise and hot-pixel distributions, and built an automated Python calibration pipeline that improves low-light signal fidelity — device-level intuition for the noise sources that set the floor on any analog front-end.",
      results: [
        { label: "Analysis", value: "Dark Current" },
        { label: "Noise", value: "Thermal" },
        { label: "Detection", value: "Hot Pixels" },
        { label: "Output", value: "Auto Pipeline" },
      ],
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
      "Two-Stage / Subthreshold Op-Amps (45 nm)",
      "Variable-Gain Amplifier (180 nm)",
      "10-bit SAR ADC (180 nm)",
      "Current-Mode Circuits",
      "Full-Custom Layout",
      "PVT-Corner & Post-Layout Verification",
    ],
  },
  {
    name: "Emerging / Neuromorphic",
    skills: [
      "Current-Mode Ising Machines",
      "Spin-Threshold Detection",
      "Subthreshold I&F Silicon Neurons",
      "Translinear Circuits",
      "Winner-Take-All Networks",
      "Device-Aware SNN Modeling (snntorch)",
      "Analog Non-Ideality Injection",
      "Monte-Carlo Mismatch Characterisation",
    ],
  },
  {
    name: "EDA Tools",
    skills: ["Cadence Virtuoso (ADE L/XL)", "Layout XL", "Innovus", "Quantus Extraction", "Vivado / ISE"],
  },
  {
    name: "Digital & FPGA",
    skills: ["Verilog RTL & Synthesis", "FSM Design", "Static Timing Analysis", "Clock-Domain Crossing", "RFSoC ZCU216"],
  },
  {
    name: "Device Fundamentals",
    skills: ["MOS Capacitor Physics", "Short-Channel Effects", "Noise Sources", "CMOS Scaling Challenges"],
  },
  {
    name: "Hardware Security",
    skills: ["EM / Power Side-Channel Analysis", "Embedded AES-128", "TLS 1.3"],
  },
  {
    name: "Programming",
    skills: ["Python", "MATLAB", "C", "Verilog HDL", "VHDL", "Linux", "Git"],
  },
]

export const coursework = [
  "Device Physics",
  "Mixed-Signal Circuit Design",
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
    icon: "award",
    title: "Best B.Tech Thesis",
    description: "Best Bachelor's thesis, Dept. of ECE, Tezpur University — low-power 45 nm CMOS op-amp",
    year: "2025",
    highlight: "Best Thesis",
  },
  {
    icon: "trophy",
    title: "GATE EC — Qualified 2025 & 2026",
    description: "Graduate Aptitude Test in Engineering, Electronics & Communication — 96th+ percentile both years",
    year: "2025, 2026",
    highlight: "96th+ percentile",
  },
  {
    icon: "medal",
    title: "Rank 4, ECE Department",
    description: "Tezpur University, Class of 2025 — CGPA 8.06/10",
    year: "2025",
    highlight: "Top 5%",
  },
  {
    icon: "star",
    title: "2nd Place, IEEE Texplorer Research Fair",
    description: "Oral research presentation, Tezpur University",
    year: "2025",
    highlight: "2nd Place",
  },
  {
    icon: "users",
    title: "Coordinator, Astronomy Club",
    description: "Tezpur University — technical seminars and public outreach",
    year: "2022—2024",
    highlight: "Leadership",
  },
]

/* ------------------------------------------------------------------ */
/* Research philosophy                                                 */
/* ------------------------------------------------------------------ */

export const philosophy = {
  summary:
    "Good analog design requires understanding both the physics and the art of tradeoffs. My approach combines rigorous device-level analysis with practical design intuition, always validated through post-layout verification, Monte-Carlo and measurement.",
  principles: [
    { label: "Physics-driven", description: "First-principles device understanding" },
    { label: "Constraint-aware", description: "Working within real-world limits" },
    { label: "Design-focused", description: "Practical implementation priority" },
    { label: "Co-designed", description: "Circuits and algorithms together" },
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
  return "https://debjyotiportfolio.vercel.app"
}
