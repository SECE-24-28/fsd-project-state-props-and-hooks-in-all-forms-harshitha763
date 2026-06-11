import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import ProductModal from '../components/ProductModal'
import api from '../utils/api'
import { PRODUCTS as LOCAL_PRODUCTS } from '../data/products'

const CATS = [
  { tag:'all',         label:'🛍️ All'         },
  { tag:'women',       label:'👗 Women'        },
  { tag:'men',         label:'👔 Men'          },
  { tag:'kids',        label:'🧒 Kids'         },
  { tag:'ethnic',      label:'🎊 Ethnic'       },
  { tag:'unisex',      label:'👕 Unisex'       },
  { tag:'accessories', label:'💍 Accessories'  },
]

export default function Shop() {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading]   = useState(true)
  const [activeTag, setActiveTag] = useState(searchParams.get('tag') || 'all')
  const [search, setSearch]     = useState('')
  const [sort, setSort]         = useState('default')
  const [modalId, setModalId]   = useState(null)

  useEffect(() => {
    api.get('/products')
      .then(res => { setProducts(res.data); setLoading(false) })
      .catch(() => {
        // Fallback to local product data when backend is unavailable
        setProducts(LOCAL_PRODUCTS)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    let list = [...products]
    if (activeTag !== 'all') list = list.filter(p => p.tag === activeTag)
    if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()))
    if (sort === 'price-asc')  list.sort((a,b) => a.price - b.price)
    if (sort === 'price-desc') list.sort((a,b) => b.price - a.price)
    if (sort === 'name')       list.sort((a,b) => a.name.localeCompare(b.name))
    if (sort === 'discount')   list.sort((a,b) => (b.original_price-b.price)/b.original_price - (a.original_price-a.price)/a.original_price)
    setFiltered(list)
  }, [products, activeTag, search, sort])

  return (
    <div className="min-h-screen bg-[#F4F6EF] pt-20">
      {/* Banner */}
      <div className="bg-gradient-sage text-white py-12 px-6 text-center">
        <h1 className="font-playfair text-4xl font-extrabold mb-2">Our Collection</h1>
        <p className="text-white/80 text-sm">Explore 56+ handpicked styles across all categories</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Search + Sort */}
        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <div className="relative flex-1 min-w-56">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7C75] text-sm"></i>
            <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products…"
              className="w-full pl-11 pr-4 py-3 bg-white border border-[#C8D4BE] rounded-2xl text-sm focus:border-[#819A91] focus:ring-4 focus:ring-[#819A91]/15 outline-none transition-all"/>
          </div>
          <select value={sort} onChange={e=>setSort(e.target.value)}
            className="px-4 py-3 bg-white border border-[#C8D4BE] rounded-2xl text-sm text-[#2C3830] focus:border-[#819A91] outline-none cursor-pointer">
            <option value="default">Sort by</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name A–Z</option>
            <option value="discount">Highest Discount</option>
          </select>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATS.map(c => (
            <button key={c.tag} onClick={() => setActiveTag(c.tag)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${activeTag===c.tag ? 'bg-gradient-sage text-white shadow-sage' : 'bg-white border border-[#C8D4BE] text-[#6B7C75] hover:border-[#819A91] hover:text-[#819A91]'}`}>
              {c.label}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-sm text-[#6B7C75] mb-6">{filtered.length} products found</p>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_,i) => <div key={i} className="h-72 bg-white rounded-2xl animate-pulse"></div>)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <i className="fas fa-search text-5xl text-[#C8D4BE] mb-4 block"></i>
            <h3 className="text-[#2C3830] font-bold text-xl mb-2">No products found</h3>
            <p className="text-[#6B7C75] text-sm">Try a different search or filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map(p => <ProductCard key={p._id} product={p} onOpenModal={setModalId}/>)}
          </div>
        )}
      </div>
      {modalId && <ProductModal productId={modalId} onClose={() => setModalId(null)}/>}
    </div>
  )
}
