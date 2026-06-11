import React, { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useToast } from '../components/Toast'

const LOOKS = [
  { id:'l1', title:'Office Ready',  desc:'Sharp & Professional',  tag:'Work',      img:'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=687&auto=format&fit=crop', products:[{id:'w7',name:'Blazer for Women',price:2800,img:'https://images.unsplash.com/photo-1594938298603-c8148c4b4357?q=80&w=200'},{id:'m9',name:'Blazer for Men',price:3500,img:'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=200'},{id:'a5',name:'Wrist Watch',price:3500,img:'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200'},{id:'a1',name:'Leather Belt',price:700,img:'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=200'}] },
  { id:'l2', title:'Festive Glow',  desc:'Celebration Vibes',     tag:'Festive',   img:'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=687&auto=format&fit=crop', products:[{id:'e1',name:'Anarkali Suit',price:2200,img:'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=200'},{id:'e3',name:'Lehenga Choli',price:4800,img:'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=200'},{id:'a4',name:'Sunglasses',price:1500,img:'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=200'},{id:'a8',name:'Stud Earrings',price:350,img:'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=200'}] },
  { id:'l3', title:'Casual Chic',   desc:'Weekend Effortless',    tag:'Casual',    img:'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=687&auto=format&fit=crop', products:[{id:'w10',name:'Boho Maxi Dress',price:1500,img:'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?q=80&w=200'},{id:'u1',name:'Casual Denim Jeans',price:1500,img:'https://images.unsplash.com/photo-1542272604-787c62d465d1?q=80&w=200'},{id:'a3',name:'Tote Bag',price:1200,img:'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=200'},{id:'a2',name:'Sun Hat',price:500,img:'https://images.unsplash.com/photo-1506629082632-32ca5dff2e48?q=80&w=200'}] },
  { id:'l4', title:'Date Night',    desc:'Elegant & Bold',        tag:'Glamour',   img:'https://images.unsplash.com/photo-1595777712802-6b7be0a54341?q=80&w=687&auto=format&fit=crop', products:[{id:'w3',name:'Evening Gown',price:3200,img:'https://images.unsplash.com/photo-1595777712802-6b7be0a54341?q=80&w=200'},{id:'a5',name:'Wrist Watch',price:3500,img:'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=200'},{id:'a8',name:'Stud Earrings',price:350,img:'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=200'},{id:'a4',name:'Sunglasses',price:1500,img:'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=200'}] },
  { id:'l5', title:'Street Smart',  desc:'Urban Cool Style',      tag:'Streetwear',img:'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=687&auto=format&fit=crop', products:[{id:'m2',name:'Leather Jacket',price:5500,img:'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=200'},{id:'u1',name:'Casual Denim Jeans',price:1500,img:'https://images.unsplash.com/photo-1542272604-787c62d465d1?q=80&w=200'},{id:'u3',name:'Sneakers',price:2800,img:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200'},{id:'u4',name:'Graphic Sweatshirt',price:1400,img:'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=200'}] },
  { id:'l6', title:'Beach Vibes',   desc:'Sun & Sea Ready',       tag:'Resort',    img:'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=687&auto=format&fit=crop', products:[{id:'w9',name:'Palazzo Pants',price:799,img:'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=200'},{id:'u3',name:'Sneakers',price:2800,img:'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=200'},{id:'a2',name:'Sun Hat',price:500,img:'https://images.unsplash.com/photo-1506629082632-32ca5dff2e48?q=80&w=200'},{id:'a4',name:'Sunglasses',price:1500,img:'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=200'}] },
]

export default function ShopTheLook() {
  const { addToCart } = useCart()
  const showToast = useToast()
  const [filter, setFilter] = useState('all')
  const [adding, setAdding] = useState({})

  const visible = filter === 'all' ? LOOKS : LOOKS.filter(l => l.tag === filter)

  const shopAll = async lookId => {
    const look = LOOKS.find(l => l.id === lookId)
    if (!look) return
    setAdding(a => ({...a, [lookId]:true}))
    for (const p of look.products) await addToCart(p.id, 1, '', '')
    showToast(`All ${look.products.length} items added to cart! 🛍️`, 'success')
    setAdding(a => ({...a, [lookId]:false}))
  }

  const quickAdd = async pid => {
    await addToCart(pid, 1, '', '')
    showToast('Item added to cart!', 'success')
  }

  const tags = ['all', ...new Set(LOOKS.map(l => l.tag))]

  return (
    <div className="min-h-screen bg-[#F4F6EF] pt-20">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#2C3830] to-[#1E2A24] py-16 px-6 text-center">
        <span className="inline-block bg-[#819A91]/20 border border-[#819A91]/40 text-[#A7C1A8] text-xs font-bold tracking-widest px-4 py-1.5 rounded-full mb-5 uppercase">Curated by Our Style Team · Updated Daily</span>
        <h1 className="font-playfair text-5xl font-extrabold text-white mb-3">Shop The Look</h1>
        <p className="text-white/55 max-w-lg mx-auto text-sm mb-8">Complete outfit inspiration — tap any item to add instantly. Average customers add 2.8 items per look.</p>
        <div className="flex gap-8 justify-center flex-wrap">
          {[['2.8x','Higher AOV'],['6','Curated Looks'],['24+','Style Items']].map(([n,l]) => (
            <div key={l} className="text-center">
              <div className="font-black text-white text-2xl">{n}</div>
              <div className="text-white/40 text-[10px] uppercase tracking-widest mt-0.5">{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {tags.map(t => (
            <button key={t} onClick={() => setFilter(t)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold capitalize transition-all ${filter===t?'bg-gradient-sage text-white shadow-sage':'bg-white border border-[#C8D4BE] text-[#6B7C75] hover:border-[#819A91] hover:text-[#819A91]'}`}>{t}</button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {visible.map(look => {
            const total = look.products.reduce((s,p) => s+p.price, 0)
            return (
              <div key={look.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#C8D4BE] hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group">
                {/* Image */}
                <div className="relative h-72 overflow-hidden">
                  <img src={look.img} alt={look.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2C3830]/70 to-transparent"></div>
                  <span className="absolute top-4 left-4 bg-gradient-sage text-white text-xs font-bold px-3 py-1 rounded-full">{look.tag}</span>
                  {/* Hotspot dots */}
                  {look.products.map((p,i) => {
                    const positions = [[72,32],[40,55],[85,68],[25,46]]
                    const pos = positions[i] || [50,50]
                    return (
                      <button key={p.id} onClick={() => quickAdd(p.id)}
                        title={`Add ${p.name} to cart`}
                        style={{top:`${pos[0]}%`, left:`${pos[1]}%`, transform:'translate(-50%,-50%)'}}
                        className="absolute w-7 h-7 bg-white border-2 border-[#819A91] rounded-full flex items-center justify-center cursor-pointer hover:scale-125 hover:bg-[#819A91] group/dot transition-all z-10">
                        <i className="fas fa-plus text-[10px] text-[#819A91] group-hover/dot:text-white transition-colors"></i>
                        {/* Pulse */}
                        <span className="absolute w-7 h-7 rounded-full bg-[#819A91]/40 animate-ping"></span>
                      </button>
                    )
                  })}
                </div>

                {/* Body */}
                <div className="p-5">
                  <h3 className="font-playfair font-bold text-[#2C3830] text-xl mb-1">{look.title}</h3>
                  <p className="text-[#6B7C75] text-xs mb-4">{look.desc} — {look.products.length} pieces</p>
                  {/* Thumbnails */}
                  <div className="flex gap-2 mb-4">
                    {look.products.map(p => (
                      <button key={p.id} onClick={() => quickAdd(p.id)} title={p.name}
                        className="w-12 h-12 rounded-xl overflow-hidden border-2 border-[#C8D4BE] hover:border-[#819A91] hover:scale-110 transition-all flex-shrink-0">
                        <img src={p.img} alt={p.name} className="w-full h-full object-cover"/>
                      </button>
                    ))}
                  </div>
                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-black text-[#819A91] text-lg">₹{total.toLocaleString('en-IN')}</span>
                    <span className="text-xs text-[#6B7C75]">{look.products.length} pieces</span>
                  </div>
                  {/* Shop all */}
                  <button onClick={() => shopAll(look.id)} disabled={adding[look.id]}
                    className="w-full bg-gradient-sage text-white py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2">
                    {adding[look.id]
                      ? <><i className="fas fa-spinner fa-spin"></i>Adding…</>
                      : <><i className="fas fa-bag-shopping"></i>Shop This Look — {look.products.length} Items</>}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
