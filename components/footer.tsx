import { profile } from "@/lib/content"

// Server component: no JS shipped for the footer.
export function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>
          © {new Date().getFullYear()} {profile.name}. All rights reserved.
        </p>
        <p className="text-center sm:text-right">
          {profile.role}, {profile.affiliation.replace(/ \(IISc\), Bangalore$/, "")}
        </p>
      </div>
    </footer>
  )
}
