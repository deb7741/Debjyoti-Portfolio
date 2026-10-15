"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useTheme } from "next-themes"
import { CornerDownLeft, Search } from "lucide-react"
import { contact, projects, publications, sections, type SectionId } from "@/lib/content"

interface Command {
  id: string
  group: string
  label: string
  hint?: string
  run: () => void
}

/**
 * Ctrl/⌘ + K quick switcher: jump to any tab, paper or project, copy the
 * email, toggle the theme or open the research terminal.
 */
export function CommandPalette({
  open,
  onOpenChange,
  onNavigate,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onNavigate: (id: SectionId) => void
}) {
  const [query, setQuery] = useState("")
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const { resolvedTheme, setTheme } = useTheme()

  const commands = useMemo<Command[]>(() => {
    const close = (fn: () => void) => () => {
      fn()
      onOpenChange(false)
    }
    return [
      ...sections.map((s) => ({
        id: `tab-${s.id}`,
        group: "Go to",
        label: s.label,
        run: close(() => onNavigate(s.id)),
      })),
      ...publications.map((p) => ({
        id: `pub-${p.id}`,
        group: "Publications",
        label: p.title,
        hint: `${p.venue} · ${p.status}`,
        run: close(() => onNavigate("publications")),
      })),
      ...projects.map((p) => ({
        id: `proj-${p.id}`,
        group: "Projects",
        label: p.title,
        hint: p.period,
        run: close(() => onNavigate("projects")),
      })),
      {
        id: "copy-email",
        group: "Actions",
        label: "Copy email address",
        hint: contact.email,
        run: close(() => void navigator.clipboard?.writeText(contact.email).catch(() => {})),
      },
      {
        id: "theme",
        group: "Actions",
        label: `Switch to ${resolvedTheme === "dark" ? "light" : "dark"} theme`,
        run: close(() => setTheme(resolvedTheme === "dark" ? "light" : "dark")),
      },
      {
        id: "terminal",
        group: "Actions",
        label: "Open research terminal",
        run: close(() => window.dispatchEvent(new Event("open-terminal"))),
      },
      {
        id: "linkedin",
        group: "Links",
        label: "LinkedIn",
        run: close(() => window.open(contact.linkedin, "_blank", "noopener")),
      },
      {
        id: "github",
        group: "Links",
        label: "GitHub",
        run: close(() => window.open(contact.github, "_blank", "noopener")),
      },
    ]
  }, [onNavigate, onOpenChange, resolvedTheme, setTheme])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter((c) => `${c.label} ${c.hint ?? ""} ${c.group}`.toLowerCase().includes(q))
  }, [commands, query])

  useEffect(() => {
    if (open) {
      setQuery("")
      setActive(0)
      setTimeout(() => inputRef.current?.focus(), 10)
    }
  }, [open])

  useEffect(() => setActive(0), [query])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActive((i) => Math.min(filtered.length - 1, i + 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActive((i) => Math.max(0, i - 1))
    } else if (e.key === "Enter") {
      e.preventDefault()
      filtered[active]?.run()
    } else if (e.key === "Escape") {
      onOpenChange(false)
    }
  }

  let lastGroup = ""

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-start justify-center bg-foreground/20 px-4 pt-[12vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={() => onOpenChange(false)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Quick search"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-xl overflow-hidden rounded-xl border border-border bg-popover shadow-2xl"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search sections, papers, projects, actions…"
                className="h-12 w-full bg-transparent text-sm text-popover-foreground outline-none placeholder:text-muted-foreground"
                role="combobox"
                aria-expanded="true"
                aria-controls="command-list"
                aria-activedescendant={filtered[active] ? `cmd-${filtered[active].id}` : undefined}
              />
              <kbd className="rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">Esc</kbd>
            </div>
            <ul id="command-list" role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
              {filtered.length === 0 && <li className="px-3 py-6 text-center text-sm text-muted-foreground">No results</li>}
              {filtered.map((c, i) => {
                const header = c.group !== lastGroup ? c.group : null
                lastGroup = c.group
                return (
                  <li key={c.id} role="presentation">
                    {header && (
                      <p className="px-3 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        {header}
                      </p>
                    )}
                    <button
                      id={`cmd-${c.id}`}
                      role="option"
                      aria-selected={i === active}
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onClick={c.run}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm ${
                        i === active ? "bg-secondary text-foreground" : "text-popover-foreground"
                      }`}
                    >
                      <span className="flex-1 truncate">{c.label}</span>
                      {c.hint && <span className="hidden truncate text-xs text-muted-foreground sm:block sm:max-w-[40%]">{c.hint}</span>}
                      {i === active && <CornerDownLeft className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />}
                    </button>
                  </li>
                )
              })}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
