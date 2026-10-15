"use client"

import { motion, useInView, AnimatePresence } from "framer-motion"
import { useId, useRef, useState } from "react"
import { ChevronDown, MapPin } from "lucide-react"
import { experiences, type Experience } from "@/lib/content"

function ExperienceCard({ experience, index }: { experience: Experience; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const detailsId = useId()

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="relative pl-8 pb-12 last:pb-0"
    >
      {/* Timeline line + dot */}
      <div className="absolute left-0 top-2 bottom-0 w-px bg-border" aria-hidden="true" />
      <div
        className="absolute left-0 top-2 w-2 h-2 -translate-x-1/2 rounded-full bg-primary"
        aria-hidden="true"
      />

      <div className="space-y-2">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="font-semibold text-lg text-foreground">{experience.title}</h3>
          <span className="text-sm text-muted-foreground">{experience.period}</span>
        </div>

        <p className="font-medium text-primary">{experience.organization}</p>

        <p className="text-sm text-muted-foreground">
          {experience.lab}
          {experience.supervisor && (
            <span>
              {" "}
              • {experience.supervisorLabel ?? "Supervisor"}: {experience.supervisor}
            </span>
          )}
        </p>

        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3 w-3" aria-hidden="true" />
          {experience.location}
        </div>

        <p className="text-muted-foreground leading-relaxed pt-2">{experience.description}</p>

        <button
          type="button"
          onClick={() => setIsExpanded((v) => !v)}
          aria-expanded={isExpanded}
          aria-controls={detailsId}
          className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors mt-2"
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
          {isExpanded ? "Hide" : "Show"} Details
        </button>

        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.ul
              id={detailsId}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {experience.details.map((detail) => (
                <li
                  key={detail}
                  className="mt-3 text-sm text-muted-foreground pl-4 border-l-2 border-border leading-relaxed"
                >
                  {detail}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export function ExperienceSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="experience" className="py-24 md:py-32 px-6 scroll-mt-16" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-sm tracking-[0.3em] text-primary uppercase mb-4">Experience</h2>
          <p className="font-serif text-3xl md:text-4xl font-semibold text-balance">Research Journey</p>
        </motion.div>

        <div className="relative">
          {experiences.map((experience, index) => (
            <ExperienceCard key={experience.id} experience={experience} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
