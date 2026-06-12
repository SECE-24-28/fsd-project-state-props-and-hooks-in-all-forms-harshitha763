import React from 'react'
import { Link, useLocation } from 'react-router-dom'

// All pages in order
const PAGES = [
  { path:'/',              label:'Landing',       icon:'fa-home' },
  { path:'/about',         label:'About Us',      icon:'fa-leaf' },
  { path:'/shop',          label:'Shop',          icon:'fa-shopping-bag' },
  { path:'/shop-the-look', label:'Shop The Look', icon:'fa-images' },
  { path:'/size-advisor',  label:'AI Sizing',     icon:'fa-robot' },
  { path:'/virtual-tryon', label:'Try-On',        icon:'fa-camera' },
  { path:'/wishlist',      label:'Wishlist',      icon:'fa-heart' },
  { path:'/orders',        label:'My Orders',     icon:'fa-box' },
  { path:'/track-order',   label:'Track Order',   icon:'fa-map-marker-alt' },
  { path:'/checkout',      label:'Checkout',      icon:'fa-credit-card' },
  { path:'/profile',       label:'Profile',       icon:'fa-user' },
  { path:'/contact',       label:'Contact',       icon:'fa-envelope' },
  { path:'/faq',           label:'FAQ',           icon:'fa-question-circle' },
]

export default function PageNavigator() {
  const { pathname } = useLocation()
  const idx  = PAGES.findIndex(p => p.path === pathname)
  if (idx === -1) return null

  const prev = idx > 0              ? PAGES[idx - 1] : null
  const next = idx < PAGES.length-1 ? PAGES[idx + 1] : null
  const curr = PAGES[idx]

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 bg-[#2C3830]/90 backdrop-blur-xl border border-[#819A91]/30 rounded-full px-4 py-2.5 shadow-2xl">
      {/* Previous */}
      {prev ? (
        <Link to={prev.path}
          className="flex items-center gap-1.5 text-white/60 hover:text-white text-xs font-semibold transition-all hover:-translate-x-0.5 group">
          <i className="fas fa-chevron-left group-hover:text-[#A7C1A8] transition-colors"></i>
          <i className={`fas ${prev.icon} text-[10px] hidden sm:block`}></i>
          <span className="hidden sm:block max-w-20 truncate">{prev.label}</span>
        </Link>
      ) : (
        <span className="w-16 opacity-0 text-xs">—</span>
      )}

      {/* Divider */}
      <div className="w-px h-4 bg-white/20"></div>

      {/* Current page indicator */}
      <div className="flex items-center gap-2 px-2">
        <i className={`fas ${curr.icon} text-[#A7C1A8] text-xs`}></i>
        <span className="text-white text-xs font-bold max-w-24 truncate">{curr.label}</span>
        <span className="text-white/35 text-[10px]">{idx+1}/{PAGES.length}</span>
      </div>

      {/* Divider */}
      <div className="w-px h-4 bg-white/20"></div>

      {/* Next */}
      {next ? (
        <Link to={next.path}
          className="flex items-center gap-1.5 text-white/60 hover:text-white text-xs font-semibold transition-all hover:translate-x-0.5 group">
          <span className="hidden sm:block max-w-20 truncate">{next.label}</span>
          <i className={`fas ${next.icon} text-[10px] hidden sm:block`}></i>
          <i className="fas fa-chevron-right group-hover:text-[#A7C1A8] transition-colors"></i>
        </Link>
      ) : (
        <span className="w-16 opacity-0 text-xs">—</span>
      )}
    </div>
  )
}
