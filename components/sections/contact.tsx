"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { Mail, Linkedin, Github, ExternalLink, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { contact } from "@/lib/content"

const contactLinks = [
  { icon: Mail, label: "Email", value: contact.email, href: `mailto:${contact.email}` },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: contact.linkedin.replace(/^https?:\/\//, ""),
    href: contact.linkedin,
  },
  {
    icon: Github,
    label: "GitHub",
    value: contact.github.replace(/^https?:\/\//, ""),
    href: contact.github,
  },
]

export function ContactSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="contact" className="py-24 md:py-32 px-6 scroll-mt-16" ref={ref}>
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
                  <link.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-muted-foreground">{link.label}</p>
                  <p className="font-medium text-card-foreground">{link.value}</p>
                </div>
              </div>
              <ExternalLink
                className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors"
                aria-hidden="true"
              />
            </motion.a>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12"
        >
          <MessageForm />
        </motion.div>
      </div>
    </section>
  )
}

const fieldClass =
  "w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"

/**
 * The site is static (no backend), so the form opens the visitor's email app
 * with everything filled in, rather than pretending to send.
 */
function MessageForm() {
  const [opened, setOpened] = useState(false)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const name = String(data.get("name") ?? "")
    const from = String(data.get("email") ?? "")
    const subject = String(data.get("subject") ?? "")
    const message = String(data.get("message") ?? "")
    const body = `${message}\n\n— ${name}${from ? ` (${from})` : ""}`
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setOpened(true)
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-lg border border-border bg-card p-6 text-left"
      aria-labelledby="message-form-title"
    >
      <h3 id="message-form-title" className="font-semibold text-card-foreground">
        Send a message
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5 text-sm">
          <span className="text-muted-foreground">Name</span>
          <input name="name" required autoComplete="name" className={fieldClass} placeholder="Your name" />
        </label>
        <label className="space-y-1.5 text-sm">
          <span className="text-muted-foreground">Email</span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className={fieldClass}
            placeholder="you@university.edu"
          />
        </label>
      </div>
      <label className="block space-y-1.5 text-sm">
        <span className="text-muted-foreground">Subject</span>
        <input name="subject" required className={fieldClass} placeholder="Research collaboration / PhD position" />
      </label>
      <label className="block space-y-1.5 text-sm">
        <span className="text-muted-foreground">Message</span>
        <textarea name="message" required rows={5} className={`${fieldClass} resize-y`} placeholder="Hello Debjyoti…" />
      </label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground" role="status">
          {opened
            ? `Your email app should now be open with the message ready. If not, write to ${contact.email}.`
            : "Opens your email app with the message pre-filled."}
        </p>
        <Button type="submit" className="gap-2 shrink-0">
          <Send className="h-4 w-4" aria-hidden="true" />
          Send via email
        </Button>
      </div>
    </form>
  )
}
