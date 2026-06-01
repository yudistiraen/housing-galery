import BentoGallery from './ui/bento-gallery'
import type { GalleryImageItem } from './ui/bento-gallery'

const GALLERY_ITEMS: GalleryImageItem[] = [
  {
    id: 1,
    title: 'Villa Seminyak',
    desc: 'Modern Tropis · 2024',
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80',
    span: 'md:col-span-2 md:row-span-2',
  },
  {
    id: 2,
    title: 'Rumah Bukit Dago',
    desc: 'Minimalis · 2024',
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=700&q=80',
    span: 'md:row-span-1',
  },
  {
    id: 3,
    title: 'Hunian Pondok Indah',
    desc: 'Kontemporer · 2023',
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=700&q=80',
    span: 'md:row-span-1',
  },
  {
    id: 4,
    title: 'Residensi Kemang',
    desc: 'Industrial Modern · 2023',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=700&q=80',
    span: 'md:row-span-2',
  },
  {
    id: 5,
    title: 'Casa de Sentul',
    desc: 'Tropical Retreat · 2023',
    url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80',
    span: 'md:row-span-1',
  },
  {
    id: 6,
    title: 'Interior Kebayoran',
    desc: 'Skandinavia · 2024',
    url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=700&q=80',
    span: 'md:col-span-2 md:row-span-1',
  },
  {
    id: 7,
    title: 'Rumah Bukit Dago',
    desc: 'Minimalis · 2024',
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=700&q=80',
    span: 'md:row-span-1',
  },
]

export default function Gallery() {
  return (
    <section id="gallery" className="py-24 relative">
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[rgba(196,163,90,0.18)] to-transparent" />
      <BentoGallery
        imageItems={GALLERY_ITEMS}
        title="Karya Terpilih"
        description="Setiap proyek adalah dialog antara arsitektur dan kehidupan yang akan berlangsung di dalamnya."
      />
    </section>
  )
}
