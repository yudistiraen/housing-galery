const API_BASE = 'https://api.louvin.dev'
const API_KEY = 'lv_2c6b0e5bd3e04bd2be7ec4d20db210a9'
const SLUG = 'galery'

export interface OrderData {
  name: string
  email: string
  phone: string
  package: 'basic' | 'standard' | 'premium'
  landSize: string
  floors: string
  style: string
  notes: string
  paymentType: string
}

export interface PaymentTransaction {
  id: string
  amount: number
  fee: number
  net_amount: number
  status: string
  reference: string
  fee_on_customer: boolean
  created_at: string
}

export interface PaymentInfo {
  order_id: string
  payment_type: string
  expired_at: string
  total_payment: number
  qr_string?: string
  va_number?: string
  bank?: string
  payment_number?: string
}

export interface PaymentResponse {
  success: boolean
  transaction: PaymentTransaction
  payment: PaymentInfo
}

export const PACKAGES = {
  basic: {
    name: 'Paket Dasar',
    amount: 2000,
    description: 'Denah 2D + Tampak Fasad',
  },
  standard: {
    name: 'Paket Standar',
    amount: 5000,
    description: 'Desain 3D + RAB + Interior 2 Ruang',
  },
  premium: {
    name: 'Paket Premium',
    amount: 10_000,
    description: 'Desain Lengkap + Walkthrough + Supervisi',
  },
} as const

export async function createTransaction(order: OrderData): Promise<PaymentResponse> {
  const pkg = PACKAGES[order.package]
  const origin = window.location.origin

  const payload = {
    slug: SLUG,
    amount: pkg.amount,
    payment_type: order.paymentType,
    customer_name: order.name,
    customer_email: order.email,
    customer_phone: order.phone,
    description: `${pkg.name} — Rumah ${order.floors}, ${order.landSize}m², Gaya ${order.style}`,
    redirect_url: `${origin}/?status=success`,
    webhook_url: `${origin}/api/webhook`,
    metadata: {
      package: order.package,
      land_size: order.landSize,
      floors: order.floors,
      style: order.style,
      notes: order.notes || '',
    },
  }

  const res = await fetch(`${API_BASE}/create-transaction`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { message?: string; error?: string }
    throw new Error(err.message ?? err.error ?? `Pembayaran gagal (${res.status})`)
  }

  const data = await res.json() as PaymentResponse
  if (!data.success) throw new Error('Transaksi gagal diproses oleh server')
  return data
}

export async function checkPaymentStatus(transactionId: string): Promise<Record<string, unknown>> {
  const res = await fetch(`/api/payment-status?transaction_id=${encodeURIComponent(transactionId)}`)
  if (!res.ok) return { status: 'pending' }
  return res.json() as Promise<Record<string, unknown>>
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount)
}

/** Parse expired_at string (WIB/UTC+7) to Date */
export function parseExpiry(expiredAt: string): Date {
  return new Date(expiredAt.replace(' ', 'T') + '+07:00')
}

export const BANK_NAMES: Record<string, string> = {
  bni: 'BNI',
  bri: 'BRI',
  permata: 'Permata Bank',
  cimb: 'CIMB Niaga',
  mandiri: 'Mandiri',
  bca: 'BCA',
}
