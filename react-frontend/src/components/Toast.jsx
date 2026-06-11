import React, { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext()

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }, [])

  const icons = { success: 'check-circle', danger: 'times-circle', info: 'info-circle', warning: 'exclamation-circle' }
  const colors = {
    success: 'bg-[#819A91] border-l-4 border-[#2C3830]',
    danger:  'bg-red-500 border-l-4 border-red-800',
    info:    'bg-[#2C3830] border-l-4 border-[#819A91]',
    warning: 'bg-amber-500 border-l-4 border-amber-800'
  }

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2">
        {toasts.map(t => (
          <div key={t.id} className={`${colors[t.type] || colors.info} text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 min-w-56 max-w-xs animate-slide-in`}>
            <i className={`fas fa-${icons[t.type] || 'check-circle'} flex-shrink-0`}></i>
            <span className="text-sm font-medium">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
