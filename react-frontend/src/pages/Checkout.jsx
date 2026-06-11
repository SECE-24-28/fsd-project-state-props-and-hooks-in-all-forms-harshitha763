import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import { useToast } from '../components/Toast'

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const showToast = useToast()
  const [step, setStep] = useState(1)
  const [pay, setPay] = useState('card')
  const [placing, setPlacing] = useState(false)
  const [orderRef, setOrderRef] = useState('')
  const [addr, setAddr] = useState({
    fname: user?.firstName||'', lname: user?.lastName||'',
    email: user?.email||'', phone: user?.phone||'',
    line1:'', line2:'', city:'', state:'', pin:''
  })

  const tax  = Math.round(cartTotal * 0.05)
  const ship = cartTotal >= 499 ? 0 : 50
  const total = cartTotal + tax + ship

  const goStep2 = () => {
    const req = ['fname','lname','email','phone','line1','city','state','pin']
    for (const f of req) { if (!addr[f]) { showToast(`Please fill in ${f}`, 'danger'); return } }
    setStep(2)
  }

  const goStep3 = () => setStep(3)

  const placeOrder = async () => {
    setPlacing(true)
    try {
      const address = `${addr.fname} ${addr.lname}, ${addr.line1}${addr.line2?', '+addr.line2:''}, ${addr.city}, ${addr.state} - ${addr.pin} | ${addr.phone}`
      const payMap  = { card:'Credit/Debit Card', upi:'UPI / PhonePe / GPay', cod:'Cash on Delivery' }
      let orderRef

      try {
        const res = await api.post('/orders', { address, payment: payMap[pay] })
        orderRef = res.data.orderRef
      } catch {
        // Offline fallback — save to localStorage
        const subtotal = cartTotal
        const tax = Math.round(subtotal * 0.05)
        const order = {
          _id: 'ord_' + Date.now(),
          orderRef: 'FC' + Date.now(),
          status: 'Confirmed',
          address,
          payment: payMap[pay],
          subtotal, tax,
          total: subtotal + tax,
          items: cart.map(i => ({ product: i.product_id || i.id, name: i.name, price: i.price, qty: i.qty, size: i.size || '', image: i.image })),
          createdAt: new Date().toISOString()
        }
        const existing = JSON.parse(localStorage.getItem('fc_orders') || '[]')
        existing.push(order)
        localStorage.setItem('fc_orders', JSON.stringify(existing))
        orderRef = order.orderRef
        // Clear local cart
        localStorage.removeItem('fc_cart')
      }

      setOrderRef(orderRef)
      setStep(4)
      showToast('Order placed successfully! 🎉', 'success')
    } catch(e) {
      showToast(e.error || 'Order failed. Try again.', 'danger')
    } finally { setPlacing(false) }
  }

  if (cart.length === 0 && step !== 4) return (
    <div className="min-h-screen bg-[#F4F6EF] pt-24 flex items-center justify-center">
      <div className="text-center">
        <i className="fas fa-shopping-cart text-6xl text-[#C8D4BE] mb-4 block"></i>
        <h2 className="font-bold text-[#2C3830] text-2xl mb-2">Your cart is empty</h2>
        <Link to="/shop" className="inline-flex items-center gap-2 bg-gradient-sage text-white px-6 py-3 rounded-full font-bold mt-4 hover:opacity-90 transition-opacity">
          <i className="fas fa-shopping-bag"></i>Continue Shopping
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F4F6EF] pt-20">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="font-playfair text-3xl font-extrabold text-[#2C3830] mb-8">Checkout</h1>

        {/* Step bar */}
        {step < 4 && (
          <div className="flex mb-8">
            {['Address','Payment','Review'].map((s,i) => (
              <div key={s} className="flex-1 text-center">
                <div className={`border-b-4 pb-3 text-sm font-semibold transition-colors ${step===i+1?'border-[#819A91] text-[#819A91]':step>i+1?'border-[#2C3830] text-[#2C3830]':'border-[#C8D4BE] text-[#6B7C75]'}`}>
                  <i className={`fas fa-${i===0?'map-marker-alt':i===1?'credit-card':'check'} mr-2`}></i>{s}
                </div>
              </div>
            ))}
          </div>
        )}

        {step === 4 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-check-circle text-5xl text-emerald-500"></i>
            </div>
            <h2 className="font-playfair text-4xl font-extrabold text-[#2C3830] mb-3">Order Placed!</h2>
            <p className="text-[#6B7C75] mb-2">Thank you for shopping with FashionCart.</p>
            <p className="text-[#6B7C75] mb-8">Order Ref: <strong className="text-[#2C3830]">{orderRef}</strong></p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/orders" className="bg-gradient-sage text-white px-8 py-3.5 rounded-full font-bold hover:opacity-90 inline-flex items-center gap-2">
                <i className="fas fa-box"></i>View My Orders
              </Link>
              <Link to="/shop" className="border-2 border-[#C8D4BE] text-[#2C3830] px-8 py-3.5 rounded-full font-semibold hover:border-[#819A91] transition-colors inline-flex items-center gap-2">
                <i className="fas fa-home"></i>Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">

              {/* Step 1 */}
              {step === 1 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#C8D4BE]">
                  <h3 className="font-bold text-[#2C3830] text-lg mb-5 flex items-center gap-2"><i className="fas fa-map-marker-alt text-[#819A91]"></i>Shipping Address</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[['fname','First Name *'],['lname','Last Name *'],['email','Email *','email','col-span-2'],['phone','Phone *','tel','col-span-2'],['line1','Address Line 1 *','text','col-span-2'],['line2','Address Line 2','text','col-span-2'],['city','City *'],['state','State *'],['pin','PIN Code *','text']].map(([k,l,t='text',cls='']) => (
                      <div key={k} className={cls}>
                        <label className="block text-xs font-semibold text-[#2C3830] mb-1.5">{l}</label>
                        <input type={t} value={addr[k]} onChange={e=>setAddr({...addr,[k]:e.target.value})}
                          className="w-full px-4 py-3 border-2 border-[#C8D4BE] rounded-xl text-sm focus:border-[#819A91] focus:ring-4 focus:ring-[#819A91]/15 outline-none transition-all"/>
                      </div>
                    ))}
                  </div>
                  <button onClick={goStep2} className="mt-6 w-full bg-gradient-sage text-white py-3.5 rounded-xl font-bold hover:opacity-90 transition-opacity">
                    Continue to Payment <i className="fas fa-arrow-right ml-2"></i>
                  </button>
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#C8D4BE]">
                  <h3 className="font-bold text-[#2C3830] text-lg mb-5 flex items-center gap-2"><i className="fas fa-credit-card text-[#819A91]"></i>Payment Method</h3>
                  <div className="space-y-3">
                    {[
                      { id:'card', icon:'far fa-credit-card',      label:'Credit / Debit Card'     },
                      { id:'upi',  icon:'fas fa-mobile-alt',        label:'UPI / PhonePe / GPay'    },
                      { id:'cod',  icon:'fas fa-money-bill-wave',   label:'Cash on Delivery'        },
                    ].map(p => (
                      <div key={p.id} onClick={() => setPay(p.id)}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${pay===p.id?'border-[#819A91] bg-[#819A91]/07':'border-[#C8D4BE] hover:border-[#819A91]/50'}`}>
                        <input type="radio" checked={pay===p.id} readOnly className="accent-[#819A91]"/>
                        <i className={`${p.icon} text-[#819A91] w-5`}></i>
                        <span className="font-semibold text-sm text-[#2C3830]">{p.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setStep(1)} className="flex-1 border-2 border-[#C8D4BE] text-[#6B7C75] py-3.5 rounded-xl font-semibold hover:border-[#819A91] transition-colors">
                      <i className="fas fa-arrow-left mr-2"></i>Back
                    </button>
                    <button onClick={goStep3} className="flex-1 bg-gradient-sage text-white py-3.5 rounded-xl font-bold hover:opacity-90 transition-opacity">
                      Review Order <i className="fas fa-arrow-right ml-2"></i>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#C8D4BE] space-y-4">
                  <h3 className="font-bold text-[#2C3830] text-lg flex items-center gap-2"><i className="fas fa-clipboard-list text-[#819A91]"></i>Review Order</h3>
                  <div className="bg-[#F4F6EF] rounded-xl p-4">
                    <p className="text-xs font-bold text-[#6B7C75] uppercase mb-1">Items</p>
                    {cart.map(i => <div key={i.id} className="flex justify-between text-sm py-1"><span>{i.name} ×{i.qty}</span><span className="font-bold text-[#819A91]">₹{(i.price*i.qty).toLocaleString('en-IN')}</span></div>)}
                  </div>
                  <div className="bg-[#F4F6EF] rounded-xl p-4">
                    <p className="text-xs font-bold text-[#6B7C75] uppercase mb-1">Delivery Address</p>
                    <p className="text-sm text-[#2C3830]">{addr.fname} {addr.lname}, {addr.line1}{addr.line2?', '+addr.line2:''}, {addr.city}, {addr.state} - {addr.pin}</p>
                  </div>
                  <div className="bg-[#F4F6EF] rounded-xl p-4">
                    <p className="text-xs font-bold text-[#6B7C75] uppercase mb-1">Payment</p>
                    <p className="text-sm text-[#2C3830]">{{ card:'Credit/Debit Card', upi:'UPI / PhonePe / GPay', cod:'Cash on Delivery' }[pay]}</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setStep(2)} className="flex-1 border-2 border-[#C8D4BE] text-[#6B7C75] py-3.5 rounded-xl font-semibold hover:border-[#819A91] transition-colors">
                      <i className="fas fa-arrow-left mr-2"></i>Back
                    </button>
                    <button onClick={placeOrder} disabled={placing} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3.5 rounded-xl font-bold transition-colors disabled:opacity-60">
                      {placing ? <><i className="fas fa-spinner fa-spin mr-2"></i>Placing…</> : <><i className="fas fa-check mr-2"></i>Place Order</>}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#C8D4BE] sticky top-24 h-fit">
              <h3 className="font-bold text-[#2C3830] text-lg mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                {cart.map(i => (
                  <div key={i.id} className="flex gap-3">
                    <img src={i.image} alt={i.name} className="w-12 h-12 object-cover rounded-xl flex-shrink-0"/>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#2C3830] truncate">{i.name}</p>
                      <p className="text-xs text-[#6B7C75]">Qty: {i.qty}</p>
                    </div>
                    <span className="text-sm font-bold text-[#819A91] flex-shrink-0">₹{(i.price*i.qty).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
              <hr className="border-[#C8D4BE] my-4"/>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-[#6B7C75]"><span>Subtotal</span><span>₹{cartTotal.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between text-[#6B7C75]"><span>Shipping</span><span className={ship===0?'text-emerald-500 font-semibold':''}>{ship===0?'FREE':'₹'+ship}</span></div>
                <div className="flex justify-between text-[#6B7C75]"><span>GST (5%)</span><span>₹{tax.toLocaleString('en-IN')}</span></div>
              </div>
              <hr className="border-[#C8D4BE] my-3"/>
              <div className="flex justify-between font-black text-[#2C3830] text-lg">
                <span>Total</span><span className="text-[#819A91]">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
