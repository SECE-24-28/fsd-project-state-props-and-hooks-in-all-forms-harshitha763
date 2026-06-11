import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import api from '../utils/api'

const CartContext = createContext()

export function CartProvider({ children }) {
  const { isLoggedIn } = useAuth()
  const [cart, setCart]       = useState([])
  const [loading, setLoading] = useState(false)

  // Load cart from localStorage as fallback
  const getLocalCart = () => {
    try { return JSON.parse(localStorage.getItem('fc_cart') || '[]') } catch { return [] }
  }
  const saveLocalCart = (c) => localStorage.setItem('fc_cart', JSON.stringify(c))

  const fetchCart = async () => {
    if (!isLoggedIn) { setCart([]); return }
    try {
      setLoading(true)
      const data = await api.get('/cart')
      setCart(data.data || [])
    } catch {
      // Fallback to localStorage cart
      setCart(getLocalCart())
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchCart() }, [isLoggedIn])

  const addToCart = async (productId, qty = 1, size = '', color = '') => {
    try {
      await api.post('/cart', { productId, qty, size, color })
      await fetchCart()
    } catch {
      // Offline: add to localStorage
      const local = getLocalCart()
      const key   = `${productId}-${size}-${color}`
      const exist = local.find(i => i.key === key)
      if (exist) exist.qty += qty
      else {
        const { PRODUCTS } = await import('../data/products')
        const p = PRODUCTS.find(x => x._id === productId || x.id === productId)
        if (p) local.push({ id: 'ci_'+Date.now(), key, product_id:productId, name:p.name, price:p.price, original_price:p.original_price, image:p.image, category:p.category, qty, size, color })
      }
      saveLocalCart(local)
      setCart([...local])
    }
  }

  const removeFromCart = async (id) => {
    try { await api.delete(`/cart/${id}`); await fetchCart() }
    catch { const local = getLocalCart().filter(i => i.id !== id); saveLocalCart(local); setCart(local) }
  }

  const updateQty = async (id, qty) => {
    if (qty <= 0) return removeFromCart(id)
    try { await api.put(`/cart/${id}`, { qty }); await fetchCart() }
    catch { const local = getLocalCart(); const item = local.find(i=>i.id===id); if(item){item.qty=qty;saveLocalCart(local);setCart([...local])} }
  }

  const clearCart = async () => {
    try { await api.delete('/cart') } catch {}
    saveLocalCart([])
    setCart([])
  }

  const cartCount = cart.reduce((s, i) => s + i.qty, 0)
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0)

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, removeFromCart, updateQty, clearCart, cartCount, cartTotal, fetchCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
