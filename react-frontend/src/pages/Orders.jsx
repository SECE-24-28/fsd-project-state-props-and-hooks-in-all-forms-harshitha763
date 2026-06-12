import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import { useToast } from '../components/Toast'
import { useCart } from '../context/CartContext'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const showToast = useToast()
  const { addToCart } = useCart()

  useEffect(() => {
    api.get('/orders')
      .then(r => { setOrders(r.data); setLoading(false) })
      .catch(() => {
        // Offline fallback — load from localStorage
        const local = JSON.parse(localStorage.getItem('fc_orders') || '[]')
        setOrders([...local].reverse())
        setLoading(false)
      })
  }, [])

  const cancelOrder = async id => {
    if (!confirm('Cancel this order?')) return
    try { await api.put(`/orders/${id}/cancel`); setOrders(o => o.map(x => x._id===id?{...x,status:'Cancelled'}:x)); showToast('Order cancelled','info') }
    catch(e) { showToast(e.error||'Cannot cancel','danger') }
  }

  const reorder = async order => {
    for (const item of order.items) { await addToCart(item.product, item.qty, item.size||'','') }
    showToast('Items added to cart!','success')
  }

  const statusStyle = {
    Confirmed:  'bg-amber-100 text-amber-800',
    Processing: 'bg-blue-100 text-blue-800',
    Shipped:    'bg-indigo-100 text-indigo-800',
    Delivered:  'bg-emerald-100 text-emerald-800',
    Cancelled:  'bg-red-100 text-red-700',
  }

  return (
    <div className="min-h-screen bg-[#F4F6EF] pt-20">
      <div className="bg-gradient-sage text-white py-12 px-6 text-center">
        <h1 className="font-playfair text-4xl font-extrabold mb-2">My Orders</h1>
        <p className="text-white/80 text-sm">Track and manage all your orders</p>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-10">
        {loading ? (
          <div className="space-y-4">{[1,2,3].map(i=><div key={i} className="h-40 bg-white rounded-2xl animate-pulse"></div>)}</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24">
            <i className="fas fa-box-open text-6xl text-[#C8D4BE] mb-4 block"></i>
            <h3 className="font-bold text-[#2C3830] text-xl mb-2">No orders yet</h3>
            <p className="text-[#6B7C75] text-sm mb-6">Looks like you haven't placed any orders.</p>
            <Link to="/shop" className="inline-flex items-center gap-2 bg-gradient-sage text-white px-6 py-3 rounded-full font-bold hover:opacity-90">
              <i className="fas fa-shopping-bag"></i>Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map(o => (
              <div key={o._id} className="bg-white rounded-2xl shadow-sm border border-[#C8D4BE] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#2C3830] to-[#1E2A24] px-6 py-4 flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <div className="text-white font-bold"><i className="fas fa-hashtag mr-1"></i>{o.orderRef}</div>
                    <div className="text-white/50 text-xs mt-0.5">{new Date(o.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${statusStyle[o.status]||'bg-gray-100 text-gray-700'}`}>{o.status}</span>
                    <span className="text-white font-black text-lg">₹{o.total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                {/* Items */}
                <div className="p-5">
                  <div className="space-y-3 mb-4">
                    {o.items.map((item,i) => (
                      <div key={i} className="flex items-center gap-3">
                        <img src={item.image||'https://images.unsplash.com/photo-1556821840-3a63f15732ce?q=80&w=100'} alt={item.name} className="w-14 h-14 object-cover rounded-xl flex-shrink-0"/>
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-[#2C3830]">{item.name}</p>
                          <p className="text-xs text-[#6B7C75]">Qty: {item.qty}{item.size?` · Size: ${item.size}`:''} · ₹{item.price.toLocaleString('en-IN')} each</p>
                        </div>
                        <span className="font-bold text-[#819A91] text-sm">₹{(item.price*item.qty).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-[#6B7C75] mb-4">
                    <i className="fas fa-map-marker-alt mr-1.5 text-[#819A91]"></i>{o.address}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button onClick={() => reorder(o)} className="text-xs font-bold border border-[#C8D4BE] text-[#6B7C75] px-4 py-2 rounded-full hover:border-[#819A91] hover:text-[#819A91] transition-all">
                      <i className="fas fa-redo mr-1"></i>Reorder
                    </button>
                    <Link to={`/track-order?ref=${o.orderRef}`} className="text-xs font-bold border border-[#819A91]/40 text-[#819A91] px-4 py-2 rounded-full hover:bg-[#819A91] hover:text-white transition-all">
                      <i className="fas fa-map-marker-alt mr-1"></i>Track Order
                    </Link>
                    {o.status === 'Confirmed' && (
                      <button onClick={() => cancelOrder(o._id)} className="text-xs font-bold border border-red-200 text-red-500 px-4 py-2 rounded-full hover:bg-red-50 transition-all">
                        <i className="fas fa-times mr-1"></i>Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
