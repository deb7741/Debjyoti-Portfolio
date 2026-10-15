import { ImageResponse } from "next/og"
import { profile } from "@/lib/content"

// Generated at build time: the preview card shown when the site is shared
// on LinkedIn, X, WhatsApp, Slack, etc.
export const alt = `${profile.name} — ${profile.headline}`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #14111f 0%, #1f1833 60%, #2a1f4a 100%)",
          color: "#f2f0fa",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            fontSize: 26,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#a78bfa",
            fontFamily: "sans-serif",
          }}
        >
          {`${profile.role} • ${profile.affiliationShort}`}
        </div>
        <div style={{ fontSize: 96, fontWeight: 600, marginTop: 24 }}>{profile.name}</div>
        <div style={{ fontSize: 36, marginTop: 24, color: "#c4bcd9", fontFamily: "sans-serif" }}>
          {profile.focusAreas.join("  •  ")}
        </div>
      </div>
    ),
    size,
  )
}
