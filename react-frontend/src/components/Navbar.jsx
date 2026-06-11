import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import CartSidebar from './CartSidebar'

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#1E2A24]/97 backdrop-blur-xl shadow-2xl py-3' : 'bg-[#1E2A24]/90 backdrop-blur-md py-4'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="text-gradient font-black text-2xl flex items-center gap-2" style={{fontFamily:'Poppins'}}>
            <i className="fas fa-leaf text-[#A7C1A8]"></i>
            FashionCart
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-7">
            {[['/', 'Home'], ['/shop', 'Shop'], ['/size-advisor', 'AI Sizing'], ['/virtual-tryon', 'Try-On'], ['/shop-the-look', 'Lookbook']].map(([path, label]) => (
              <Link key={path} to={path} className="text-white/75 hover:text-white text-sm font-medium transition-colors relative group">
                {label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-sage group-hover:w-full transition-all duration-300 rounded-full"></span>
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <Link to="/wishlist" className="text-white/70 hover:text-white transition-colors hidden sm:block"><i className="fas fa-heart text-lg"></i></Link>
                <Link to="/orders" className="text-white/70 hover:text-white transition-colors hidden sm:block"><i className="fas fa-box text-lg"></i></Link>
                <button onClick={() => setCartOpen(true)} className="relative bg-gradient-sage text-white px-4 py-2 rounded-full text-sm font-bold hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-sage">
                  <i className="fas fa-shopping-cart mr-1"></i>Cart
                  {cartCount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-[#2C3830] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">{cartCount}</span>}
                </button>
                <div className="relative group hidden sm:block">
                  <button className="text-white/80 hover:text-white text-sm font-medium flex items-center gap-1.5 border border-white/20 rounded-full px-3 py-1.5 transition-colors hover:border-white/40">
                    <i className="fas fa-user-circle"></i>
                    {user?.firstName || 'User'}
                    <i className="fas fa-chevron-down text-xs"></i>
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link to="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#819A91]"><i className="fas fa-user w-4 text-[#819A91]"></i>Profile</Link>
                    <Link to="/orders"  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#819A91]"><i className="fas fa-box w-4 text-[#819A91]"></i>My Orders</Link>
                    <Link to="/wishlist"className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#819A91]"><i className="fas fa-heart w-4 text-red-400"></i>Wishlist</Link>
                    <hr className="my-1 border-gray-100"/>
                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full"><i className="fas fa-sign-out-alt w-4"></i>Logout</button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login"  className="text-white/80 hover:text-white text-sm font-semibold border border-white/25 rounded-full px-4 py-2 transition-all hover:border-white/50">Sign In</Link>
                <Link to="/signup" className="bg-gradient-sage text-white text-sm font-bold px-4 py-2 rounded-full hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-sage">
                  <i className="fas fa-user-plus mr-1"></i>Sign Up
                </Link>
              </>
            )}
            <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}><i className={`fas fa-${menuOpen ? 'times' : 'bars'} text-xl`}></i></button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-[#1E2A24] border-t border-white/10 px-6 py-4 flex flex-col gap-3">
            {[['/', 'Home'], ['/shop', 'Shop'], ['/size-advisor', 'AI Sizing'], ['/virtual-tryon', 'Try-On'], ['/shop-the-look', 'Lookbook']].map(([path, label]) => (
              <Link key={path} to={path} onClick={() => setMenuOpen(false)} className="text-white/80 hover:text-white text-sm font-medium py-1">{label}</Link>
            ))}
          </div>
        )}
      </nav>

      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
