'use client'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/BottomNav'

const games = [
  { id: 'blindtest', icon: '🎵', title: 'Blind Test Musical', desc: 'Mise de coins avant d\'écouter', gain: '×2 à ×5 ta mise', active: true, route: '/games/blindtest' },
  { id: 'quiz', icon: '❓', title: 'Quiz Culture Bar', desc: '500 questions — boissons, pop culture', gain: '+20 à +100 coins', active: true, route: '/games/quiz' },
  { id: 'roue', icon: '🎰', title: 'Roue de la Fortune', desc: 'Bientôt disponible', gain: 'Surprise !', active: false, soon: 'ANJ' },
  { id: 'tournois', icon: '🏆', title: 'Tournois', desc: 'Qualification soirée', gain: 'Jackpot coins', active: false },
  { id: 'paris', icon: '⚽', title: 'Paris Sportifs', desc: 'Miser sur le match en cours', gain: 'Cotes variables', active: false },
]

const glassCard = { background: '#1A2942', border: '1px solid rgba(201,146,42,0.15)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }

export default function Games() {
  const router = useRouter()
  return (
    <div className="min-h-dvh pb-20" style={{ background: 'linear-gradient(180deg, #0F1923 0%, #0D1B2E 50%, #1A1035 100%)' }}>
      {/* Header */}
      <div className="px-4 pt-12 pb-4" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 100%)' }}>
        <h1 className="text-xl font-black" style={{ color: '#F5F0E8', textShadow: '0 0 16px rgba(201,146,42,0.3)' }}>Jeux disponibles</h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="w-2 h-2 rounded-full live-dot inline-block" style={{ background: '#22C55E' }}></span>
          <p className="text-[#F5F0E8]/50 text-sm">Soirée en cours — Le Bar des Amis</p>
        </div>
      </div>

      <div className="px-4 pt-2 flex flex-col gap-3">
        <div className="bg-glow-gold" />
        <div className="bg-glow-violet" />

        {/* 🔥 Défi Privé — feature phare */}
        <button
          onClick={() => router.push('/games/challenge')}
          className="rounded-2xl p-4 text-left transition-transform active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #1A2942 0%, #2D1248 100%)',
            border: '2px solid rgba(201,146,42,0.5)',
            boxShadow: '0 0 24px rgba(201,146,42,0.2)',
            borderRadius: '16px'
          }}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">⚔️</span>
            <div>
              <div className="text-[#F5F0E8] font-black text-base">Défi Privé — Entre potes</div>
              <div className="text-xs" style={{ color: 'rgba(245,240,232,0.5)' }}>Challenge ta table, pas besoin que le bar lance un jeu</div>
            </div>
            <div className="ml-auto btn-primary text-xs px-3 py-1.5 flex-shrink-0">Lancer</div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {['🎵 Blind Test', '❓ Quiz', '🏆 Score'].map((t, i) => (
              <span key={i} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(201,146,42,0.2)', color: '#C9922A' }}>{t}</span>
            ))}
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(201,146,42,0.06)', color: 'rgba(245,240,232,0.5)' }}>accès 10 coins · mise partagée</span>
          </div>
        </button>

        <div className="section-label px-1 mt-1">Jeux lancés par le bar</div>

        {games.map(g => (
          <div key={g.id}
            className={`rounded-2xl p-4 flex items-center gap-4 transition-transform ${g.active ? 'active:scale-[0.98] cursor-pointer' : 'opacity-50'}`}
            style={g.active
              ? { ...glassCard, boxShadow: '0 0 12px rgba(201,146,42,0.08)' }
              : { background: '#162035', border: '1px solid rgba(201,146,42,0.06)' }}
            onClick={() => g.active && g.route && router.push(g.route)}>
            <div className="text-3xl flex-shrink-0">{g.icon}</div>
            <div className="flex-1">
              <div className="font-bold text-sm text-[#F5F0E8]">{g.title}</div>
              <div className="text-xs" style={{ color: 'rgba(245,240,232,0.5)' }}>{g.desc}</div>
              <div className="text-xs font-bold mt-1" style={{ color: g.active ? '#C9922A' : 'rgba(245,240,232,0.5)' }}>{g.gain}</div>
            </div>
            {g.active ? (
              <div className="btn-primary text-xs px-3 py-1.5">Jouer</div>
            ) : (
              <div className="px-3 py-1.5 rounded-xl text-xs font-bold"
                style={{ background: 'rgba(232,134,10,0.15)', color: '#E8860A', border: '1px solid rgba(232,134,10,0.3)' }}>
                {g.soon || 'Bientôt'}
              </div>
            )}
          </div>
        ))}
      </div>
      <BottomNav active="games" />
    </div>
  )
}
