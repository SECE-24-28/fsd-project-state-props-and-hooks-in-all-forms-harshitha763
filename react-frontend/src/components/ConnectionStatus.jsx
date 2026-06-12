import React, { useState, useEffect } from 'react'
import api from '../utils/api'

export default function ConnectionStatus() {
  const [online, setOnline]   = useState(null) // null=checking, true=online, false=offline
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const check = async () => {
      try {
        await api.get('/health')
        setOnline(true)
      } catch {
        setOnline(false)
      }
    }
    check()
    const interval = setInterval(check, 30000) // re-check every 30s
    return () => clearInterval(interval)
  }, [])

  // Auto-hide after 5s if online
  useEffect(() => {
    if (online === true) {
      const t = setTimeout(() => setVisible(false), 5000)
      return () => clearTimeout(t)
    } else {
      setVisible(true)
    }
  }, [online])

  if (!visible || online === null) return null

  return (
    <div className={`fixed bottom-4 left-4 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-full shadow-lg text-sm font-semibold transition-all ${online ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'}`}>
      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${online ? 'bg-white animate-pulse' : 'bg-white'}`}></span>
      {online
        ? <><i className="fas fa-database mr-1"></i>Connected to MongoDB</>
        : <><i className="fas fa-wifi-slash mr-1"></i>Offline Mode (localStorage)</>}
      {!online && (
        <a href="https://cloud.mongodb.com" target="_blank" rel="noreferrer"
          className="ml-2 underline text-white/80 hover:text-white text-xs">Resume Atlas</a>
      )}
      <button onClick={() => setVisible(false)} className="ml-1 text-white/60 hover:text-white">
        <i className="fas fa-times text-xs"></i>
      </button>
    </div>
  )
}
