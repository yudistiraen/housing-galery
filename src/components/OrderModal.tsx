import { useState, useEffect, useId, useCallback } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import {
  createTransaction, PACKAGES, formatRupiah, parseExpiry, BANK_NAMES,
  type OrderData, type PaymentResponse,
} from '../lib/payment'

type PkgKey = keyof typeof PACKAGES
type Step = 'form' | 'payment-method' | 'submitting' | 'payment-info' | 'error'

interface OrderModalProps {
  initialPackage: string
  onClose: () => void
}

const STYLES = ['Modern', 'Minimalis', 'Tropis', 'Klasik', 'Industrial', 'Japandi']
const FLOORS = ['1 Lantai', '2 Lantai', '3+ Lantai']

const PAYMENT_METHODS = [
  {
    group: 'E-Wallet & QRIS',
    items: [
      { id: 'qris',      label: 'QRIS',      sub: 'Scan semua dompet digital', icon: '⬛' },
      { id: 'gopay',     label: 'GoPay',     sub: 'Bayar lewat Gojek',         icon: '🟢' },
      { id: 'shopeepay', label: 'ShopeePay', sub: 'Bayar lewat Shopee',         icon: '🟠' },
    ],
  },
  {
    group: 'Virtual Account',
    items: [
      { id: 'bni_va',        label: 'BNI Virtual Account',        sub: 'Bank Negara Indonesia', icon: '🔵' },
      { id: 'bri_va',        label: 'BRI Virtual Account',        sub: 'Bank Rakyat Indonesia', icon: '🔵' },
      { id: 'permata_va',    label: 'Permata Virtual Account',    sub: 'Bank Permata',          icon: '🔵' },
      { id: 'cimb_niaga_va', label: 'CIMB Niaga Virtual Account', sub: 'Bank CIMB Niaga',       icon: '🔴' },
    ],
  },
]

function isValidPkg(v: string): v is PkgKey {
  return v === 'basic' || v === 'standard' || v === 'premium'
}

/* ── Countdown hook ── */
function useCountdown(expiredAt: string | undefined) {
  const [display, setDisplay] = useState('--:--:--')
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    if (!expiredAt) return

    const target = parseExpiry(expiredAt)

    const tick = () => {
      const diff = target.getTime() - Date.now()
      if (diff <= 0) {
        setDisplay('00:00:00')
        setIsExpired(true)
        return
      }
      const h = Math.floor(diff / 3_600_000)
      const m = Math.floor((diff % 3_600_000) / 60_000)
      const s = Math.floor((diff % 60_000) / 1_000)
      setDisplay(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`)
    }

    tick()
    const id = setInterval(tick, 1_000)
    return () => clearInterval(id)
  }, [expiredAt])

  return { display, isExpired }
}

/* ── QRIS view ── */
function QrisView({ qrString, amount, orderId, expiredAt }: {
  qrString: string; amount: number; orderId: string; expiredAt: string
}) {
  const { display, isExpired } = useCountdown(expiredAt)

  return (
    <div className="flex-1 overflow-y-auto px-8 py-7">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-px w-6 bg-[#C4A35A]" />
        <span className="text-[#C4A35A] text-[10px] tracking-[0.3em] uppercase">Scan & Bayar</span>
      </div>
      <h3 className="font-display text-2xl text-cream font-light mb-6">Pembayaran QRIS</h3>

      {/* QR code */}
      <div className="flex justify-center mb-6">
        <div className="p-6 bg-white inline-block shadow-lg">
          <QRCodeSVG
            value={qrString}
            size={240}
            fgColor="#000000"
            bgColor="#ffffff"
            level="L"
            marginSize={4}
          />
        </div>
        <p className="sr-only">QR Code QRIS untuk pembayaran</p>
      </div>

      {/* Countdown */}
      <div className="text-center mb-6">
        <div className="text-muted text-[10px] tracking-[0.24em] uppercase mb-2">
          {isExpired ? 'Kode Kedaluwarsa' : 'Bayar Dalam'}
        </div>
        <div className={`font-mono text-[2.2rem] font-light tracking-widest ${isExpired ? 'text-red-500' : 'text-gold'}`}>
          {display}
        </div>
      </div>

      {/* Amount + Order ID */}
      <div className="space-y-2.5 mb-6 p-4 border border-[rgba(196,163,90,0.1)] bg-[rgba(196,163,90,0.03)]">
        <div className="flex items-center justify-between">
          <span className="text-muted text-[11px] tracking-wide">Total Pembayaran</span>
          <span className="font-display text-xl text-gold font-light">{formatRupiah(amount)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted text-[11px] tracking-wide">Order ID</span>
          <span className="text-stone text-[11px] font-mono truncate max-w-50">{orderId}</span>
        </div>
      </div>

      {/* Instructions */}
      <div>
        <div className="text-muted text-[10px] tracking-[0.24em] uppercase mb-3">Cara Bayar</div>
        <ol className="space-y-2">
          {[
            'Buka aplikasi GoPay, OVO, DANA, atau e-wallet lainnya',
            'Pilih fitur Scan QR Code',
            'Arahkan kamera ke kode QR di atas',
            'Konfirmasi nominal dan selesaikan pembayaran',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-stone text-sm">
              <span className="text-gold text-[10px] font-mono mt-0.5 shrink-0 w-4">
                {String(i + 1).padStart(2, '0')}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

/* ── Virtual Account view ── */
function VaView({ vaNumber, bank, amount, orderId, expiredAt }: {
  vaNumber: string; bank: string; amount: number; orderId: string; expiredAt: string
}) {
  const { display, isExpired } = useCountdown(expiredAt)
  const [copied, setCopied] = useState(false)

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(vaNumber)
    } catch {
      const el = document.createElement('textarea')
      el.value = vaNumber
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2_000)
  }, [vaNumber])

  const bankName = BANK_NAMES[bank.toLowerCase()] ?? bank.toUpperCase()

  return (
    <div className="flex-1 overflow-y-auto px-8 py-7">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-px w-6 bg-gold" />
        <span className="text-gold text-[10px] tracking-[0.3em] uppercase">Virtual Account</span>
      </div>
      <h3 className="font-display text-2xl text-cream font-light mb-1">Transfer ke {bankName}</h3>
      <p className="text-stone text-sm mb-7">Lakukan transfer tepat sesuai nominal berikut.</p>

      {/* VA Number */}
      <div className="mb-6">
        <div className="text-muted text-[10px] tracking-[0.24em] uppercase mb-2.5">Nomor Virtual Account</div>
        <div className="flex items-center gap-3 p-4 border border-[rgba(196,163,90,0.2)] bg-[rgba(196,163,90,0.04)]">
          <span className="font-mono text-cream text-xl tracking-widest flex-1 select-all">
            {vaNumber}
          </span>
          <button
            onClick={copy}
            className={`shrink-0 px-3 py-1.5 border text-[10px] tracking-[0.2em] uppercase transition-all duration-200 focus-visible:outline-none ${
              copied
                ? 'border-emerald-600 text-emerald-400 bg-emerald-950/20'
                : 'border-[rgba(196,163,90,0.3)] text-gold hover:border-gold hover:bg-[rgba(196,163,90,0.08)]'
            }`}
          >
            {copied ? '✓ Disalin' : 'Salin'}
          </button>
        </div>
      </div>

      {/* Countdown */}
      <div className="text-center mb-6 py-4 border border-[rgba(196,163,90,0.08)]">
        <div className="text-muted text-[10px] tracking-[0.24em] uppercase mb-1.5">
          {isExpired ? 'Waktu Habis' : 'Bayar Sebelum'}
        </div>
        <div className={`font-mono text-[2.2rem] font-light tracking-widest ${isExpired ? 'text-red-500' : 'text-gold'}`}>
          {display}
        </div>
      </div>

      {/* Amount + Order ID */}
      <div className="space-y-2.5 mb-6 p-4 border border-[rgba(196,163,90,0.1)] bg-[rgba(196,163,90,0.03)]">
        <div className="flex items-center justify-between">
          <span className="text-muted text-[11px] tracking-wide">Total Pembayaran</span>
          <span className="font-display text-xl text-gold font-light">{formatRupiah(amount)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted text-[11px] tracking-wide">Order ID</span>
          <span className="text-stone text-[11px] font-mono truncate max-w-50">{orderId}</span>
        </div>
      </div>

      {/* Instructions */}
      <div>
        <div className="text-muted text-[10px] tracking-[0.24em] uppercase mb-3">Cara Bayar</div>
        <ol className="space-y-2">
          {[
            `Buka aplikasi mobile banking ${bankName}`,
            'Pilih Transfer → Virtual Account',
            `Masukkan nomor VA ${bankName} di atas`,
            'Periksa nominal, lalu konfirmasi pembayaran',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-stone text-sm">
              <span className="text-gold text-[10px] font-mono mt-0.5 shrink-0 w-4">
                {String(i + 1).padStart(2, '0')}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

/* ── Main modal ── */
export default function OrderModal({ initialPackage, onClose }: OrderModalProps) {
  const formId = useId()
  const initPkg: PkgKey = isValidPkg(initialPackage) ? initialPackage : 'standard'

  const [selectedPkg, setSelectedPkg] = useState<PkgKey>(initPkg)
  const [step, setStep] = useState<Step>('form')
  const [errorMsg, setErrorMsg] = useState('')
  const [paymentResult, setPaymentResult] = useState<PaymentResponse | null>(null)
  const [showCloseConfirm, setShowCloseConfirm] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    landSize: '', floors: '1 Lantai', style: 'Modern', notes: '',
  })

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const set = <K extends keyof typeof form>(key: K, val: string) =>
    setForm(f => ({ ...f, [key]: val }))

  const handleCloseRequest = () => {
    if (step === 'form') {
      onClose()
    } else {
      setShowCloseConfirm(true)
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setStep('payment-method')
  }

  const handlePaymentMethodSelect = async (paymentType: string) => {
    setStep('submitting')
    try {
      const order: OrderData = {
        name: form.name, email: form.email, phone: form.phone,
        package: selectedPkg, landSize: form.landSize,
        floors: form.floors, style: form.style,
        notes: form.notes, paymentType,
      }
      const result = await createTransaction(order)
      setPaymentResult(result)
      setStep('payment-info')
    } catch (err) {
      setStep('error')
      setErrorMsg(err instanceof Error ? err.message : 'Terjadi kesalahan. Silakan coba lagi.')
    }
  }

  const pkg = PACKAGES[selectedPkg]
  const payment = paymentResult?.payment
  const isQris = payment?.qr_string != null
  const isVa = payment?.va_number != null

  return (
    <div className="fixed inset-0 z-100 flex items-stretch">
      {/* Backdrop — no click-to-close */}
      <div
        className="absolute inset-0 bg-charcoal/75 backdrop-blur-[6px]"
        style={{ animation: 'fadeIn 0.3s ease-out both' }}
      />

      {/* Panel */}
      <div
        className="relative ml-auto w-full max-w-160 bg-[#111009] border-l border-[rgba(196,163,90,0.1)] flex flex-col h-full"
        style={{ animation: 'slideInRight 0.42s cubic-bezier(0.16,1,0.3,1) both' }}
      >
        {/* Close button */}
        <button
          onClick={handleCloseRequest}
          aria-label="Tutup"
          className="absolute top-5 right-5 z-10 w-9 h-9 flex items-center justify-center border border-[rgba(196,163,90,0.15)] text-muted hover:text-cream hover:border-[rgba(196,163,90,0.4)] active:scale-90 transition-all duration-200 focus-visible:outline-none text-sm"
        >
          ✕
        </button>

        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-[rgba(196,163,90,0.08)] shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-8 bg-gold" />
            <span className="text-gold text-[10px] tracking-[0.3em] uppercase">
              {step === 'payment-info' ? 'Selesaikan Pembayaran' : 'Pemesanan Desain'}
            </span>
          </div>
          <h2 className="font-display text-[2rem] text-cream font-light">
            {step === 'payment-info'
              ? (isQris ? 'Scan QR Code' : `Transfer ${BANK_NAMES[payment?.bank ?? ''] ?? 'Bank'}`)
              : 'Mulai Proyek Anda'}
          </h2>
        </div>

        {/* Content: payment-info vs form */}
        {step === 'payment-info' && payment && paymentResult ? (
          isQris ? (
            <QrisView
              qrString={payment.qr_string!}
              amount={paymentResult.transaction.amount}
              orderId={payment.order_id}
              expiredAt={payment.expired_at}
            />
          ) : isVa ? (
            <VaView
              vaNumber={payment.va_number!}
              bank={payment.bank ?? ''}
              amount={paymentResult.transaction.amount}
              orderId={payment.order_id}
              expiredAt={payment.expired_at}
            />
          ) : (
            /* Fallback: generic payment info */
            <div className="flex-1 overflow-y-auto px-8 py-7">
              <p className="text-stone text-sm mb-4">Pembayaran sedang diproses.</p>
              <div className="p-4 border border-[rgba(196,163,90,0.1)] bg-[rgba(196,163,90,0.03)]">
                <div className="text-muted text-[11px] mb-1">Total</div>
                <div className="font-display text-xl text-gold">{formatRupiah(paymentResult.transaction.amount)}</div>
                <div className="text-muted text-[11px] mt-2">Order ID: {payment.order_id}</div>
              </div>
            </div>
          )
        ) : (
          /* Order form */
          <form id={formId} onSubmit={handleFormSubmit} className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto px-8 py-7 space-y-6">

              {/* Package selector */}
              <fieldset>
                <legend className="block text-[10px] text-muted tracking-[0.28em] uppercase mb-3">Paket Layanan</legend>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.entries(PACKAGES) as [PkgKey, typeof PACKAGES[PkgKey]][]).map(([key, p]) => (
                    <button
                      key={key} type="button" onClick={() => setSelectedPkg(key)}
                      className={`py-3 px-2 text-center border transition-all duration-200 focus-visible:outline-none ${
                        selectedPkg === key
                          ? 'border-gold bg-[rgba(196,163,90,0.07)] text-cream'
                          : 'border-[rgba(196,163,90,0.1)] text-stone hover:border-[rgba(196,163,90,0.28)]'
                      }`}
                    >
                      <div className="text-xs font-medium">{p.name.replace('Paket ', '')}</div>
                      <div className={`text-[10px] mt-1 ${selectedPkg === key ? 'text-gold' : 'text-muted'}`}>
                        Rp {(p.amount / 1_000_000).toFixed(0)}jt
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-2.5 px-3 py-2 bg-[rgba(196,163,90,0.04)] border border-[rgba(196,163,90,0.07)]">
                  <span className="text-gold text-[11px]">{pkg.name}</span>
                  <span className="text-muted text-[11px]"> — {pkg.description}</span>
                </div>
              </fieldset>

              {/* Name */}
              <div>
                <label className="block text-[10px] text-muted tracking-[0.28em] uppercase mb-2">Nama Lengkap *</label>
                <input required type="text" value={form.name} onChange={e => set('name', e.target.value)}
                  placeholder="Nama Anda"
                  className="w-full bg-charcoal border border-[rgba(196,163,90,0.12)] text-cream placeholder-[#302E28] px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors duration-200" />
              </div>

              {/* Email + Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-muted tracking-[0.28em] uppercase mb-2">Email *</label>
                  <input required type="email" value={form.email} onChange={e => set('email', e.target.value)}
                    placeholder="email@anda.com"
                    className="w-full bg-charcoal border border-[rgba(196,163,90,0.12)] text-cream placeholder-[#302E28] px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors duration-200" />
                </div>
                <div>
                  <label className="block text-[10px] text-muted tracking-[0.28em] uppercase mb-2">WhatsApp *</label>
                  <input required type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className="w-full bg-charcoal border border-[rgba(196,163,90,0.12)] text-cream placeholder-[#302E28] px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors duration-200" />
                </div>
              </div>

              {/* Land size + Floors */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-muted tracking-[0.28em] uppercase mb-2">Luas Tanah (m²) *</label>
                  <input required type="number" min="36" value={form.landSize} onChange={e => set('landSize', e.target.value)}
                    placeholder="mis: 150"
                    className="w-full bg-charcoal border border-[rgba(196,163,90,0.12)] text-cream placeholder-[#302E28] px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors duration-200" />
                </div>
                <div>
                  <label className="block text-[10px] text-muted tracking-[0.28em] uppercase mb-2">Jumlah Lantai *</label>
                  <select value={form.floors} onChange={e => set('floors', e.target.value)}
                    className="w-full bg-charcoal border border-[rgba(196,163,90,0.12)] text-cream px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors duration-200 appearance-none cursor-pointer">
                    {FLOORS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
              </div>

              {/* Design style */}
              <div>
                <label className="block text-[10px] text-muted tracking-[0.28em] uppercase mb-3">Gaya Desain</label>
                <div className="flex flex-wrap gap-2">
                  {STYLES.map(style => (
                    <button key={style} type="button" onClick={() => set('style', style)}
                      className={`px-3.5 py-1.5 text-sm border transition-all duration-200 focus-visible:outline-none ${
                        form.style === style
                          ? 'border-gold bg-[rgba(196,163,90,0.07)] text-cream'
                          : 'border-[rgba(196,163,90,0.1)] text-stone hover:border-[rgba(196,163,90,0.28)]'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[10px] text-muted tracking-[0.28em] uppercase mb-2">Catatan Tambahan</label>
                <textarea rows={3} value={form.notes} onChange={e => set('notes', e.target.value)}
                  placeholder="Kebutuhan khusus, referensi desain, dll."
                  className="w-full bg-charcoal border border-[rgba(196,163,90,0.12)] text-cream placeholder-[#302E28] px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors duration-200 resize-none" />
              </div>

              {/* Error */}
              {step === 'error' && (
                <div className="p-4 border border-red-900/40 bg-red-950/20 text-red-400 text-sm leading-relaxed">
                  ⚠ {errorMsg}
                  <button type="button" onClick={() => setStep('form')}
                    className="block mt-2 text-[11px] text-red-400/70 underline hover:text-red-300 transition-colors">
                    Ganti metode pembayaran
                  </button>
                </div>
              )}
            </div>

            {/* Form footer */}
            <div className="px-8 py-6 border-t border-[rgba(196,163,90,0.08)] shrink-0 bg-[#111009]">
              <div className="flex items-center justify-between mb-4">
                <div className="text-muted text-[11px] tracking-wide">Total Pembayaran</div>
                <div className="font-display text-[1.8rem] text-gold font-light leading-none">
                  {formatRupiah(pkg.amount)}
                </div>
              </div>
              <button type="submit" form={formId}
                className="w-full py-4 bg-gold text-charcoal text-[11px] tracking-[0.22em] uppercase font-body font-semibold hover:bg-gold-light active:scale-[0.98] transition-all duration-300 focus-visible:outline-none flex items-center justify-center gap-3">
                Pilih Metode Pembayaran →
              </button>
              <p className="text-center text-[#4A4840] text-[10px] tracking-wide mt-3">
                Aman &amp; terenkripsi · Diproses oleh Louvin.dev
              </p>
            </div>
          </form>
        )}

        {/* ── Payment method picker overlay ── */}
        {(step === 'payment-method' || step === 'submitting') && (
          <div className="absolute inset-0 z-10 flex items-center justify-center p-6"
            style={{ animation: 'fadeIn 0.2s ease-out both' }}>
            <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm" />
            <div className="relative w-full max-w-md bg-surface border border-[rgba(196,163,90,0.15)] shadow-2xl overflow-hidden"
              style={{ animation: 'fadeUp 0.25s cubic-bezier(0.16,1,0.3,1) both' }}>

              <div className="px-6 py-5 border-b border-[rgba(196,163,90,0.08)] flex items-center justify-between">
                <div>
                  <div className="text-gold text-[10px] tracking-[0.28em] uppercase mb-1">Langkah Terakhir</div>
                  <h3 className="font-display text-xl text-cream font-light">Pilih Metode Bayar</h3>
                </div>
                {step !== 'submitting' && (
                  <button onClick={() => setStep('form')}
                    className="text-muted hover:text-cream text-sm transition-colors focus-visible:outline-none">
                    ← Kembali
                  </button>
                )}
              </div>

              <div className="px-6 py-5 space-y-5 max-h-[60vh] overflow-y-auto">
                {step === 'submitting' ? (
                  <div className="flex flex-col items-center py-8 gap-4">
                    <div className="w-8 h-8 border-2 border-[rgba(196,163,90,0.25)] border-t-gold rounded-full animate-spin" />
                    <p className="text-stone text-sm">Membuat transaksi...</p>
                  </div>
                ) : (
                  PAYMENT_METHODS.map(group => (
                    <div key={group.group}>
                      <div className="text-muted text-[10px] tracking-[0.24em] uppercase mb-2.5">{group.group}</div>
                      <div className="space-y-2">
                        {group.items.map(method => (
                          <button key={method.id} type="button"
                            onClick={() => handlePaymentMethodSelect(method.id)}
                            className="w-full flex items-center gap-4 px-4 py-3.5 border border-[rgba(196,163,90,0.1)] bg-[#0F0E0B] hover:border-gold hover:bg-[rgba(196,163,90,0.05)] active:scale-[0.98] transition-all duration-200 focus-visible:outline-none focus-visible:border-gold text-left group">
                            <span className="text-xl shrink-0 w-8 text-center">{method.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="text-cream text-sm font-medium group-hover:text-gold transition-colors duration-200">{method.label}</div>
                              <div className="text-muted text-[11px] mt-0.5">{method.sub}</div>
                            </div>
                            <span className="text-muted group-hover:text-gold transition-colors duration-200 text-sm shrink-0">→</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {step !== 'submitting' && (
                <div className="px-6 py-4 border-t border-[rgba(196,163,90,0.08)] flex items-center justify-between bg-[rgba(196,163,90,0.03)]">
                  <span className="text-muted text-[11px]">{pkg.name}</span>
                  <span className="font-display text-lg text-gold font-light">{formatRupiah(pkg.amount)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Close confirmation dialog ── */}
        {showCloseConfirm && (
          <div className="absolute inset-0 z-20 flex items-center justify-center p-6"
            style={{ animation: 'fadeIn 0.15s ease-out both' }}>
            <div className="absolute inset-0 bg-charcoal/80 backdrop-blur-sm" />
            <div className="relative w-full max-w-sm bg-surface-2 border border-[rgba(196,163,90,0.2)] p-7 text-center"
              style={{ animation: 'fadeUp 0.2s cubic-bezier(0.16,1,0.3,1) both' }}>
              <div className="w-10 h-10 border border-[rgba(196,163,90,0.3)] flex items-center justify-center mx-auto mb-4">
                <span className="text-gold text-lg">!</span>
              </div>
              <h3 className="font-display text-xl text-cream font-light mb-2">Tutup Modal?</h3>
              <p className="text-stone text-sm leading-relaxed mb-6">
                Transaksi Anda tetap aktif. Simpan nomor VA atau screenshot QR sebelum menutup.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowCloseConfirm(false)}
                  className="flex-1 py-3 border border-[rgba(196,163,90,0.2)] text-stone text-[11px] tracking-[0.2em] uppercase hover:border-gold hover:text-cream transition-all duration-200 focus-visible:outline-none">
                  Batal
                </button>
                <button onClick={onClose}
                  className="flex-1 py-3 bg-[rgba(196,163,90,0.15)] border border-[rgba(196,163,90,0.3)] text-gold text-[11px] tracking-[0.2em] uppercase hover:bg-gold hover:text-charcoal transition-all duration-200 focus-visible:outline-none">
                  Ya, Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
