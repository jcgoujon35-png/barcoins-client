'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()
  const [step, setStep] = useState<'phone'|'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [toast, setToast] = useState('')

  function sendCode() {
    if (phone.length < 10) return
    setToast('Code envoyé : 1234')
    setTimeout(() => setToast(''), 3000)
    setStep('otp')
  }
  function verify() {
    if (otp === '1234') {
      // Simulate recognizing or creating user from phone number
      const existing = typeof window !== 'undefined' ? localStorage.getItem('barcoins_user') : null
      if (!existing) {
        localStorage.setItem('barcoins_user', JSON.stringify({
          name: 'Alexandre M.', initials: 'AM', phone, coins: 1247, status: 'VIP', isNew: false
        }))
      }
      router.push('/dashboard')
    } else {
      setToast('Code incorrect, essaie 1234')
      setTimeout(() => setToast(''), 3000)
    }
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6" style={{background:'linear-gradient(160deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)'}}>
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl text-sm font-bold" style={{background:'#F59E0B',color:'#1a1a2e'}}>{toast}</div>
      )}
      <div className="w-full max-w-sm slide-up">
        <button onClick={() => router.back()} className="text-[#F5E6D3]/40 text-sm mb-6">← Retour</button>
        <div className="text-3xl font-black mb-1" style={{color:'#F59E0B'}}>Bar<span style={{color:'#fff'}}>⚡</span>Coins</div>
        <h1 className="text-[#F5E6D3] text-xl font-bold mb-1">Rejoindre la soirée</h1>
        <p className="text-[#F5E6D3]/50 text-sm mb-8">Le Bar des Amis — Narbonne</p>
        {step === 'phone' ? (
          <>
            <label className="text-[#F5E6D3]/60 text-xs uppercase tracking-wider mb-2 block">Ton numéro de téléphone</label>
            <input
              type="tel" value={phone} onChange={e => setPhone(e.target.value)}
              placeholder="06 XX XX XX XX"
              className="w-full px-4 py-3 rounded-xl text-[#F5E6D3] text-lg mb-4 outline-none"
              style={{background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)'}}
            />
            <button onClick={sendCode} className="w-full py-4 rounded-2xl font-bold text-lg transition-transform active:scale-95" style={{background:'#F59E0B',color:'#1a1a2e'}}>
              Recevoir mon code SMS
            </button>
            <p className="text-[#F5E6D3]/30 text-xs text-center mt-4">Déjà inscrit ? Tu seras reconnu automatiquement.</p>
          </>
        ) : (
          <>
            <label className="text-[#F5E6D3]/60 text-xs uppercase tracking-wider mb-2 block">Code reçu par SMS</label>
            <input
              type="number" value={otp} onChange={e => setOtp(e.target.value)}
              placeholder="• • • •"
              className="w-full px-4 py-3 rounded-xl text-[#F5E6D3] text-2xl text-center tracking-[1rem] mb-4 outline-none"
              style={{background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)'}}
            />
            <button onClick={verify} className="w-full py-4 rounded-2xl font-bold text-lg transition-transform active:scale-95" style={{background:'#F59E0B',color:'#1a1a2e'}}>
              Accéder à BarCoins ⚡
            </button>
            <button onClick={() => setStep('phone')} className="w-full text-center text-[#F5E6D3]/40 text-sm mt-3">Changer de numéro</button>
          </>
        )}
      </div>
    </div>
  )
}
