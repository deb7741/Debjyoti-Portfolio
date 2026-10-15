"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  // resolvedTheme is "light" | "dark" even when the stored theme is "system",
  // so the icon is always correct.
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === "dark"
  const label = mounted ? `Switch to ${isDark ? "light" : "dark"} theme` : "Toggle theme"

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9 text-muted-foreground hover:text-foreground"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={label}
      title={label}
    >
      {mounted && (isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />)}
    </Button>
  )
}
