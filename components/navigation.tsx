"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "@/components/ui/button"
import { profile, sections } from "@/lib/content"

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Highlight the nav link for the section currently in view.
  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null)
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActiveId(entry.target.id)
      },
      { rootMargin: "-45% 0px -50% 0px" },
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isMobileMenuOpen) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsMobileMenuOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isMobileMenuOpen])

  const linkClass = (id: string) =>
    `transition-colors ${activeId === id ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || isMobileMenuOpen
            ? "bg-background/80 backdrop-blur-lg border-b border-border"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto max-w-6xl px-6 py-4" aria-label="Main">
          <div className="flex items-center justify-between">
            <a
              href="#top"
              className="font-serif text-xl font-semibold text-foreground hover:text-primary transition-colors"
              aria-label={`${profile.name} — back to top`}
            >
              {profile.initials}
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-7">
              {sections.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  aria-current={activeId === item.id ? "true" : undefined}
                  className={`text-sm ${linkClass(item.id)}`}
                >
                  {item.label}
                </a>
              ))}
              <ThemeToggle />
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center gap-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen((open) => !open)}
                className="h-9 w-9"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                <span className="sr-only">{isMobileMenuOpen ? "Close menu" : "Open menu"}</span>
              </Button>
            </div>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[69px] z-40 bg-background/95 backdrop-blur-lg border-b border-border lg:hidden"
          >
            <nav className="flex flex-col px-6 py-4 gap-1" aria-label="Mobile">
              {sections.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`py-2 ${linkClass(item.id)}`}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
