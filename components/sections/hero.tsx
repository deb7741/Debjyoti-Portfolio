"use client"

import { motion } from "framer-motion"
import { ArrowDown, FileText, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { profile } from "@/lib/content"

export function HeroSection() {
  return (
    <section id="top" className="relative min-h-screen flex items-center justify-center px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-sm tracking-[0.3em] text-primary uppercase mb-4">
            {profile.role} • {profile.affiliationShort}
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-serif text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight mb-6 text-balance"
        >
          {profile.name}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-2 text-lg md:text-xl text-muted-foreground mb-8"
        >
          {profile.focusAreas.map((area, i) => (
            <span key={area} className="flex items-center gap-2">
              {i > 0 && <span className="text-primary" aria-hidden="true">•</span>}
              {area}
            </span>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Button asChild size="lg" className="gap-2">
            <a href="#about">
              View Research
              <ArrowDown className="h-4 w-4" />
            </a>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <a href="#publications">
              <FileText className="h-4 w-4" />
              Publications
            </a>
          </Button>
          <Button asChild variant="ghost" size="lg" className="gap-2">
            <a href="#contact">
              <Mail className="h-4 w-4" />
              Contact
            </a>
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        aria-hidden="true"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="h-5 w-5 text-muted-foreground" />
        </motion.div>
      </motion.div>
    </section>
  )
}
