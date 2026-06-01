import { formatRupiah, PACKAGES } from '../lib/payment'

interface PackagesProps {
  onOrder: (pkg: string) => void
}

const PKG_LIST = [
  {
    id: 'basic' as const, tagline: 'Mulai dari sini', popular: false,
    features: ['Denah lantai 2D','Tampak fasad depan & samping','Tampak potongan','2× revisi desain','Konsultasi via WhatsApp'],
  },
  {
    id: 'standard' as const, tagline: 'Pilihan terpopuler', popular: true,
    features: ['Semua fitur Paket Dasar','Visualisasi 3D eksterior','Rencana Anggaran Biaya','Desain interior 2 ruang','5× revisi desain','Konsultasi intensif 1 bulan'],
  },
  {
    id: 'premium' as const, tagline: 'Pengalaman penuh', popular: false,
    features: ['Semua fitur Paket Standar','3D walkthrough video','Desain interior seluruh ruang','Spesifikasi material detail','Revisi tak terbatas','Supervisi proyek 3 bulan','Prioritas respons 24 jam'],
  },
]

export default function Packages({ onOrder }: PackagesProps) {
  return (
    <section id="packages" className="py-24 relative">
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[rgba(196,163,90,0.18)] to-transparent" />

      <div className="layout">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-10 bg-gold" />
            <span className="text-gold text-[10px] tracking-[0.32em] uppercase font-body">Harga Transparan</span>
            <div className="h-px w-10 bg-gold" />
          </div>
          <h2 className="font-display text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[0.95] text-cream font-light tracking-[-0.02em]">
            Pilih <em className="not-italic text-gold">Paket</em> Anda
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PKG_LIST.map(item => {
            const pkg = PACKAGES[item.id]
            return (
              <div
                key={item.id}
                className={`relative flex flex-col border transition-all duration-300 ${
                  item.popular
                    ? 'border-gold bg-surface'
                    : 'border-[rgba(196,163,90,0.12)] bg-[#0F0E0B] hover:border-[rgba(196,163,90,0.28)] hover:bg-surface'
                }`}
              >
                {item.popular && <div className="absolute inset-x-0 -top-px h-[1.5px] bg-linear-to-r from-transparent via-gold to-transparent" />}
                {item.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-gold text-charcoal text-[9px] tracking-[0.22em] uppercase font-body font-semibold px-3.5 py-1 whitespace-nowrap">
                      Terpopuler
                    </span>
                  </div>
                )}
                <div className="p-8 flex-1 flex flex-col">
                  <div className="mb-6">
                    <div className="text-muted text-[10px] tracking-[0.24em] uppercase mb-2">{item.tagline}</div>
                    <h3 className="font-display text-2xl text-cream font-light mb-4">{pkg.name}</h3>
                    <div className="font-display text-[2.4rem] text-gold font-light leading-none">{formatRupiah(pkg.amount)}</div>
                    <div className="text-muted text-[11px] mt-1.5">{pkg.description}</div>
                  </div>
                  <ul className="space-y-2.5 mb-8 flex-1">
                    {item.features.map(feat => (
                      <li key={feat} className="flex items-start gap-2.5 text-sm text-stone">
                        <span className="text-gold shrink-0 mt-0.5 text-xs">✓</span>
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => onOrder(item.id)}
                    className={`w-full py-3.5 text-[11px] tracking-[0.22em] uppercase font-body font-medium transition-all duration-300 active:scale-[0.97] focus-visible:outline-none ${
                      item.popular
                        ? 'bg-gold text-charcoal hover:bg-gold-light'
                        : 'border border-[rgba(196,163,90,0.3)] text-gold hover:bg-gold hover:text-charcoal hover:border-gold'
                    }`}
                  >
                    Pilih Paket Ini
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <p className="text-center text-muted text-[11px] tracking-wide mt-8">
          Harga dapat bervariasi sesuai kompleksitas proyek · Konsultasi awal gratis
        </p>
      </div>
    </section>
  )
}
