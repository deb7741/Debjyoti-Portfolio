"use client"

import Image from "next/image"
import { useState } from "react"
import { Check, Copy, FileText, Github, Linkedin, Mail, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { contact, isPeerReviewed, lastUpdated, profile, publications } from "@/lib/content"

export function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard blocked — the value is still visible to select */
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      aria-label={copied ? "Copied" : label}
      title={copied ? "Copied" : label}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-accent" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  )
}

const links = [
  { href: contact.linkedin, label: "LinkedIn", icon: Linkedin },
  { href: contact.github, label: "GitHub", icon: Github },
  { href: `mailto:${contact.email}`, label: "Email", icon: Mail },
]

/** Classic side profile card: portrait, identity, contact and quick facts. */
export function ProfileCard() {
  const published = publications.filter(isPeerReviewed).length
  const pending = publications.length - published

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card/90 shadow-sm backdrop-blur">
      {profile.photo && (
        <div className="relative aspect-[16/11] w-full bg-secondary sm:aspect-[5/4]">
          <Image
            src={profile.photo}
            alt={profile.name}
            fill
            priority
            sizes="(min-width: 1024px) 320px, 100vw"
            className="object-cover object-[50%_30%]"
          />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-card/95 to-transparent" />
        </div>
      )}

      <div className="space-y-4 p-6">
        <div>
          <h1 className="font-serif text-[1.9rem] font-semibold leading-tight text-card-foreground">{profile.name}</h1>
          <p className="mt-1 text-sm font-medium text-accent">{profile.role}</p>
          <p className="text-sm text-muted-foreground">{profile.affiliation}</p>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            {profile.location}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {profile.focusAreas.map((area) => (
            <span key={area} className="rounded-full border border-border bg-secondary/60 px-2.5 py-1 text-[11px] text-secondary-foreground">
              {area}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 divide-x divide-border rounded-lg border border-border text-center">
          <div className="py-2.5">
            <p className="font-serif text-2xl font-semibold text-card-foreground">{published}</p>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Published</p>
          </div>
          <div className="py-2.5">
            <p className="font-serif text-2xl font-semibold text-card-foreground">{pending}</p>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Under review</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 rounded-lg bg-secondary/60 px-3 py-2">
          <a href={`mailto:${contact.email}`} className="truncate text-sm text-card-foreground hover:text-primary">
            {contact.email}
          </a>
          <CopyButton value={contact.email} label="Copy email address" />
        </div>

        <div className="flex items-center gap-2">
          {links.map(({ href, label, icon: Icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              title={label}
              {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
          <Button asChild size="sm" variant="outline" className="ml-auto gap-1.5">
            <a href={`mailto:${contact.email}?subject=${encodeURIComponent("CV request")}`}>
              <FileText className="h-3.5 w-3.5" aria-hidden="true" />
              Request CV
            </a>
          </Button>
        </div>

        <p className="border-t border-border pt-4 text-[11px] text-muted-foreground">Last updated {lastUpdated}</p>
      </div>
    </div>
  )
}
