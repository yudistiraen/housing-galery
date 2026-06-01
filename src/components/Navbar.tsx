import { useState, useEffect } from 'react'

interface NavbarProps {
  onOrder: () => void
}

const NAV_LINKS = [
  { label: 'Galeri', id: 'gallery' },
  { label: 'Kontak', id: 'contact' },
]

export default function Navbar({ onOrder }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-charcoal/95 backdrop-blur-md border-b border-[rgba(196,163,90,0.08)]' : 'bg-transparent'
    }`}>
      <div className="layout py-5 flex items-center justify-between m-auto">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2.5 group focus-visible:outline-none"
        >
          <div className="relative w-7 h-7 border border-gold rotate-45 flex items-center justify-center shrink-0 group-hover:border-gold-light transition-colors duration-300">
            <div className="w-3 h-3 bg-gold -rotate-45 group-hover:bg-gold-light transition-colors duration-300" />
          </div>
          <span className="font-display text-[1.15rem] text-cream tracking-[0.18em] uppercase font-light leading-none">
            Ruma Studio
          </span>
        </button>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(link => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="text-stone hover:text-gold text-[11px] tracking-[0.22em] uppercase font-body font-light transition-colors duration-300 focus-visible:outline-none focus-visible:text-gold"
            >
              {link.label}
            </button>
          ))}
        </div>


        <button
          onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
          className="md:hidden flex flex-col gap-1.5 p-1 focus-visible:outline-none"
        >
          <span className={`block w-6 h-px bg-cream transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-1.75' : ''}`} />
          <span className={`block w-6 h-px bg-cream transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-px bg-cream transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-1.75' : ''}`} />
        </button>
      </div>

      <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-80' : 'max-h-0'} bg-charcoal/98 backdrop-blur-md border-t border-[rgba(196,163,90,0.08)]`}>
        <div className="px-6 py-4 flex flex-col">
          {NAV_LINKS.map(link => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="text-left py-3.5 text-stone hover:text-gold text-[11px] tracking-[0.22em] uppercase border-b border-[rgba(196,163,90,0.06)] last:border-0 transition-colors duration-200 focus-visible:outline-none"
            >
              {link.label}
            </button>
          ))}
          
        </div>
      </div>
    </nav>
  )
}
