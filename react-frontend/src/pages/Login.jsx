import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email:'', password:'' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // 1. Try real backend first
      const res = await api.post('/auth/login', form)
      login(res.data.user, res.data.token)
      navigate('/shop')
    } catch(backendErr) {
      // 2. Demo account (always works)
      if (form.email.toLowerCase().trim() === 'suryasekar626@gmail.com' && form.password === 'Surya@123') {
        const demoUser = { id:'demo001', firstName:'Surya', lastName:'Sekar', email:'suryasekar626@gmail.com', phone:'+91 98765 43210' }
        login(demoUser, 'demo_token_' + Date.now())
        navigate('/shop')
        return
      }
      // 3. Fallback to localStorage users (offline mode)
      const users = JSON.parse(localStorage.getItem('fc_users') || '[]')
      const found = users.find(u => u.email.toLowerCase() === form.email.toLowerCase().trim() && u.password === form.password)
      if (found) {
        const { password:_pw, ...user } = found
        const token = 'local_' + Date.now()
        login(user, token)
        navigate('/shop')
      } else {
        setError(backendErr.error || backendErr.message || 'Invalid email or password')
      }
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-[#1E2A24] flex items-center justify-center px-4 pt-20">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-sage rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sage">
            <i className="fas fa-shopping-bag text-white text-2xl"></i>
          </div>
          <h2 className="font-playfair text-3xl font-extrabold text-[#2C3830]">FashionCart</h2>
          <p className="text-[#6B7C75] text-sm mt-1">Welcome back! Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm mb-5 flex items-center gap-2">
            <i className="fas fa-exclamation-circle"></i>{error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-[#2C3830] mb-2">Email Address</label>
            <div className="relative">
              <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7C75] text-sm"></i>
              <input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="you@example.com" required
                className="w-full pl-11 pr-4 py-3 border-2 border-[#C8D4BE] rounded-xl text-sm focus:border-[#819A91] focus:ring-4 focus:ring-[#819A91]/15 outline-none transition-all"/>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#2C3830] mb-2">Password</label>
            <div className="relative">
              <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7C75] text-sm"></i>
              <input type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Your password" required
                className="w-full pl-11 pr-4 py-3 border-2 border-[#C8D4BE] rounded-xl text-sm focus:border-[#819A91] focus:ring-4 focus:ring-[#819A91]/15 outline-none transition-all"/>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-[#6B7C75] cursor-pointer">
              <input type="checkbox" className="accent-[#819A91]"/> Remember me
            </label>
            <Link to="/forgot-password" className="text-[#819A91] font-semibold hover:underline">Forgot password?</Link>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-gradient-sage text-white py-3.5 rounded-xl font-bold text-sm hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-sage disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? <><i className="fas fa-spinner fa-spin mr-2"></i>Signing in…</> : <><i className="fas fa-sign-in-alt mr-2"></i>Sign In</>}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-[#6B7C75]">
          Don't have an account? <Link to="/signup" className="text-[#819A91] font-bold hover:underline">Create one free</Link>
        </div>

        {/* Demo hint */}
        <div className="mt-5 p-3 bg-[#F4F6EF] rounded-xl border border-[#C8D4BE]">
          <p className="text-xs text-[#6B7C75] text-center"><i className="fas fa-info-circle mr-1 text-[#819A91]"></i>Demo: <strong>suryasekar626@gmail.com</strong> / <strong>Surya@123</strong></p>
        </div>
      </div>
    </div>
  )
}
