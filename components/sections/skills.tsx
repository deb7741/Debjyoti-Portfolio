"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { coursework, skillCategories } from "@/lib/content"

function SkillCategory({
  category,
  index,
  isActive,
  onSelect,
}: {
  category: (typeof skillCategories)[0]
  index: number
  isActive: boolean
  onSelect: () => void
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      viewport={{ once: true }}
      type="button"
      onClick={onSelect}
      aria-pressed={isActive}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        isActive
          ? "bg-primary text-primary-foreground"
          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
      }`}
    >
      {category.name}
    </motion.button>
  )
}

export function SkillsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [activeCategory, setActiveCategory] = useState(0)

  return (
    <section ref={ref}>
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8 border-b border-border pb-6"
        >
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
            Technical Skills
          </h2>
          <p className="font-serif text-3xl md:text-[2.5rem] leading-tight font-semibold text-balance">
            Tools & Expertise
          </p>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {skillCategories.map((category, index) => (
            <SkillCategory
              key={category.name}
              category={category}
              index={index}
              isActive={activeCategory === index}
              onSelect={() => setActiveCategory(index)}
            />
          ))}
        </div>

        {/* Skills Grid */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-3"
        >
          {skillCategories[activeCategory].skills.map((skill, index) => (
            <motion.div
              key={skill}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
              className="bg-card border border-border rounded-lg p-3 text-center hover:border-primary/50 transition-colors"
            >
              <span className="text-sm text-card-foreground">{skill}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Relevant Coursework */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 pt-10 border-t border-border"
        >
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
            Relevant Coursework
          </h3>
          <div className="flex flex-wrap gap-2">
            {coursework.map((course) => (
              <span
                key={course}
                className="text-xs px-3 py-1.5 rounded-full bg-secondary/50 text-secondary-foreground"
              >
                {course}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
