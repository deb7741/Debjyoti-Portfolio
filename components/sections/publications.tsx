"use client"

import { motion, useInView, AnimatePresence } from "framer-motion"
import { useId, useRef, useState } from "react"
import { ExternalLink, ChevronDown, Quote, Check } from "lucide-react"
import { isPeerReviewed, publications, type Publication } from "@/lib/content"

/** BibTeX entry built from the publication data (authors as listed on the site). */
function toBibtex(p: Publication) {
  const year = p.year.match(/\d{4}/)?.[0] ?? p.year
  const firstWord = p.title.split(/\W+/).find((w) => w.length > 3)?.toLowerCase() ?? "paper"
  const isJournal = /transactions|journal/i.test(p.venue)
  const authors = p.authors.replace(/,\s*/g, " and ").replace(/\s+et al\.?/, " and others")
  const fields = [
    `  title = {${p.title}}`,
    `  author = {${authors}}`,
    `  ${isJournal ? "journal" : "booktitle"} = {${p.venue}}`,
    `  year = {${year}}`,
    p.doi ? `  doi = {${p.doi}}` : null,
  ].filter(Boolean)
  return `@${isJournal ? "article" : "inproceedings"}{chowbey${year}${firstWord},\n${fields.join(",\n")}\n}`
}

function CiteButton({ publication }: { publication: Publication }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(toBibtex(publication))
          setCopied(true)
          setTimeout(() => setCopied(false), 1600)
        } catch {
          /* clipboard unavailable */
        }
      }}
      className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      title="Copy BibTeX"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-accent" aria-hidden="true" /> : <Quote className="h-3.5 w-3.5" aria-hidden="true" />}
      {copied ? "BibTeX copied" : "Cite"}
    </button>
  )
}

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

        <div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {publication.abstract && (
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
          )}
          <CiteButton publication={publication} />
          </div>

          <AnimatePresence initial={false}>
            {isExpanded && publication.abstract && (
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
      </div>
    </motion.article>
  )
}

export function PublicationsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref}>
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8 border-b border-border pb-6"
        >
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent">Publications</h2>
          <p className="font-serif text-3xl md:text-[2.5rem] leading-tight font-semibold text-balance">Research Papers</p>
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
