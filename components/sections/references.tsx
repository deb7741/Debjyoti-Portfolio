"use client"

import { motion } from "framer-motion"
import { Building2, ExternalLink, Mail, UserRound } from "lucide-react"
import { CopyButton } from "@/components/profile-card"
import { references } from "@/lib/content"

export function ReferencesSection() {
  return (
    <section>
      <header className="mb-8 border-b border-border pb-6">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent">References</p>
        <h2 className="font-serif text-3xl md:text-[2.5rem] font-semibold leading-tight text-balance">Faculty Referees</h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
          Faculty who have supervised my research and can speak to my work. Official institutional email addresses are
          listed below.
        </p>
      </header>

      <div className="space-y-4">
        {references.map((ref, i) => (
          <motion.article
            key={ref.email}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="grid gap-5 rounded-xl border border-border bg-card p-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:p-6"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <UserRound className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <h3 className="font-serif text-xl font-semibold leading-tight text-card-foreground">{ref.name}</h3>
                <p className="text-sm text-accent">{ref.designation}</p>
                <p className="mt-2 flex gap-2 text-sm text-muted-foreground">
                  <Building2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>
                    {ref.department}
                    <br />
                    {ref.institution}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex min-w-0 flex-col justify-between gap-3 md:border-l md:border-border md:pl-6">
              <p className="text-sm leading-relaxed text-muted-foreground">{ref.relation}</p>
              <div className="flex items-center gap-1 rounded-lg bg-secondary/60 px-3 py-2">
                <Mail className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <a href={`mailto:${ref.email}`} className="ml-1 flex-1 break-all font-mono text-sm text-primary hover:underline">
                  {ref.email}
                </a>
                <CopyButton value={ref.email} label={`Copy ${ref.name}'s email`} />
                <a
                  href={ref.profile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
                  aria-label={`${ref.name}'s official page (opens in a new tab)`}
                  title="Official page"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
