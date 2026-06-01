import * as React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

export interface PolaroidImage {
  src: string
  alt: string
  id: string
}

interface ScatterPosition {
  x: number
  y: number
  rotation: number
  scale: number
}

interface ImageStackProps {
  images: PolaroidImage[]
  maxRotation?: number
  scatterRadius?: number
  seed?: number
  className?: string
}

type SpringConfig = { type: 'spring'; stiffness: number; damping: number }
type TweenConfig  = { type: 'tween';  duration: number }
type AnimConfig   = SpringConfig | TweenConfig

class SeededRandom {
  private seed: number
  constructor(seed: number) { this.seed = seed }
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280
    return this.seed / 233280
  }
  range(min: number, max: number): number {
    return min + this.next() * (max - min)
  }
}

const containerVariants = {
  hidden: {},
  visible: { transition: { delayChildren: 0, staggerChildren: 1.2 } },
}

const cardVariants = {
  hidden: (custom: { zIndex: number }) => ({
    x: 0, y: 0, rotate: 0, scale: 1, zIndex: custom.zIndex,
  }),
  visible: (custom: { position: ScatterPosition; zIndex: number; springConfig: AnimConfig }) => ({
    x: custom.position.x,
    y: custom.position.y,
    rotate: custom.position.rotation,
    scale: custom.position.scale,
    zIndex: custom.zIndex,
    transition: custom.springConfig,
  }),
}

export default function PolaroidStack({
  images,
  maxRotation = 14,
  scatterRadius = 28,
  seed = 42,
  className = '',
}: ImageStackProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const [imagesLoaded, setImagesLoaded] = React.useState(false)
  const [scatterPositions, setScatterPositions] = React.useState<ScatterPosition[]>([])
  const [currentSeed, setCurrentSeed] = React.useState(seed)

  const containerRef = React.useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const generatePositions = React.useCallback((s: number) => {
    const rng = new SeededRandom(s)
    return images.map(() => ({
      x: rng.range(-90, -50),
      y: rng.range(-scatterRadius, scatterRadius),
      rotation: rng.range(-maxRotation, maxRotation),
      scale: rng.range(0.96, 1.04),
    }))
  }, [images, scatterRadius, maxRotation])

  React.useEffect(() => {
    const preload = async () => {
      await Promise.allSettled(
        images.map(img => new Promise<void>(resolve => {
          const el = new Image()
          el.onload = el.onerror = () => resolve()
          el.src = img.src
        }))
      )
      setImagesLoaded(true)
    }
    preload()
  }, [images])

  React.useEffect(() => {
    setScatterPositions(generatePositions(currentSeed))
  }, [currentSeed, generatePositions])

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && imagesLoaded) setIsVisible(true) },
      { threshold: 0.25 }
    )
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [imagesLoaded])

  const handleReshuffle = () => {
    setCurrentSeed(Math.floor(Math.random() * 1_000_000))
    setIsVisible(false)
    setTimeout(() => setIsVisible(true), 80)
  }

  const springConfig: AnimConfig = prefersReducedMotion
    ? { type: 'tween', duration: 0.3 }
    : { type: 'spring', stiffness: 90, damping: 18 }

  return (
    <div
      className={`relative w-full h-[520px] flex items-center justify-center overflow-hidden cursor-pointer ${className}`}
      onClick={handleReshuffle}
      title="Klik untuk acak ulang"
    >
      <motion.div
        ref={containerRef}
        className="relative w-full h-full"
        style={{ perspective: '1000px' }}
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? 'visible' : 'hidden'}
      >
        {images.map((image, index) => {
          const position = scatterPositions[index]
          if (!position) return null

          return (
            <motion.div
              key={`${image.id}-${currentSeed}`}
              className="absolute"
              variants={cardVariants}
              custom={{ position, zIndex: images.length - index, springConfig }}
              style={{
                left: '50%',
                top: '50%',
                marginLeft: '-100px',
                marginTop: '-135px',
              }}
            >
              {/* White polaroid frame */}
              <div className="bg-white p-3 pb-8 shadow-[0_4px_24px_rgba(0,0,0,0.35)] border border-neutral-200/80">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-[200px] h-[260px] object-cover"
                  loading="lazy"
                />
                <p className="mt-2 text-center text-[11px] text-neutral-500 font-['Inter'] tracking-wide">
                  {image.alt}
                </p>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Hint text */}
      <p className="absolute bottom-3 left-0 right-0 text-center text-[#6B6358] text-[9px] tracking-[0.25em] uppercase pointer-events-none">
        Klik untuk acak
      </p>
    </div>
  )
}
