import React, { useState } from 'react'

const SIZE_CHART = {
  female: [
    {size:'XS',chest:[72,80],waist:[58,64],hips:[80,88]},
    {size:'S', chest:[80,88],waist:[64,70],hips:[88,94]},
    {size:'M', chest:[88,96],waist:[70,76],hips:[94,100]},
    {size:'L', chest:[96,104],waist:[76,82],hips:[100,108]},
    {size:'XL',chest:[104,112],waist:[82,90],hips:[108,116]},
    {size:'XXL',chest:[112,122],waist:[90,100],hips:[116,126]},
  ],
  male: [
    {size:'S', chest:[86,92],waist:[70,76],hips:[86,92]},
    {size:'M', chest:[92,98],waist:[76,82],hips:[92,98]},
    {size:'L', chest:[98,106],waist:[82,88],hips:[98,106]},
    {size:'XL',chest:[106,114],waist:[88,96],hips:[106,114]},
    {size:'XXL',chest:[114,124],waist:[96,106],hips:[114,122]},
  ],
}

export default function SizeAdvisor() {
  const [step, setStep]       = useState(1)
  const [gender, setGender]   = useState('female')
  const [cat, setCat]         = useState('tops')
  const [fit, setFit]         = useState('regular')
  const [measurements, setM]  = useState({ height:165, weight:65, chest:90, waist:75, hips:95, age:28 })
  const [result, setResult]   = useState(null)

  const calculate = () => {
    const chart = SIZE_CHART[gender] || SIZE_CHART.female
    let best = chart[Math.floor(chart.length/2)], bestScore = 0
    chart.forEach(s => {
      let score = 0
      if (measurements.chest>=s.chest[0] && measurements.chest<=s.chest[1]) score+=3
      if (measurements.waist>=s.waist[0] && measurements.waist<=s.waist[1]) score+=3
      if (measurements.hips>=s.hips[0]  && measurements.hips<=s.hips[1])   score+=2
      if (score > bestScore) { bestScore = score; best = s }
    })
    const allSizes  = chart.map(s => s.size)
    let idx = allSizes.indexOf(best.size)
    if (fit==='loose' && idx<allSizes.length-1) idx++
    if (fit==='tight' && idx>0)                  idx--
    const size       = allSizes[idx]
    const confidence = Math.min(97, 82 + bestScore * 2)
    const alts       = [allSizes[idx-1], allSizes[idx+1]].filter(Boolean)
    setResult({ size, confidence, alts })
    setStep(4)
  }

  const Slider = ({ label, id, min, max, unit }) => (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-semibold text-[#2C3830]">{label}</label>
        <span className="bg-gradient-sage text-white text-xs font-bold px-3 py-1 rounded-full">{measurements[id]} {unit}</span>
      </div>
      <input type="range" min={min} max={max} value={measurements[id]}
        onChange={e => setM({...measurements,[id]:parseInt(e.target.value)})}
        className="w-full accent-[#819A91] cursor-pointer h-2"/>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#1E2A24] pt-20">
      {/* Hero */}
      <div className="text-center py-14 px-6">
        <div className="inline-flex items-center gap-2 bg-[#819A91]/15 border border-[#819A91]/35 text-[#A7C1A8] px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-5">
          <i className="fas fa-robot"></i>AI POWERED · Reduces Returns by 78%
        </div>
        <h1 className="font-playfair text-5xl font-extrabold text-white mb-3">Smart Size Advisor</h1>
        <p className="text-white/55 max-w-md mx-auto text-sm">Answer a few quick questions and our AI finds your perfect fit.</p>
      </div>

      <div className="max-w-2xl mx-auto px-6 pb-20">
        {/* Progress */}
        {step < 4 && (
          <div className="flex items-center justify-center gap-0 mb-10">
            {[1,2,3].map((n,i) => (
              <React.Fragment key={n}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${n<step?'bg-[#819A91] text-white':n===step?'bg-gradient-sage text-white shadow-sage':'bg-white/10 text-white/40'}`}>{n<step?<i className="fas fa-check text-xs"></i>:n}</div>
                {i<2 && <div className={`h-0.5 w-16 transition-all ${n<step?'bg-[#819A91]':'bg-white/10'}`}></div>}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Step 1 */}
        {step===1 && (
          <div className="bg-white/[0.06] border border-white/10 rounded-3xl p-8">
            <h2 className="text-white font-bold text-xl mb-6">Who are you shopping for?</h2>
            <div className="grid grid-cols-3 gap-3 mb-7">
              {[['female','Venus','Women'],['male','Mars','Men'],['kids','Child','Kids']].map(([g,icon,label]) => (
                <button key={g} onClick={() => setGender(g)}
                  className={`rounded-2xl p-5 border-2 transition-all text-center ${gender===g?'border-[#819A91] bg-[#819A91]/15':'border-white/15 hover:border-white/30'}`}>
                  <i className={`fas fa-${icon} text-2xl text-[#A7C1A8] block mb-2`}></i>
                  <span className="text-white font-semibold text-sm">{label}</span>
                </button>
              ))}
            </div>
            <h3 className="text-white font-semibold mb-3">What are you buying?</h3>
            <div className="flex flex-wrap gap-2 mb-7">
              {['tops','dress','bottoms','ethnic','jacket'].map(c => (
                <button key={c} onClick={() => setCat(c)}
                  className={`px-4 py-2 rounded-full text-xs font-bold capitalize transition-all ${cat===c?'bg-gradient-sage text-white':'bg-white/10 text-white/60 border border-white/15 hover:border-white/35'}`}>{c}</button>
              ))}
            </div>
            <button onClick={() => setStep(2)} className="w-full bg-gradient-sage text-white py-4 rounded-2xl font-bold hover:opacity-90 transition-opacity">
              Next <i className="fas fa-arrow-right ml-2"></i>
            </button>
          </div>
        )}

        {/* Step 2 */}
        {step===2 && (
          <div className="bg-white/[0.06] border border-white/10 rounded-3xl p-8 space-y-6">
            <h2 className="text-white font-bold text-xl">Your measurements</h2>
            <Slider label="Height" id="height" min={140} max={200} unit="cm"/>
            <Slider label="Weight" id="weight" min={40}  max={120} unit="kg"/>
            <Slider label="Chest / Bust" id="chest" min={70} max={130} unit="cm"/>
            <Slider label="Waist" id="waist" min={55} max={120} unit="cm"/>
            <Slider label="Hips" id="hips" min={70} max={135} unit="cm"/>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setStep(1)} className="flex-1 border border-white/20 text-white/70 py-3.5 rounded-2xl font-semibold hover:border-white/40 transition-all">Back</button>
              <button onClick={() => setStep(3)} className="flex-1 bg-gradient-sage text-white py-3.5 rounded-2xl font-bold hover:opacity-90">Next <i className="fas fa-arrow-right ml-1"></i></button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step===3 && (
          <div className="bg-white/[0.06] border border-white/10 rounded-3xl p-8">
            <h2 className="text-white font-bold text-xl mb-6">How do you prefer your fit?</h2>
            <div className="grid grid-cols-3 gap-3 mb-7">
              {[['tight','Compress','Fitted'],['regular','Equals','Regular'],['loose','Expand','Oversized']].map(([f,icon,label]) => (
                <button key={f} onClick={() => setFit(f)}
                  className={`rounded-2xl p-5 border-2 transition-all text-center ${fit===f?'border-[#819A91] bg-[#819A91]/15':'border-white/15 hover:border-white/30'}`}>
                  <i className={`fas fa-${icon.toLowerCase()}-arrows-alt text-2xl text-[#A7C1A8] block mb-2`}></i>
                  <span className="text-white font-semibold text-sm">{label}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 border border-white/20 text-white/70 py-3.5 rounded-2xl font-semibold hover:border-white/40">Back</button>
              <button onClick={calculate} className="flex-1 bg-gradient-sage text-white py-3.5 rounded-2xl font-bold hover:opacity-90">
                <i className="fas fa-robot mr-2"></i>Get My Size
              </button>
            </div>
          </div>
        )}

        {/* Step 4 — Result */}
        {step===4 && result && (
          <div className="space-y-5">
            {/* Main result */}
            <div className="bg-gradient-sage rounded-3xl p-10 text-center text-white">
              <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-2">Your Recommended Size</p>
              <div className="text-9xl font-black my-4" style={{textShadow:'0 4px 20px rgba(0,0,0,.25)'}}>{result.size}</div>
              <p className="text-white/80 mb-4">{result.confidence}% confidence match</p>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all duration-1000" style={{width:`${result.confidence}%`}}></div>
              </div>
              <div className="mt-5">
                <p className="text-white/60 text-xs mb-2">Also fits in:</p>
                <div className="flex gap-2 justify-center">
                  {result.alts.map(s => <span key={s} className="bg-white/20 border border-white/30 text-white px-4 py-1.5 rounded-full text-sm font-bold">{s}</span>)}
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white/[0.06] border border-white/10 rounded-2xl p-6 space-y-3">
              <h3 className="text-white font-bold mb-2">Sizing Tips</h3>
              {[
                'For this category, sizes run slightly slim. Consider sizing up if between sizes.',
                'Not happy with the fit? Our 30-day hassle-free return policy means zero risk.',
                'Measure yourself before placing the order for best results.',
              ].map((tip,i) => (
                <div key={i} className="flex gap-3 items-start text-white/60 text-sm">
                  <i className="fas fa-circle-check text-[#A7C1A8] mt-0.5 flex-shrink-0"></i>{tip}
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 border border-white/20 text-white/70 py-3.5 rounded-2xl font-semibold hover:border-white/40 transition-all">
                <i className="fas fa-redo mr-2"></i>Start Over
              </button>
              <a href="/shop" className="flex-1 bg-gradient-sage text-white py-3.5 rounded-2xl font-bold text-center hover:opacity-90 transition-opacity inline-block">
                <i className="fas fa-shopping-bag mr-2"></i>Shop My Size
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
