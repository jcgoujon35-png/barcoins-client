'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import BottomNav from '@/components/BottomNav'

const programme = [
  { time: '20h30', label: 'Blind Test années 2000', icon: '🎵' },
  { time: '21h15', label: 'Quiz Culture Bar', icon: '❓' },
  { time: '22h00', label: 'Double XP coins — 30 min', icon: '⚡' },
  { time: '22h30', label: 'Grand classement final', icon: '🏆' },
]

const produitsVedette = [
  { icon: '🍺', label: 'Pinte artisanale', prix: '6€', coins: '+40 coins' },
  { icon: '🥂', label: 'Pitcher pour 2', prix: '14€', coins: '+100 coins' },
  { icon: '🍕', label: 'Planche charcuterie', prix: '12€', coins: '+80 coins' },
  { icon: '🍹', label: 'Cocktail du soir', prix: '9€', coins: '+60 coins' },
]

const paliersCoins = [
  { conso: '5€', coins: 20, label: 'Soft / café' },
  { conso: '10€', coins: 50, label: 'Bière / verre' },
  { conso: '20€', coins: 120, label: 'Cocktail + apéro' },
  { conso: '50€', coins: 350, label: 'Table complète' },
]

const glassCard = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(245,158,11,0.15)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }
const glassCardSubtle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(245,158,11,0.10)' }

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState({ name: 'Alexandre M.', initials: 'AM', coins: 1247, status: 'VIP' })

  useEffect(() => {
    const stored = localStorage.getItem('barcoins_user')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch {}
    }
  }, [])

  const firstName = user.name.split(' ')[0]
  const gapTo1st = Math.max(0, 1580 - user.coins)

  return (
    <div className="min-h-dvh pb-20" style={{ background: 'linear-gradient(180deg, #1a0a00 0%, #2d1200 60%, #1a0a00 100%)' }}>
      {/* Header */}
      <div className="px-4 pt-10 pb-5" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 100%)' }}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xl font-black glow-amber" style={{ color: '#F59E0B' }}>Bar⚡Coins</span>
          <button onClick={() => router.push('/profile')}
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
            style={{ background: 'linear-gradient(135deg, #F59E0B, #FF6B35)', color: '#1a0a00' }}>
            {user.initials}
          </button>
        </div>
        <div className="text-[#F5E6D3]/60 text-sm mb-2">Bonsoir, <span className="text-[#F5E6D3] font-bold">{firstName}</span> 👋</div>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-4xl font-black glow-amber" style={{ color: '#F59E0B' }}>⚡ {user.coins.toLocaleString()}</div>
            <div className="text-[#F5E6D3]/40 text-xs mt-0.5">coins ce soir</div>
          </div>
          <div className="text-right">
            <div className="inline-block px-2 py-0.5 rounded-full text-xs font-bold mb-1" style={{ background: 'rgba(245,158,11,0.2)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.5)' }}>⭐ {user.status}</div>
            {gapTo1st > 0 ? (
              <div className="text-[#F5E6D3]/50 text-xs">encore <span className="text-[#F5E6D3] font-bold">{gapTo1st}</span> coins pour 🥇</div>
            ) : (
              <div className="text-xs font-bold" style={{ color: '#22c55e' }}>🥇 Tu mènes la soirée !</div>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 pt-2 flex flex-col gap-4">
        {/* Soirée active */}
        <div className="rounded-2xl p-4" style={{ ...glassCard, border: '1.5px solid #F59E0B', boxShadow: '0 0 20px rgba(245,158,11,0.15)' }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-green-400 live-dot inline-block"></span>
            <span className="text-green-400 text-xs font-bold tracking-wider">SOIRÉE EN COURS</span>
          </div>
          <div className="text-[#F5E6D3] font-bold text-lg">Le Bar des Amis</div>
          <div className="text-[#F5E6D3]/50 text-sm mb-3">Vendredi 20 mars 2026 — 21h30 · 24 joueurs</div>
          <button onClick={() => router.push('/leaderboard')} className="text-sm font-bold" style={{ color: '#F59E0B' }}>
            Voir le classement en direct →
          </button>
        </div>

        {/* Position */}
        <div className="rounded-2xl p-4 flex items-center justify-between" style={glassCard}>
          <div>
            <div className="text-[#A07850] text-xs uppercase tracking-wider mb-1">Ta position ce soir</div>
            <div className="text-3xl font-black" style={{ color: '#F5E6D3' }}>🏆 3<span className="text-lg">ème</span></div>
            <div className="text-[#A07850] text-xs">sur 24 joueurs</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black glow-amber" style={{ color: '#F59E0B' }}>+320</div>
            <div className="text-[#A07850] text-xs">coins ce soir</div>
            {gapTo1st > 0 && (
              <div className="text-xs mt-1 font-medium" style={{ color: '#FF6B35' }}>🎯 {gapTo1st} coins pour 1<sup>er</sup></div>
            )}
          </div>
        </div>

        {/* Programme ce soir */}
        <div className="rounded-2xl p-4" style={glassCard}>
          <div className="section-label mb-3">📅 Programme ce soir</div>
          {programme.map((p, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b last:border-0"
              style={{ borderColor: 'rgba(245,158,11,0.1)' }}>
              <div className="text-xs font-bold w-10 flex-shrink-0" style={{ color: '#F59E0B' }}>{p.time}</div>
              <span className="text-base">{p.icon}</span>
              <span className="text-sm font-medium text-[#F5E6D3]">{p.label}</span>
            </div>
          ))}
        </div>

        {/* Offre du moment */}
        <div className="rounded-2xl p-4 overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #D97706, #FF6B35)', boxShadow: '0 4px 24px rgba(245,158,11,0.35)' }}>
          <div className="text-xs font-black uppercase tracking-wider text-amber-900 mb-1">🔥 Offre du moment</div>
          <div className="font-black text-lg leading-tight" style={{ color: '#1a0a00' }}>Pitcher = +200 coins</div>
          <div className="text-amber-900/80 text-sm">Ce soir seulement — jusqu'à 23h</div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-5xl opacity-20">🍺</div>
        </div>

        {/* Produits vedette */}
        <div className="rounded-2xl p-4" style={glassCard}>
          <div className="section-label mb-3">🍽️ Carte ce soir</div>
          <div className="grid grid-cols-2 gap-2">
            {produitsVedette.map((p, i) => (
              <div key={i} className="rounded-xl p-3" style={glassCardSubtle}>
                <div className="text-2xl mb-1">{p.icon}</div>
                <div className="text-xs font-bold text-[#F5E6D3]">{p.label}</div>
                <div className="text-xs text-[#A07850]">{p.prix}</div>
                <div className="text-xs font-bold mt-1" style={{ color: '#F59E0B' }}>{p.coins}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Paliers coins */}
        <div className="rounded-2xl p-4" style={glassCard}>
          <div className="section-label mb-3">⚡ Paliers — Coins par conso</div>
          <div className="flex flex-col gap-2">
            {paliersCoins.map((p, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b last:border-0"
                style={{ borderColor: 'rgba(245,158,11,0.08)' }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black"
                    style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B' }}>{p.conso}</div>
                  <span className="text-sm text-[#A07850]">{p.label}</span>
                </div>
                <span className="font-black text-sm" style={{ color: '#F59E0B' }}>+{p.coins} coins</span>
              </div>
            ))}
          </div>
          <div className="text-[#A07850] text-xs mt-2 text-center">Le gérant saisit ta conso · Les coins arrivent instantanément</div>
        </div>

        {/* Défi Privé CTA */}
        <button onClick={() => router.push('/games/challenge')}
          className="rounded-2xl p-4 flex items-center gap-3 transition-transform active:scale-95"
          style={{ ...glassCard, border: '1.5px solid rgba(245,158,11,0.4)', boxShadow: '0 0 16px rgba(245,158,11,0.1)' }}>
          <span className="text-3xl">⚔️</span>
          <div className="flex-1">
            <div className="text-[#F5E6D3] font-bold text-sm">Créer un défi privé</div>
            <div className="text-[#A07850] text-xs">Challenge ta table entre potes</div>
          </div>
          <div className="btn-primary text-xs px-3 py-1.5">Go</div>
        </button>

        {/* Jeux */}
        <div className="section-label px-1">Jeux lancés par le bar</div>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => router.push('/games/blindtest')}
            className="rounded-2xl p-4 text-left transition-transform active:scale-95"
            style={{ ...glassCard, boxShadow: '0 0 12px rgba(245,158,11,0.1)' }}>
            <div className="text-2xl mb-2">🎵</div>
            <div className="text-[#F5E6D3] font-bold text-sm">Blind Test</div>
            <div className="text-[#A07850] text-xs">Mise avant écoute</div>
            <div className="mt-2 text-xs font-bold" style={{ color: '#F59E0B' }}>jusqu'à ×5</div>
          </button>
          <button onClick={() => router.push('/games/quiz')}
            className="rounded-2xl p-4 text-left transition-transform active:scale-95"
            style={glassCard}>
            <div className="text-2xl mb-2">❓</div>
            <div className="text-[#F5E6D3] font-bold text-sm">Quiz Bar</div>
            <div className="text-[#A07850] text-xs">500 questions</div>
            <div className="mt-2 text-xs font-bold" style={{ color: '#F59E0B' }}>+20 à +100 coins</div>
          </button>
        </div>

        {/* Dernières transactions */}
        <div className="rounded-2xl p-4" style={glassCard}>
          <div className="section-label mb-3">Dernières transactions</div>
          {[
            { label: 'Quiz Blind Test', coins: '+150', time: 'il y a 12 min' },
            { label: 'Consommation 16€', coins: '+80', time: 'il y a 34 min' },
            { label: 'Connexion soirée', coins: '+25', time: 'il y a 1h' },
          ].map((t, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b last:border-0"
              style={{ borderColor: 'rgba(245,158,11,0.08)' }}>
              <div>
                <div className="text-sm font-medium text-[#F5E6D3]">{t.label}</div>
                <div className="text-xs text-[#A07850]">{t.time}</div>
              </div>
              <span className="font-bold text-sm" style={{ color: '#22c55e' }}>{t.coins}</span>
            </div>
          ))}
          <button onClick={() => router.push('/history')} className="text-xs mt-2 font-medium" style={{ color: '#F59E0B' }}>
            Voir tout l'historique →
          </button>
        </div>

        {/* 🔮 Prochainement */}
        <div className="rounded-2xl p-4" style={{ ...glassCard, border: '1px solid rgba(245,158,11,0.2)' }}>
          <div className="flex items-center gap-2 mb-3">
            <span>🔮</span>
            <span className="text-[#F5E6D3] font-black text-sm">Bientôt sur BarCoins</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {[
              { icon: '🛒', label: 'Acheter des coins', desc: 'Recharge en ligne' },
              { icon: '🎁', label: 'Coins fidélité', desc: 'Échange vs réductions' },
              { icon: '🎰', label: 'Roue de la Fortune', desc: 'Bientôt disponible' },
              { icon: '🌍', label: 'Multi-bars', desc: 'Tes coins partout (V2)' },
              { icon: '⚽', label: 'Paris sportifs', desc: 'Sur le match en cours' },
            ].map((f, i) => (
              <div key={i} className="flex-shrink-0 rounded-xl p-3 w-28 text-center"
                style={glassCardSubtle}>
                <div className="text-xl mb-1">{f.icon}</div>
                <div className="text-[#F5E6D3] text-xs font-bold leading-tight">{f.label}</div>
                <div className="text-[#A07850] text-xs mt-0.5">{f.desc}</div>
              </div>
            ))}
          </div>
          <button onClick={() => router.push('/profile')} className="text-xs mt-3 font-medium" style={{ color: 'rgba(245,158,11,0.7)' }}>
            Voir ton profil fidélité →
          </button>
        </div>

      </div>
      <BottomNav active="dashboard" />
    </div>
  )
}
