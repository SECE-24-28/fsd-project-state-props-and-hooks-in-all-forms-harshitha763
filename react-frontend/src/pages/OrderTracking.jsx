import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

const TRACKING_STEPS = [
  { id:'confirmed',  icon:'fa-check-circle',  label:'Order Confirmed',  desc:'Your order has been placed and confirmed.' },
  { id:'processing', icon:'fa-cog',           label:'Processing',       desc:'We are preparing your items for dispatch.' },
  { id:'shipped',    icon:'fa-truck',          label:'Shipped',          desc:'Your order is on its way to you.' },
  { id:'delivered',  icon:'fa-home',           label:'Delivered',        desc:'Your order has been delivered. Enjoy!' },
]

const STATUS_IDX = { Confirmed:0, Processing:1, Shipped:2, Delivered:3, Cancelled:-1 }

function TrackingTimeline({ status }) {
  const idx = STATUS_IDX[status] ?? 0
  if (status === 'Cancelled') {
    return (
      <div className="flex flex-col items-center py-8">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-3">
          <i className="fas fa-times-circle text-3xl text-red-500"></i>
        </div>
        <p className="text-red-500 font-bold text-lg">Order Cancelled</p>
        <p className="text-gray-400 text-sm mt-1">This order has been cancelled and refund initiated.</p>
      </div>
    )
  }
  return (
    <div className="py-6">
      <div className="relative flex justify-between items-start">
        {/* Progress line */}
        <div className="absolute top-5 left-5 right-5 h-1 bg-[#E8EDE8] z-0">
          <div className="h-full bg-gradient-sage rounded-full transition-all duration-1000"
            style={{ width: idx === 0 ? '0%' : idx === 1 ? '33%' : idx === 2 ? '66%' : '100%' }}></div>
        </div>
        {TRACKING_STEPS.map((step, i) => {
          const done    = i <= idx
          const current = i === idx
          return (
            <div key={step.id} className="flex flex-col items-center gap-2 z-10 flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${done ? 'bg-gradient-sage border-transparent text-white' : 'bg-white border-[#C8D4BE] text-[#C8D4BE]'} ${current ? 'ring-4 ring-[#A7C1A8]/30 scale-110' : ''}`}>
                <i className={`fas ${step.icon} text-sm`}></i>
              </div>
              <div className="text-center">
                <p className={`text-xs font-bold ${done ? 'text-[#2C3830]' : 'text-gray-400'}`}>{step.label}</p>
                {current && <p className="text-[10px] text-[#819A91] mt-0.5 max-w-[80px]">{step.desc}</p>}
              </div>
            </div>
          )
        })}
      </div>
      {/* ETA */}
      {status !== 'Delivered' && (
        <div className="mt-6 bg-[#F4F6EF] rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-sage rounded-xl flex items-center justify-center flex-shrink-0">
            <i className="fas fa-clock text-white"></i>
          </div>
          <div>
            <p className="font-bold text-[#2C3830] text-sm">Estimated Delivery</p>
            <p className="text-[#6B7C75] text-xs">
              {status === 'Confirmed' ? '5–7 business days' :
               status === 'Processing' ? '3–5 business days' :
               status === 'Shipped' ? '1–2 business days' : 'Delivered'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default function OrderTracking() {
  const [searchParams] = useSearchParams()
  const [refInput, setRefInput] = useState(searchParams.get('ref') || '')
  const [order, setOrder]       = useState(null)
  const [error, setError]       = useState('')

  // Auto-track if ref is in URL
  useEffect(() => {
    const ref = searchParams.get('ref')
    if (ref) {
      setRefInput(ref)
      // Small delay to let state settle
      setTimeout(() => trackOrderByRef(ref), 100)
    }
  }, [])

  const trackOrderByRef = (ref) => {
    setError('')
    setOrder(null)
    if (!ref?.trim()) return

    // Search localStorage orders
    const orders = JSON.parse(localStorage.getItem('fc_orders') || '[]')
    const found  = orders.find(o => o.orderRef === ref.trim() || o._id === ref.trim())
    if (found) {
      setOrder(found)
    } else if (ref.startsWith('FC')) {
      // Demo order for testing
      setOrder({
        _id: 'demo', orderRef: ref.trim(), status:'Shipped',
        createdAt: new Date(Date.now() - 2*24*60*60*1000).toISOString(),
        address: 'Demo Address, Mumbai, Maharashtra - 400001',
        payment: 'Credit/Debit Card',
        subtotal: 2800, tax: 140, total: 2940,
        items: [{ name:'Leather Jacket', price:2800, qty:1, image:'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=200&q=80' }]
      })
    } else {
      setError('Order not found. Check your order reference and try again.')
    }
  }

  const trackOrder = () => trackOrderByRef(refInput)

  return (
    <div className="min-h-screen bg-[#F4F6EF] pt-20">
      {/* Banner */}
      <div className="bg-gradient-sage text-white py-14 px-6 text-center">
        <i className="fas fa-map-marker-alt text-4xl mb-3 block opacity-80"></i>
        <h1 className="font-playfair text-4xl font-extrabold mb-2">Track Your Order</h1>
        <p className="text-white/80 text-sm">Enter your order reference to get real-time updates</p>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Search */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#C8D4BE] mb-6">
          <h3 className="font-bold text-[#2C3830] mb-4 flex items-center gap-2">
            <i className="fas fa-search text-[#819A91]"></i>Enter Order Reference
          </h3>
          <div className="flex gap-3">
            <input
              type="text"
              value={refInput}
              onChange={e => setRefInput(e.target.value)}
              onKeyDown={e => e.key==='Enter' && trackOrder()}
              placeholder="e.g. FC1717654321000 (from My Orders page)"
              className="flex-1 px-4 py-3 border-2 border-[#C8D4BE] rounded-xl text-sm focus:border-[#819A91] focus:ring-4 focus:ring-[#819A91]/15 outline-none transition-all"
            />
            <button onClick={trackOrder}
              className="bg-gradient-sage text-white px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 hover:-translate-y-0.5 transition-all flex items-center gap-2 whitespace-nowrap">
              <i className="fas fa-search"></i>Track
            </button>
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-3 flex items-center gap-2">
              <i className="fas fa-exclamation-circle"></i>{error}
            </p>
          )}
          <div className="mt-3 p-3 bg-[#F4F6EF] rounded-xl border border-[#C8D4BE]">
            <p className="text-[#6B7C75] text-xs flex items-start gap-2">
              <i className="fas fa-lightbulb text-[#819A91] mt-0.5 flex-shrink-0"></i>
              <span>Your order reference (starts with <strong>FC</strong>) is shown on the <strong>My Orders</strong> page after checkout. You can also click "Track Order" directly from any order card below.</span>
            </p>
          </div>
        </div>

        {/* Result */}
        {order && (
          <div className="bg-white rounded-2xl shadow-sm border border-[#C8D4BE] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#2C3830] to-[#1E2A24] px-6 py-5">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-wider mb-1">Order Reference</p>
                  <p className="text-white font-black text-xl">#{order.orderRef}</p>
                  <p className="text-white/50 text-xs mt-1">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}
                  </p>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                  order.status==='Delivered'  ? 'bg-emerald-100 text-emerald-700' :
                  order.status==='Shipped'    ? 'bg-blue-100 text-blue-700' :
                  order.status==='Processing' ? 'bg-amber-100 text-amber-700' :
                  order.status==='Cancelled'  ? 'bg-red-100 text-red-600' :
                  'bg-[#D1D8BE] text-[#2C3830]'}`}>
                  {order.status}
                </span>
              </div>
            </div>

            <div className="p-6">
              {/* Timeline */}
              <TrackingTimeline status={order.status}/>

              {/* Order items */}
              <div className="border-t border-[#E8EDE8] pt-5 mt-2">
                <h4 className="font-bold text-[#2C3830] text-sm mb-4">Order Items</h4>
                <div className="space-y-3">
                  {order.items.map((item,i) => (
                    <div key={i} className="flex items-center gap-3">
                      <img src={item.image||`https://placehold.co/56x56/D1D8BE/2C3830?text=${encodeURIComponent((item.name||'').split(' ')[0])}`}
                        alt={item.name} className="w-14 h-14 object-cover rounded-xl flex-shrink-0"
                        onError={e=>e.target.src=`https://placehold.co/56x56/D1D8BE/2C3830?text=Item`}/>
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-[#2C3830]">{item.name}</p>
                        <p className="text-xs text-[#6B7C75]">Qty: {item.qty}{item.size?` · Size: ${item.size}`:''}</p>
                      </div>
                      <span className="font-bold text-[#819A91]">₹{(item.price*item.qty).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price breakdown */}
              <div className="border-t border-[#E8EDE8] pt-4 mt-4 space-y-2 text-sm">
                <div className="flex justify-between text-[#6B7C75]"><span>Subtotal</span><span>₹{order.subtotal?.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between text-[#6B7C75]"><span>GST (5%)</span><span>₹{order.tax?.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between font-black text-[#2C3830] text-base border-t border-[#E8EDE8] pt-2 mt-2">
                  <span>Total</span><span className="text-[#819A91]">₹{order.total?.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Delivery info */}
              <div className="bg-[#F4F6EF] rounded-xl p-4 mt-4">
                <p className="text-xs font-bold text-[#6B7C75] uppercase mb-1"><i className="fas fa-map-marker-alt mr-1 text-[#819A91]"></i>Delivery Address</p>
                <p className="text-sm text-[#2C3830]">{order.address}</p>
              </div>
              <div className="bg-[#F4F6EF] rounded-xl p-4 mt-3">
                <p className="text-xs font-bold text-[#6B7C75] uppercase mb-1"><i className="fas fa-credit-card mr-1 text-[#819A91]"></i>Payment</p>
                <p className="text-sm text-[#2C3830]">{order.payment}</p>
              </div>

              <div className="flex gap-3 mt-5 flex-wrap">
                <Link to="/orders" className="flex-1 text-center bg-gradient-sage text-white py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">
                  <i className="fas fa-box mr-2"></i>All Orders
                </Link>
                <Link to="/shop" className="flex-1 text-center border-2 border-[#C8D4BE] text-[#2C3830] py-3 rounded-xl font-bold text-sm hover:border-[#819A91] transition-colors">
                  <i className="fas fa-shopping-bag mr-2"></i>Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Info cards */}
        {!order && !error && (
          <>
            {/* Recent orders from localStorage */}
            {(() => {
              const localOrders = JSON.parse(localStorage.getItem('fc_orders') || '[]').reverse().slice(0,5)
              if (localOrders.length === 0) return null
              return (
                <div className="mb-6">
                  <h3 className="font-bold text-[#2C3830] text-base mb-3 flex items-center gap-2">
                    <i className="fas fa-clock text-[#819A91]"></i>Your Recent Orders
                    <span className="text-xs text-[#6B7C75] font-normal">— click to track instantly</span>
                  </h3>
                  <div className="space-y-2">
                    {localOrders.map(o => (
                      <button key={o._id} onClick={() => { setRefInput(o.orderRef); trackOrderByRef(o.orderRef) }}
                        className="w-full bg-white border-2 border-[#C8D4BE] hover:border-[#819A91] rounded-2xl px-5 py-4 flex items-center justify-between gap-3 transition-all hover:shadow-md text-left group">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-sage rounded-xl flex items-center justify-center flex-shrink-0">
                            <i className="fas fa-box text-white text-sm"></i>
                          </div>
                          <div>
                            <div className="font-bold text-[#2C3830] text-sm font-mono">{o.orderRef}</div>
                            <div className="text-[#6B7C75] text-xs">{new Date(o.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})} · ₹{o.total?.toLocaleString('en-IN')}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                            o.status==='Delivered'?'bg-emerald-100 text-emerald-700':
                            o.status==='Shipped'?'bg-blue-100 text-blue-700':
                            o.status==='Cancelled'?'bg-red-100 text-red-600':
                            'bg-[#D1D8BE] text-[#2C3830]'}`}>{o.status}</span>
                          <i className="fas fa-arrow-right text-[#819A91] text-xs group-hover:translate-x-1 transition-transform"></i>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )
            })()}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon:'fa-clock',       title:'Processing',  desc:'1–2 business days to prepare your order' },
                { icon:'fa-truck',       title:'Shipping',    desc:'2–5 business days standard delivery' },
                { icon:'fa-headset',     title:'Need Help?',  desc:'Contact support@fashioncart.in' },
              ].map(c => (
                <div key={c.title} className="bg-white rounded-2xl p-5 shadow-sm border border-[#C8D4BE] text-center">
                  <div className="w-12 h-12 bg-gradient-sage rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <i className={`fas ${c.icon} text-white`}></i>
                  </div>
                  <h4 className="font-bold text-[#2C3830] text-sm mb-1">{c.title}</h4>
                  <p className="text-[#6B7C75] text-xs">{c.desc}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
