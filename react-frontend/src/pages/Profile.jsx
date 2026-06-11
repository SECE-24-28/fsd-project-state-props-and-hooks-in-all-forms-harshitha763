import React, { useState, useEffect } from 'react'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'

export default function Profile() {
  const { user } = useAuth()
  const showToast = useToast()
  const [tab, setTab] = useState('personal')
  const [profile, setProfile] = useState({ firstName:'', lastName:'', phone:'', gender:'' })
  const [address, setAddress] = useState({ line1:'', line2:'', city:'', state:'', pin:'' })
  const [pwd, setPwd] = useState({ currentPassword:'', newPassword:'', confirm:'' })
  const [stats, setStats] = useState({ orders:0, wishlist:0 })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get('/auth/me')
      .then(r => {
        setProfile({ firstName:r.data.firstName||'', lastName:r.data.lastName||'', phone:r.data.phone||'', gender:r.data.gender||'' })
        if (r.data.address) setAddress(r.data.address)
      })
      .catch(() => {
        // Use user from context
        const u = JSON.parse(localStorage.getItem('fc_user') || '{}')
        setProfile({ firstName:u.firstName||'', lastName:u.lastName||'', phone:u.phone||'', gender:u.gender||'' })
        if (u.address) setAddress(u.address)
      })
    api.get('/orders').then(r => setStats(s=>({...s,orders:r.data.length}))).catch(() => {
      const local = JSON.parse(localStorage.getItem('fc_orders') || '[]')
      setStats(s => ({...s, orders: local.length}))
    })
    api.get('/wishlist').then(r => setStats(s=>({...s,wishlist:r.data.length}))).catch(() => {
      const wl = JSON.parse(localStorage.getItem('fc_wishlist') || '[]')
      setStats(s => ({...s, wishlist: wl.length}))
    })
  }, [])

  const saveProfile = async e => {
    e.preventDefault(); setSaving(true)
    try {
      await api.put('/auth/profile', profile)
    } catch {
      // Offline: update localStorage
      const u = JSON.parse(localStorage.getItem('fc_user') || '{}')
      Object.assign(u, profile)
      localStorage.setItem('fc_user', JSON.stringify(u))
    }
    showToast('Profile updated!','success')
    setSaving(false)
  }

  const saveAddress = async e => {
    e.preventDefault(); setSaving(true)
    try {
      await api.put('/auth/address', address)
    } catch {
      const u = JSON.parse(localStorage.getItem('fc_user') || '{}')
      u.address = address
      localStorage.setItem('fc_user', JSON.stringify(u))
    }
    showToast('Address saved!','success')
    setSaving(false)
  }

  const changePwd = async e => {
    e.preventDefault()
    if (pwd.newPassword !== pwd.confirm) { showToast('Passwords do not match','danger'); return }
    setSaving(true)
    try {
      await api.put('/auth/password', { currentPassword:pwd.currentPassword, newPassword:pwd.newPassword })
      showToast('Password changed!','success')
      setPwd({currentPassword:'',newPassword:'',confirm:''})
    } catch(err) { showToast(err.error||'Failed — check your current password','danger') }
    setSaving(false)
  }

  const tabs = [['personal','User','Personal Info'],['security','Lock','Security'],['address','Map Marker Alt','Address']]

  return (
    <div className="min-h-screen bg-[#F4F6EF] pt-20">
      <div className="bg-gradient-sage text-white py-12 px-6 text-center">
        <h1 className="font-playfair text-4xl font-extrabold mb-2">My Profile</h1>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-7">
          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-[#C8D4BE]">
              <div className="w-20 h-20 bg-gradient-sage rounded-full flex items-center justify-center text-white text-3xl font-black mx-auto mb-3">
                {(user?.firstName||'U')[0].toUpperCase()}
              </div>
              <h3 className="font-bold text-[#2C3830]">{user?.firstName} {user?.lastName}</h3>
              <p className="text-[#6B7C75] text-xs mt-1">{user?.email}</p>
              <span className="inline-block mt-2 bg-gradient-sage text-white text-xs font-bold px-3 py-1 rounded-full">Member</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[['Orders',stats.orders,'fa-box'],['Wishlist',stats.wishlist,'fa-heart']].map(([l,n,ic]) => (
                <div key={l} className="bg-white rounded-2xl p-4 text-center shadow-sm border border-[#C8D4BE]">
                  <div className="text-2xl font-black text-[#819A91]">{n}</div>
                  <div className="text-xs text-[#6B7C75] mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Main */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-[#C8D4BE] overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-[#C8D4BE]">
              {tabs.map(([id,,label]) => (
                <button key={id} onClick={() => setTab(id)}
                  className={`flex-1 py-4 text-sm font-semibold transition-colors ${tab===id?'text-[#819A91] border-b-3 border-[#819A91]':'text-[#6B7C75] hover:text-[#2C3830]'}`}
                  style={tab===id?{borderBottom:'3px solid #819A91'}:{}}>
                  {label}
                </button>
              ))}
            </div>

            <div className="p-7">
              {tab === 'personal' && (
                <form onSubmit={saveProfile} className="space-y-5">
                  <h3 className="font-bold text-[#2C3830] text-lg mb-1">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-xs font-semibold text-[#2C3830] mb-1.5">First Name</label><input value={profile.firstName} onChange={e=>setProfile({...profile,firstName:e.target.value})} className="w-full px-4 py-3 border-2 border-[#C8D4BE] rounded-xl text-sm focus:border-[#819A91] outline-none transition-all"/></div>
                    <div><label className="block text-xs font-semibold text-[#2C3830] mb-1.5">Last Name</label><input value={profile.lastName} onChange={e=>setProfile({...profile,lastName:e.target.value})} className="w-full px-4 py-3 border-2 border-[#C8D4BE] rounded-xl text-sm focus:border-[#819A91] outline-none transition-all"/></div>
                    <div className="col-span-2"><label className="block text-xs font-semibold text-[#2C3830] mb-1.5">Email</label><input value={user?.email||''} disabled className="w-full px-4 py-3 border-2 border-[#C8D4BE] rounded-xl text-sm bg-[#F4F6EF] text-[#6B7C75] cursor-not-allowed"/></div>
                    <div className="col-span-2"><label className="block text-xs font-semibold text-[#2C3830] mb-1.5">Phone</label><input value={profile.phone} onChange={e=>setProfile({...profile,phone:e.target.value})} className="w-full px-4 py-3 border-2 border-[#C8D4BE] rounded-xl text-sm focus:border-[#819A91] outline-none transition-all"/></div>
                    <div className="col-span-2"><label className="block text-xs font-semibold text-[#2C3830] mb-1.5">Gender</label>
                      <select value={profile.gender} onChange={e=>setProfile({...profile,gender:e.target.value})} className="w-full px-4 py-3 border-2 border-[#C8D4BE] rounded-xl text-sm focus:border-[#819A91] outline-none cursor-pointer">
                        <option value="">Prefer not to say</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" disabled={saving} className="bg-gradient-sage text-white px-8 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60">
                    {saving?<><i className="fas fa-spinner fa-spin mr-2"></i>Saving…</>:<><i className="fas fa-save mr-2"></i>Save Changes</>}
                  </button>
                </form>
              )}

              {tab === 'security' && (
                <form onSubmit={changePwd} className="space-y-5">
                  <h3 className="font-bold text-[#2C3830] text-lg mb-1">Change Password</h3>
                  {[['currentPassword','Current Password'],['newPassword','New Password'],['confirm','Confirm New Password']].map(([k,l]) => (
                    <div key={k}><label className="block text-xs font-semibold text-[#2C3830] mb-1.5">{l}</label>
                      <input type="password" value={pwd[k]} onChange={e=>setPwd({...pwd,[k]:e.target.value})} placeholder="••••••" className="w-full px-4 py-3 border-2 border-[#C8D4BE] rounded-xl text-sm focus:border-[#819A91] outline-none transition-all"/>
                    </div>
                  ))}
                  <button type="submit" disabled={saving} className="bg-gradient-sage text-white px-8 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60">
                    {saving?<><i className="fas fa-spinner fa-spin mr-2"></i>Updating…</>:<><i className="fas fa-lock mr-2"></i>Update Password</>}
                  </button>
                </form>
              )}

              {tab === 'address' && (
                <form onSubmit={saveAddress} className="space-y-4">
                  <h3 className="font-bold text-[#2C3830] text-lg mb-1">Saved Address</h3>
                  {[['line1','Address Line 1','col-span-2'],['line2','Address Line 2 (optional)','col-span-2'],['city','City'],['state','State'],['pin','PIN Code']].map(([k,l,cls='']) => (
                    <div key={k} className={cls}><label className="block text-xs font-semibold text-[#2C3830] mb-1.5">{l}</label>
                      <input value={address[k]||''} onChange={e=>setAddress({...address,[k]:e.target.value})} maxLength={k==='pin'?6:undefined} className="w-full px-4 py-3 border-2 border-[#C8D4BE] rounded-xl text-sm focus:border-[#819A91] outline-none transition-all"/>
                    </div>
                  ))}
                  <button type="submit" disabled={saving} className="bg-gradient-sage text-white px-8 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60">
                    {saving?<><i className="fas fa-spinner fa-spin mr-2"></i>Saving…</>:<><i className="fas fa-save mr-2"></i>Save Address</>}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
