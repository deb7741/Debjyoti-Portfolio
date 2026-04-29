"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Mail, Linkedin, Github, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

const contactLinks = [
  {
    icon: Mail,
    label: "Email",
    value: "chowbeydebjyoti@gmail.com",
    href: "mailto:chowbeydebjyoti@gmail.com",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "linkedin.com/in/debjyotichowbey",
    href: "https://linkedin.com/in/debjyotichowbey",
  },
  {
    icon: Github,
    label: "GitHub",
    value: "github.com/deb7741",
    href: "https://github.com/deb7741",
  },
]

export function ContactSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="contact" className="py-24 md:py-32 px-6" ref={ref}>
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-sm tracking-[0.3em] text-primary uppercase mb-4">
            Contact
          </h2>
          <p className="font-serif text-3xl md:text-4xl font-semibold mb-4 text-balance">
            Let&apos;s Connect
          </p>
          <p className="text-muted-foreground leading-relaxed mb-10">
            Interested in collaboration, research discussions, or have questions 
            about my work? I&apos;d be happy to hear from you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4"
        >
          {contactLinks.map((link, index) => (
            <motion.a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("mailto") ? undefined : "_blank"}
              rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              className="group flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <link.icon className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-muted-foreground">{link.label}</p>
                  <p className="font-medium text-card-foreground">{link.value}</p>
                </div>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </motion.a>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12"
        >
          <Button asChild size="lg" className="gap-2">
            <a href="mailto:chowbeydebjyoti@gmail.com">
              <Mail className="h-4 w-4" />
              Send Email
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
