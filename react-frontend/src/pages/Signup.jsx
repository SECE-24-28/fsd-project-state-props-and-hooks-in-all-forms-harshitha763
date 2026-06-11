import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

export default function Signup() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', phone:'', password:'', confirm:'' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [strength, setStrength] = useState(0)

  const checkStrength = pwd => {
    let s = 0
    if (pwd.length >= 6) s++
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) s++
    if (/[^A-Za-z0-9]/.test(pwd)) s++
    setStrength(s)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      const res = await api.post('/auth/register', { firstName:form.firstName, lastName:form.lastName, email:form.email, phone:form.phone, password:form.password })
      login(res.data.user, res.data.token)
      navigate('/shop')
    } catch(err) {
      setError(err.error || 'Registration failed')
    } finally { setLoading(false) }
  }

  const strengthColors = ['bg-red-400','bg-amber-400','bg-emerald-400']
  const strengthLabels = ['Weak','Fair','Strong']

  return (
    <div className="min-h-screen bg-[#1E2A24] flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-sage rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sage">
            <i className="fas fa-shopping-bag text-white text-2xl"></i>
          </div>
          <h2 className="font-playfair text-3xl font-extrabold text-[#2C3830]">Create Account</h2>
          <p className="text-[#6B7C75] text-sm mt-1">Join FashionCart and start shopping</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm mb-5 flex items-center gap-2">
            <i className="fas fa-times-circle"></i>{error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#2C3830] mb-1.5">First Name</label>
              <input type="text" value={form.firstName} onChange={e=>setForm({...form,firstName:e.target.value})} placeholder="First name" required
                className="w-full px-4 py-3 border-2 border-[#C8D4BE] rounded-xl text-sm focus:border-[#819A91] focus:ring-4 focus:ring-[#819A91]/15 outline-none transition-all"/>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#2C3830] mb-1.5">Last Name</label>
              <input type="text" value={form.lastName} onChange={e=>setForm({...form,lastName:e.target.value})} placeholder="Last name" required
                className="w-full px-4 py-3 border-2 border-[#C8D4BE] rounded-xl text-sm focus:border-[#819A91] focus:ring-4 focus:ring-[#819A91]/15 outline-none transition-all"/>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#2C3830] mb-1.5">Email Address</label>
            <div className="relative">
              <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7C75] text-sm"></i>
              <input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com" required
                className="w-full pl-11 pr-4 py-3 border-2 border-[#C8D4BE] rounded-xl text-sm focus:border-[#819A91] focus:ring-4 focus:ring-[#819A91]/15 outline-none transition-all"/>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#2C3830] mb-1.5">Phone Number</label>
            <div className="relative">
              <i className="fas fa-phone absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7C75] text-sm"></i>
              <input type="tel" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+91 00000 00000"
                className="w-full pl-11 pr-4 py-3 border-2 border-[#C8D4BE] rounded-xl text-sm focus:border-[#819A91] focus:ring-4 focus:ring-[#819A91]/15 outline-none transition-all"/>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#2C3830] mb-1.5">Password</label>
            <div className="relative">
              <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7C75] text-sm"></i>
              <input type="password" value={form.password} onChange={e=>{setForm({...form,password:e.target.value});checkStrength(e.target.value)}} placeholder="Min. 6 characters" required
                className="w-full pl-11 pr-4 py-3 border-2 border-[#C8D4BE] rounded-xl text-sm focus:border-[#819A91] focus:ring-4 focus:ring-[#819A91]/15 outline-none transition-all"/>
            </div>
            {form.password && (
              <div className="mt-2 flex gap-1.5 items-center">
                {[1,2,3].map(i => <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i<=strength ? strengthColors[strength-1] : 'bg-gray-200'}`}></div>)}
                <span className="text-xs text-[#6B7C75] ml-1">{strength > 0 ? strengthLabels[strength-1] : ''}</span>
              </div>
            )}
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#2C3830] mb-1.5">Confirm Password</label>
            <div className="relative">
              <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7C75] text-sm"></i>
              <input type="password" value={form.confirm} onChange={e=>setForm({...form,confirm:e.target.value})} placeholder="Repeat password" required
                className="w-full pl-11 pr-4 py-3 border-2 border-[#C8D4BE] rounded-xl text-sm focus:border-[#819A91] focus:ring-4 focus:ring-[#819A91]/15 outline-none transition-all"/>
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-gradient-sage text-white py-3.5 rounded-xl font-bold text-sm hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-sage disabled:opacity-60 mt-2">
            {loading ? <><i className="fas fa-spinner fa-spin mr-2"></i>Creating…</> : <><i className="fas fa-user-plus mr-2"></i>Create Account</>}
          </button>
        </form>
        <div className="text-center mt-5 text-sm text-[#6B7C75]">
          Already have an account? <Link to="/login" className="text-[#819A91] font-bold hover:underline">Sign in</Link>
        </div>
      </div>
    </div>
  )
}
