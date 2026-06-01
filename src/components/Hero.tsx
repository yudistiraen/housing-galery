interface HeroProps {
  onOrder: () => void
}

const STATS = [
  { num: '150+', label: 'Proyek Selesai' },
  { num: '8+',   label: 'Tahun Pengalaman' },
  { num: '98%',  label: 'Klien Puas' },
]

export default function Hero({ onOrder }: HeroProps) {
  const scrollToGallery = () =>
    document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80')",
          animation: 'heroZoom 20s ease-in-out infinite alternate',
        }}
      />
      <style>{`@keyframes heroZoom { from { transform: scale(1.05); } to { transform: scale(1); } }`}</style>

      <div className="absolute inset-0 bg-linear-to-r from-charcoal via-charcoal/88 to-charcoal/35" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-charcoal to-transparent" />
      <div className="absolute top-1/3 right-[22%] w-px h-32 bg-linear-to-b from-transparent via-[rgba(196,163,90,0.35)] to-transparent hidden lg:block" />

      {/* Content — centered via .layout */}
      <div className="layout pt-28 pb-24 relative z-10">
        <div className="max-w-150" style={{ animation: 'fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) both' }}>

          <div className="flex items-center gap-4 mb-9">
            <div className="h-px w-10 bg-gold" />
            <span className="text-gold text-[10px] tracking-[0.32em] uppercase font-body">
              Studio Arsitektur &amp; Desain
            </span>
          </div>

          <h1 className="font-display text-[clamp(3.6rem,8.5vw,7.2rem)] leading-[0.9] text-cream font-light tracking-tight mb-7">
            Arsitektur<br />
            <em className="not-italic text-gold">yang</em><br />
            Bercerita
          </h1>

          <p className="text-stone text-[1.05rem] leading-[1.75] mb-11 max-w-120 font-light">
            Kami menghadirkan desain rumah yang bukan sekadar estetika —
            tetapi ruang yang mencerminkan siapa Anda dan cara Anda hidup.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onOrder}
              className="group flex items-center gap-3 px-8 py-4 bg-gold text-charcoal text-[11px] tracking-[0.22em] uppercase font-body font-semibold hover:bg-gold-light active:scale-[0.97] transition-all duration-300 focus-visible:outline-none"
            >
              Mulai Konsultasi
              <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
            </button>
            <button
              onClick={scrollToGallery}
              className="flex items-center gap-3 px-8 py-4 border border-[rgba(196,163,90,0.3)] text-stone text-[11px] tracking-[0.22em] uppercase hover:border-gold hover:text-gold active:scale-[0.97] transition-all duration-300 focus-visible:outline-none"
            >
              Lihat Galeri
            </button>
          </div>

          <div className="flex gap-10 mt-14 pt-10 border-t border-[rgba(196,163,90,0.1)]">
            {STATS.map(s => (
              <div key={s.label}>
                <div className="font-display text-[2rem] text-cream font-light leading-none">{s.num}</div>
                <div className="text-muted text-[10px] tracking-[0.24em] uppercase mt-1.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5">
        <span className="text-muted text-[9px] tracking-[0.3em] uppercase">Scroll</span>
        <div className="w-px h-10 bg-linear-to-b from-[rgba(196,163,90,0.6)] to-transparent animate-pulse" />
      </div>
    </section>
  )
}
