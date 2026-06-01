import React, { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

export type GalleryImageItem = {
  id: number | string
  title: string
  desc: string
  url: string
  span: string
}

interface BentoGalleryProps {
  imageItems: GalleryImageItem[]
  title: string
  description: string
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', stiffness: 100, damping: 15 },
  },
}

function ImageModal({ item, onClose }: { item: GalleryImageItem; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 16, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.92, y: 16, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
        className="relative w-full max-w-5xl px-4"
        onClick={e => e.stopPropagation()}
      >
        <img
          src={item.url}
          alt={item.title}
          className="h-auto max-h-[85vh] w-full rounded object-contain"
        />
        <div className="mt-4 text-center">
          <p className="font-display text-2xl text-[#EDE8DC] font-light">{item.title}</p>
          <p className="text-[#A89E8A] text-sm mt-1">{item.desc}</p>
        </div>
      </motion.div>

      <button
        onClick={onClose}
        className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center border border-white/20 text-white/70 hover:text-white hover:border-white/50 transition-all duration-200 rounded-sm"
        aria-label="Tutup"
      >
        <X size={16} />
      </button>
    </motion.div>
  )
}

export default function BentoGallery({ imageItems, title, description }: BentoGalleryProps) {
  const [selectedItem, setSelectedItem] = useState<GalleryImageItem | null>(null)
  const [dragConstraint, setDragConstraint] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const calc = () => {
      if (gridRef.current && containerRef.current) {
        const gap = containerRef.current.offsetWidth - gridRef.current.scrollWidth - 32
        setDragConstraint(Math.min(0, gap))
      }
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [imageItems])

  const { scrollYProgress } = useScroll({ target: targetRef, offset: ['start end', 'end start'] })
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.15], [32, 0])

  return (
    <section ref={targetRef} className="w-full overflow-hidden">
      {/* Header */}
      <motion.div style={{ opacity, y }} className="layout mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-10 bg-[#C4A35A]" />
              <span className="text-[#C4A35A] text-[10px] tracking-[0.32em] uppercase font-body">Portfolio</span>
            </div>
            <h2 className="font-display text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[0.95] text-[#EDE8DC] font-light tracking-[-0.02em]">
              {title.split(' ').map((word, i) => (
                <span key={i}>
                  {i === 1 ? <em className="not-italic text-[#C4A35A]">{word}</em> : word}
                  {i < title.split(' ').length - 1 ? <br /> : ''}
                </span>
              ))}
            </h2>
          </div>
          <p className="text-[#A89E8A] text-sm leading-relaxed max-w-xs font-light">{description}</p>
        </div>
      </motion.div>

      {/* Drag-to-scroll bento grid */}
      <div ref={containerRef} className="relative w-full cursor-grab active:cursor-grabbing select-none">
        <motion.div
          className="w-max"
          drag="x"
          dragConstraints={{ left: dragConstraint, right: 0 }}
          dragElastic={0.04}
          whileTap={{ cursor: 'grabbing' }}
        >
          <motion.div
            ref={gridRef}
            className="grid auto-cols-[minmax(16rem,1fr)] grid-flow-col gap-3 px-[max(1rem,calc(30vw-570px))]"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {imageItems.map(item => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className={cn(
                  'group relative flex h-full min-h-[15rem] w-full min-w-[16rem] cursor-pointer items-end overflow-hidden p-5',
                  item.span,
                )}
                whileHover={{ scale: 1.015 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                onClick={() => setSelectedItem(item)}
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setSelectedItem(item)}
                aria-label={`Lihat ${item.title}`}
              >
                {/* Image */}
                <img
                  src={item.url}
                  alt={item.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                />

                {/* Always-visible bottom gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[#C4A35A]/0 group-hover:bg-[#C4A35A]/8 transition-colors duration-500 mix-blend-screen" />

                {/* Info — slides up on hover */}
                <div className="relative z-10 translate-y-2 group-hover:translate-y-0 transition-transform duration-400">
                  <p className="text-[#C4A35A] text-[10px] tracking-[0.24em] uppercase mb-1">{item.desc}</p>
                  <h3 className="font-display text-xl text-[#EDE8DC] font-medium leading-tight">{item.title}</h3>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Fade hints for drag indication */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-linear-to-r from-[#0C0B09] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-linear-to-l from-[#0C0B09] to-transparent" />
      </div>

      {/* Drag hint */}
      <p className="text-center text-[#6B6358] text-[10px] tracking-[0.24em] uppercase mt-5">
        Drag untuk jelajahi · Klik untuk perbesar
      </p>

      <AnimatePresence>
        {selectedItem && (
          <ImageModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}
