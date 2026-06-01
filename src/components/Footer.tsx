const NAV_LINKS = [
  { label: 'Layanan', id: 'services' },
  { label: 'Galeri', id: 'gallery' },
  { label: 'Paket', id: 'packages' },
  { label: 'Kontak', id: 'contact' },
]

export default function Footer() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <footer id="contact" className="border-t border-[rgba(196,163,90,0.08)] py-16">
      <div className="layout">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-7 h-7 border border-gold rotate-45 flex items-center justify-center shrink-0">
                <div className="w-3 h-3 bg-gold -rotate-45" />
              </div>
              <span className="font-display text-[1.15rem] text-cream tracking-[0.18em] uppercase font-light">
                Ruma Studio
              </span>
            </div>
            <p className="text-muted text-sm leading-relaxed max-w-60">
              Studio arsitektur dan desain interior yang mengutamakan estetika berkelanjutan dan fungsionalitas.
            </p>
            <div className="flex gap-4 mt-6">
              {['Instagram', 'Pinterest', 'Houzz'].map(s => (
                <span key={s} className="text-muted text-[10px] tracking-wide hover:text-gold transition-colors duration-200 cursor-pointer">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-cream text-[10px] tracking-[0.24em] uppercase mb-5">Hubungi Kami</h4>
            <div className="space-y-3 text-sm">
              <div className="text-stone">studio@rumastudio.id</div>
              <div className="text-stone">+62 812-3456-7890</div>
              <div className="text-muted leading-relaxed">Jl. Kemang Raya No. 88<br />Jakarta Selatan, 12730</div>
            </div>
          </div>

          <div>
            <h4 className="text-cream text-[10px] tracking-[0.24em] uppercase mb-5">Navigasi</h4>
            <div className="space-y-3">
              {NAV_LINKS.map(link => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className="block text-stone text-sm hover:text-gold transition-colors duration-200 focus-visible:outline-none"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[rgba(196,163,90,0.06)] flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="text-muted text-[11px]">© 2024 Ruma Studio. Seluruh hak cipta dilindungi.</div>
          <div className="text-[#3A3830] text-[11px]">Hak cipta desain dilindungi undang-undang</div>
        </div>
      </div>
    </footer>
  )
}
