"use client"

import { useId, useState, useRef } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { Cpu, Camera, Award, ChevronDown, Layers } from "lucide-react"
import { ImageGallery, ImageGalleryPlaceholder } from "@/components/image-gallery"
import { projects, type Project, type ProjectIcon } from "@/lib/content"

const projectIcons: Record<ProjectIcon, typeof Cpu> = { cpu: Cpu, camera: Camera }

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const Icon = projectIcons[project.icon]
  const [activeTab, setActiveTab] = useState<"overview" | "deep-dive">("overview")

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className={`group bg-card border rounded-lg overflow-hidden transition-all duration-300 ${
        project.highlight ? "border-primary/30 md:col-span-2" : "border-border"
      } hover:border-primary/50`}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
              project.highlight
                ? "bg-primary text-primary-foreground"
                : "bg-primary/10 text-primary"
            }`}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <p className="text-xs text-primary font-medium uppercase tracking-wider">
                {project.category}
              </p>
              {project.highlight && <Award className="h-3.5 w-3.5 text-primary" aria-hidden="true" />}
            </div>
            <h3 className="font-semibold text-lg text-card-foreground">
              {project.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {project.tools} • {project.period}
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-4 border-b border-border" role="tablist" aria-label={`${project.title} views`}>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
            className={`px-3 py-2 text-sm font-medium transition-colors relative ${
              activeTab === "overview"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Overview
            {activeTab === "overview" && (
              <motion.div
                layoutId={`tab-indicator-${project.id}`}
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              />
            )}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "deep-dive"}
            onClick={() => setActiveTab("deep-dive")}
            className={`px-3 py-2 text-sm font-medium transition-colors relative flex items-center gap-1.5 ${
              activeTab === "deep-dive"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layers className="h-3.5 w-3.5" aria-hidden="true" />
            Deep Dive
            {activeTab === "deep-dive" && (
              <motion.div
                layoutId={`tab-indicator-${project.id}`}
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              />
            )}
          </button>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" ? (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div>
                <h4 className="text-sm font-medium text-foreground mb-1">Problem</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {project.overview.problem}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-foreground mb-1">Approach</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {project.overview.approach}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Key Results</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {project.overview.results.map((result) => (
                    <div
                      key={result.label}
                      className="bg-secondary/50 rounded-md p-2 text-center"
                    >
                      <p className="text-sm font-semibold text-foreground">
                        {result.value}
                      </p>
                      <p className="text-xs text-muted-foreground">{result.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="deep-dive"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Collapsible Deep Dive Sections */}
              {[
                { title: "Problem Statement", content: project.deepDive.problemStatement },
                { title: "Design Rationale", content: project.deepDive.designRationale },
                { title: "Tradeoffs", content: project.deepDive.tradeoffs },
                { title: "Verification", content: project.deepDive.verification },
                { title: "Key Results", content: project.deepDive.keyResults },
                { title: "Lessons Learned", content: project.deepDive.lessonsLearned },
                { title: "Future Work", content: project.deepDive.futureWork },
              ].map((section, idx) => (
                <DeepDiveSection
                  key={section.title}
                  title={section.title}
                  content={section.content}
                  defaultOpen={idx === 0}
                />
              ))}

              {/* Image Gallery */}
              <div className="pt-4 border-t border-border">
                <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                  Media Gallery
                  <span className="text-xs font-normal text-muted-foreground">
                    (layouts, waveforms, measurements)
                  </span>
                </h4>
                {project.images.length > 0 ? (
                  <ImageGallery images={project.images} projectId={project.id} />
                ) : (
                  <ImageGalleryPlaceholder count={project.highlight ? 4 : 2} />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-4 mt-4 border-t border-border">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  )
}

function DeepDiveSection({
  title,
  content,
  defaultOpen = false,
}: {
  title: string
  content: string
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const contentId = useId()

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-secondary/30 hover:bg-secondary/50 transition-colors text-left"
      >
        <span className="text-sm font-medium text-foreground">{title}</span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={contentId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="px-4 py-3 text-sm text-muted-foreground leading-relaxed">
              {content}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function ProjectsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="projects" className="py-24 md:py-32 px-6 bg-card/50 scroll-mt-16" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-sm tracking-[0.3em] text-primary uppercase mb-4">
            Projects
          </h2>
          <p className="font-serif text-3xl md:text-4xl font-semibold text-balance">
            Technical Case Studies
          </p>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-4 leading-relaxed">
            Deep dives into selected projects showcasing problem formulation,
            design rationale, and verified results.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
