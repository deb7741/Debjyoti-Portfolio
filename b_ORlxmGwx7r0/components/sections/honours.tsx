"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Award, Trophy, Star, Medal, Users } from "lucide-react"

const honours = [
  {
    icon: Trophy,
    title: "GATE EC — Qualified 2025 & 2026",
    description: "Graduate Aptitude Test in Engineering, Electronics & Communication",
    year: "2025, 2026",
    highlight: "Qualified",
  },
  {
    icon: Medal,
    title: "Rank 4, ECE Department",
    description: "Tezpur University, Class of 2025",
    year: "2025",
    highlight: "Top 5%",
  },
  {
    icon: Award,
    title: "University Best Project Award 2025",
    description: "Low-Power 45nm CMOS Op-Amp — Full-custom design with 2 IEEE publications",
    year: "2025",
    highlight: "Best Project",
  },
  {
    icon: Star,
    title: "2nd Place, IEEE Texplorer Research Fair",
    description: "Oral presentation at IEEE DevIC 2025, Kalyani, India",
    year: "2025",
    highlight: "2nd Place",
  },
  {
    icon: Users,
    title: "Coordinator, Astronomy Club",
    description: "Tezpur University — Organised technical seminars and public outreach programmes",
    year: "2022—2024",
    highlight: "Leadership",
  },
]

export function HonoursSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="py-24 md:py-32 px-6 bg-card/50" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-sm tracking-[0.3em] text-primary uppercase mb-4">
            Recognition
          </h2>
          <p className="font-serif text-3xl md:text-4xl font-semibold text-balance">
            Honours & Achievements
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4">
          {honours.map((honour, index) => (
            <motion.div
              key={honour.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group flex gap-4 p-5 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors"
            >
              <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <honour.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-card-foreground">
                    {honour.title}
                  </h3>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {honour.year}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {honour.description}
                </p>
                <span className="inline-block text-xs font-medium px-2 py-1 rounded-md bg-primary/10 text-primary">
                  {honour.highlight}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
