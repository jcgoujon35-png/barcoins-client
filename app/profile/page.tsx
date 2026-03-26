'use client'
import BottomNav from '@/components/BottomNav'

const badges = [
  { icon: '🎵', name: 'Maître du Blind Test', date: 'Mars 2026' },
  { icon: '🍺', name: 'Habitué du Bar', date: 'Fév 2026' },
  { icon: '🏆', name: 'Champion de Soirée', date: 'Mars 2026' },
  { icon: '🔥', name: '7 soirées d\'affilée', date: 'Mars 2026' },
]

const recompenses = [
  { icon: '🍺', label: 'Demi offert', coins: 500, dispo: true },
  { icon: '🥂', label: 'Cocktail offert', coins: 1200, dispo: false },
  { icon: '🍕', label: 'Planche offerte', coins: 1500, dispo: false },
  { icon: '🎁', label: 'Soirée VIP', coins: 5000, dispo: false },
]

const comingSoon = [
  { icon: '🛒', label: 'Achat de coins', desc: 'Recharge ton solde en ligne' },
  { icon: '🎁', label: 'Cadeaux & bons', desc: 'Échange tes coins contre des réductions' },
  { icon: '🌍', label: 'Multi-bars V2', desc: 'Tes coins valables partout' },
  { icon: '⚽', label: 'Paris sportifs', desc: 'Miser sur le match en cours' },
  { icon: '🎰', label: 'Roue de la Fortune', desc: 'Bientôt disponible' },
  { icon: '🏅', label: 'Championnats', desc: 'Tournois inter-bars mensuels' },
]

const glassCard = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(245,158,11,0.15)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }
const glassCardSubtle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(245,158,11,0.10)' }

export default function Profile() {
  const coinsPlay = 4820
  const coinsFidelite = 1340
  const progress = (coinsPlay / 10000) * 100
  const fideliteProgress = (coinsFidelite / 2000) * 100

  return (
    <div className="min-h-dvh pb-20" style={{ background: 'linear-gradient(180deg, #1a0a00 0%, #2d1200 60%, #1a0a00 100%)' }}>
      {/* Hero */}
      <div className="px-4 pt-12 pb-6 text-center slide-up" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 100%)' }}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-3"
          style={{ background: 'linear-gradient(135deg, #F59E0B, #FF6B35)', color: '#1a0a00', boxShadow: '0 0 24px rgba(245,158,11,0.4)' }}>AM</div>
        <div className="text-xl font-black" style={{ color: '#F5E6D3', textShadow: '0 0 16px rgba(245,158,11,0.25)' }}>Alexandre M.</div>
        <div className="inline-block px-3 py-1 rounded-full text-xs font-bold mt-1 mb-4"
          style={{ background: 'rgba(245,158,11,0.2)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.5)' }}>⭐ VIP</div>
        {/* Deux types de coins */}
        <div className="flex gap-3 justify-center">
          <div className="flex-1 rounded-2xl px-3 py-2"
            style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.35)' }}>
            <div className="text-2xl font-black" style={{ color: '#F59E0B', textShadow: '0 0 20px rgba(245,158,11,0.7), 0 0 40px rgba(245,158,11,0.3)' }}>{coinsPlay.toLocaleString()}</div>
            <div className="text-[#F5E6D3]/50 text-xs">⚡ Coins Play</div>
          </div>
          <div className="flex-1 rounded-2xl px-3 py-2"
            style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)' }}>
            <div className="text-2xl font-black" style={{ color: '#10B981' }}>{coinsFidelite.toLocaleString()}</div>
            <div className="text-[#F5E6D3]/50 text-xs">🎁 Coins Fidélité</div>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 flex flex-col gap-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {[['🎮', '47', 'soirées'], ['🏆', '1er', 'meilleur rang'], ['🎯', '68%', 'bonnes rép.'], ['📅', '12', 'bars visités']].map(([icon, val, label], i) => (
            <div key={i} className="rounded-2xl p-4 text-center" style={glassCard}>
              <div className="text-xl mb-1">{icon}</div>
              <div className="font-black text-xl text-[#F5E6D3]">{val}</div>
              <div className="text-[#A07850] text-xs">{label}</div>
            </div>
          ))}
        </div>

        {/* Coins Fidélité */}
        <div className="rounded-2xl p-4" style={glassCard}>
          <div className="flex items-center justify-between mb-3">
            <div className="section-label">🎁 Coins Fidélité</div>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981' }}>Beta</span>
          </div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-[#A07850]">Solde fidélité</span>
            <span className="text-xl font-black" style={{ color: '#10B981' }}>{coinsFidelite} 🎁</span>
          </div>
          <div className="w-full rounded-full h-2 mb-2" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div className="h-2 rounded-full" style={{ width: `${Math.min(100, fideliteProgress)}%`, background: '#10B981' }}></div>
          </div>
          <div className="text-xs text-[#A07850] mb-4">{coinsFidelite} / 2 000 pour un <strong className="text-[#F5E6D3]">demi offert</strong></div>

          <div className="section-label mb-2">Récompenses disponibles</div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {recompenses.map((r, i) => (
              <div key={i} className="flex-shrink-0 rounded-xl p-3 w-28 text-center"
                style={{
                  background: r.dispo ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.04)',
                  border: r.dispo ? '1.5px solid #10B981' : '1px solid rgba(255,255,255,0.08)',
                  opacity: r.dispo ? 1 : 0.55
                }}>
                <div className="text-2xl mb-1">{r.icon}</div>
                <div className="text-xs font-bold text-[#F5E6D3]">{r.label}</div>
                <div className="text-xs font-black mt-1" style={{ color: r.dispo ? '#10B981' : '#A07850' }}>{r.coins.toLocaleString()} 🎁</div>
                {r.dispo && <div className="text-xs font-bold mt-1" style={{ color: '#10B981' }}>Disponible !</div>}
              </div>
            ))}
          </div>
          <div className="text-[#A07850] text-xs mt-3 text-center">Coins fidélité = earned à chaque visite, non perdables en jeu</div>
        </div>

        {/* Progression statut Play */}
        <div className="rounded-2xl p-4" style={glassCard}>
          <div className="flex justify-between text-xs text-[#A07850] mb-2">
            <span className="font-bold" style={{ color: '#F59E0B' }}>⭐ VIP</span>
            <span className="text-[#F5E6D3]/50">LEGEND 🌟</span>
          </div>
          <div className="w-full rounded-full h-3" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div className="h-3 rounded-full" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #F59E0B, #FF6B35)', boxShadow: '0 0 8px rgba(245,158,11,0.5)' }}></div>
          </div>
          <div className="text-center text-xs text-[#A07850] mt-2">{coinsPlay.toLocaleString()} / 10 000 coins pour LEGEND</div>
        </div>

        {/* Badges */}
        <div className="rounded-2xl p-4" style={glassCard}>
          <div className="section-label mb-3">Badges obtenus</div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {badges.map((b, i) => (
              <div key={i} className="flex-shrink-0 flex flex-col items-center gap-1 w-20">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                  style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)' }}>{b.icon}</div>
                <div className="text-center text-xs font-medium leading-tight text-[#F5E6D3]">{b.name}</div>
                <div className="text-xs text-[#A07850]">{b.date}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 🔮 Prochainement */}
        <div className="rounded-2xl p-4" style={{ ...glassCard, border: '1px solid rgba(245,158,11,0.2)' }}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">🔮</span>
            <span className="text-[#F5E6D3] font-black text-sm">Prochainement sur BarCoins</span>
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(245,158,11,0.2)', color: '#F59E0B' }}>V2</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {comingSoon.map((f, i) => (
              <div key={i} className="flex-shrink-0 rounded-xl p-3 w-32"
                style={glassCardSubtle}>
                <div className="text-2xl mb-1">{f.icon}</div>
                <div className="text-[#F5E6D3] text-xs font-bold leading-tight">{f.label}</div>
                <div className="text-[#A07850] text-xs mt-1 leading-tight">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bar favori */}
        <div className="rounded-2xl p-4 flex items-center gap-3" style={glassCard}>
          <div className="text-2xl">📍</div>
          <div>
            <div className="font-bold text-[#F5E6D3]">Le Bar des Amis</div>
            <div className="text-[#A07850] text-sm">Narbonne — Membre depuis fév. 2026</div>
          </div>
        </div>
      </div>
      <BottomNav active="profile" />
    </div>
  )
}
