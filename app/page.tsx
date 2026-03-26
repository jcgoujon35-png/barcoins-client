'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Landing() {
  const router = useRouter()
  const [returning, setReturning] = useState(false)
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('barcoins_user')
    if (stored) {
      try {
        const u = JSON.parse(stored)
        setReturning(true)
        setUserName(u.name?.split(' ')[0] || '')
      } catch {}
    }
  }, [])

  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center, #3d1a00 0%, #0d0500 70%)' }}
    >
      {/* Ambiance lumineuse */}
      <div className="absolute top-16 right-8 w-40 h-40 rounded-full pointer-events-none"
        style={{ background: '#F59E0B', filter: 'blur(60px)', opacity: 0.1 }} />
      <div className="absolute bottom-32 left-4 w-28 h-28 rounded-full pointer-events-none"
        style={{ background: '#FF6B35', filter: 'blur(40px)', opacity: 0.08 }} />

      <div className="text-center slide-up relative z-10 w-full max-w-sm">
        <div className="text-5xl mb-3">🍺</div>
        <div className="text-5xl barcoins-title mb-1" style={{ color: '#F59E0B' }}>
          Bar<span style={{ color: '#F5E6D3' }}>⚡</span>Coins
        </div>
        <div className="text-sm mb-2" style={{ color: '#A07850' }}>Joue. Gagne. Règne.</div>

        {returning && userName ? (
          <>
            <div className="mt-4 mb-8 px-4 py-3 rounded-2xl glass-card">
              <div className="text-sm" style={{ color: '#A07850' }}>Heureux de te revoir,</div>
              <div className="font-bold text-lg" style={{ color: '#F5E6D3' }}>{userName} 👋</div>
              <div className="text-xs mt-1" style={{ color: 'rgba(245,230,211,0.4)' }}>Ton compte est reconnu automatiquement</div>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="btn-primary w-full py-4 rounded-2xl font-bold text-lg mb-4">
              ⚡ Rejoindre la soirée
            </button>
            <button onClick={() => router.push('/login')} style={{ color: 'rgba(245,230,211,0.4)', fontSize: '14px' }}>
              Ce n'est pas moi →
            </button>
          </>
        ) : (
          <>
            <p className="text-xs mb-10 mt-2" style={{ color: 'rgba(160,120,80,0.7)' }}>
              Tu es dans un bar BarCoins ? Scanne le QR ou entre ton numéro.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="btn-primary w-full py-4 rounded-2xl font-bold text-lg mb-4">
              📷 Scanner un QR code
            </button>
            <button onClick={() => router.push('/login')}
              className="text-sm underline"
              style={{ color: 'rgba(245,230,211,0.5)' }}>
              Accéder avec mon numéro →
            </button>
          </>
        )}
      </div>

      <div className="absolute bottom-8 text-xs z-10" style={{ color: 'rgba(245,230,211,0.2)' }}>
        BarCoins v1.0 — Beta
      </div>
    </div>
  )
}
