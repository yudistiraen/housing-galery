import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Gallery from './components/Gallery'
import OrderModal from './components/OrderModal'
import PaymentStatus from './components/PaymentStatus'
import Footer from './components/Footer'

type View = 'home' | 'payment-success' | 'payment-failed'

export default function App() {
  const [view, setView] = useState<View>('home')
  const [transactionId, setTransactionId] = useState('')
  const [orderOpen, setOrderOpen] = useState(false)
  const [selectedPkg, setSelectedPkg] = useState('standard')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const status = params.get('status')
    const txId = params.get('transaction_id') ?? params.get('order_id') ?? ''

    if (status === 'success') {
      setView('payment-success')
      setTransactionId(txId)
    } else if (status === 'failed' || status === 'cancel' || status === 'cancelled') {
      setView('payment-failed')
    }
  }, [])

  const openOrder = (pkg?: string) => {
    setSelectedPkg(pkg ?? 'standard')
    setOrderOpen(true)
  }

  const goHome = () => {
    setView('home')
    window.history.replaceState({}, '', '/')
  }

  if (view !== 'home') {
    return <PaymentStatus status={view} transactionId={transactionId} onBack={goHome} />
  }

  return (
    <>
      {/* Subtle grain overlay for depth */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px',
        }}
      />

      <div className="min-h-screen bg-[#0C0B09] font-body">
        <Navbar onOrder={() => openOrder()} />
        <Hero onOrder={() => openOrder()} />
        <Gallery />
        <Footer />
      </div>

      {orderOpen && (
        <OrderModal
          initialPackage={selectedPkg}
          onClose={() => setOrderOpen(false)}
        />
      )}
    </>
  )
}
