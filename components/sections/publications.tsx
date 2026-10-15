"use client"

import { motion, useInView, AnimatePresence } from "framer-motion"
import { useId, useRef, useState } from "react"
import { ExternalLink, ChevronDown } from "lucide-react"
import { isPeerReviewed, publications, type Publication } from "@/lib/content"

function PublicationCard({ publication, index }: { publication: Publication; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const abstractId = useId()

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group border-b border-border pb-6 last:border-0"
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-medium text-foreground group-hover:text-primary transition-colors leading-snug">
              {publication.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{publication.authors}</p>
          </div>
          <span
            className={`shrink-0 text-xs px-2 py-1 rounded-md ${
              publication.status === "Published"
                ? "bg-primary/10 text-primary"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            {publication.status}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="font-medium">{publication.venue}</span>
          <span aria-hidden="true">•</span>
          {publication.location && (
            <>
              <span>{publication.location}</span>
              <span aria-hidden="true">•</span>
            </>
          )}
          <span>{publication.year}</span>
          {publication.note && (
            <>
              <span aria-hidden="true">•</span>
              <span className="font-mono text-xs">{publication.note}</span>
            </>
          )}
          {publication.doi && (
            <>
              <span aria-hidden="true">•</span>
              <a
                href={`https://doi.org/${publication.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                DOI
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </>
          )}
        </div>

        {publication.abstract && (
        <div>
          <button
            type="button"
            onClick={() => setIsExpanded((v) => !v)}
            aria-expanded={isExpanded}
            aria-controls={abstractId}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
            {isExpanded ? "Hide" : "Show"} Abstract
          </button>

          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                id={abstractId}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed bg-secondary/50 p-4 rounded-lg">
                  {publication.abstract}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        )}
      </div>
    </motion.article>
  )
}

export function PublicationsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="publications" className="py-24 md:py-32 px-6 bg-card/50 scroll-mt-16" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-sm tracking-[0.3em] text-primary uppercase mb-4">Publications</h2>
          <p className="font-serif text-3xl md:text-4xl font-semibold text-balance">Research Papers</p>
        </motion.div>

        {[
          { title: "Peer-Reviewed", items: publications.filter(isPeerReviewed) },
          { title: "Under Review / Submitted", items: publications.filter((p) => !isPeerReviewed(p)) },
        ]
          .filter((group) => group.items.length > 0)
          .map((group) => (
            <div key={group.title} className="mb-12 last:mb-0">
              <h3 className="mb-6 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                {group.title}
              </h3>
              <div className="space-y-6">
                {group.items.map((publication, index) => (
                  <PublicationCard key={publication.id} publication={publication} index={index} />
                ))}
              </div>
            </div>
          ))}
      </div>
    </section>
  )
}
