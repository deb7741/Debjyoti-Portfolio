/** @type {import('next').NextConfig} */
const nextConfig = {
  // Type errors now fail the build instead of being silently shipped.
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // Tree-shake icon and animation imports so only what's used is bundled.
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
}

export default nextConfig
