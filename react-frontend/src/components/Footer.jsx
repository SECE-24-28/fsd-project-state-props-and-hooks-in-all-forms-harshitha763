import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[#080e0a] text-white/40 pt-16 pb-0">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12">
          {/* Brand */}
          <div className="col-span-2">
            <div className="text-gradient font-black text-2xl mb-3 flex items-center gap-2">
              <i className="fas fa-leaf text-[#A7C1A8]"></i>FashionCart
            </div>
            <p className="text-sm leading-relaxed text-white/35 max-w-xs">India's premium online fashion destination. Trendy, curated styles for every occasion.</p>
            <div className="flex gap-2 mt-4">
              {['instagram','facebook-f','twitter','youtube','pinterest-p'].map(s => (
                <a key={s} href="#" className="w-9 h-9 bg-[#819A91]/10 border border-[#819A91]/20 rounded-xl flex items-center justify-center text-white/40 hover:bg-gradient-sage hover:border-transparent hover:text-white hover:-translate-y-1 transition-all text-sm">
                  <i className={`fab fa-${s}`}></i>
                </a>
              ))}
            </div>
          </div>
          {/* Links */}
          <div>
            <h6 className="text-white font-bold mb-4 text-sm tracking-wide">Shop</h6>
            {[['Women','women'],['Men','men'],['Kids','kids'],['Ethnic','ethnic'],['Accessories','accessories']].map(([l,t]) => (
              <Link key={t} to={`/shop?tag=${t}`} className="block text-sm mb-2.5 hover:text-[#A7C1A8] hover:translate-x-1 transition-all">{l}</Link>
            ))}
          </div>
          <div>
            <h6 className="text-white font-bold mb-4 text-sm tracking-wide">Features</h6>
            {[['AI Size Advisor','/size-advisor'],['Virtual Try-On','/virtual-tryon'],['Shop The Look','/shop-the-look'],['About Us','/about'],['Contact','/contact']].map(([l,p]) => (
              <Link key={p} to={p} className="block text-sm mb-2.5 hover:text-[#A7C1A8] hover:translate-x-1 transition-all">{l}</Link>
            ))}
          </div>
          <div>
            <h6 className="text-white font-bold mb-4 text-sm tracking-wide">Support</h6>
            {[['FAQ','/faq'],['My Orders','/orders'],['Track Order','/track-order'],['Privacy Policy','/privacy'],['Terms','/terms']].map(([l,p]) => (
              <Link key={p} to={p} className="block text-sm mb-2.5 hover:text-[#A7C1A8] hover:translate-x-1 transition-all">{l}</Link>
            ))}
            <div className="mt-4 space-y-2">
              <p className="text-xs flex items-center gap-2"><i className="fas fa-envelope text-[#819A91]"></i>support@fashioncart.in</p>
              <p className="text-xs flex items-center gap-2"><i className="fas fa-phone text-[#819A91]"></i>+91 98765 43210</p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-[#819A91]/10 py-5 text-center text-xs text-white/20">
        <div className="max-w-7xl mx-auto px-6">
          © 2024 FashionCart. All rights reserved. Made with <span className="text-[#819A91]">♥</span> in India
        </div>
      </div>
    </footer>
  )
}
