import React, { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

const TRACKING_STEPS = [
  { id:'confirmed',  icon:'fa-check-circle', label:'Order Confirmed', desc:'Your order has been placed and confirmed.' },
  { id:'processing', icon:'fa-cog',          label:'Processing',      desc:'We are preparing your items for dispatch.' },
  { id:'shipped',    icon:'fa-truck',         label:'Shipped',         desc:'Your order is on its way to you.' },
  { id:'delivered',  icon:'fa-home',          label:'Delivered',       desc:'Your order has been delivered. Enjoy!' },
]
const STATUS_IDX = { Confirmed:0, Processing:1, Shipped:2, Delivered:3, Cancelled:-1 }

function TrackingTimeline({ status }) {
  const idx = STATUS_IDX[status] ?? 0
  if (status === 'Cancelled') {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <i className="fas fa-times-circle text-3xl text-red-500"></i>
        </div>
        <p className="text-red-500 font-bold text-lg">Order Cancelled</p>
        <p className="text-gray-400 text-sm mt-1">This order has been cancelled.</p>
      </div>
    )
  }
  return (
    <div className="py-6">
      <div className="relative flex justify-between items-start">
        <div className="absolute top-5 left-5 right-5 h-1 bg-[#E8EDE8] z-0">
          <div className="h-full bg-gradient-sage rounded-full transition-all duration-1000"
            style={{width: idx===0?'0%':idx===1?'33%':idx===2?'66%':'100%'}}></div>
        </div>
        {TRACKING_STEPS.map((step,i) => {
          const done    = i<=idx
          const current = i===idx
          return (
            <div key={step.id} className="flex flex-col items-center gap-2 z-10 flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${done?'bg-gradient-sage border-transparent text-white':'bg-white border-[#C8D4BE] text-[#C8D4BE]'} ${current?'ring-4 ring-[#A7C1A8]/30 scale-110':''}`}>
                <i className={`fas ${step.icon} text-sm`}></i>
              </div>
              <div className="text-center">
                <p className={`text-xs font-bold ${done?'text-[#2C3830]':'text-gray-400'}`}>{step.label}</p>
                {current && <p className="text-[10px] text-[#819A91] mt-0.5 max-w-[80px]">{step.desc}</p>}
              </div>
            </div>
          )
        })}
      </div>
      {status !== 'Delivered' && (
        <div className="mt-6 bg-[#F4F6EF] rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-sage rounded-xl flex items-center justify-center flex-shrink-0">
            <i className="fas fa-clock text-white"></i>
          </div>
          <div>
            <p className="font-bold text-[#2C3830] text-sm">Estimated Delivery</p>
            <p className="text-[#6B7C75] text-xs">
              {status==='Confirmed'?'5–7 business days':status==='Processing'?'3–5 business days':status==='Shipped'?'1–2 business days':'Delivered'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default function OrderTracking() {
  const [searchParams]          = useSearchParams()
  const [refInput, setRefInput] = useState('')
  const [order,    setOrder]    = useState(null)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  // Core track function — takes ref string directly (no stale state)
  const doTrack = useCallback((ref) => {
    const clean = (ref || '').trim()
    if (!clean) { setError('Please enter an order reference number.'); return }

    setLoading(true)
    setError('')
    setOrder(null)

    setTimeout(() => {
      // 1. Search localStorage orders
      const stored = JSON.parse(localStorage.getItem('fc_orders') || '[]')
      const found  = stored.find(o =>
        o.orderRef === clean || o._id === clean
      )

      if (found) {
        setOrder(found)
        setLoading(false)
        return
      }

      // 2. If starts with FC — show demo tracking result
      if (clean.toUpperCase().startsWith('FC')) {
        setOrder({
          _id:       'demo_' + clean,
          orderRef:  clean,
          status:    'Shipped',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          address:   '123 Fashion Street, Bandra West, Mumbai - 400050 | +91 98765 43210',
          payment:   'Credit/Debit Card',
          subtotal:  2800,
          tax:       140,
          total:     2940,
          items: [{
            name:  'Leather Jacket',
            price: 2800,
            qty:   1,
            size:  'L',
            image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=200&q=80'
          }]
        })
      } else {
        setError('Order not found. Your order reference starts with "FC" — check My Orders page.')
      }

      setLoading(false)
    }, 600) // small delay for UX feel
  }, [])

  // Auto-track from URL param
  useEffect(() => {
    const ref = searchParams.get('ref')
    if (ref) {
      setRefInput(ref)
      doTrack(ref)
    }
  }, [searchParams, doTrack])

  // Button click handler
  const handleTrack = () => doTrack(refInput)

  // Recent orders from localStorage
  const recentOrders = JSON.parse(localStorage.getItem('fc_orders') || '[]')
    .slice().reverse().slice(0, 5)

  const statusBadge = s =>
    s==='Delivered'  ? 'bg-emerald-100 text-emerald-700' :
    s==='Shipped'    ? 'bg-blue-100 text-blue-700'        :
    s==='Processing' ? 'bg-amber-100 text-amber-700'      :
    s==='Cancelled'  ? 'bg-red-100 text-red-600'          :
                       'bg-[#D1D8BE] text-[#2C3830]'

  return (
    <div className="min-h-screen bg-[#F4F6EF] pt-20">
      {/* Banner */}
      <div className="bg-gradient-sage text-white py-14 px-6 text-center">
        <i className="fas fa-map-marker-alt text-5xl mb-3 block opacity-80"></i>
        <h1 className="font-playfair text-4xl font-extrabold mb-2">Track Your Order</h1>
        <p className="text-white/80 text-sm">Real-time updates on your FashionCart orders</p>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12 space-y-6">

        {/* Search Box */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#C8D4BE]">
          <h3 className="font-bold text-[#2C3830] text-base mb-4 flex items-center gap-2">
            <i className="fas fa-search text-[#819A91]"></i>Enter Order Reference
          </h3>

          <div className="flex gap-3">
            <input
              type="text"
              value={refInput}
              onChange={e => setRefInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleTrack()}
              placeholder="e.g. FC1717654321000"
              className="flex-1 px-4 py-3.5 border-2 border-[#C8D4BE] rounded-xl text-sm focus:border-[#819A91] focus:ring-4 focus:ring-[#819A91]/15 outline-none transition-all font-mono"
            />
            <button
              onClick={handleTrack}
              disabled={loading || !refInput.trim()}
              className="bg-gradient-sage text-white px-6 py-3.5 rounded-xl font-bold text-sm hover:opacity-90 hover:-translate-y-0.5 transition-all flex items-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 shadow-sage-sm">
              {loading
                ? <><i className="fas fa-spinner fa-spin"></i>Tracking…</>
                : <><i className="fas fa-search"></i>Track</>}
            </button>
          </div>

          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-sm text-red-600">
              <i className="fas fa-exclamation-circle mt-0.5 flex-shrink-0"></i>
              <span>{error}</span>
            </div>
          )}

          <div className="mt-4 p-3 bg-[#F4F6EF] rounded-xl border border-[#C8D4BE]">
            <p className="text-[#6B7C75] text-xs flex items-start gap-2">
              <i className="fas fa-lightbulb text-[#819A91] mt-0.5 flex-shrink-0"></i>
              <span>Your order reference starts with <strong className="text-[#2C3830]">FC</strong> and is shown on the
                <Link to="/orders" className="text-[#819A91] font-semibold hover:underline mx-1">My Orders</Link>
                page after placing an order. You can also click the order cards below to track directly.</span>
            </p>
          </div>
        </div>

        {/* Recent orders — click to track */}
        {!order && recentOrders.length > 0 && (
          <div>
            <h3 className="font-bold text-[#2C3830] text-base mb-3 flex items-center gap-2">
              <i className="fas fa-history text-[#819A91]"></i>Your Recent Orders
              <span className="text-xs text-[#6B7C75] font-normal">— click any to track instantly</span>
            </h3>
            <div className="space-y-2">
              {recentOrders.map(o => (
                <button key={o._id}
                  onClick={() => { setRefInput(o.orderRef); doTrack(o.orderRef) }}
                  className="w-full bg-white border-2 border-[#C8D4BE] hover:border-[#819A91] rounded-2xl px-5 py-4 flex items-center justify-between gap-3 transition-all hover:shadow-md text-left group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-sage rounded-xl flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-box text-white text-sm"></i>
                    </div>
                    <div>
                      <div className="font-bold text-[#2C3830] text-sm font-mono">{o.orderRef}</div>
                      <div className="text-[#6B7C75] text-xs mt-0.5">
                        {new Date(o.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}
                        {' · '}₹{o.total?.toLocaleString('en-IN')}
                        {' · '}{o.items?.length || 0} item{o.items?.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${statusBadge(o.status)}`}>{o.status}</span>
                    <i className="fas fa-chevron-right text-[#C8D4BE] text-xs group-hover:text-[#819A91] group-hover:translate-x-1 transition-all"></i>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* No orders yet */}
        {!order && recentOrders.length === 0 && !error && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon:'fa-bag-shopping',  title:'Place an Order',    desc:'Shop at FashionCart and your orders will appear here automatically.' },
              { icon:'fa-truck',         title:'Shipping',          desc:'2–5 business days standard delivery across India.' },
              { icon:'fa-headset',       title:'Need Help?',        desc:'Email support@fashioncart.in or call +91 98765 43210.' },
            ].map(c => (
              <div key={c.title} className="bg-white rounded-2xl p-5 shadow-sm border border-[#C8D4BE] text-center">
                <div className="w-12 h-12 bg-gradient-sage rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <i className={`fas ${c.icon} text-white`}></i>
                </div>
                <h4 className="font-bold text-[#2C3830] text-sm mb-1">{c.title}</h4>
                <p className="text-[#6B7C75] text-xs leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-[#C8D4BE]">
            <i className="fas fa-spinner fa-spin text-4xl text-[#819A91] mb-3 block"></i>
            <p className="text-[#6B7C75] font-medium">Tracking your order…</p>
          </div>
        )}

        {/* Result */}
        {order && !loading && (
          <div className="bg-white rounded-2xl shadow-sm border border-[#C8D4BE] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#2C3830] to-[#1E2A24] px-6 py-5 flex items-start justify-between flex-wrap gap-3">
              <div>
                <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Order Reference</p>
                <p className="text-white font-black text-2xl font-mono">#{order.orderRef}</p>
                <p className="text-white/50 text-xs mt-1">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'})}
                </p>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${statusBadge(order.status)}`}>
                {order.status}
              </span>
            </div>

            <div className="p-6 space-y-5">
              {/* Timeline */}
              <TrackingTimeline status={order.status}/>

              {/* Items */}
              <div className="border-t border-[#E8EDE8] pt-5">
                <h4 className="font-bold text-[#2C3830] text-sm mb-4">
                  <i className="fas fa-box mr-2 text-[#819A91]"></i>Order Items
                </h4>
                <div className="space-y-3">
                  {(order.items || []).map((item,i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-[#F4F6EF] rounded-xl">
                      <img
                        src={item.image || `https://placehold.co/56x56/D1D8BE/2C3830?text=${encodeURIComponent((item.name||'').split(' ')[0])}`}
                        alt={item.name}
                        className="w-14 h-14 object-cover rounded-xl flex-shrink-0"
                        onError={e => e.target.src = `https://placehold.co/56x56/D1D8BE/2C3830?text=Item`}
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-[#2C3830]">{item.name}</p>
                        <p className="text-xs text-[#6B7C75]">
                          Qty: {item.qty}{item.size ? ` · Size: ${item.size}` : ''} · ₹{item.price?.toLocaleString('en-IN')} each
                        </p>
                      </div>
                      <span className="font-bold text-[#819A91] text-sm flex-shrink-0">
                        ₹{((item.price||0) * (item.qty||1)).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="border-t border-[#E8EDE8] pt-4 space-y-2">
                <div className="flex justify-between text-sm text-[#6B7C75]"><span>Subtotal</span><span>₹{order.subtotal?.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between text-sm text-[#6B7C75]"><span>GST (5%)</span><span>₹{order.tax?.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between font-black text-[#2C3830] text-lg border-t border-[#E8EDE8] pt-2 mt-1">
                  <span>Total</span><span className="text-[#819A91]">₹{order.total?.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Delivery + Payment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-[#F4F6EF] rounded-xl p-4">
                  <p className="text-xs font-bold text-[#6B7C75] uppercase mb-2"><i className="fas fa-map-marker-alt mr-1 text-[#819A91]"></i>Delivery Address</p>
                  <p className="text-sm text-[#2C3830] leading-relaxed">{order.address}</p>
                </div>
                <div className="bg-[#F4F6EF] rounded-xl p-4">
                  <p className="text-xs font-bold text-[#6B7C75] uppercase mb-2"><i className="fas fa-credit-card mr-1 text-[#819A91]"></i>Payment Method</p>
                  <p className="text-sm text-[#2C3830]">{order.payment}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 flex-wrap">
                <Link to="/orders" className="flex-1 text-center bg-gradient-sage text-white py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">
                  <i className="fas fa-box mr-2"></i>All My Orders
                </Link>
                <button onClick={() => { setOrder(null); setRefInput(''); setError('') }}
                  className="flex-1 text-center border-2 border-[#C8D4BE] text-[#2C3830] py-3 rounded-xl font-bold text-sm hover:border-[#819A91] transition-colors">
                  <i className="fas fa-search mr-2"></i>Track Another
                </button>
                <Link to="/shop" className="flex-1 text-center border-2 border-[#C8D4BE] text-[#2C3830] py-3 rounded-xl font-bold text-sm hover:border-[#819A91] transition-colors">
                  <i className="fas fa-shopping-bag mr-2"></i>Shop More
                </Link>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
