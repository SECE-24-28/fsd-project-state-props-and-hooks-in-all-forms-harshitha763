import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const FAQS = [
  { cat:'Orders & Shopping', items:[
    { q:'How do I place an order?', a:'Browse our collections, add products to your cart, proceed to checkout, fill in your delivery address, choose a payment method and confirm. You\'ll receive an order confirmation instantly.' },
    { q:'Can I modify or cancel my order?', a:'You can cancel your order from "My Orders" as long as the status is "Confirmed". Once it\'s been shipped, cancellation is not possible. For modifications, contact us immediately.' },
    { q:'How do I track my order?', a:'Go to "My Orders" in your account. You\'ll see the current status — Confirmed, Processing, Shipped, or Delivered — along with a visual progress tracker.' },
    { q:'What payment methods are accepted?', a:'We accept Credit/Debit Cards (Visa, Mastercard, RuPay), UPI (GPay, PhonePe, Paytm), and Cash on Delivery (COD) for orders up to ₹10,000.' },
  ]},
  { cat:'Delivery & Shipping', items:[
    { q:'How long does delivery take?', a:'Standard delivery takes 3–5 business days. Metro cities typically receive orders within 2–3 days. Express delivery (1–2 days) is available for select pin codes.' },
    { q:'Is free shipping available?', a:'Yes! We offer free shipping on all orders above ₹499. Orders below ₹499 have a flat shipping fee of ₹50.' },
    { q:'Do you ship to all pin codes?', a:'We deliver to 25,000+ pin codes across India. If your pin code is not serviceable, you\'ll be notified at checkout.' },
  ]},
  { cat:'Returns & Refunds', items:[
    { q:'What is the return policy?', a:'We offer a 30-day return policy. Items must be unused, unwashed, with original tags and packaging intact. Some categories like lingerie and customized items are non-returnable.' },
    { q:'How do I initiate a return?', a:'Go to "My Orders", select the order, click "Return Item" and follow the instructions. Our team will arrange a pickup within 2 business days.' },
    { q:'When will I receive my refund?', a:'Refunds are credited within 5–7 business days after we receive and inspect the returned item. For COD orders, refunds are issued as store credits or NEFT transfer.' },
  ]},
  { cat:'Account & Security', items:[
    { q:'How do I create an account?', a:'Click "Sign Up", fill in your name, email, phone number and create a password. Your account is ready instantly.' },
    { q:'I forgot my password. What do I do?', a:'Click "Forgot Password" on the login page, enter your registered email, and follow the instructions to reset your password.' },
    { q:'Is my personal data safe?', a:'Absolutely. We use industry-standard SSL encryption for all transactions. Your passwords are hashed and never stored in plain text. We never share your personal data with third parties.' },
  ]},
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`border-2 rounded-xl overflow-hidden transition-all ${open?'border-[#819A91]':'border-[#C8D4BE] hover:border-[#819A91]/50'}`}>
      <button onClick={() => setOpen(!open)} className={`w-full flex justify-between items-center px-5 py-4 text-left font-semibold text-sm transition-all ${open?'bg-gradient-sage text-white':'bg-white text-[#2C3830] hover:bg-[#F4F6EF]'}`}>
        {q}
        <i className={`fas fa-chevron-down text-xs ml-3 flex-shrink-0 transition-transform ${open?'rotate-180':''}`}></i>
      </button>
      {open && <div className="bg-[#F4F6EF] px-5 py-4 text-sm text-[#6B7C75] leading-relaxed">{a}</div>}
    </div>
  )
}

export default function FAQ() {
  return (
    <div className="min-h-screen bg-[#F4F6EF] pt-20">
      <div className="bg-gradient-sage text-white py-16 px-6 text-center">
        <h1 className="font-playfair text-5xl font-extrabold mb-3">Frequently Asked Questions</h1>
        <p className="text-white/80 max-w-xl mx-auto">Find answers to the most common questions about FashionCart</p>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16 space-y-12">
        {FAQS.map(section => (
          <div key={section.cat}>
            <h3 className="font-bold text-[#2C3830] text-lg mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-gradient-sage rounded-full inline-block"></span>
              {section.cat}
            </h3>
            <div className="space-y-2">
              {section.items.map(item => <FAQItem key={item.q} {...item}/>)}
            </div>
          </div>
        ))}

        <div className="bg-white rounded-2xl p-7 text-center border border-[#C8D4BE] shadow-sm">
          <h4 className="font-bold text-[#2C3830] text-lg mb-2">Still have questions?</h4>
          <p className="text-[#6B7C75] text-sm mb-4">Our support team is available 24/7 to help you.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-gradient-sage text-white px-6 py-3 rounded-full font-bold hover:opacity-90 transition-opacity">
            <i className="fas fa-headset"></i>Contact Support
          </Link>
        </div>
      </div>
    </div>
  )
}
