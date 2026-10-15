"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Cpu, Zap, Shield, GraduationCap, Atom } from "lucide-react"
import { philosophy, profile, researchDomains, researchStatement, type DomainIcon } from "@/lib/content"

const domainIcons: Record<DomainIcon, typeof Cpu> = { cpu: Cpu, zap: Zap, shield: Shield }

export function AboutSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="about" className="py-24 md:py-32 px-6" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-sm tracking-[0.3em] text-primary uppercase mb-4">
            Research Overview
          </h2>
          <p className="font-serif text-3xl md:text-4xl font-semibold mb-6 text-balance">
            Bridging Theory and Silicon
          </p>
          <p className="text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {researchStatement}
          </p>
        </motion.div>

        {/* Education Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12 flex justify-center"
        >
          <div className="inline-flex items-center gap-3 px-5 py-3 bg-card border border-border rounded-lg">
            <GraduationCap className="h-5 w-5 text-primary" />
            <div className="text-left">
              <p className="font-medium text-card-foreground">{profile.education.degree}</p>
              <p className="text-sm text-muted-foreground">
                {profile.education.institution} • {profile.education.detail}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Research Philosophy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-16"
        >
          <div className="bg-card/50 border border-border rounded-lg p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Atom className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground">Research Philosophy</h3>
                <p className="text-sm text-muted-foreground">How I approach problems</p>
              </div>
            </div>
            
            <p className="text-muted-foreground leading-relaxed mb-6">
              {philosophy.summary}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {philosophy.principles.map((principle, index) => (
                <motion.div
                  key={principle.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                  className="text-center p-3 bg-secondary/30 rounded-lg border border-border/50"
                >
                  <p className="text-sm font-medium text-foreground">{principle.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{principle.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Research Domains */}
        <div className="grid md:grid-cols-3 gap-6">
          {researchDomains.map((domain, index) => {
            const Icon = domainIcons[domain.icon]
            return (
            <motion.div
              key={domain.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              className="group relative bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                
                <h3 className="font-semibold text-xl mb-3 text-card-foreground">
                  {domain.title}
                </h3>
                
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {domain.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {domain.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
