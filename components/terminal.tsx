"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Terminal as TerminalIcon, X, Minus } from "lucide-react"
import {
  contact,
  experiences,
  honours,
  philosophy,
  profile,
  projects,
  publications,
  researchStatement,
  sections,
  skillCategories,
} from "@/lib/content"

interface FileSystemNode {
  type: "dir" | "file"
  content?: string
  children?: Record<string, FileSystemNode>
}

const file = (content: string): FileSystemNode => ({ type: "file", content })
const dir = (children: Record<string, FileSystemNode>): FileSystemNode => ({ type: "dir", children })
const heading = (text: string) => `${text.toUpperCase()}\n${"=".repeat(text.length)}`
const bullets = (items: readonly string[]) => items.map((i) => `• ${i}`).join("\n")
const slug = (text: string) =>
  text.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")

/**
 * The terminal's virtual filesystem is generated from lib/content.ts, so it
 * always matches what the page shows. Add content there, not here.
 */
const fileSystem: Record<string, FileSystemNode> = {
  about: dir({
    "intro.txt": file(
      `${heading(profile.name)}
${profile.role} @ ${profile.affiliationShort}

${profile.headline}.
Focus: ${profile.focusAreas.join(" • ")}

${researchStatement}

Education: ${profile.education.degree}
           ${profile.education.institution} — ${profile.education.detail}

Type 'cd ..' to go back, or 'ls' to explore.`,
    ),
    "philosophy.txt": file(
      `${heading("Research Philosophy")}
${bullets(philosophy.principles.map((p) => `${p.label}: ${p.description}`))}

"${philosophy.summary}"`,
    ),
  }),
  publications: dir(
    Object.fromEntries(
      publications.map((pub) => [
        `${pub.id}.txt`,
        file(
          `${heading(`${pub.venue} — ${pub.status}`)}
Title:   ${pub.title}
Authors: ${pub.authors}
Venue:   ${pub.venue}${pub.location ? `, ${pub.location}` : ""} (${pub.year})${pub.doi ? `\nDOI:     ${pub.doi}` : ""}${pub.note ? `\nID:      ${pub.note}` : ""}${pub.abstract ? `\n\nAbstract: ${pub.abstract}` : ""}

Type 'open publications' to jump to this section.`,
        ),
      ]),
    ),
  ),
  experience: dir(
    Object.fromEntries(
      experiences.map((exp) => [
        `${exp.id}.txt`,
        file(
          `${heading(exp.organization)}
Role:   ${exp.title}
Period: ${exp.period}
Lab:    ${exp.lab}${exp.supervisor ? `\n${exp.supervisorLabel ?? "Supervisor"}: ${exp.supervisor}` : ""}
Where:  ${exp.location}

${exp.description}

${bullets(exp.details)}`,
        ),
      ]),
    ),
  ),
  projects: dir(
    Object.fromEntries(
      projects.map((pr) => [
        pr.id,
        dir({
          "overview.txt": file(
            `${heading(pr.title)}
${pr.category} • ${pr.period}
Tools: ${pr.tools}

Problem:  ${pr.overview.problem}

Approach: ${pr.overview.approach}`,
          ),
          "results.txt": file(
            `${heading("Key Results")}
${pr.overview.results.map((r) => `${r.label.padEnd(16)}| ${r.value}`).join("\n")}`,
          ),
          ...(pr.deepDive
            ? {
                "deep-dive.txt": file(
                  pr.deepDive.map((sec) => `${heading(sec.title)}\n${sec.content}`).join("\n\n"),
                ),
              }
            : {}),
        }),
      ]),
    ),
  ),
  skills: dir(
    Object.fromEntries(
      skillCategories.map((cat) => [`${slug(cat.name)}.txt`, file(`${heading(cat.name)}\n${bullets(cat.skills)}`)]),
    ),
  ),
  honours: dir({
    "list.txt": file(
      `${heading("Honours & Awards")}
${bullets(honours.map((h) => `${h.title} (${h.year})`))}`,
    ),
  }),
  contact: dir({
    "info.txt": file(
      `${heading("Contact Information")}
Email:    ${contact.email}
LinkedIn: ${contact.linkedin.replace(/^https?:\/\//, "")}
GitHub:   ${contact.github.replace(/^https?:\/\//, "")}

Currently based at ${profile.affiliationShort}.
Open to research collaborations and discussions.`,
    ),
  }),
}

const COMMANDS = ["help", "ls", "cd", "cat", "tree", "open", "clear", "whoami", "pwd", "exit"]

const WELCOME_MESSAGE = `
┌─────────────────────────────────────────────────────┐
│  DEBJYOTI CHOWBEY // Research Terminal v1.1         │
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
  • Tab completes commands and paths
  • Esc closes the terminal
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
        const sectionMap: Record<string, string> = Object.fromEntries(
          sections.map((sec) => [sec.id, `#${sec.id}`]),
        )
        sectionMap.honors = "#honours"
        sectionMap.map = "#research-map"
        sectionMap.top = "#top"
        const target = sectionMap[arg.toLowerCase()]
        if (target) {
          addOutput(`Opening ${arg}...`)
          setIsMinimized(true)
          setTimeout(() => {
            document.querySelector(target)?.scrollIntoView({ behavior: "smooth" })
          }, 150)
        } else {
          addOutput(`open: unknown section '${arg}'`, "error")
          addOutput(`Available: ${sections.map((sec) => sec.id).join(", ")}`)
        }
        break
      }

      case "neofetch":
        addOutput(`
        ⠀⠀⠀⠀⣠⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣶⣦⣄⠀⠀⠀⠀    debjyoti@research
        ⠀⠀⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣄⠀⠀    ------------------
        ⠀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⠀    OS: Research Terminal v1.0
        ⣸⣿⣿⣿⣿⡿⠿⠿⠿⠿⠿⠿⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣇    Host: ${profile.affiliationShort}
        ⣿⣿⣿⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿    Kernel: Analog IC Design
        ⣿⣿⡟⠀⠀⣴⣶⣶⣦⠀⠀⠀⠀⠀⠀⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿    Shell: zsh 5.9
        ⣿⣿⡇⠀⠀⣿⣿⣿⣿⠀⠀⣶⣶⡄⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿    Focus: Low-Power CMOS
        ⣿⣿⣷⡀⠀⠻⠿⠿⠟⠀⠀⣿⣿⡇⠀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿    Theme: Semiconductor Dark
        ⠹⣿⣿⣿⣦⣀⠀⠀⠀⢀⣼⣿⣿⣷⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠏    Papers: ${publications.filter((p) => p.status === "Published").length} published
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
      const parts = currentInput.split(" ")
      const word = parts[parts.length - 1]
      let candidates: string[]
      let prefix = ""
      if (parts.length === 1) {
        candidates = COMMANDS
      } else if (parts[0] === "open") {
        candidates = sections.map((sec) => sec.id)
      } else {
        // Complete the last path segment, relative to the directory typed so far.
        const slash = word.lastIndexOf("/")
        prefix = slash >= 0 ? word.slice(0, slash + 1) : ""
        const base = prefix ? navigateToPath(prefix) : getCurrentDir()
        candidates = base?.children
          ? Object.entries(base.children).map(([name, node]) => (node.type === "dir" ? `${name}/` : name))
          : []
      }
      const partial = word.slice(prefix.length).toLowerCase()
      const matches = candidates.filter((c) => c.toLowerCase().startsWith(partial))
      if (matches.length === 1) {
        parts[parts.length - 1] = prefix + matches[0]
        setCurrentInput(parts.join(" ") + (matches[0].endsWith("/") ? "" : " "))
      } else if (matches.length > 1) {
        addOutput(matches.join("  "))
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault()
      setLines([])
    } else if (e.key === "Escape") {
      setIsOpen(false)
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
        <TerminalIcon className="h-5 w-5 text-primary" aria-hidden="true" />
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
            className={`fixed bottom-6 right-6 z-50 w-[min(600px,calc(100vw-3rem))] ${isMinimized ? "pointer-events-none" : ""} bg-[#0d0d14] border border-zinc-800 rounded-lg shadow-2xl overflow-hidden`}
            role="dialog"
            aria-label="Research terminal"
          >
            {/* Title Bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#16161e] border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <TerminalIcon className="h-4 w-4 text-violet-400" aria-hidden="true" />
                <span className="text-sm font-mono text-zinc-400">
                  research@debjyoti: ~/{currentPath.join("/")}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-1.5 hover:bg-zinc-800 rounded transition-colors"
                  aria-label="Minimize terminal"
                >
                  <Minus className="h-3 w-3 text-zinc-400" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-red-500/20 rounded transition-colors"
                  aria-label="Close terminal"
                >
                  <X className="h-3 w-3 text-zinc-400" />
                </button>
              </div>
            </div>

            {/* Terminal Content */}
            <div
              ref={terminalRef}
              onClick={() => inputRef.current?.focus()}
              className="h-80 overflow-y-auto p-4 font-mono text-xs sm:text-sm cursor-text"
              role="log"
              aria-live="polite"
            >
              {lines.map((line, index) => (
                <div
                  key={index}
                  className={`whitespace-pre-wrap mb-1 ${
                    line.type === "input"
                      ? "text-violet-400"
                      : line.type === "error"
                        ? "text-red-400"
                        : "text-zinc-300"
                  }`}
                >
                  {line.content}
                </div>
              ))}

              {/* Input Line */}
              <div className="flex items-center gap-2">
                <span className="text-violet-400 shrink-0">
                  ~/{currentPath.join("/")}$
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 min-w-0 bg-transparent outline-none text-zinc-100 caret-violet-400"
                  aria-label="Terminal command"
                  autoComplete="off"
                  spellCheck={false}
                />
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
            type="button"
            onClick={() => setIsMinimized(false)}
            aria-label="Restore terminal"
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
