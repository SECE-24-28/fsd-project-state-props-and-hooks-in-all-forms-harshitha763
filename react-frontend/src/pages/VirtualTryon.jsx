import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useToast } from '../components/Toast'
import api from '../utils/api'
import { PRODUCTS as LOCAL } from '../data/products'

const COLOR_HEX = {
  Black:'#111', White:'#eee', Navy:'#0a1a3e', Red:'#b71c1c', Olive:'#4a5e2a',
  Beige:'#d4b483', Pink:'#e91e8c', Blue:'#1565c0', Green:'#2e7d32',
  Brown:'#5d4037', Khaki:'#a08840', Grey:'#757575', Gold:'#c8a400',
  Cream:'#f0e8d0', Sage:'#819A91', Mint:'#A7C1A8',
}

export default function VirtualTryon() {
  const { addToCart } = useCart()
  const showToast     = useToast()
  const videoRef      = useRef(null)
  const canvasRef     = useRef(null)
  const overlayRef    = useRef(null)
  const fileRef       = useRef(null)
  const animRef       = useRef(null)
  const streamRef     = useRef(null)

  const [products, setProducts]     = useState([])
  const [selected, setSelected]     = useState(null)
  const [camOn, setCamOn]           = useState(false)
  const [bgImg, setBgImg]           = useState(null)
  const [opacity, setOpacity]       = useState(80)
  const [catFilter, setCatFilter]   = useState('all')
  const [selectedColor, setColor]   = useState('')
  const [colorTint, setColorTint]   = useState(null)
  const [showGuide, setShowGuide]   = useState(true)
  const [imgError, setImgError]     = useState({})

  useEffect(() => {
    api.get('/products')
      .then(r => setProducts(r.data.filter(p=>['women','men','ethnic','unisex'].includes(p.tag))))
      .catch(() => setProducts(LOCAL.filter(p=>['women','men','ethnic','unisex'].includes(p.tag))))
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(t=>t.stop())
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [])

  const filtered = catFilter==='all' ? products : products.filter(p=>p.tag===catFilter)

  /* ── Camera ── */
  const startCam = async () => {
    if (camOn) { stopCam(); return }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video:{ facingMode:'user', width:{ideal:1280}, height:{ideal:960} }, audio:false
      })
      streamRef.current = stream
      videoRef.current.srcObject = stream
      await videoRef.current.play()
      setCamOn(true)
      setBgImg(null)
      setShowGuide(false)
      drawLoop()
      showToast('📷 Camera on! Select a garment →', 'success')
    } catch(e) {
      showToast('Camera blocked. Please allow access or upload a photo.', 'danger')
    }
  }

  const stopCam = () => {
    if (streamRef.current) streamRef.current.getTracks().forEach(t=>t.stop())
    streamRef.current = null
    setCamOn(false)
    if (animRef.current) cancelAnimationFrame(animRef.current)
  }

  /* ── Canvas draw loop (real-time camera + overlay) ── */
  const drawLoop = useCallback(() => {
    const canvas = canvasRef.current
    const video  = videoRef.current
    const overlay= overlayRef.current
    if (!canvas || !video || video.paused || video.ended) return

    const ctx = canvas.getContext('2d')
    canvas.width  = video.videoWidth  || video.clientWidth
    canvas.height = video.videoHeight || video.clientHeight

    // Draw video frame
    ctx.save()
    ctx.scale(-1, 1)
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height)
    ctx.restore()

    // Draw garment overlay
    if (overlay && overlay.complete && overlay.naturalWidth > 0) {
      const gw = canvas.width  * 0.72
      const gh = canvas.height * 0.72
      const gx = (canvas.width  - gw) / 2
      const gy = canvas.height  * 0.08

      ctx.globalAlpha = opacity / 100
      if (colorTint) {
        ctx.globalCompositeOperation = 'source-over'
      }
      ctx.drawImage(overlay, gx, gy, gw, gh)

      // Apply color tint
      if (colorTint) {
        ctx.globalCompositeOperation = 'multiply'
        ctx.globalAlpha = 0.35
        ctx.fillStyle = colorTint
        ctx.fillRect(gx, gy, gw, gh)
        ctx.globalCompositeOperation = 'source-over'
      }
      ctx.globalAlpha = 1
    }

    animRef.current = requestAnimationFrame(drawLoop)
  }, [opacity, colorTint])

  useEffect(() => {
    if (camOn) {
      if (animRef.current) cancelAnimationFrame(animRef.current)
      drawLoop()
    }
  }, [camOn, opacity, colorTint, selected])

  /* ── Upload photo ── */
  const loadPhoto = e => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      setBgImg(ev.target.result)
      stopCam()
      setShowGuide(false)
      showToast('✅ Photo loaded! Select a garment →', 'success')
    }
    reader.readAsDataURL(file)
  }

  /* ── Select garment ── */
  const selectProduct = p => {
    setSelected(p)
    setColor(p.colors?.[0] || '')
    setColorTint(p.colors?.[0] ? COLOR_HEX[p.colors[0]] || null : null)
    setShowGuide(false)
    showToast(`👗 "${p.name}" selected! Adjust with the controls below.`, 'info')
  }

  /* ── Color switch ── */
  const switchColor = (c) => {
    setColor(c)
    setColorTint(COLOR_HEX[c] || null)
    showToast(`Color changed to ${c}`, 'success')
  }

  /* ── Snapshot ── */
  const takeSnap = () => {
    const canvas = canvasRef.current
    if (camOn && canvas.width > 0) {
      const link = document.createElement('a')
      link.download = `fashioncart-tryon-${Date.now()}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
      showToast('📸 Snapshot saved!', 'success')
      return
    }
    // Photo mode
    const stage = document.getElementById('tryStage')
    const offscreen = document.createElement('canvas')
    offscreen.width  = stage.offsetWidth  * 2
    offscreen.height = stage.offsetHeight * 2
    const ctx = offscreen.getContext('2d')
    ctx.scale(2,2)

    const draw = () => {
      const overlay = overlayRef.current
      if (overlay && overlay.complete) {
        const gw = stage.offsetWidth  * 0.72
        const gh = stage.offsetHeight * 0.72
        const gx = (stage.offsetWidth  - gw) / 2
        const gy = stage.offsetHeight  * 0.08
        ctx.globalAlpha = opacity / 100
        ctx.drawImage(overlay, gx, gy, gw, gh)
        if (colorTint) {
          ctx.globalCompositeOperation = 'multiply'
          ctx.globalAlpha = 0.35
          ctx.fillStyle = colorTint
          ctx.fillRect(gx, gy, gw, gh)
          ctx.globalCompositeOperation = 'source-over'
        }
        ctx.globalAlpha = 1
      }
      const link = document.createElement('a')
      link.download = `fashioncart-tryon-${Date.now()}.png`
      link.href = offscreen.toDataURL('image/png')
      link.click()
      showToast('📸 Snapshot saved!', 'success')
    }

    if (bgImg) {
      const bg = new Image()
      bg.onload = () => { ctx.drawImage(bg, 0, 0, stage.offsetWidth, stage.offsetHeight); draw() }
      bg.src = bgImg
    } else { draw() }
  }

  const addSel = async () => {
    if (!selected) { showToast('Select a garment first!', 'warning'); return }
    await addToCart(selected._id, 1, selected.sizes?.[0]||'', selectedColor)
    showToast(`✅ ${selected.name} added to cart!`, 'success')
  }

  return (
    <div className="min-h-screen bg-[#0d1a12] pt-20">
      {/* Hero */}
      <div className="text-center py-10 px-6">
        <div className="inline-flex items-center gap-2 bg-[#819A91]/15 border border-[#819A91]/35 text-[#A7C1A8] px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-5">
          <span className="w-2 h-2 bg-[#A7C1A8] rounded-full animate-pulse"></span>
          Augmented Reality · No App Needed
        </div>
        <h1 className="font-playfair text-5xl font-extrabold text-white mb-3">Virtual Try-On Studio</h1>
        <p className="text-white/50 max-w-lg mx-auto text-sm leading-relaxed">
          Use your live camera or upload a photo — see any garment on you instantly before buying
        </p>
      </div>

      {/* How to use */}
      {showGuide && (
        <div className="max-w-5xl mx-auto px-6 mb-6">
          <div className="bg-[#819A91]/10 border border-[#819A91]/25 rounded-2xl p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-bold flex items-center gap-2">
                <i className="fas fa-circle-info text-[#A7C1A8]"></i>How to Use
              </h3>
              <button onClick={() => setShowGuide(false)} className="text-white/30 hover:text-white text-xs transition-colors">✕ Close</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { step:'1', icon:'📷', title:'Start Camera / Upload', desc:'Click "Camera" for live view, or "Upload" to use a photo of yourself' },
                { step:'2', icon:'👗', title:'Pick a Garment',         desc:'Browse the right panel and click any clothing item to overlay it' },
                { step:'3', icon:'🎨', title:'Adjust & Change Color',  desc:'Use the opacity slider and color swatches to fine-tune the look' },
                { step:'4', icon:'📸', title:'Snapshot or Buy',        desc:'Download your try-on photo or add the item directly to your cart' },
              ].map(s => (
                <div key={s.step} className="bg-white/[0.05] border border-white/10 rounded-xl p-4 text-center">
                  <div className="text-3xl mb-2">{s.icon}</div>
                  <div className="text-[#A7C1A8] text-xs font-bold mb-1">Step {s.step}: {s.title}</div>
                  <div className="text-white/40 text-[10px] leading-relaxed">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 pb-16 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Stage ── */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div id="tryStage" className="relative bg-[#111a14] rounded-2xl overflow-hidden border border-[#819A91]/20"
            style={{aspectRatio:'4/5', maxHeight:'570px', display:'flex', alignItems:'center', justifyContent:'center'}}>

            {/* Camera canvas (replaces video in display) */}
            {camOn && (
              <canvas ref={canvasRef}
                className="absolute inset-0 w-full h-full object-cover"
                style={{display:'block'}}/>
            )}
            {/* Hidden video source for canvas */}
            <video ref={videoRef} className="hidden" playsInline muted/>

            {/* Photo background */}
            {bgImg && !camOn && (
              <img src={bgImg} alt="Your photo" className="absolute inset-0 w-full h-full object-cover"/>
            )}

            {/* Garment overlay (photo mode) */}
            {selected && !camOn && (bgImg) && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <div className="relative" style={{maxHeight:'78%', maxWidth:'86%'}}>
                  <img
                    ref={overlayRef}
                    src={selected.image}
                    alt={selected.name}
                    crossOrigin="anonymous"
                    className="max-h-full max-w-full object-contain drop-shadow-2xl"
                    style={{
                      opacity: opacity/100,
                      filter: colorTint ? `sepia(1) saturate(3) hue-rotate(${getHue(colorTint)}deg)` : 'none',
                      transition: 'filter 0.4s ease, opacity 0.3s ease'
                    }}
                    onError={e => e.target.style.display='none'}
                  />
                </div>
              </div>
            )}
            {/* Hidden overlay img for canvas mode */}
            {selected && camOn && (
              <img ref={overlayRef} src={selected.image} alt="" className="hidden" crossOrigin="anonymous"
                onError={e => e.target.style.opacity='0'}/>
            )}

            {/* AR corner brackets */}
            {(camOn || bgImg) && selected && (
              <>
                <div className="absolute top-4 left-4 w-8 h-8 border-t-[3px] border-l-[3px] border-[#A7C1A8] rounded-tl-lg z-20 pointer-events-none"></div>
                <div className="absolute top-4 right-4 w-8 h-8 border-t-[3px] border-r-[3px] border-[#A7C1A8] rounded-tr-lg z-20 pointer-events-none"></div>
                <div className="absolute bottom-16 left-4 w-8 h-8 border-b-[3px] border-l-[3px] border-[#A7C1A8] rounded-bl-lg z-20 pointer-events-none"></div>
                <div className="absolute bottom-16 right-4 w-8 h-8 border-b-[3px] border-r-[3px] border-[#A7C1A8] rounded-br-lg z-20 pointer-events-none"></div>
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                  <span className="flex items-center gap-1.5 bg-[#0d1a12]/80 backdrop-blur border border-[#819A91]/40 text-[#A7C1A8] text-[10px] font-bold px-3 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 bg-[#A7C1A8] rounded-full animate-pulse"></span>
                    {camOn ? 'AR LIVE' : 'TRY-ON'}
                  </span>
                </div>
              </>
            )}

            {/* Placeholder */}
            {!camOn && !bgImg && (
              <div className="flex flex-col items-center justify-center gap-5 p-10 text-center z-10 w-full">
                <div className="relative">
                  <div className="w-28 h-28 border-2 border-dashed border-[#819A91]/30 rounded-full flex items-center justify-center animate-spin-slow">
                    <i className="fas fa-tshirt text-5xl text-[#819A91]/30"></i>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <i className="fas fa-tshirt text-4xl text-[#819A91]/60"></i>
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-bold text-2xl mb-2">Start Your Try-On</h3>
                  <p className="text-white/40 text-sm max-w-xs mx-auto leading-relaxed">Enable your camera for a live experience, or upload a photo of yourself</p>
                </div>
                <div className="flex gap-3 flex-wrap justify-center">
                  <button onClick={startCam}
                    className="bg-gradient-sage text-white px-7 py-3.5 rounded-full font-bold hover:opacity-90 hover:-translate-y-0.5 transition-all flex items-center gap-2 shadow-sage">
                    <i className="fas fa-video"></i>Enable Camera
                  </button>
                  <button onClick={() => fileRef.current?.click()}
                    className="border-2 border-[#819A91]/40 text-[#A7C1A8] px-7 py-3.5 rounded-full font-semibold hover:border-[#A7C1A8] hover:text-white transition-all flex items-center gap-2">
                    <i className="fas fa-image"></i>Upload Photo
                  </button>
                </div>
                <p className="text-white/20 text-xs">💡 Best results: front-facing full-body photo in good lighting</p>
              </div>
            )}

            {/* Bottom product badge */}
            {selected && (camOn || bgImg) && (
              <div className="absolute bottom-3 left-3 right-3 bg-[#0d1a12]/90 backdrop-blur-md rounded-2xl p-3 flex items-center gap-3 z-30">
                <img src={selected.image} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                  onError={e=>e.target.src=`https://placehold.co/40x40/D1D8BE/2C3830?text=${selected.name[0]}`}/>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-xs truncate">{selected.name}</p>
                  <p className="text-[#A7C1A8] font-black text-sm">₹{selected.price.toLocaleString('en-IN')}</p>
                </div>
                <button onClick={addSel}
                  className="bg-gradient-sage text-white text-xs font-bold px-3.5 py-2 rounded-xl hover:opacity-90 flex-shrink-0 flex items-center gap-1">
                  <i className="fas fa-cart-plus"></i>Add
                </button>
              </div>
            )}
          </div>

          {/* Controls */}
          {selected && (
            <div className="bg-white/[0.05] border border-white/10 rounded-2xl p-4 space-y-4">
              {/* Opacity */}
              <div className="flex items-center gap-3">
                <i className="fas fa-layer-group text-[#819A91] w-5 text-center flex-shrink-0"></i>
                <span className="text-white/60 text-xs font-semibold whitespace-nowrap w-24">Overlay {opacity}%</span>
                <input type="range" min={20} max={100} value={opacity}
                  onChange={e => setOpacity(+e.target.value)}
                  className="flex-1 h-2 rounded-full cursor-pointer accent-[#819A91]"/>
              </div>
              {/* Color swatches */}
              {selected.colors && selected.colors.length > 0 && (
                <div className="flex items-center gap-3 flex-wrap">
                  <i className="fas fa-palette text-[#819A91] w-5 text-center flex-shrink-0"></i>
                  <span className="text-white/60 text-xs font-semibold whitespace-nowrap">Color:</span>
                  <div className="flex gap-2 flex-wrap">
                    {selected.colors.map(c => (
                      <button key={c} onClick={() => switchColor(c)} title={c}
                        className={`w-8 h-8 rounded-full transition-all duration-200 flex-shrink-0 ${selectedColor===c ? 'ring-2 ring-white ring-offset-2 ring-offset-[#1E2A24] scale-110' : 'hover:scale-110'}`}
                        style={{ background: COLOR_HEX[c] || '#888', border: c==='White'?'2px solid #ccc':'none' }}>
                        {selectedColor===c && <i className="fas fa-check text-[8px]" style={{color: c==='White'||c==='Cream'?'#333':'white'}}></i>}
                      </button>
                    ))}
                  </div>
                  <span className="text-[#A7C1A8] text-xs font-semibold">{selectedColor}</span>
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button onClick={startCam}
              className={`py-3 rounded-2xl text-sm font-bold border-2 transition-all flex items-center justify-center gap-2 ${camOn ? 'border-red-400/60 text-red-400 hover:bg-red-400/10' : 'border-[#819A91]/40 text-[#A7C1A8] hover:bg-[#819A91]/15 hover:border-[#A7C1A8]'}`}>
              <i className={`fas fa-${camOn ? 'video-slash' : 'video'}`}></i>
              {camOn ? 'Stop Cam' : 'Camera'}
            </button>
            <button onClick={() => fileRef.current?.click()}
              className="py-3 rounded-2xl text-sm font-bold border-2 border-white/15 text-white/70 hover:border-[#819A91]/50 hover:text-white transition-all flex items-center justify-center gap-2">
              <i className="fas fa-image"></i>Upload
            </button>
            <button onClick={takeSnap}
              className="py-3 rounded-2xl text-sm font-bold border-2 border-white/15 text-white/70 hover:border-[#819A91]/50 hover:text-white transition-all flex items-center justify-center gap-2">
              <i className="fas fa-camera"></i>Snapshot
            </button>
            <button onClick={addSel}
              className="py-3 rounded-2xl text-sm font-bold bg-gradient-sage text-white hover:opacity-90 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 shadow-sage-sm">
              <i className="fas fa-cart-plus"></i>Add to Cart
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={loadPhoto}/>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[['3M+','Try-Ons Done'],['78%','Fewer Returns'],['4.9★','Satisfaction']].map(([n,l]) => (
              <div key={l} className="bg-white/[0.04] border border-white/8 rounded-2xl p-4 text-center hover:bg-[#819A91]/10 transition-colors">
                <div className="text-white font-black text-xl">{n}</div>
                <div className="text-white/35 text-[10px] uppercase tracking-widest mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div className="flex flex-col gap-4">
          {/* Selected product card */}
          {selected && (
            <div className="bg-[#819A91]/12 border border-[#819A91]/30 rounded-2xl overflow-hidden">
              <div className="relative h-36 overflow-hidden">
                <img src={selected.image} alt={selected.name} className="w-full h-full object-cover"
                  onError={e=>e.target.src=`https://placehold.co/300x150/D1D8BE/2C3830?text=${encodeURIComponent(selected.name)}`}/>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1a12] via-transparent to-transparent"></div>
                <div className="absolute bottom-2 left-3">
                  <p className="text-white font-bold text-sm">{selected.name}</p>
                  <p className="text-[#A7C1A8] font-black">₹{selected.price.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          )}

          {/* Category filter */}
          <div className="bg-white/[0.04] border border-white/8 rounded-2xl p-4">
            <p className="text-white/30 text-[9px] font-bold uppercase tracking-[2px] mb-3">Category</p>
            <div className="flex flex-wrap gap-1.5">
              {['all','women','men','ethnic','unisex'].map(c => (
                <button key={c} onClick={() => setCatFilter(c)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-bold capitalize transition-all ${catFilter===c ? 'bg-gradient-sage text-white shadow-sage-sm' : 'bg-white/8 text-white/50 border border-white/10 hover:border-[#819A91]/50 hover:text-white/80'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Products grid */}
          <div className="bg-white/[0.04] border border-white/8 rounded-2xl p-4 flex-1">
            <p className="text-white/30 text-[9px] font-bold uppercase tracking-[2px] mb-3">
              Select Garment <span className="text-[#819A91]">({filtered.length})</span>
            </p>
            <div className="grid grid-cols-2 gap-2 overflow-y-auto pr-0.5" style={{maxHeight:'400px', scrollbarWidth:'thin', scrollbarColor:'#819A91 transparent'}}>
              {filtered.map(p => (
                <div key={p._id} onClick={() => selectProduct(p)}
                  className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all duration-200 group ${selected?._id===p._id ? 'border-[#A7C1A8] shadow-[0_0_12px_rgba(167,193,168,0.4)]' : 'border-transparent hover:border-[#819A91]/60'}`}>
                  <div className="aspect-square overflow-hidden">
                    <img src={p.image} alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                      onError={e => {
                        if (!imgError[p._id]) {
                          setImgError(prev => ({...prev, [p._id]: true}))
                          e.target.src = `https://placehold.co/200x200/D1D8BE/2C3830?text=${encodeURIComponent(p.name.split(' ')[0])}`
                        }
                      }}/>
                  </div>
                  {selected?._id===p._id && (
                    <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-[#A7C1A8] rounded-full flex items-center justify-center z-10">
                      <i className="fas fa-check text-[#2C3830] text-[8px]"></i>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2">
                    <p className="text-white text-[9px] font-bold leading-tight truncate">{p.name}</p>
                    <p className="text-[#A7C1A8] text-[9px] font-black">₹{p.price.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-2">
            <Link to="/size-advisor"
              className="flex items-center gap-3 bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-white/60 hover:text-[#A7C1A8] hover:border-[#819A91]/40 hover:bg-[#819A91]/10 transition-all text-sm font-semibold">
              <i className="fas fa-robot text-[#A7C1A8] w-5 text-center text-base"></i>
              <span>AI Size Advisor</span>
              <i className="fas fa-arrow-right ml-auto text-xs opacity-50"></i>
            </Link>
            <Link to="/shop-the-look"
              className="flex items-center gap-3 bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-white/60 hover:text-[#A7C1A8] hover:border-[#819A91]/40 hover:bg-[#819A91]/10 transition-all text-sm font-semibold">
              <i className="fas fa-images text-[#A7C1A8] w-5 text-center text-base"></i>
              <span>Shop The Look</span>
              <i className="fas fa-arrow-right ml-auto text-xs opacity-50"></i>
            </Link>
            <Link to="/shop"
              className="flex items-center gap-3 bg-gradient-sage rounded-xl px-4 py-3 text-white text-sm font-bold hover:opacity-90 transition-opacity shadow-sage-sm">
              <i className="fas fa-shopping-bag w-5 text-center text-base"></i>
              <span>Browse All Products</span>
              <i className="fas fa-arrow-right ml-auto text-xs opacity-70"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper: convert hex color to hue-rotate degree approximation
function getHue(hex) {
  if (!hex) return 0
  const r = parseInt(hex.slice(1,3)||'0',16)/255
  const g = parseInt(hex.slice(3,5)||'0',16)/255
  const b = parseInt(hex.slice(5,7)||'0',16)/255
  const max = Math.max(r,g,b), min = Math.min(r,g,b)
  if (max===min) return 0
  let h = 0
  if (max===r) h = ((g-b)/(max-min))%6
  else if (max===g) h = (b-r)/(max-min)+2
  else h = (r-g)/(max-min)+4
  return Math.round(h*60) % 360
}
