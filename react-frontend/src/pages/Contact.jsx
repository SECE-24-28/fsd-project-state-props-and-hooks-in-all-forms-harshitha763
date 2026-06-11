import React, { useState } from 'react'
import { useToast } from '../components/Toast'

export default function Contact() {
  const showToast = useToast()
  const [form, setForm] = useState({ name:'', email:'', phone:'', subject:'', message:'' })
  const [sent, setSent] = useState(false)

  const handleSubmit = e => {
    e.preventDefault()
    const msgs = JSON.parse(localStorage.getItem('fc_messages') || '[]')
    msgs.push({ ...form, date: new Date().toISOString() })
    localStorage.setItem('fc_messages', JSON.stringify(msgs))
    setSent(true)
    showToast('Message sent! We\'ll reply within 24 hours.', 'success')
    setForm({ name:'', email:'', phone:'', subject:'', message:'' })
    setTimeout(() => setSent(false), 6000)
  }

  return (
    <div className="min-h-screen bg-[#F4F6EF] pt-20">
      <div className="bg-gradient-sage text-white py-16 px-6 text-center">
        <h1 className="font-playfair text-5xl font-extrabold mb-3">Contact Us</h1>
        <p className="text-white/80">We'd love to hear from you — get in touch any time</p>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Info */}
          <div className="lg:col-span-2 bg-gradient-sage rounded-3xl p-8 text-white">
            <h3 className="font-playfair text-2xl font-bold mb-7">Get in Touch</h3>
            {[
              { icon:'fa-map-marker-alt', title:'Address',       text:'123 Fashion Street, Bandra West\nMumbai, Maharashtra 400050' },
              { icon:'fa-phone',          title:'Phone',         text:'+91 98765 43210\nMon–Sat: 9AM–6PM IST' },
              { icon:'fa-envelope',       title:'Email',         text:'support@fashioncart.in\ninfo@fashioncart.in' },
              { icon:'fa-clock',          title:'Support Hours', text:'Mon–Fri: 9AM–6PM\nSat–Sun: 10AM–4PM' },
            ].map(item => (
              <div key={item.title} className="flex gap-4 mb-6">
                <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className={`fas ${item.icon} text-white`}></i>
                </div>
                <div>
                  <h6 className="font-bold text-sm mb-1">{item.title}</h6>
                  <p className="text-white/75 text-sm whitespace-pre-line">{item.text}</p>
                </div>
              </div>
            ))}
            <div className="pt-5 border-t border-white/20 flex gap-2 mt-2">
              {['facebook-f','instagram','twitter'].map(s => (
                <a key={s} href="#" className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors">
                  <i className={`fab fa-${s} text-white text-sm`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3 bg-white rounded-3xl p-8 shadow-sm border border-[#C8D4BE]">
            <h3 className="font-playfair text-2xl font-bold text-[#2C3830] mb-6"><i className="fas fa-paper-plane mr-2 text-[#819A91]"></i>Send a Message</h3>
            {sent && (
              <div className="bg-[#eef5ee] border border-[#a8c4a8] text-[#2C3830] rounded-xl px-4 py-3 text-sm mb-5">
                <i className="fas fa-check-circle mr-2 text-[#819A91]"></i>Thank you! Your message has been received. We'll reply within 24 hours.
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-semibold text-[#2C3830] mb-1.5">Full Name *</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required placeholder="Your full name" className="w-full px-4 py-3 border-2 border-[#C8D4BE] rounded-xl text-sm focus:border-[#819A91] focus:ring-4 focus:ring-[#819A91]/15 outline-none transition-all"/></div>
                <div><label className="block text-xs font-semibold text-[#2C3830] mb-1.5">Email *</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required placeholder="you@example.com" className="w-full px-4 py-3 border-2 border-[#C8D4BE] rounded-xl text-sm focus:border-[#819A91] focus:ring-4 focus:ring-[#819A91]/15 outline-none transition-all"/></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-semibold text-[#2C3830] mb-1.5">Phone</label><input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+91 00000 00000" className="w-full px-4 py-3 border-2 border-[#C8D4BE] rounded-xl text-sm focus:border-[#819A91] outline-none transition-all"/></div>
                <div><label className="block text-xs font-semibold text-[#2C3830] mb-1.5">Subject *</label>
                  <select value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} required className="w-full px-4 py-3 border-2 border-[#C8D4BE] rounded-xl text-sm focus:border-[#819A91] outline-none cursor-pointer">
                    <option value="">Select subject</option>
                    {['Order Inquiry','Returns & Refunds','Product Question','Shipping & Delivery','Account Help','Feedback','Other'].map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div><label className="block text-xs font-semibold text-[#2C3830] mb-1.5">Message *</label><textarea value={form.message} onChange={e=>setForm({...form,message:e.target.value})} required rows={5} placeholder="Write your message here…" className="w-full px-4 py-3 border-2 border-[#C8D4BE] rounded-xl text-sm focus:border-[#819A91] focus:ring-4 focus:ring-[#819A91]/15 outline-none transition-all resize-none"/></div>
              <button type="submit" className="w-full bg-gradient-sage text-white py-3.5 rounded-xl font-bold hover:opacity-90 hover:-translate-y-0.5 transition-all">
                <i className="fas fa-paper-plane mr-2"></i>Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
