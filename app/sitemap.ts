import type { MetadataRoute } from "next"
import { getSiteUrl } from "@/lib/content"

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${getSiteUrl()}/`, changeFrequency: "monthly", priority: 1 }]
}
