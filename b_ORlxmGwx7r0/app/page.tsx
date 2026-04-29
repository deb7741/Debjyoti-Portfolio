import { CircuitBackground } from "@/components/circuit-background"
import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/sections/hero"
import { AboutSection } from "@/components/sections/about"
import { PublicationsSection } from "@/components/sections/publications"
import { ExperienceSection } from "@/components/sections/experience"
import { ResearchGraph } from "@/components/sections/research-graph"
import { ProjectsSection } from "@/components/sections/projects"
import { SkillsSection } from "@/components/sections/skills"
import { HonoursSection } from "@/components/sections/honours"
import { ContactSection } from "@/components/sections/contact"
import { Footer } from "@/components/footer"
import { ResearchTerminal } from "@/components/terminal"

export default function HomePage() {
  return (
    <>
      <CircuitBackground />
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <PublicationsSection />
        <ExperienceSection />
        <ResearchGraph />
        <ProjectsSection />
        <SkillsSection />
        <HonoursSection />
        <ContactSection />
      </main>
      <Footer />
      <ResearchTerminal />
    </>
  )
}
