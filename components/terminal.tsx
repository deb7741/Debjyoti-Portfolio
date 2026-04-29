"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Terminal as TerminalIcon, X, Minus, Square } from "lucide-react"

interface FileSystemNode {
  type: "dir" | "file"
  content?: string
  children?: Record<string, FileSystemNode>
}

const fileSystem: Record<string, FileSystemNode> = {
  about: {
    type: "dir",
    children: {
      "intro.txt": {
        type: "file",
        content: `DEBJYOTI CHOWBEY
================
Research Associate @ IISc Bangalore

Electronics engineer specializing in analog IC design,
unconventional computing, and hardware security.

Education: B.Tech ECE, Tezpur University
           CGPA: 8.06/10.0 | Rank 4 in Department

Type 'cd ..' to go back, or 'ls' to explore.`,
      },
      "philosophy.txt": {
        type: "file",
        content: `RESEARCH PHILOSOPHY
===================
My approach to research is:

• Physics-driven: Understanding device behavior from first principles
• Constraint-aware: Working within real-world limitations
• Design-focused: Prioritizing practical implementation
• Experimental: Validating through silicon and measurement
• Rigorous: Following systematic verification methodology

"Good analog design requires understanding both the 
 physics and the art of tradeoffs."`,
      },
    },
  },
  publications: {
    type: "dir",
    children: {
      "ieee-devic-2025.txt": {
        type: "file",
        content: `IEEE DevIC 2025 - PUBLISHED
===========================
Title: A 45nm Two-Stage OTA with Adaptive Biasing for 
       Low-Frequency Biomedical Applications

Authors: D. Chowbey, S. S. Dhar, H. Rahaman
Venue: IEEE DevIC 2025 Conference
DOI: 10.1109/DevIC61308.2025.10817524
Status: Published

Abstract: Presents adaptive biasing technique for 
subthreshold operation with improved PVT tolerance.

Type 'open publication-1' to navigate to this paper.`,
      },
      "ieee-gcon-2026.txt": {
        type: "file",
        content: `IEEE GCON 2026 - ACCEPTED
=========================
Title: Area-Efficient Adaptive Biasing with Low-Voltage 
       Subthreshold Startup

Authors: D. Chowbey, S. S. Dhar
Venue: IEEE GCON 2026 Conference
Status: Accepted (presentation pending)

Abstract: Proposes area-efficient startup circuit for
subthreshold analog systems.`,
      },
      "tsg-prep.txt": {
        type: "file",
        content: `TSG JOURNAL - IN PREPARATION
============================
Title: Electromagnetic Emanation Cartography and 
       Side-Channel Profiling of TLS 1.3 Handshakes 
       on Embedded Platforms

Authors: D. Chowbey, et al.
Status: Manuscript in preparation

Focus: EM side-channel analysis of cryptographic
implementations on embedded systems.`,
      },
    },
  },
  experience: {
    type: "dir",
    children: {
      "iisc.txt": {
        type: "file",
        content: `IISc BANGALORE
==============
Role: Research Associate
Period: Feb 2026 — Present
Lab: Circuits and Systems Lab

Focus Areas:
• Current-mode Ising machines for combinatorial optimization
• Spin threshold detection techniques
• Novel stochastic primitives for analog computing
• Low-power neuromorphic circuit design

Advisor: Prof. [Advisor Name]`,
      },
      "rri.txt": {
        type: "file",
        content: `RAMAN RESEARCH INSTITUTE (RRI)
==============================
Role: Research Assistant (RA-II)
Period: Jul 2025 — Jan 2026
Group: Electronics Engineering Group

Contributions:
• Digital back-end design using FPGA/Verilog
• Radiometer instrumentation systems
• Signal acquisition and DSP pipelines
• Telescope receiver control systems

This experience bridged analog signal processing with
digital system implementation for radio astronomy.`,
      },
      "tezpur.txt": {
        type: "file",
        content: `TEZPUR UNIVERSITY
=================
Role: VLSI Lab Project
Period: Aug 2024 — Jun 2025

Project: Low-Power Two-Stage Op-Amp in 45nm CMOS
Result: Best Project Award, Class of 2025

Tools: Cadence Virtuoso, ADE, Quantus
Advisors: Dr. S. S. Dhar, Prof. H. Rahaman`,
      },
      "iitkgp.txt": {
        type: "file",
        content: `IIT KHARAGPUR
=============
Role: Summer Intern
Period: Jun 2024 — Jul 2024
Lab: Secured Embedded Architecture Lab (SEAL)

Focus: Electromagnetic Side-Channel Analysis
• CPA attacks on AES implementations
• EM cartography and leakage characterization
• TLS 1.3 security evaluation

This internship sparked my interest in hardware security.`,
      },
    },
  },
  projects: {
    type: "dir",
    children: {
      "opamp-45nm": {
        type: "dir",
        children: {
          "overview.txt": {
            type: "file",
            content: `45nm TWO-STAGE OP-AMP
=====================
Status: FLAGSHIP PROJECT
Award: Best Project, Class of 2025

A full-custom low-power operational amplifier 
designed in 45nm CMOS technology.

Files in this directory:
• specs.txt    - Performance specifications
• design.txt   - Design methodology
• results.txt  - Measurement results
• lessons.txt  - Key learnings`,
          },
          "specs.txt": {
            type: "file",
            content: `PERFORMANCE SPECIFICATIONS
==========================
Parameter        | Value
-----------------|------------
DC Gain          | 67 dB
GBW              | 3.7 MHz
Power            | <10 μW
Supply           | 1.0V
Technology       | 45nm CMOS
Phase Margin     | >60°
Load Cap         | 1pF`,
          },
          "design.txt": {
            type: "file",
            content: `DESIGN METHODOLOGY
==================
1. Architecture: Two-stage Miller-compensated OTA
2. Biasing: Adaptive subthreshold technique
3. Layout: Full-custom with DRC/LVS clean
4. Extraction: Quantus parasitic extraction
5. Verification: All PVT corners (SS/TT/FF)

Key Innovation:
Adaptive biasing maintains performance across
process corners while minimizing area overhead.`,
          },
          "results.txt": {
            type: "file",
            content: `MEASUREMENT RESULTS
===================
✓ DC Gain: 67 dB (target: >60 dB)
✓ GBW: 3.7 MHz (target: >1 MHz)
✓ Power: 8.3 μW (target: <10 μW)
✓ Phase Margin: 65° (target: >60°)
✓ PVT: <5% variation across corners

Publications: 2 IEEE conference papers
Recognition: University Best Project Award`,
          },
          "lessons.txt": {
            type: "file",
            content: `KEY LEARNINGS
=============
What worked well:
• Systematic corner analysis early in design
• Conservative phase margin budgeting
• Careful layout-aware sizing

What could improve:
• Earlier parasitic extraction iterations
• More aggressive power optimization possible
• Could explore current-reuse architectures

Next steps:
• Tape-out validation (planned)
• Extend to 28nm node
• Add programmable gain stages`,
          },
        },
      },
      "ccd-sensor": {
        type: "dir",
        children: {
          "overview.txt": {
            type: "file",
            content: `CCD SENSOR CHARACTERISATION
===========================
A noise analysis and calibration pipeline for
astronomical CCD imaging sensors.

Period: May 2024 — Jun 2024
Tools: Python, NumPy, Matplotlib

Focus: Understanding device-level noise sources
for analog front-end design intuition.`,
          },
          "results.txt": {
            type: "file",
            content: `ANALYSIS RESULTS
================
Characterized noise sources:
• Dark current mapping
• Thermal noise profiling
• Hot-pixel detection and flagging
• Read noise estimation

Deliverable: Automated Python pipeline for
sensor calibration in low-light conditions.`,
          },
        },
      },
    },
  },
  skills: {
    type: "dir",
    children: {
      "analog.txt": {
        type: "file",
        content: `ANALOG & MIXED-SIGNAL
=====================
• Op-Amp/OTA design
• Bandgap references
• Biasing circuits
• Current mirrors
• Subthreshold design
• PVT-tolerant circuits
• Noise analysis`,
      },
      "tools.txt": {
        type: "file",
        content: `EDA TOOLS
=========
• Cadence Virtuoso (Schematic/Layout)
• Cadence ADE (Simulation)
• Cadence Quantus (Extraction)
• LTspice
• ngspice
• Calibre (DRC/LVS)`,
      },
      "digital.txt": {
        type: "file",
        content: `DIGITAL & FPGA
==============
• Verilog HDL
• FPGA prototyping
• Digital backend flow
• Timing analysis
• RTL synthesis`,
      },
      "programming.txt": {
        type: "file",
        content: `PROGRAMMING
===========
• Python (NumPy, Matplotlib, SciPy)
• MATLAB/Octave
• C for embedded
• SKILL scripting (Cadence)
• TCL`,
      },
    },
  },
  honours: {
    type: "dir",
    children: {
      "list.txt": {
        type: "file",
        content: `HONOURS & AWARDS
================
• GATE EC Qualified (2025, 2026)
• Rank 4, ECE Department, Tezpur University
• Best Project Award, Class of 2025
• 2nd Place, IEEE Texplorer Competition
• Astronomy Club Coordinator (2022-23)`,
      },
    },
  },
  contact: {
    type: "dir",
    children: {
      "info.txt": {
        type: "file",
        content: `CONTACT INFORMATION
===================
Email:    chowbeydebjyoti@gmail.com
LinkedIn: linkedin.com/in/debjyotichowbey
GitHub:   github.com/deb7741

Currently based at IISc Bangalore.
Open to research collaborations and discussions.`,
      },
    },
  },
}

const WELCOME_MESSAGE = `
┌─────────────────────────────────────────────────────┐
│  DEBJYOTI CHOWBEY // Research Terminal v1.0         │
│  Analog IC Design • Computing • Security            │
└─────────────────────────────────────────────────────┘

Type 'help' to see available commands.
Type 'ls' to explore the filesystem.
`

const HELP_TEXT = `
AVAILABLE COMMANDS
==================
  help              Show this help message
  ls [dir]          List directory contents
  cd <dir>          Change directory (use '..' to go up)
  cat <file>        Display file contents
  tree              Show directory structure
  open <section>    Navigate to website section
  clear             Clear terminal
  whoami            Display user info
  pwd               Print working directory

EXAMPLES
--------
  ls                    List current directory
  cd projects           Enter projects directory
  cat results.txt       Read a file
  open publications     Jump to publications section
  tree                  View full structure

TIPS
----
  • Use Tab for command hints
  • Files end in .txt, directories don't
  • Type 'cd ..' to go back
`

interface TerminalLine {
  type: "input" | "output" | "error"
  content: string
}

export function ResearchTerminal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "output", content: WELCOME_MESSAGE },
  ])
  const [currentInput, setCurrentInput] = useState("")
  const [currentPath, setCurrentPath] = useState<string[]>([])
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  const getCurrentDir = useCallback((): FileSystemNode => {
    let current: FileSystemNode = { type: "dir", children: fileSystem }
    for (const segment of currentPath) {
      if (current.children && current.children[segment]) {
        current = current.children[segment]
      }
    }
    return current
  }, [currentPath])

  const scrollToBottom = () => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [lines])

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen, isMinimized])

  const addOutput = (content: string, type: "output" | "error" = "output") => {
    setLines((prev) => [...prev, { type, content }])
  }

  const processCommand = (input: string) => {
    const trimmed = input.trim()
    if (!trimmed) return

    setLines((prev) => [
      ...prev,
      { type: "input", content: `~/${currentPath.join("/")}$ ${trimmed}` },
    ])
    setCommandHistory((prev) => [...prev, trimmed])
    setHistoryIndex(-1)

    const [cmd, ...args] = trimmed.split(" ")
    const arg = args.join(" ")

    switch (cmd.toLowerCase()) {
      case "help":
        addOutput(HELP_TEXT)
        break

      case "clear":
        setLines([])
        break

      case "pwd":
        addOutput(`/${currentPath.join("/")}`)
        break

      case "whoami":
        addOutput("guest@debjyoti-research")
        break

      case "ls": {
        const dir = arg ? navigateToPath(arg) : getCurrentDir()
        if (!dir || dir.type !== "dir" || !dir.children) {
          addOutput(`ls: cannot access '${arg}': No such directory`, "error")
        } else {
          const items = Object.entries(dir.children)
            .map(([name, node]) => (node.type === "dir" ? `${name}/` : name))
            .sort()
          addOutput(items.length > 0 ? items.join("  ") : "(empty directory)")
        }
        break
      }

      case "cd": {
        if (!arg || arg === "~") {
          setCurrentPath([])
        } else if (arg === "..") {
          setCurrentPath((prev) => prev.slice(0, -1))
        } else if (arg === "/") {
          setCurrentPath([])
        } else {
          const targetPath = arg.startsWith("/")
            ? arg.slice(1).split("/").filter(Boolean)
            : [...currentPath, ...arg.split("/").filter(Boolean)]

          const resolved: string[] = []
          for (const segment of targetPath) {
            if (segment === "..") {
              resolved.pop()
            } else if (segment !== ".") {
              resolved.push(segment)
            }
          }

          const target = navigateToPath(resolved.join("/"))
          if (!target || target.type !== "dir") {
            addOutput(`cd: no such directory: ${arg}`, "error")
          } else {
            setCurrentPath(resolved)
          }
        }
        break
      }

      case "cat": {
        if (!arg) {
          addOutput("cat: missing file operand", "error")
        } else {
          const target = navigateToPath(arg)
          if (!target) {
            addOutput(`cat: ${arg}: No such file`, "error")
          } else if (target.type === "dir") {
            addOutput(`cat: ${arg}: Is a directory`, "error")
          } else {
            addOutput(target.content || "(empty file)")
          }
        }
        break
      }

      case "tree": {
        const renderTree = (
          node: FileSystemNode,
          prefix = "",
          isLast = true
        ): string => {
          let result = ""
          if (node.children) {
            const entries = Object.entries(node.children)
            entries.forEach(([name, child], index) => {
              const isLastItem = index === entries.length - 1
              const connector = isLastItem ? "└── " : "├── "
              const display = child.type === "dir" ? `${name}/` : name
              result += `${prefix}${connector}${display}\n`
              if (child.type === "dir" && child.children) {
                const newPrefix = prefix + (isLastItem ? "    " : "│   ")
                result += renderTree(child, newPrefix, isLastItem)
              }
            })
          }
          return result
        }
        const currentDir = getCurrentDir()
        addOutput(`.\n${renderTree(currentDir)}`)
        break
      }

      case "open": {
        const sectionMap: Record<string, string> = {
          about: "#about",
          publications: "#publications",
          "publication-1": "#publications",
          "publication-2": "#publications",
          experience: "#experience",
          projects: "#projects",
          skills: "#skills",
          honours: "#honours",
          honors: "#honours",
          contact: "#contact",
        }
        const target = sectionMap[arg.toLowerCase()]
        if (target) {
          addOutput(`Opening ${arg}...`)
          setTimeout(() => {
            document.querySelector(target)?.scrollIntoView({ behavior: "smooth" })
          }, 300)
        } else {
          addOutput(`open: unknown section '${arg}'`, "error")
          addOutput("Available: about, publications, experience, projects, skills, honours, contact")
        }
        break
      }

      case "neofetch":
        addOutput(`
        ⠀⠀⠀⠀⣠⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣦⣄⠀⠀⠀⠀    debjyoti@research
        ⠀⠀⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣄⠀⠀    ------------------
        ⠀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⠀    OS: Research Terminal v1.0
        ⣸⣿⣿⣿⣿⡿⠿⠿⠿⠿⠿⠿⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣇    Host: IISc Bangalore
        ⣿⣿⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿    Kernel: Analog IC Design
        ⣿⣿⡟⠀⠀⣴⣶⣶⣦⠀⠀⠀⠀⠀⠀⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿    Shell: zsh 5.9
        ⣿⣿⡇⠀⠀⣿⣿⣿⣿⠀⠀⣶⣶⡄⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿    Focus: Low-Power CMOS
        ⣿⣿⣷⡀⠀⠻⠿⠿⠟⠀⠀⣿⣿⡇⠀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿    Theme: Semiconductor Dark
        ⠹⣿⣿⣿⣦⣀⠀⠀⠀⢀⣼⣿⣿⣷⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠏    Papers: 2 IEEE Published
        ⠀⠙⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⠀    Coffee: ███████████ 99%
        ⠀⠀⠀⠙⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠋⠀⠀⠀
`)
        break

      case "sudo":
        addOutput("Nice try. This terminal runs on coffee, not privileges.")
        break

      case "rm":
        addOutput("rm: permission denied (and that's probably for the best)")
        break

      case "vim":
      case "nano":
      case "emacs":
        addOutput(`${cmd}: editor wars are above my pay grade`)
        break

      case "exit":
      case "quit":
        setIsOpen(false)
        break

      default:
        addOutput(`command not found: ${cmd}`, "error")
        addOutput("Type 'help' for available commands.")
    }
  }

  const navigateToPath = (pathStr: string): FileSystemNode | null => {
    const segments = pathStr.startsWith("/")
      ? pathStr.slice(1).split("/").filter(Boolean)
      : [...currentPath, ...pathStr.split("/").filter(Boolean)]

    const resolved: string[] = []
    for (const segment of segments) {
      if (segment === "..") {
        resolved.pop()
      } else if (segment !== ".") {
        resolved.push(segment)
      }
    }

    let current: FileSystemNode = { type: "dir", children: fileSystem }
    for (const segment of resolved) {
      if (!current.children || !current.children[segment]) {
        return null
      }
      current = current.children[segment]
    }
    return current
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      processCommand(currentInput)
      setCurrentInput("")
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex =
          historyIndex === -1
            ? commandHistory.length - 1
            : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setCurrentInput(commandHistory[newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1)
          setCurrentInput("")
        } else {
          setHistoryIndex(newIndex)
          setCurrentInput(commandHistory[newIndex])
        }
      }
    } else if (e.key === "Tab") {
      e.preventDefault()
      // Simple tab completion for directories
      const dir = getCurrentDir()
      if (dir.children) {
        const matches = Object.keys(dir.children).filter((name) =>
          name.toLowerCase().startsWith(currentInput.split(" ").pop()?.toLowerCase() || "")
        )
        if (matches.length === 1) {
          const parts = currentInput.split(" ")
          parts[parts.length - 1] = matches[0]
          setCurrentInput(parts.join(" "))
        }
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault()
      setLines([])
    }
  }

  return (
    <>
      {/* Terminal Toggle Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.3 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 p-3 bg-card border border-border rounded-lg shadow-lg hover:border-primary/50 hover:bg-card/80 transition-all ${isOpen ? "opacity-0 pointer-events-none" : ""}`}
        aria-label="Open terminal"
      >
        <TerminalIcon className="h-5 w-5 text-primary" />
      </motion.button>

      {/* Terminal Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{
              opacity: isMinimized ? 0 : 1,
              y: isMinimized ? 100 : 0,
              scale: isMinimized ? 0.9 : 1,
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[min(600px,calc(100vw-3rem))] bg-[#0d0d14] border border-border rounded-lg shadow-2xl overflow-hidden"
          >
            {/* Title Bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#16161e] border-b border-border">
              <div className="flex items-center gap-2">
                <TerminalIcon className="h-4 w-4 text-primary" />
                <span className="text-sm font-mono text-muted-foreground">
                  research@debjyoti: ~/{currentPath.join("/")}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-1.5 hover:bg-secondary rounded transition-colors"
                  aria-label="Minimize"
                >
                  <Minus className="h-3 w-3 text-muted-foreground" />
                </button>
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 hover:bg-secondary rounded transition-colors"
                  aria-label="Maximize"
                >
                  <Square className="h-3 w-3 text-muted-foreground" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-destructive/20 rounded transition-colors"
                  aria-label="Close"
                >
                  <X className="h-3 w-3 text-muted-foreground" />
                </button>
              </div>
            </div>

            {/* Terminal Content */}
            <div
              ref={terminalRef}
              onClick={() => inputRef.current?.focus()}
              className="h-80 overflow-y-auto p-4 font-mono text-sm cursor-text"
            >
              {lines.map((line, index) => (
                <div
                  key={index}
                  className={`whitespace-pre-wrap mb-1 ${
                    line.type === "input"
                      ? "text-primary"
                      : line.type === "error"
                        ? "text-red-400"
                        : "text-foreground/80"
                  }`}
                >
                  {line.content}
                </div>
              ))}

              {/* Input Line */}
              <div className="flex items-center gap-2">
                <span className="text-primary shrink-0">
                  ~/{currentPath.join("/")}$
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent outline-none text-foreground caret-primary"
                  autoComplete="off"
                  spellCheck={false}
                />
                <span className="w-2 h-4 bg-primary animate-pulse" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimized Tab */}
      <AnimatePresence>
        {isOpen && isMinimized && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={() => setIsMinimized(false)}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg shadow-lg hover:border-primary/50 transition-all"
          >
            <TerminalIcon className="h-4 w-4 text-primary" />
            <span className="text-sm font-mono text-muted-foreground">Terminal</span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}
