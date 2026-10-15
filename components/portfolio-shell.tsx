"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Search } from "lucide-react"
import { CircuitBackground } from "@/components/circuit-background"
import { CommandPalette } from "@/components/command-palette"
import { ProfileCard } from "@/components/profile-card"
import { ResearchTerminal } from "@/components/terminal"
import { ThemeToggle } from "@/components/theme-toggle"
import { ContactSection } from "@/components/sections/contact"
import { ExperienceSection } from "@/components/sections/experience"
import { HonoursSection } from "@/components/sections/honours"
import { OverviewSection } from "@/components/sections/overview"
import { ProjectsSection } from "@/components/sections/projects"
import { PublicationsSection } from "@/components/sections/publications"
import { ReferencesSection } from "@/components/sections/references"
import { ResearchGraph } from "@/components/sections/research-graph"
import { SkillsSection } from "@/components/sections/skills"
import { profile, sections, type SectionId } from "@/lib/content"

const panels: Record<SectionId, () => React.ReactNode> = {
  overview: () => <OverviewSection />,
  publications: () => <PublicationsSection />,
  experience: () => <ExperienceSection />,
  projects: () => <ProjectsSection />,
  "research-map": () => <ResearchGraph />,
  skills: () => <SkillsSection />,
  honours: () => <HonoursSection />,
  references: () => <ReferencesSection />,
  contact: () => <ContactSection />,
}

const aliases: Record<string, SectionId> = { about: "overview", top: "overview", map: "research-map", honors: "honours" }

function tabFromHash(): SectionId {
  const raw = decodeURIComponent(window.location.hash.replace(/^#/, ""))
  if (raw in panels) return raw as SectionId
  return aliases[raw] ?? "overview"
}

/**
 * Card-based layout: a sticky profile card on the side, tabs on top, and one
 * content card at a time. Each tab has its own URL hash (#publications …) so
 * links are shareable and the browser's back button works.
 */
export function PortfolioShell() {
  const [active, setActive] = useState<SectionId>("overview")
  const [paletteOpen, setPaletteOpen] = useState(false)
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const mainRef = useRef<HTMLDivElement>(null)

  // Sync with the URL hash (initial load, back/forward, terminal `open`).
  useEffect(() => {
    const sync = () => setActive(tabFromHash())
    sync()
    window.addEventListener("hashchange", sync)
    window.addEventListener("popstate", sync)
    return () => {
      window.removeEventListener("hashchange", sync)
      window.removeEventListener("popstate", sync)
    }
  }, [])

  const navigate = useCallback((id: SectionId) => {
    setActive(id)
    if (window.location.hash !== `#${id}`) window.history.pushState(null, "", `#${id}`)
    // Keep the newly opened card in view on small screens.
    const top = mainRef.current?.getBoundingClientRect().top ?? 0
    if (top < 0 || top > window.innerHeight * 0.6) {
      mainRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [])

  // Keep the active tab visible in the scrollable strip.
  useEffect(() => {
    tabRefs.current[active]?.scrollIntoView({ block: "nearest", inline: "nearest" })
  }, [active])

  // ⌘/Ctrl + K or "/" opens the quick switcher.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault()
        setPaletteOpen((o) => !o)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  // Arrow keys move between tabs (WAI-ARIA tabs pattern).
  const onTabKey = (e: React.KeyboardEvent, index: number) => {
    let next = -1
    if (e.key === "ArrowRight") next = (index + 1) % sections.length
    if (e.key === "ArrowLeft") next = (index - 1 + sections.length) % sections.length
    if (e.key === "Home") next = 0
    if (e.key === "End") next = sections.length - 1
    if (next >= 0) {
      e.preventDefault()
      navigate(sections[next].id)
      tabRefs.current[sections[next].id]?.focus()
    }
  }

  return (
    <>
      <CircuitBackground />

      <a
        href="#main-card"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 sm:px-6">
          <button
            type="button"
            onClick={() => navigate("overview")}
            className="flex shrink-0 items-center gap-2 py-3"
            aria-label={`${profile.name} — overview`}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-md border border-primary/30 bg-primary/10 font-serif text-sm font-semibold text-primary">
              {profile.initials}
            </span>
            <span className="hidden font-serif text-lg font-semibold text-foreground xl:inline">{profile.name}</span>
          </button>

          <nav aria-label="Sections" className="no-scrollbar -mb-px flex flex-1 overflow-x-auto">
            <div role="tablist" aria-orientation="horizontal" className="mx-auto flex gap-1">
              {sections.map((s, i) => {
                const selected = s.id === active
                return (
                  <button
                    key={s.id}
                    ref={(el) => {
                      tabRefs.current[s.id] = el
                    }}
                    id={`tab-${s.id}`}
                    role="tab"
                    type="button"
                    aria-selected={selected}
                    aria-controls="main-card"
                    tabIndex={selected ? 0 : -1}
                    onClick={() => navigate(s.id)}
                    onKeyDown={(e) => onTabKey(e, i)}
                    className={`relative whitespace-nowrap px-3 py-4 text-sm transition-colors ${
                      selected ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {s.label}
                    {selected && (
                      <motion.span
                        layoutId="tab-underline"
                        className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-accent"
                        transition={{ type: "spring", stiffness: 500, damping: 40 }}
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </nav>

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="hidden items-center gap-2 rounded-lg border border-border px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground md:inline-flex"
              aria-label="Quick search (Ctrl+K)"
            >
              <Search className="h-3.5 w-3.5" aria-hidden="true" />
              <kbd className="font-sans">Ctrl K</kbd>
            </button>
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-foreground md:hidden"
              aria-label="Quick search"
            >
              <Search className="h-4 w-4" />
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-8 lg:py-10">
        {/* Profile card: always on large screens, on the Overview tab on phones */}
        <aside className={`${active === "overview" ? "block" : "hidden"} lg:block`}>
          <div className="lg:sticky lg:top-24">
            <ProfileCard />
          </div>
        </aside>

        <main ref={mainRef} className="min-w-0 scroll-mt-20">
          <div
            id="main-card"
            role="tabpanel"
            aria-labelledby={`tab-${active}`}
            tabIndex={-1}
            className="min-h-[70vh] rounded-2xl border border-border bg-card/90 p-5 shadow-sm backdrop-blur sm:p-8 lg:p-10"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {panels[active]()}
              </motion.div>
            </AnimatePresence>
          </div>

          <footer className="flex flex-col items-center justify-between gap-2 px-2 py-6 text-xs text-muted-foreground sm:flex-row">
            <p>
              © {new Date().getFullYear()} {profile.name}
            </p>
            <p>
              Press <kbd className="rounded border border-border px-1">Ctrl K</kbd> to search · terminal at bottom-right
            </p>
          </footer>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} onNavigate={navigate} />
      <ResearchTerminal />
    </>
  )
}
