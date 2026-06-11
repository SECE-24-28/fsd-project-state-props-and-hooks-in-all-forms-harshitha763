import React, { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { useToast } from './Toast'
import { PRODUCTS } from '../data/products'

export default function ProductModal({ productId, onClose }) {
  const { addToCart } = useCart()
  const showToast = useToast()
  const [qty, setQty]       = useState(1)
  const [size, setSize]     = useState('')
  const [color, setColor]   = useState('')
  const [imgErr, setImgErr] = useState(false)
  const [adding, setAdding] = useState(false)

  const product = PRODUCTS.find(p => p._id === productId)
  if (!product) return null

  const discount  = Math.round((1 - product.price / product.original_price) * 100)
  const fallback  = `https://placehold.co/500x500/D1D8BE/2C3830?text=${encodeURIComponent(product.name.substring(0,10))}`

  const handleAdd = async () => {
    setAdding(true)
    await addToCart(product._id, qty, size, color)
    showToast(`${product.name} ×${qty} added to cart! 🛍️`, 'success')
    setAdding(false)
    onClose()
  }

  const SWATCH = { Black:'#1a1a1a', White:'#f5f5f5', Navy:'#0a1a3e', Red:'#c0392b', Olive:'#556b2f', Beige:'#c8a97e', Pink:'#e91e8c', Blue:'#1565c0', Green:'#2e7d32', Brown:'#5d4037', Khaki:'#a08840', Grey:'#757575', Gold:'#c8a400', Cream:'#f0e8d0', Sage:'#819A91', Mint:'#A7C1A8' }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div className="relative bg-white rounded-3xl overflow-hidden max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 z-10 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 text-gray-500 hover:text-gray-800 transition-colors">
          <i className="fas fa-times text-sm"></i>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <div className="relative bg-[#F4F6EF]">
            <img src={imgErr ? fallback : product.image} alt={product.name}
              onError={() => setImgErr(true)}
              className="w-full h-72 md:h-full object-cover"/>
            {product.badge && (
              <span className="absolute top-4 left-4 bg-gradient-sage text-white text-xs font-bold px-3 py-1 rounded-full">{product.badge}</span>
            )}
            <span className="absolute top-4 right-4 bg-[#2C3830] text-white text-xs font-bold px-3 py-1 rounded-full">-{discount}%</span>
          </div>

          {/* Details */}
          <div className="p-7 flex flex-col">
            <p className="text-[10px] text-[#6B7C75] uppercase tracking-widest font-semibold mb-2">{product.category} · {product.material}</p>
            <h2 className="font-playfair text-2xl font-extrabold text-[#2C3830] mb-3 leading-tight">{product.name}</h2>

            {/* Stars */}
            <div className="flex items-center gap-1.5 mb-3">
              {Array.from({length:Math.floor(product.rating||4.5)}).map((_,i)=><i key={i} className="fas fa-star text-sm text-amber-400"></i>)}
              <span className="text-sm font-bold text-[#2C3830] ml-1">{product.rating}</span>
              <span className="text-sm text-[#6B7C75]">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-1">
              <span className="font-black text-[#819A91] text-3xl">₹{product.price.toLocaleString('en-IN')}</span>
              <span className="text-base text-gray-300 line-through">₹{product.original_price.toLocaleString('en-IN')}</span>
            </div>
            <p className="text-sm text-emerald-600 font-semibold mb-4">You save ₹{(product.original_price-product.price).toLocaleString('en-IN')}</p>

            <p className="text-sm text-[#6B7C75] leading-relaxed mb-5">{product.description}</p>

            {/* Colors */}
            {product.colors && (
              <div className="mb-4">
                <p className="text-xs font-bold text-[#2C3830] mb-2">Color: <span className="font-normal text-[#6B7C75]">{color || 'Select'}</span></p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(c => (
                    <button key={c} title={c} onClick={() => setColor(c)}
                      className={`w-8 h-8 rounded-full border-3 transition-all hover:scale-110 ${color===c ? 'ring-2 ring-offset-2 ring-[#819A91]' : 'border-white'}`}
                      style={{background: SWATCH[c]||'#888', border: color===c ? '2px solid #819A91' : '2px solid #e5e7eb'}}>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && (
              <div className="mb-5">
                <p className="text-xs font-bold text-[#2C3830] mb-2">Size: <span className="font-normal text-[#6B7C75]">{size || 'Select'}</span></p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(s => (
                    <button key={s} onClick={() => setSize(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border-2 transition-all ${size===s ? 'border-[#819A91] bg-[#819A91]/10 text-[#819A91]' : 'border-[#C8D4BE] text-[#6B7C75] hover:border-[#819A91]/50'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty + Add */}
            <div className="flex items-center gap-3 mt-auto">
              <div className="flex items-center border-2 border-[#C8D4BE] rounded-xl overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1,q-1))} className="w-10 h-11 flex items-center justify-center text-[#6B7C75] hover:bg-[#819A91] hover:text-white transition-colors font-bold">−</button>
                <span className="w-10 h-11 flex items-center justify-center text-[#2C3830] font-black text-base border-x border-[#C8D4BE]">{qty}</span>
                <button onClick={() => setQty(q => Math.min(10,q+1))} className="w-10 h-11 flex items-center justify-center text-[#6B7C75] hover:bg-[#819A91] hover:text-white transition-colors font-bold">+</button>
              </div>
              <button onClick={handleAdd} disabled={adding}
                className="flex-1 bg-gradient-sage text-white py-3.5 rounded-xl font-bold text-sm hover:opacity-90 hover:-translate-y-0.5 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                {adding ? <><i className="fas fa-spinner fa-spin"></i>Adding…</> : <><i className="fas fa-cart-plus"></i>Add {qty} to Cart</>}
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[#C8D4BE]">
              {[['fa-truck-fast','Free Delivery','above ₹499'],['fa-shield-halved','Secure Pay','100% safe'],['fa-undo','30-Day Returns','No questions']].map(([ic,t,s]) => (
                <div key={t} className="text-center">
                  <i className={`fas ${ic} text-[#819A91] text-sm mb-1 block`}></i>
                  <div className="text-[9px] font-bold text-[#2C3830]">{t}</div>
                  <div className="text-[8px] text-[#6B7C75]">{s}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
