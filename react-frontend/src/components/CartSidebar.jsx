import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function CartSidebar({ isOpen, onClose }) {
  const { cart, cartTotal, removeFromCart, updateQty, clearCart } = useCart()

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={onClose}></div>}

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-96 max-w-full bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="bg-gradient-sage text-white px-6 py-4 flex items-center justify-between">
          <h2 className="font-bold text-lg"><i className="fas fa-shopping-cart mr-2"></i>Your Cart ({cart.length})</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white text-xl"><i className="fas fa-times"></i></button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <i className="fas fa-shopping-cart text-5xl text-gray-200 mb-4"></i>
              <p className="text-gray-500 font-medium">Your cart is empty</p>
              <p className="text-gray-400 text-sm mt-1">Add items to get started</p>
              <button onClick={onClose} className="mt-6 bg-gradient-sage text-white px-6 py-2.5 rounded-full font-bold text-sm hover:opacity-90 transition-opacity">Browse Products</button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-3 pb-4 border-b border-gray-100">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl flex-shrink-0"/>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-800 truncate">{item.name}</p>
                  {item.size && <p className="text-xs text-gray-400 mt-0.5">Size: {item.size}</p>}
                  <p className="text-xs text-gray-400">₹{item.price.toLocaleString('en-IN')} each</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-sm hover:border-[#819A91] hover:text-[#819A91] transition-colors">−</button>
                    <span className="text-sm font-semibold w-6 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-sm hover:border-[#819A91] hover:text-[#819A91] transition-colors">+</button>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <p className="font-bold text-[#819A91]">₹{(item.price * item.qty).toLocaleString('en-IN')}</p>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 text-xs transition-colors"><i className="fas fa-trash"></i></button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-4 py-4 border-t border-gray-100 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-800 text-lg">Total</span>
              <span className="font-black text-[#819A91] text-xl">₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <Link to="/checkout" onClick={onClose} className="block w-full bg-gradient-sage text-white py-3.5 rounded-2xl font-bold text-center hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-sage">
              <i className="fas fa-credit-card mr-2"></i>Proceed to Checkout
            </Link>
            <button onClick={clearCart} className="block w-full border border-red-200 text-red-400 py-2.5 rounded-2xl font-semibold text-sm text-center hover:bg-red-50 transition-colors">
              <i className="fas fa-trash mr-2"></i>Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  )
}
