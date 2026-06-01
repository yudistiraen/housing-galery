const SERVICES = [
  {
    num: '01',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    title: 'Desain Konsep',
    desc: 'Eksplorasi ide awal melalui sketsa, moodboard, dan konsep ruang yang sesuai visi dan gaya hidup Anda.',
    tags: ['Denah 2D', 'Tampak fasad', 'Moodboard'],
  },
  {
    num: '02',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
      </svg>
    ),
    title: 'Render 3D',
    desc: 'Visualisasi tiga dimensi realistis agar Anda dapat melihat dan merasakan rumah sebelum dibangun.',
    tags: ['Eksterior 3D', 'Interior 3D', 'Walkthrough'],
  },
  {
    num: '03',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    title: 'Desain Interior',
    desc: 'Penataan ruang dalam yang harmonis — dari pemilihan material, furnitur, hingga pencahayaan yang tepat.',
    tags: ['Layout furnitur', 'Skema warna', 'Lighting plan'],
  },
  {
    num: '04',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
    title: 'Supervisi Proyek',
    desc: 'Pengawasan langsung di lapangan untuk memastikan setiap detail pembangunan sesuai gambar kerja.',
    tags: ['Kunjungan lapangan', 'RAB', 'Progress report'],
  },
]

export default function Services() {
  return (
    <section id="services" className="py-24 relative">
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[rgba(196,163,90,0.18)] to-transparent" />

      <div className="layout">
        <div className="mb-14 max-w-xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-10 bg-gold" />
            <span className="text-gold text-[10px] tracking-[0.32em] uppercase font-body">Apa yang Kami Tawarkan</span>
          </div>
          <h2 className="font-display text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[0.95] text-cream font-light tracking-[-0.02em]">
            Layanan<br />
            <em className="not-italic text-gold">Lengkap</em> Kami
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[rgba(196,163,90,0.08)]">
          {SERVICES.map(svc => (
            <div
              key={svc.num}
              className="bg-charcoal p-8 lg:p-9 group hover:bg-surface transition-colors duration-500"
            >
              <div className="font-display text-[4rem] text-[rgba(196,163,90,0.12)] leading-none mb-6 select-none">
                {svc.num}
              </div>
              <div className="text-gold mb-5 transition-transform duration-300 group-hover:scale-110 origin-left">
                {svc.icon}
              </div>
              <h3 className="font-display text-xl text-cream font-medium mb-3">{svc.title}</h3>
              <p className="text-stone text-[0.875rem] leading-relaxed mb-6">{svc.desc}</p>
              <div className="flex flex-wrap gap-1.5 pt-5 border-t border-[rgba(196,163,90,0.07)]">
                {svc.tags.map(t => (
                  <span key={t} className="text-muted text-[10px] tracking-wide">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
