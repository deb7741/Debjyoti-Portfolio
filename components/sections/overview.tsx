"use client"

import { motion } from "framer-motion"
import { Atom, Cpu, GraduationCap, Shield, Zap } from "lucide-react"
import {
  news,
  philosophy,
  profile,
  researchDomains,
  researchStatement,
  type DomainIcon,
} from "@/lib/content"

const domainIcons: Record<DomainIcon, typeof Cpu> = { cpu: Cpu, zap: Zap, shield: Shield }

const highlights = [
  { value: "45–180 nm", label: "CMOS nodes" },
  { value: "67 dB", label: "Op-amp DC gain, < 10 µW" },
  { value: "2.17 pJ", label: "Per spike, silicon neuron" },
  { value: "16K-pt", label: "FFT spectrometer on RFSoC" },
]

export function OverviewSection() {
  return (
    <section>
      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent">Overview</p>
        <h2 className="font-serif text-3xl md:text-[2.5rem] font-semibold leading-tight text-balance">
          Bridging Theory and Silicon
        </h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">{researchStatement}</p>
      </header>

      {/* Highlights */}
      <div className="mb-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-4">
        {highlights.map((h, i) => (
          <motion.div
            key={h.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            className="bg-card px-4 py-4"
          >
            <p className="font-serif text-2xl font-semibold text-card-foreground">{h.value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{h.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Research areas */}
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Research areas</h3>
      <div className="mb-10 grid gap-4 md:grid-cols-3">
        {researchDomains.map((domain, index) => {
          const Icon = domainIcons[domain.icon]
          return (
            <motion.div
              key={domain.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.06 }}
              className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
            >
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h4 className="mb-2 font-semibold leading-snug text-card-foreground">{domain.title}</h4>
              <p className="mb-3 text-sm leading-relaxed text-muted-foreground">{domain.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {domain.tags.map((tag) => (
                  <span key={tag} className="rounded-md bg-secondary px-2 py-0.5 text-[11px] text-secondary-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* News */}
        <div className="lg:col-span-3">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Latest news</h3>
          <ol className="relative space-y-4 border-l border-border pl-5">
            {news.map((item) => (
              <li key={item.text} className="relative">
                <span className="absolute -left-[25px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-card bg-accent" aria-hidden="true" />
                <p className="text-xs font-medium uppercase tracking-wider text-accent">{item.date}</p>
                <p className="text-sm leading-relaxed text-card-foreground">{item.text}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Education + philosophy */}
        <div className="space-y-6 lg:col-span-2">
          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Education</h3>
            <div className="flex gap-3 rounded-xl border border-border bg-card p-4">
              <GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <div>
                <p className="font-medium text-card-foreground">{profile.education.degree}</p>
                <p className="text-sm text-muted-foreground">{profile.education.institution}</p>
                <p className="mt-1 text-xs text-muted-foreground">{profile.education.detail}</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <Atom className="h-3.5 w-3.5" aria-hidden="true" /> Approach
            </h3>
            <p className="mb-3 text-sm leading-relaxed text-muted-foreground">{philosophy.summary}</p>
            <ul className="space-y-1.5">
              {philosophy.principles.map((p) => (
                <li key={p.label} className="flex gap-2 text-sm">
                  <span className="font-medium text-card-foreground">{p.label}</span>
                  <span className="text-muted-foreground">— {p.description}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
