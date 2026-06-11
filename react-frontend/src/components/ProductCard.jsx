import React, { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useToast } from './Toast'

export default function ProductCard({ product }) {
  const { cart, addToCart, updateQty } = useCart()
  const showToast = useToast()
  const [qty, setQty]         = useState(1)
  const [adding, setAdding]   = useState(false)
  const [imgError, setImgError] = useState(false)
  const [wished, setWished]   = useState(() => {
    const wl = JSON.parse(localStorage.getItem('fc_wishlist') || '[]')
    return wl.includes(product._id)
  })

  const pid      = product._id || product.id
  const discount = Math.round((1 - product.price / product.original_price) * 100)
  const stars    = product.rating || 4.5
  const fullStar = Math.floor(stars)
  const inCart   = cart.find(i => i.product_id === pid || i.id === pid)
  const fallback = `https://placehold.co/500x500/D1D8BE/2C3830?font=montserrat&text=${encodeURIComponent(product.name.split(' ').slice(0,2).join('+'))}`

  const toggleWish = () => {
    const wl  = JSON.parse(localStorage.getItem('fc_wishlist') || '[]')
    const upd = wished ? wl.filter(x => x !== pid) : [...wl, pid]
    localStorage.setItem('fc_wishlist', JSON.stringify(upd))
    setWished(!wished)
    showToast(wished ? 'Removed from wishlist' : 'Added to wishlist ❤️', wished ? 'info' : 'success')
  }

  const handleAdd = async () => {
    setAdding(true)
    await addToCart(pid, qty, '', '')
    showToast(`${product.name} added to cart!`, 'success')
    setAdding(false)
  }

  const incQty = () => setQty(q => Math.min(q + 1, 10))
  const decQty = () => setQty(q => Math.max(q - 1, 1))

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#E8EDE8] hover:-translate-y-2 hover:shadow-2xl hover:border-[#A7C1A8]/50 transition-all duration-300 group flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden" style={{height:'240px'}}>
        <img
          src={imgError ? fallback : (product.image || fallback)}
          alt={product.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
        />
        {/* Badges */}
        {product.badge && (
          <span className="absolute top-3 left-3 bg-[#2C3830] text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide">{product.badge}</span>
        )}
        <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">-{discount}%</span>

        {/* Wishlist */}
        <button onClick={toggleWish}
          className={`absolute bottom-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${wished ? 'bg-red-50 text-red-500 scale-110' : 'bg-white text-gray-300 hover:text-red-400'}`}>
          <i className={`${wished ? 'fas' : 'far'} fa-heart text-sm`}></i>
        </button>

        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="bg-white text-[#2C3830] text-xs font-bold px-4 py-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">Quick View</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-[10px] text-[#819A91] uppercase tracking-widest font-bold mb-1">{product.category}</p>
        <h3 className="font-bold text-sm text-[#2C3830] mb-1.5 leading-tight line-clamp-2 flex-grow-0">{product.name}</h3>

        {/* Stars */}
        <div className="flex items-center gap-1 mb-2">
          {Array.from({length:fullStar}).map((_,i)=><i key={i} className="fas fa-star text-[10px] text-amber-400"></i>)}
          {stars%1>=0.5&&<i className="fas fa-star-half-alt text-[10px] text-amber-400"></i>}
          <span className="text-[10px] text-gray-400 ml-1">({product.reviews||0})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="font-black text-[#819A91] text-lg">₹{product.price.toLocaleString('en-IN')}</span>
          <span className="text-xs text-gray-300 line-through">₹{product.original_price.toLocaleString('en-IN')}</span>
          <span className="text-xs text-green-600 font-bold">Save ₹{(product.original_price-product.price).toLocaleString('en-IN')}</span>
        </div>

        {/* Qty controls */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-gray-500 font-medium">Qty:</span>
          <div className="flex items-center border-2 border-[#C8D4BE] rounded-xl overflow-hidden">
            <button onClick={decQty}
              className="w-8 h-8 flex items-center justify-center text-[#2C3830] hover:bg-[#F4F6EF] transition-colors font-bold text-base disabled:opacity-40"
              disabled={qty <= 1}>−</button>
            <span className="w-8 text-center text-sm font-bold text-[#2C3830]">{qty}</span>
            <button onClick={incQty}
              className="w-8 h-8 flex items-center justify-center text-[#2C3830] hover:bg-[#F4F6EF] transition-colors font-bold text-base disabled:opacity-40"
              disabled={qty >= 10}>+</button>
          </div>
          {inCart && (
            <span className="text-xs text-[#819A91] font-semibold ml-1">
              <i className="fas fa-check-circle mr-1"></i>In cart ({inCart.qty})
            </span>
          )}
        </div>

        {/* Add to cart */}
        <button onClick={handleAdd} disabled={adding}
          className="w-full bg-[#2C3830] hover:bg-gradient-sage text-white py-2.5 rounded-xl text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 mt-auto">
          {adding
            ? <><i className="fas fa-spinner fa-spin mr-2"></i>Adding…</>
            : <><i className="fas fa-cart-plus mr-2"></i>Add {qty > 1 ? `${qty}x ` : ''}to Cart</>}
        </button>
      </div>
    </div>
  )
}
