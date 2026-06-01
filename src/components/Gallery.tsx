const PROJECTS = [
  { id: 1, title: 'Villa Seminyak',     tag: 'Modern Tropis',     year: '2024', img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=900&q=80', wide: true  },
  { id: 2, title: 'Rumah Bukit Dago',   tag: 'Minimalis',         year: '2024', img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=700&q=80', wide: false },
  { id: 3, title: 'Hunian Pondok Indah',tag: 'Kontemporer',       year: '2023', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=700&q=80', wide: false },
  { id: 4, title: 'Residensi Kemang',   tag: 'Industrial Modern', year: '2023', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=700&q=80', wide: false },
  { id: 5, title: 'Casa de Sentul',     tag: 'Tropical Retreat',  year: '2023', img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80', wide: true  },
  { id: 6, title: 'Interior Kebayoran', tag: 'Skandinavia',       year: '2024', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=700&q=80', wide: false },
]

export default function Gallery() {
  return (
    <section id="gallery" className="py-24 relative">
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[rgba(196,163,90,0.18)] to-transparent" />

      <div className="layout">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-10 bg-gold" />
              <span className="text-gold text-[10px] tracking-[0.32em] uppercase font-body">Portfolio</span>
            </div>
            <h2 className="font-display text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[0.95] text-cream font-light tracking-[-0.02em]">
              Karya<br />
              <em className="not-italic text-gold">Terpilih</em>
            </h2>
          </div>
          <p className="text-stone text-sm leading-relaxed max-w-xs font-light">
            Setiap proyek adalah dialog antara arsitektur dan kehidupan yang akan berlangsung di dalamnya.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PROJECTS.map(project => (
            <div
              key={project.id}
              className={`relative group overflow-hidden ${project.wide ? 'md:col-span-2' : 'md:col-span-1'}`}
              style={{ aspectRatio: project.wide ? '16/9' : '4/3' }}
            >
              <img src={project.img} alt={project.title} loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]" />
              <div className="absolute inset-0 bg-linear-to-t from-charcoal/90 via-charcoal/20 to-transparent" />
              <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/5 transition-colors duration-500 mix-blend-screen" />
              <div className="absolute inset-x-0 bottom-0 p-6 translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-gold text-[10px] tracking-[0.24em] uppercase mb-1.5">{project.tag}</div>
                    <h3 className="font-display text-xl text-cream font-medium">{project.title}</h3>
                  </div>
                  <div className="text-muted text-[11px] tracking-widest font-body">{project.year}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
