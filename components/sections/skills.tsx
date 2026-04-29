"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"

const skillCategories = [
  {
    name: "Analog & Mixed-Signal",
    skills: [
      "Op-Amp Design (Two-Stage, Folded-Cascode)",
      "Subthreshold/Adaptive Biasing",
      "Current-Mode Circuits",
      "Flash ADC Design",
      "LDO Concepts",
      "Full-Custom Layout",
    ],
  },
  {
    name: "Analog Computing",
    skills: [
      "Current-Mode Ising Machines",
      "Spin-Threshold Detection",
      "Differential-Amplifier Comparators",
      "Coupled Oscillator Networks",
      "65nm CMOS Design",
    ],
  },
  {
    name: "Physical Security",
    skills: [
      "Power/EM Side-Channel Analysis",
      "Correlation Power Analysis (CPA)",
      "EM Cartography",
      "Embedded AES Evaluation",
      "Analog Signal Acquisition",
    ],
  },
  {
    name: "EDA Tools",
    skills: [
      "Cadence Virtuoso (ADE L/XL)",
      "Layout XL",
      "Spectre Simulator",
      "Quantus Extraction",
      "Xilinx Vivado/ISE",
      "ModelSim",
    ],
  },
  {
    name: "Digital & FPGA",
    skills: [
      "RTL (Verilog/VHDL)",
      "FSM Design",
      "Static Timing Analysis",
      "Clock-Domain Crossing",
      "RFSoC ZCU216",
    ],
  },
  {
    name: "Device Fundamentals",
    skills: [
      "MOS Capacitor Physics",
      "Short-Channel Effects",
      "CMOS Scaling Challenges",
      "Leakage Mechanisms",
    ],
  },
  {
    name: "Programming",
    skills: [
      "Python",
      "MATLAB",
      "C",
      "Verilog HDL",
      "VHDL",
      "Linux",
      "Git",
    ],
  },
]

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
      onClick={onSelect}
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
    <section id="skills" className="py-24 md:py-32 px-6" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-sm tracking-[0.3em] text-primary uppercase mb-4">
            Technical Skills
          </h2>
          <p className="font-serif text-3xl md:text-4xl font-semibold text-balance">
            Tools & Expertise
          </p>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
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
          <h3 className="text-center text-sm text-muted-foreground mb-6">
            Relevant Coursework
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "Semiconductor Devices",
              "Analog & Mixed-Signal IC Design",
              "Digital System Design",
              "Digital Signal Processing",
              "VHDL",
            ].map((course) => (
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
