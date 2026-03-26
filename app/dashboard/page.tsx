'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import BottomNav from '@/components/BottomNav'
import { getEffectiveMultiplier, PLAYER_STATUS_THRESHOLDS } from '@/config/business-rules'

const programme = [
  { time: '20h30', label: 'Blind Test années 2000', icon: '🎵' },
  { time: '21h15', label: 'Quiz Culture Bar', icon: '❓' },
  { time: '22h00', label: 'Double XP coins — 30 min', icon: '⚡' },
  { time: '22h30', label: 'Grand classement final', icon: '🏆' },
]

// Multiplicateur actif (plan Standard, pas de boost ce soir — TODO: venir de l'API bar)
const PLAN_ACTIF = 'STANDARD' as const
const BOOST_ACTIF = false
const mult = getEffectiveMultiplier(PLAN_ACTIF, BOOST_ACTIF)

// Produits vedette — coins calculés dynamiquement via multiplier
// Prix en centimes pour éviter les flottants, TODO: venir API bar
const produitsBase = [
  { icon: '🍺', label: 'Pinte artisanale', prix: '6€', prixVal: 6 },
  { icon: '🥂', label: 'Pitcher pour 2',   prix: '14€', prixVal: 14 },
  { icon: '🍕', label: 'Planche charcuterie', prix: '12€', prixVal: 12 },
  { icon: '🍹', label: 'Cocktail du soir', prix: '9€', prixVal: 9 },
]
const produitsVedette = produitsBase.map(p => ({
  ...p,
  coins: `+${Math.round(p.prixVal * mult)} coins`
}))

// Paliers — TODO: venir du dashboard gérant via BDD (COINS_PALIERS_DEMO placeholder)
const paliersCoins = [
  { conso: '5€',  coins: '— TODO', label: 'Soft / café'      },
  { conso: '10€', coins: '— TODO', label: 'Bière / verre'    },
  { conso: '20€', coins: '— TODO', label: 'Cocktail + apéro' },
  { conso: '50€', coins: '— TODO', label: 'Table complète'   },
]

const glassCard = {
  background: '#1A2942',
  border: '1px solid rgba(201,146,42,0.15)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)'
}
const glassCardSubtle = {
  background: '#162035',
  border: '1px solid rgba(201,146,42,0.10)'
}

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState({ name: 'Alexandre M.', initials: 'AM', coins: 1247, status: 'VIP' })
  // Statut calculé dynamiquement via business-rules
  const computedStatus = user.coins >= PLAYER_STATUS_THRESHOLDS.LEGEND ? 'LEGEND' : user.coins >= PLAYER_STATUS_THRESHOLDS.VIP ? 'VIP' : 'REGULAR'

  useEffect(() => {
    const stored = localStorage.getItem('barcoins_user')
    if (stored) {
      try { setUser(JSON.parse(stored)) } catch {}
    }
  }, [])

  const firstName = user.name.split(' ')[0]
  const gapTo1st = Math.max(0, 1580 - user.coins)

  return (
    <div className="min-h-dvh pb-20" style={{ background: 'linear-gradient(180deg, #0F1923 0%, #0D1B2E 50%, #1A1035 100%)' }}>
      {/* Header */}
      <div className="px-4 pt-10 pb-5" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 100%)' }}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xl barcoins-title" style={{ color: '#C9922A' }}>Bar⚡Coins</span>
          <button onClick={() => router.push('/profile')}
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
            style={{ background: 'linear-gradient(135deg, #C9922A, #E8860A)', color: '#0F1923' }}>
            {user.initials}
          </button>
        </div>
        <div className="text-[#F5F0E8]/60 text-sm mb-2">Bonsoir, <span className="text-[#F5F0E8] font-bold">{firstName}</span> 👋</div>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-5xl font-black glow-pulse" style={{ color: '#C9922A' }}>⚡ {user.coins.toLocaleString()}</div>
            <div className="text-[#F5F0E8]/40 text-xs mt-0.5">coins ce soir</div>
          </div>
          <div className="text-right">
            <div className="inline-block px-2 py-0.5 rounded-full text-xs font-bold mb-1" style={{ background: 'rgba(201,146,42,0.2)', color: '#C9922A', border: '1px solid rgba(201,146,42,0.5)' }}>⭐ {computedStatus}</div>
            {gapTo1st > 0 ? (
              <div className="text-[#F5F0E8]/50 text-xs">encore <span className="text-[#F5F0E8] font-bold">{gapTo1st}</span> coins pour 🥇</div>
            ) : (
              <div className="text-xs font-bold" style={{ color: '#22C55E' }}>🥇 Tu mènes la soirée !</div>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 pt-2 flex flex-col gap-4">
        <div className="bg-glow-gold" />
        <div className="bg-glow-violet" />
        {/* Soirée active */}
        <div className="rounded-2xl p-4 slide-up" style={{
          background: 'linear-gradient(135deg, #1A2942 0%, #2D1248 100%)',
          border: '1px solid rgba(201,146,42,0.4)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(201,146,42,0.15), inset 0 1px 0 rgba(255,255,255,0.05)'
        }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full live-dot inline-block" style={{ background: '#22C55E' }}></span>
            <span className="text-xs font-bold tracking-wider" style={{ color: '#22C55E' }}>SOIRÉE EN COURS</span>
          </div>
          <div className="text-[#F5F0E8] font-bold text-lg">Le Bar des Amis</div>
          <div className="text-[#F5F0E8]/50 text-sm mb-3">Vendredi 20 mars 2026 — 21h30 · 24 joueurs</div>
          <button onClick={() => router.push('/leaderboard')} className="text-sm font-bold" style={{ color: '#C9922A' }}>
            Voir le classement en direct →
          </button>
        </div>

        {/* Position */}
        <div className="rounded-2xl p-4 flex items-center justify-between slide-up" style={glassCard}>
          <div>
            <div className="text-xs uppercase tracking-wider mb-1" style={{ color: 'rgba(245,240,232,0.5)' }}>Ta position ce soir</div>
            <div className="text-5xl font-black" style={{ color: '#F5F0E8', textShadow: '0 0 10px rgba(201,146,42,0.3)' }}>🏆 3<span className="text-lg">ème</span></div>
            <div className="text-xs" style={{ color: 'rgba(245,240,232,0.5)' }}>sur 24 joueurs</div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-black glow-amber" style={{ color: '#22C55E', textShadow: '0 0 12px rgba(34,197,94,0.5)' }}>+320</div>
            <div className="text-xs" style={{ color: 'rgba(245,240,232,0.5)' }}>coins ce soir</div>
            {gapTo1st > 0 && (
              <div className="text-xs mt-1 font-medium" style={{ color: '#E8860A' }}>🎯 {gapTo1st} coins pour 1<sup>er</sup></div>
            )}
          </div>
        </div>

        {/* Programme ce soir */}
        <div className="rounded-2xl p-4" style={glassCard}>
          <div className="section-label mb-3">📅 Programme ce soir</div>
          {programme.map((p, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b last:border-0"
              style={{ borderColor: 'rgba(201,146,42,0.1)' }}>
              <div className="text-xs font-bold w-10 flex-shrink-0" style={{ color: '#C9922A' }}>{p.time}</div>
              <span className="text-base">{p.icon}</span>
              <span className="text-sm font-medium text-[#F5F0E8]">{p.label}</span>
            </div>
          ))}
        </div>

        {/* Badge boost actif */}
        {BOOST_ACTIF && (
          <div className="rounded-xl px-4 py-2 flex items-center gap-2 pulse-gold"
            style={{ background: 'rgba(201,146,42,0.2)', border: '1.5px solid #C9922A' }}>
            <span className="text-lg">⚡</span>
            <span className="font-black text-sm" style={{ color: '#C9922A' }}>BOOST ×2 ACTIF — Multiplicateur ×{mult}</span>
          </div>
        )}

        {/* Offre du moment */}
        <div className="rounded-2xl p-4 overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #C9922A, #E8860A)', boxShadow: '0 4px 24px rgba(201,146,42,0.35)' }}>
          <div className="text-xs font-black uppercase tracking-wider text-amber-900 mb-1">🔥 Offre du moment</div>
          <div className="font-black text-lg leading-tight" style={{ color: '#0F1923' }}>Pitcher = +200 coins</div>
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
                <div className="text-xs font-bold text-[#F5F0E8]">{p.label}</div>
                <div className="text-xs" style={{ color: 'rgba(245,240,232,0.5)' }}>{p.prix}</div>
                <div className="text-xs font-bold mt-1" style={{ color: '#C9922A' }}>{p.coins}</div>
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
                style={{ borderColor: 'rgba(201,146,42,0.08)' }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black"
                    style={{ background: 'rgba(201,146,42,0.15)', color: '#C9922A' }}>{p.conso}</div>
                  <span className="text-sm" style={{ color: 'rgba(245,240,232,0.5)' }}>{p.label}</span>
                </div>
                <span className="font-black text-sm" style={{ color: '#C9922A' }}>+{p.coins} coins</span>
              </div>
            ))}
          </div>
          <div className="text-xs mt-2 text-center" style={{ color: 'rgba(245,240,232,0.5)' }}>Le gérant saisit ta conso · Les coins arrivent instantanément</div>
        </div>

        {/* Défi Privé CTA */}
        <button onClick={() => router.push('/games/challenge')}
          className="rounded-2xl p-4 flex items-center gap-3 transition-transform active:scale-95"
          style={{ ...glassCard, border: '1.5px solid rgba(201,146,42,0.4)', boxShadow: '0 0 16px rgba(201,146,42,0.1)' }}>
          <span className="text-3xl">⚔️</span>
          <div className="flex-1">
            <div className="text-[#F5F0E8] font-bold text-sm">Créer un défi privé</div>
            <div className="text-xs" style={{ color: 'rgba(245,240,232,0.5)' }}>Challenge ta table entre potes</div>
          </div>
          <div className="btn-primary text-xs px-3 py-1.5">Go</div>
        </button>

        {/* Jeux */}
        <div className="section-label px-1">Jeux lancés par le bar</div>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => router.push('/games/blindtest')}
            className="rounded-2xl p-4 text-left transition-transform active:scale-95"
            style={{ ...glassCard, boxShadow: '0 0 12px rgba(201,146,42,0.1)' }}>
            <div className="text-2xl mb-2">🎵</div>
            <div className="text-[#F5F0E8] font-bold text-sm">Blind Test</div>
            <div className="text-xs" style={{ color: 'rgba(245,240,232,0.5)' }}>Mise avant écoute</div>
            <div className="mt-2 text-xs font-bold" style={{ color: '#C9922A' }}>jusqu'à ×5</div>
          </button>
          <button onClick={() => router.push('/games/quiz')}
            className="rounded-2xl p-4 text-left transition-transform active:scale-95"
            style={glassCard}>
            <div className="text-2xl mb-2">❓</div>
            <div className="text-[#F5F0E8] font-bold text-sm">Quiz Bar</div>
            <div className="text-xs" style={{ color: 'rgba(245,240,232,0.5)' }}>500 questions</div>
            <div className="mt-2 text-xs font-bold" style={{ color: '#C9922A' }}>+20 à +100 coins</div>
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
              style={{ borderColor: 'rgba(201,146,42,0.08)' }}>
              <div>
                <div className="text-sm font-medium text-[#F5F0E8]">{t.label}</div>
                <div className="text-xs" style={{ color: 'rgba(245,240,232,0.5)' }}>{t.time}</div>
              </div>
              <span className="font-bold text-sm" style={{ color: '#22C55E' }}>{t.coins}</span>
            </div>
          ))}
          <button onClick={() => router.push('/history')} className="text-xs mt-2 font-medium" style={{ color: '#C9922A' }}>
            Voir tout l'historique →
          </button>
        </div>

        {/* 🔮 Prochainement */}
        <div className="rounded-2xl p-4" style={{ ...glassCard, border: '1px solid rgba(201,146,42,0.2)' }}>
          <div className="flex items-center gap-2 mb-3">
            <span>🔮</span>
            <span className="text-[#F5F0E8] font-black text-sm">Bientôt sur BarCoins</span>
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
                <div className="text-[#F5F0E8] text-xs font-bold leading-tight">{f.label}</div>
                <div className="text-xs mt-0.5" style={{ color: 'rgba(245,240,232,0.5)' }}>{f.desc}</div>
              </div>
            ))}
          </div>
          <button onClick={() => router.push('/profile')} className="text-xs mt-3 font-medium" style={{ color: 'rgba(201,146,42,0.7)' }}>
            Voir ton profil fidélité →
          </button>
        </div>

      </div>
      <BottomNav active="dashboard" />
    </div>
  )
}
