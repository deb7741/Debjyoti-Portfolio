"use client"

import * as React from "react"
import { MotionConfig } from "framer-motion"
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes"

/**
 * App-wide client providers.
 * `reducedMotion="user"` makes every framer-motion animation respect the
 * visitor's OS "reduce motion" setting (transforms are skipped, fades remain).
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </NextThemesProvider>
  )
}
