import React from 'react'

const sections = [
  { title:'1. Acceptance of Terms', content:`By accessing or using FashionCart, you agree to be bound by these Terms and Conditions. If you do not agree, you may not use our services. By creating an account or making a purchase, you confirm you are at least 18 years old (or have parental consent).` },
  { title:'2. Account Registration', content:`You must provide accurate, complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately of any unauthorized access.` },
  { title:'3. Product Information & Pricing', content:`We strive to ensure all product information is accurate. However, we reserve the right to correct any errors and are not bound by pricing errors. All prices are in Indian Rupees (₹) and include applicable taxes unless stated otherwise. Product images are for illustrative purposes.` },
  { title:'4. Orders & Payment', content:`Placing an order constitutes an offer to buy the product at the listed price. We reserve the right to cancel orders due to stock unavailability or pricing errors. Payment must be completed at the time of placing the order (except COD). We do not store credit/debit card information on our servers.` },
  { title:'5. Delivery & Shipping', content:`Delivery timelines are estimates and not guaranteed. We are not liable for delays caused by courier partners, natural disasters, or other events beyond our control. Risk of loss passes to you upon delivery.` },
  { title:'6. Returns & Refunds', content:`Our 30-day return policy allows you to return most items in original condition with tags intact. Non-returnable items include innerwear, swimwear, customized items, and items marked "Final Sale". Refunds are processed within 5–7 business days of receiving the returned item.` },
  { title:'7. Intellectual Property', content:`All content on FashionCart — including text, images, logos, and design — is owned by FashionCart or its content suppliers and protected by Indian and international copyright laws. You may not reproduce, distribute, or create derivative works without written permission.` },
  { title:'8. Prohibited Activities', content:`You agree not to use our platform for any illegal purpose, post false or misleading content, attempt to hack or disrupt our systems, create multiple accounts to abuse promotional offers, or resell products purchased from FashionCart commercially.` },
  { title:'9. Limitation of Liability', content:`FashionCart shall not be liable for any indirect, incidental, special, or consequential damages. Our maximum liability is limited to the amount paid for the specific order in dispute.` },
  { title:'10. Governing Law', content:`These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.` },
]

export default function Terms() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="bg-gradient-sage text-white py-16 px-6 text-center">
        <h1 className="font-playfair text-5xl font-extrabold mb-3">Terms & Conditions</h1>
        <p className="text-white/80">Please read these terms carefully before using our services</p>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-14">
        <div className="inline-flex items-center gap-2 bg-[#F4F6EF] border border-[#C8D4BE] px-4 py-2 rounded-full text-sm text-[#6B7C75] mb-10">
          <i className="fas fa-calendar text-[#819A91]"></i>Last updated: December 1, 2024
        </div>
        <p className="text-[#6B7C75] leading-relaxed mb-10">By accessing or using FashionCart, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not use our services.</p>
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
          <p className="text-[#6B7C75] text-sm"><strong>Email:</strong> legal@fashioncart.in<br/><strong>Address:</strong> 123 Fashion Street, Bandra West, Mumbai 400050</p>
        </div>
      </div>
    </div>
  )
}
