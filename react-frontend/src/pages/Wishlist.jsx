import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import api from '../utils/api'
import { PRODUCTS as LOCAL_PRODUCTS } from '../data/products'
import { useToast } from '../components/Toast'

export default function Wishlist() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const showToast = useToast()

  const loadWishlist = async () => {
    try {
      const r = await api.get('/wishlist')
      setItems(r.data)
    } catch {
      // Offline fallback — read wishlist IDs from localStorage and match with local products
      const ids = JSON.parse(localStorage.getItem('fc_wishlist') || '[]')
      setItems(LOCAL_PRODUCTS.filter(p => ids.includes(p._id)))
    } finally { setLoading(false) }
  }

  useEffect(() => { loadWishlist() }, [])

  const clearAll = async () => {
    if (!confirm('Clear all wishlist items?')) return
    try { await api.delete('/wishlist') } catch {}
    localStorage.removeItem('fc_wishlist')
    setItems([])
    showToast('Wishlist cleared','info')
  }

  return (
    <div className="min-h-screen bg-[#F4F6EF] pt-20">
      <div className="bg-gradient-sage text-white py-12 px-6 text-center">
        <h1 className="font-playfair text-4xl font-extrabold mb-2">My Wishlist</h1>
        <p className="text-white/80 text-sm">{items.length} saved {items.length===1?'item':'items'}</p>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-10">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">{[...Array(4)].map((_,i)=><div key={i} className="h-72 bg-white rounded-2xl animate-pulse"></div>)}</div>
        ) : items.length === 0 ? (
          <div className="text-center py-24">
            <i className="far fa-heart text-6xl text-[#C8D4BE] mb-4 block"></i>
            <h3 className="font-bold text-[#2C3830] text-xl mb-2">Your wishlist is empty</h3>
            <p className="text-[#6B7C75] text-sm mb-6">Browse products and click ♡ to save them here.</p>
            <Link to="/shop" className="inline-flex items-center gap-2 bg-gradient-sage text-white px-6 py-3 rounded-full font-bold hover:opacity-90">
              <i className="fas fa-shopping-bag"></i>Explore Products
            </Link>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-[#6B7C75]">{items.length} products saved</p>
              <button onClick={clearAll} className="text-sm text-red-400 hover:text-red-600 font-semibold transition-colors">
                <i className="fas fa-trash mr-1"></i>Clear All
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {items.map(p => <ProductCard key={p._id} product={p}/>)}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
