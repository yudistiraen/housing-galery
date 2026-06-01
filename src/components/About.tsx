import PolaroidStack from './ui/polaroid-flick-through'
import type { PolaroidImage } from './ui/polaroid-flick-through'

const PHOTOS: PolaroidImage[] = [
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&h=800&fit=crop',
    alt: 'Blueprint & konsep',
  },
  {
    id: '2',
    src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=800&fit=crop',
    alt: 'Villa Seminyak',
  },
  {
    id: '3',
    src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=800&fit=crop',
    alt: 'Luxury retreat',
  },
  {
    id: '4',
    src: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=800&fit=crop',
    alt: 'Interior modern',
  },
  {
    id: '5',
    src: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=800&fit=crop',
    alt: 'Fasad kontemporer',
  },
]

export default function About() {
  return (
    <section id="about" className="py-24 relative">
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[rgba(196,163,90,0.18)] to-transparent" />

      <div className="layout">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left — polaroid stack */}
          <div className="relative">
            <PolaroidStack images={PHOTOS} seed={2024} />
          </div>

          {/* Right — description */}
          <div>
            {/* Eyebrow */}
            <div className="flex items-center gap-4 mb-7">
              <div className="h-px w-10 bg-gold" />
              <span className="text-gold text-[10px] tracking-[0.32em] uppercase font-body">
                Tentang Kami
              </span>
            </div>

            {/* Heading */}
            <h2 className="font-display text-[clamp(2.2rem,4.5vw,3.8rem)] leading-[1.05] text-cream font-light tracking-[-0.02em] mb-7">
              Membangun Ruang,<br />
              <em className="not-italic text-gold">Mendefinisikan</em><br />
              Kehidupan
            </h2>

            {/* Body text */}
            <div className="space-y-4 mb-10">
              <p className="text-stone text-[0.95rem] leading-[1.8]">
                Ruma Studio adalah studio arsitektur dan desain interior yang berdiri sejak 2016.
                Kami percaya bahwa sebuah rumah bukan hanya struktur fisik, melainkan cerminan nilai,
                kepribadian, dan aspirasi penghuninya.
              </p>
              <p className="text-muted text-[0.9rem] leading-[1.8]">
                Dengan pendekatan yang berpusat pada manusia dan memperhatikan setiap detail,
                tim kami menghadirkan desain yang fungsional sekaligus estetis — menciptakan
                ruang yang benar-benar terasa seperti rumah.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
