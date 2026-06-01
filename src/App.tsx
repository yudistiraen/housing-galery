import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Gallery from './components/Gallery'
import OrderModal from './components/OrderModal'
import PaymentStatus from './components/PaymentStatus'
import Footer from './components/Footer'

type View = 'home' | 'payment-success' | 'payment-failed'

function getInitialView(): { view: View; transactionId: string } {
  const params = new URLSearchParams(window.location.search)
  const status = params.get('status')
  const txId = params.get('transaction_id') ?? params.get('order_id') ?? ''
  if (status === 'success') return { view: 'payment-success', transactionId: txId }
  if (status === 'failed' || status === 'cancel' || status === 'cancelled') return { view: 'payment-failed', transactionId: '' }
  return { view: 'home', transactionId: '' }
}

export default function App() {
  const [{ view, transactionId }, setViewState] = useState(getInitialView)
  const [orderOpen, setOrderOpen] = useState(false)
  const [selectedPkg, setSelectedPkg] = useState('standard')

  const openOrder = (pkg?: string) => {
    setSelectedPkg(pkg ?? 'standard')
    setOrderOpen(true)
  }

  const goHome = () => {
    setViewState({ view: 'home', transactionId: '' })
    window.history.replaceState({}, '', '/')
  }

  if (view !== 'home') {
    return <PaymentStatus status={view} transactionId={transactionId} onBack={goHome} />
  }

  return (
    <>
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px',
        }}
      />

      <div className="min-h-screen bg-[#0C0B09] font-body">
        <Navbar />
        <Hero onOrder={() => openOrder()} />
        <About />
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
