import React from 'react'

const sections = [
  { title:'1. Information We Collect', content:`When you create an account, we collect your name, email address, phone number, and password (stored as a secure hash). When you place orders, we collect your delivery address, payment method (we do not store card details), and purchase history. We also collect information about how you interact with our website.` },
  { title:'2. How We Use Your Information', content:`We use your information to: process and fulfill your orders, create and manage your account, send promotional emails (you can unsubscribe anytime), improve our website and services, comply with legal obligations, and prevent fraud.` },
  { title:'3. Information Sharing', content:`We do not sell, trade, or rent your personal information to third parties. We may share your information with delivery partners (to fulfill orders), payment processors (to process transactions securely), and legal authorities (when required by law).` },
  { title:'4. Data Security', content:`We implement industry-standard security measures including SSL/TLS encryption for all data transmission, bcrypt password hashing, JWT-based authentication with 7-day expiry, and regular security audits.` },
  { title:'5. Cookies', content:`We use cookies and localStorage to maintain your session, remember preferences, and analyze usage. You can disable cookies in your browser settings, but this may affect some features of our website.` },
  { title:'6. Your Rights', content:`You have the right to access a copy of your personal data, correct incorrect information via your profile page, request deletion of your account and data, and opt-out of marketing emails at any time. Contact us at support@fashioncart.in to exercise these rights.` },
  { title:'7. Children\'s Privacy', content:`Our services are not directed to children under 13. We do not knowingly collect personal information from children under 13.` },
  { title:'8. Changes to This Policy', content:`We may update this Privacy Policy periodically. We will notify you of significant changes via email or a prominent notice on our website.` },
]

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="bg-gradient-sage text-white py-16 px-6 text-center">
        <h1 className="font-playfair text-5xl font-extrabold mb-3">Privacy Policy</h1>
        <p className="text-white/80">How we collect, use, and protect your personal information</p>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-14">
        <div className="inline-flex items-center gap-2 bg-[#F4F6EF] border border-[#C8D4BE] px-4 py-2 rounded-full text-sm text-[#6B7C75] mb-10">
          <i className="fas fa-calendar text-[#819A91]"></i>Last updated: December 1, 2024
        </div>
        <p className="text-[#6B7C75] leading-relaxed mb-10">This Privacy Policy describes how FashionCart collects, uses, and shares information about you when you use our website and services.</p>
        <div className="space-y-8">
          {sections.map(s => (
            <div key={s.title} className="border-l-4 border-[#819A91] pl-5">
              <h3 className="font-bold text-[#2C3830] text-base mb-3">{s.title}</h3>
              <p className="text-[#6B7C75] text-sm leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 p-5 bg-[#F4F6EF] rounded-2xl border border-[#C8D4BE]">
          <h4 className="font-bold text-[#2C3830] mb-2">Contact Us</h4>
          <p className="text-[#6B7C75] text-sm">For questions about this Privacy Policy:<br/><strong>Email:</strong> support@fashioncart.in<br/><strong>Phone:</strong> +91 98765 43210<br/><strong>Address:</strong> 123 Fashion Street, Bandra West, Mumbai 400050</p>
        </div>
      </div>
    </div>
  )
}
