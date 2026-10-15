"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"
import Image from "next/image"

export interface GalleryImage {
  id: string
  src: string
  alt: string
  caption?: string
}

interface ImageGalleryProps {
  images: GalleryImage[]
  projectId: string
}

export function ImageGallery({ images, projectId }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (selectedIndex === null) return
      if (e.key === "Escape") {
        setSelectedIndex(null)
      } else if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) =>
          prev !== null ? (prev - 1 + images.length) % images.length : null
        )
      } else if (e.key === "ArrowRight") {
        setSelectedIndex((prev) =>
          prev !== null ? (prev + 1) % images.length : null
        )
      }
    },
    [selectedIndex, images.length]
  )

  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = "hidden"
      window.addEventListener("keydown", handleKeyDown)
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [selectedIndex, handleKeyDown])

  if (images.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        <p>Images coming soon</p>
        <p className="text-xs mt-1">Gallery supports: layouts, waveforms, lab photos, simulations</p>
      </div>
    )
  }

  return (
    <>
      {/* Gallery Grid */}
      <div
        className={`grid gap-2 ${
          images.length === 1
            ? "grid-cols-1"
            : images.length === 2
              ? "grid-cols-2"
              : "grid-cols-2 md:grid-cols-3"
        }`}
      >
        {images.map((image, index) => (
          <motion.button
            key={`${projectId}-${image.id}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            type="button"
            onClick={() => setSelectedIndex(index)}
            aria-label={`Open image: ${image.alt}`}
            className="group relative aspect-video bg-secondary/50 rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-all"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 33vw"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <ZoomIn className="h-6 w-6 text-foreground" />
            </div>
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-background/80 to-transparent">
                <p className="text-xs text-foreground/80 truncate">{image.caption}</p>
              </div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setSelectedIndex(null)}
            role="dialog"
            aria-modal="true"
            aria-label={images[selectedIndex].alt}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute top-4 right-4 p-2 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors z-10"
              aria-label="Close gallery"
            >
              <X className="h-5 w-5 text-foreground" />
            </button>

            {/* Navigation - Previous */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedIndex((prev) =>
                    prev !== null ? (prev - 1 + images.length) % images.length : null
                  )
                }}
                className="absolute left-4 p-2 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6 text-foreground" />
              </button>
            )}

            {/* Image */}
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-[90vw] max-h-[85vh] w-full h-full flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-[70vh]">
                <Image
                  src={images[selectedIndex].src}
                  alt={images[selectedIndex].alt}
                  fill
                  className="object-contain"
                  sizes="90vw"
                />
              </div>
              {images[selectedIndex].caption && (
                <p className="mt-4 text-sm text-muted-foreground text-center max-w-xl">
                  {images[selectedIndex].caption}
                </p>
              )}
              <p className="mt-2 text-xs text-muted-foreground">
                {selectedIndex + 1} / {images.length}
              </p>
            </motion.div>

            {/* Navigation - Next */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedIndex((prev) =>
                    prev !== null ? (prev + 1) % images.length : null
                  )
                }}
                className="absolute right-4 p-2 bg-secondary/50 rounded-lg hover:bg-secondary transition-colors z-10"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6 text-foreground" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Placeholder component for projects without images yet
export function ImageGalleryPlaceholder({ count = 3 }: { count?: number }) {
  return (
    <div className={`grid gap-2 ${count <= 2 ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3"}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="aspect-video bg-secondary/30 rounded-lg border border-dashed border-border flex items-center justify-center"
        >
          <span className="text-xs text-muted-foreground">image-{index + 1}</span>
        </div>
      ))}
    </div>
  )
}
