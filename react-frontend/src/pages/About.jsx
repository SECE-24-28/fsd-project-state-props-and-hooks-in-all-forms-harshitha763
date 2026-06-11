import React from 'react'
import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="min-h-screen bg-[#F4F6EF] pt-20">
      {/* Banner */}
      <div className="bg-gradient-sage text-white py-16 px-6 text-center">
        <h1 className="font-playfair text-5xl font-extrabold mb-3">About FashionCart</h1>
        <p className="text-white/80 max-w-xl mx-auto">Our story, mission, and the team behind India's favourite fashion destination</p>
      </div>

      {/* Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="text-[#819A91] text-xs font-bold tracking-[3px] uppercase block mb-3">Our Story</span>
              <h2 className="font-playfair text-4xl font-extrabold text-[#2C3830] mb-5">From a Dream to India's <span className="italic text-[#819A91]">Fashion Hub</span></h2>
              <p className="text-[#6B7C75] leading-relaxed mb-4">FashionCart was founded in 2020 with a simple mission — make premium fashion accessible to every Indian. What started as a small curated collection has grown into a platform with 66+ products across 6 categories.</p>
              <p className="text-[#6B7C75] leading-relaxed mb-4">We believe fashion is a form of self-expression, and everyone deserves to look and feel their best — without breaking the bank. Our team carefully curates every product to ensure the perfect balance of style, quality, and affordability.</p>
              <p className="text-[#6B7C75] leading-relaxed">Based in Mumbai, India, we serve customers across the country with fast delivery, easy returns, and 24/7 customer support.</p>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1470&auto=format&fit=crop" alt="Our Story" className="w-full h-96 object-cover"/>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[['50K+','Happy Customers'],['66+','Products'],['4.9★','Avg Rating'],['24/7','Support']].map(([n,l]) => (
              <div key={l} className="bg-gradient-sage rounded-2xl p-7 text-center text-white">
                <div className="text-4xl font-black mb-2">{n}</div>
                <div className="text-white/75 text-sm font-medium">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-[#819A91] text-xs font-bold tracking-[3px] uppercase block mb-3">What We Stand For</span>
            <h2 className="font-playfair text-4xl font-extrabold text-[#2C3830]">Our Core <span className="italic text-[#819A91]">Values</span></h2>
            <div className="w-12 h-0.5 bg-gradient-sage mx-auto mt-4 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon:'fa-leaf',       title:'Sustainability', desc:'We are committed to responsible fashion that is kind to the planet and future generations.' },
              { icon:'fa-medal',      title:'Quality First',  desc:'Every product is carefully vetted for quality, ensuring you always receive the best.' },
              { icon:'fa-users',      title:'Community',      desc:'We celebrate diversity and believe fashion should be for everyone, regardless of size or budget.' },
              { icon:'fa-shield-alt', title:'Trust & Safety', desc:'Your security is paramount. We use industry-standard encryption to protect every transaction.' },
              { icon:'fa-headset',    title:'Customer First', desc:'Our 24/7 support team is always ready to help with any query or concern.' },
              { icon:'fa-tags',       title:'Affordability',  desc:'Premium fashion at prices that don\'t make you choose between style and your wallet.' },
            ].map(v => (
              <div key={v.title} className="bg-white rounded-2xl p-7 shadow-sm border border-[#C8D4BE] hover:-translate-y-2 hover:shadow-lg transition-all group">
                <div className="w-14 h-14 bg-gradient-sage rounded-2xl flex items-center justify-center text-white text-xl mb-4 group-hover:scale-110 transition-transform">
                  <i className={`fas ${v.icon}`}></i>
                </div>
                <h4 className="font-bold text-[#2C3830] text-lg mb-2">{v.title}</h4>
                <p className="text-[#6B7C75] text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-sage text-white text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="font-playfair text-4xl font-extrabold mb-4">Ready to Explore?</h2>
          <p className="text-white/85 mb-8">Join 50,000+ happy customers and discover your perfect style today.</p>
          <Link to="/signup" className="inline-flex items-center gap-2 bg-white text-[#2C3830] font-bold px-10 py-4 rounded-full hover:-translate-y-1 hover:shadow-xl transition-all">
            <i className="fas fa-shopping-bag"></i>Start Shopping
          </Link>
        </div>
      </section>
    </div>
  )
}
