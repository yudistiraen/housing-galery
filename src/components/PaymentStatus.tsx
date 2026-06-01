import { useEffect, useState } from 'react'
import { checkPaymentStatus } from '../lib/payment'

interface PaymentStatusProps {
  status: 'payment-success' | 'payment-failed'
  transactionId: string
  onBack: () => void
}

export default function PaymentStatus({ status, transactionId, onBack }: PaymentStatusProps) {
  const [webhookConfirmed, setWebhookConfirmed] = useState(false)
  const [webhookData, setWebhookData] = useState<Record<string, unknown> | null>(null)
  const isSuccess = status === 'payment-success'

  useEffect(() => {
    if (!isSuccess || !transactionId) return

    let attempts = 0
    const maxAttempts = 20

    const poll = async () => {
      try {
        const data = await checkPaymentStatus(transactionId)
        const payStatus = data.status as string | undefined
        if (payStatus && payStatus !== 'pending') {
          setWebhookData(data)
          setWebhookConfirmed(true)
          clearInterval(interval)
        }
      } catch {
        /* silent */
      }
      attempts++
      if (attempts >= maxAttempts) clearInterval(interval)
    }

    const interval = setInterval(poll, 3_000)
    poll()
    return () => clearInterval(interval)
  }, [isSuccess, transactionId])

  return (
    <div
      className="min-h-screen bg-[#0C0B09] flex flex-col items-center justify-center px-6 py-20"
      style={{ animation: 'fadeIn 0.5s ease-out both' }}
    >
      {/* Icon */}
      <div
        className={`w-20 h-20 flex items-center justify-center border-2 mb-8 ${
          isSuccess ? 'border-[#C4A35A]' : 'border-red-800/60'
        }`}
      >
        {isSuccess ? (
          <svg className="w-9 h-9 text-[#C4A35A]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-9 h-9 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
      </div>

      {/* Headline */}
      <h1 className="font-display text-[clamp(2.2rem,6vw,4rem)] text-[#EDE8DC] font-light text-center mb-4 tracking-[-0.02em]">
        {isSuccess ? 'Pembayaran Berhasil' : 'Pembayaran Gagal'}
      </h1>

      {/* Sub */}
      <p className="text-[#A89E8A] text-center leading-relaxed max-w-[440px] mb-8">
        {isSuccess
          ? 'Terima kasih! Tim kami akan menghubungi Anda dalam 1×24 jam untuk memulai proses desain rumah Anda.'
          : 'Pembayaran tidak berhasil diproses. Silakan coba kembali atau hubungi kami di studio@rumastudio.id.'}
      </p>

      {/* Transaction detail */}
      {isSuccess && transactionId && (
        <div className="w-full max-w-sm mb-8 border border-[rgba(196,163,90,0.12)] bg-[#141210]">
          <div className="px-5 py-4">
            <div className="text-[10px] text-[#6B6358] tracking-[0.24em] uppercase mb-1.5">ID Transaksi</div>
            <div className="text-[#C4A35A] font-mono text-sm break-all">{transactionId}</div>
          </div>

          {/* Webhook status */}
          <div className="border-t border-[rgba(196,163,90,0.07)] px-5 py-3 flex items-center gap-2.5">
            {webhookConfirmed ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                <span className="text-emerald-400 text-[11px]">
                  Konfirmasi diterima
                  {webhookData?.status ? ` — ${webhookData.status}` : ''}
                </span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-[#C4A35A] flex-shrink-0 animate-pulse" />
                <span className="text-[#6B6358] text-[11px]">Menunggu konfirmasi webhook...</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onBack}
          className="px-8 py-3.5 border border-[rgba(196,163,90,0.25)] text-[#A89E8A] text-[11px] tracking-[0.22em] uppercase hover:border-[#C4A35A] hover:text-[#C4A35A] active:scale-[0.97] transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C4A35A]"
        >
          ← Kembali ke Beranda
        </button>
        {!isSuccess && (
          <button
            onClick={onBack}
            className="px-8 py-3.5 bg-[#C4A35A] text-[#0C0B09] text-[11px] tracking-[0.22em] uppercase font-semibold hover:bg-[#DBBF7A] active:scale-[0.97] transition-all duration-300 focus-visible:outline-none"
          >
            Coba Lagi
          </button>
        )}
      </div>
    </div>
  )
}
