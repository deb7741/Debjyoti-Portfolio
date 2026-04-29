"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { ExternalLink, ChevronDown } from "lucide-react"

const publications = [
  {
    title: "Low-Power CMOS Operational Amplifier Design in 45nm Technology",
    authors: ["D. Chowbey", "R. K. Baruah"],
    venue: "IEEE DevIC 2025",
    location: "Kalyani, India",
    year: "Apr 2025",
    status: "Published",
    doi: "10.1109/DevIC63749.2025.11012572",
    abstract:
      "This paper presents a low-power operational amplifier design in 45nm CMOS technology, targeting short-channel effects and gate leakage. The design achieves 67dB DC gain, 3.7MHz GBW, and sub-10μW power consumption with complete post-layout verification across PVT corners.",
  },
  {
    title: "A 45nm Subthreshold CMOS Op-Amp with Adaptive Biasing for Ultra-Low-Power Implantable Applications",
    authors: ["D. Chowbey", "R. K. Baruah"],
    venue: "IEEE GCON 2026",
    location: "IIT Guwahati, India",
    year: "2026",
    status: "Accepted",
    doi: null,
    abstract:
      "This work presents a novel subthreshold CMOS operational amplifier with adaptive biasing technique optimized for ultra-low-power implantable biomedical applications. The design achieves significant power reduction while maintaining adequate performance for sensing applications.",
  },
]

function PublicationCard({
  publication,
  index,
}: {
  publication: (typeof publications)[0]
  index: number
}) {
  const [isExpanded, setIsExpanded] = useState(false)

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
            <p className="text-sm text-muted-foreground mt-1">
              {publication.authors.join(", ")}
            </p>
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
          <span>•</span>
          <span>{publication.location}</span>
          <span>•</span>
          <span>{publication.year}</span>
          {publication.doi && (
            <>
              <span>•</span>
              <a
                href={`https://doi.org/${publication.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                DOI
                <ExternalLink className="h-3 w-3" />
              </a>
            </>
          )}
        </div>

        <div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
            />
            {isExpanded ? "Hide" : "Show"} Abstract
          </button>
          
          {isExpanded && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 text-sm text-muted-foreground leading-relaxed bg-secondary/50 p-4 rounded-lg"
            >
              {publication.abstract}
            </motion.p>
          )}
        </div>
      </div>
    </motion.article>
  )
}

export function PublicationsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="publications" className="py-24 md:py-32 px-6 bg-card/50" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-sm tracking-[0.3em] text-primary uppercase mb-4">
            Publications
          </h2>
          <p className="font-serif text-3xl md:text-4xl font-semibold text-balance">
            Research Papers
          </p>
        </motion.div>

        <div className="space-y-6">
          {publications.map((publication, index) => (
            <PublicationCard
              key={publication.title}
              publication={publication}
              index={index}
            />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-10 text-center text-sm text-muted-foreground"
        >
          Additional journal submission on TLS 1.3 side-channel analysis (IEEE TSG) currently under preparation.
        </motion.p>
      </div>
    </section>
  )
}
