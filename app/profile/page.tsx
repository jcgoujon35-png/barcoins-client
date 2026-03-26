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

export default function Profile() {
  const coinsPlay = 4820
  const coinsFidelite = 1340
  const progress = (coinsPlay / 10000) * 100
  const fideliteProgress = (coinsFidelite / 2000) * 100

  return (
    <div className="min-h-dvh pb-20" style={{background:'#f4f5f7'}}>
      {/* Hero */}
      <div className="px-4 pt-12 pb-6 text-center" style={{background:'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)'}}>
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-3" style={{background:'#F59E0B',color:'#1a1a2e'}}>AM</div>
        <div className="text-[#F5E6D3] text-xl font-bold">Alexandre M.</div>
        <div className="inline-block px-3 py-1 rounded-full text-xs font-bold mt-1 mb-4" style={{background:'rgba(245,158,11,0.2)',color:'#F59E0B',border:'1px solid #F59E0B'}}>⭐ VIP</div>
        {/* Deux types de coins */}
        <div className="flex gap-3 justify-center">
          <div className="flex-1 rounded-2xl px-3 py-2" style={{background:'rgba(245,158,11,0.15)', border:'1px solid rgba(245,158,11,0.4)'}}>
            <div className="text-2xl font-black" style={{color:'#F59E0B'}}>{coinsPlay.toLocaleString()}</div>
            <div className="text-[#F5E6D3]/50 text-xs">⚡ Coins Play</div>
          </div>
          <div className="flex-1 rounded-2xl px-3 py-2" style={{background:'rgba(34,197,94,0.15)', border:'1px solid rgba(34,197,94,0.3)'}}>
            <div className="text-2xl font-black" style={{color:'#22c55e'}}>{coinsFidelite.toLocaleString()}</div>
            <div className="text-[#F5E6D3]/50 text-xs">🎁 Coins Fidélité</div>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 flex flex-col gap-4">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {[['🎮','47','soirées'],['🏆','1er','meilleur rang'],['🎯','68%','bonnes rép.'],['📅','12','bars visités']].map(([icon,val,label],i) => (
            <div key={i} className="rounded-2xl bg-white p-4 text-center shadow-sm">
              <div className="text-xl mb-1">{icon}</div>
              <div className="font-black text-xl" style={{color:'#1a1a2e'}}>{val}</div>
              <div className="text-[#A07850] text-xs">{label}</div>
            </div>
          ))}
        </div>

        {/* Coins Fidélité — section dédiée */}
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[#A07850] text-xs font-bold uppercase tracking-wider">🎁 Coins Fidélité</div>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{background:'rgba(34,197,94,0.1)',color:'#22c55e'}}>Beta</span>
          </div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-[#A07850]">Solde fidélité</span>
            <span className="text-xl font-black" style={{color:'#22c55e'}}>{coinsFidelite} 🎁</span>
          </div>
          <div className="w-full rounded-full h-2 mb-2" style={{background:'#f3f4f6'}}>
            <div className="h-2 rounded-full" style={{width:`${Math.min(100, fideliteProgress)}%`, background:'#22c55e'}}></div>
          </div>
          <div className="text-xs text-[#A07850] mb-4">{coinsFidelite} / 2 000 pour un <strong>demi offert</strong></div>

          <div className="text-xs font-bold text-[#A07850] uppercase tracking-wider mb-2">Récompenses disponibles</div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {recompenses.map((r, i) => (
              <div key={i} className="flex-shrink-0 rounded-xl p-3 w-28 text-center"
                style={{background: r.dispo ? 'rgba(34,197,94,0.1)' : '#f9fafb',
                  border: r.dispo ? '1.5px solid #22c55e' : '1.5px solid #f3f4f6',
                  opacity: r.dispo ? 1 : 0.6}}>
                <div className="text-2xl mb-1">{r.icon}</div>
                <div className="text-xs font-bold" style={{color:'#1a1a2e'}}>{r.label}</div>
                <div className="text-xs font-black mt-1" style={{color: r.dispo ? '#22c55e' : '#9ca3af'}}>{r.coins.toLocaleString()} 🎁</div>
                {r.dispo && <div className="text-xs text-green-600 font-bold mt-1">Disponible !</div>}
              </div>
            ))}
          </div>
          <div className="text-[#A07850] text-xs mt-3 text-center">Coins fidélité = earned à chaque visite, non perdables en jeu</div>
        </div>

        {/* Progression statut Play */}
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex justify-between text-xs text-[#A07850] mb-2">
            <span className="font-bold" style={{color:'#F59E0B'}}>⭐ VIP</span>
            <span>LEGEND 🌟</span>
          </div>
          <div className="w-full rounded-full h-3" style={{background:'#f3f4f6'}}>
            <div className="h-3 rounded-full" style={{width:`${progress}%`, background:'#F59E0B'}}></div>
          </div>
          <div className="text-center text-xs text-[#A07850] mt-2">{coinsPlay.toLocaleString()} / 10 000 coins pour LEGEND</div>
        </div>

        {/* Badges */}
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="text-[#A07850] text-xs font-bold uppercase tracking-wider mb-3">Badges obtenus</div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {badges.map((b, i) => (
              <div key={i} className="flex-shrink-0 flex flex-col items-center gap-1 w-20">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl" style={{background:'#f4f5f7'}}>{b.icon}</div>
                <div className="text-center text-xs font-medium leading-tight" style={{color:'#1a1a2e'}}>{b.name}</div>
                <div className="text-xs text-[#A07850]">{b.date}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 🔮 Prochainement sur BarCoins */}
        <div className="rounded-2xl p-4 shadow-sm" style={{background:'linear-gradient(135deg,#1a1a2e,#0f3460)'}}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">🔮</span>
            <span className="text-[#F5E6D3] font-black text-sm">Prochainement sur BarCoins</span>
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-bold" style={{background:'rgba(245,158,11,0.2)',color:'#F59E0B'}}>V2</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {comingSoon.map((f, i) => (
              <div key={i} className="flex-shrink-0 rounded-xl p-3 w-32"
                style={{background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)'}}>
                <div className="text-2xl mb-1">{f.icon}</div>
                <div className="text-[#F5E6D3] text-xs font-bold leading-tight">{f.label}</div>
                <div className="text-[#F5E6D3]/40 text-xs mt-1 leading-tight">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bar favori */}
        <div className="rounded-2xl bg-white p-4 shadow-sm flex items-center gap-3">
          <div className="text-2xl">📍</div>
          <div>
            <div className="font-bold" style={{color:'#1a1a2e'}}>Le Bar des Amis</div>
            <div className="text-[#A07850] text-sm">Narbonne — Membre depuis fév. 2026</div>
          </div>
        </div>
      </div>
      <BottomNav active="profile" />
    </div>
  )
}
