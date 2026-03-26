'use client'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/BottomNav'

const games = [
  { id: 'blindtest', icon: '🎵', title: 'Blind Test Musical', desc: 'Mise de coins avant d\'écouter', gain: '×2 à ×5 ta mise', active: true, route: '/games/blindtest' },
  { id: 'quiz', icon: '❓', title: 'Quiz Culture Bar', desc: '500 questions — boissons, pop culture', gain: '+20 à +100 coins', active: true, route: '/games/quiz' },
  { id: 'roue', icon: '🎰', title: 'Roue de la Fortune', desc: 'Bientôt disponible', gain: 'Surprise !', active: false, soon: 'Bientôt' },
  { id: 'tournois', icon: '🏆', title: 'Tournois', desc: 'Qualification soirée', gain: 'Jackpot coins', active: false },
  { id: 'paris', icon: '⚽', title: 'Paris Sportifs', desc: 'Miser sur le match en cours', gain: 'Cotes variables', active: false },
]

const glassCard = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(245,158,11,0.15)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }

export default function Games() {
  const router = useRouter()
  return (
    <div className="min-h-dvh pb-20" style={{ background: 'linear-gradient(180deg, #1a0a00 0%, #2d1200 60%, #1a0a00 100%)' }}>
      {/* Header */}
      <div className="px-4 pt-12 pb-4" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 100%)' }}>
        <h1 className="text-[#F5E6D3] text-xl font-black">Jeux disponibles</h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="w-2 h-2 rounded-full bg-green-400 live-dot inline-block"></span>
          <p className="text-[#F5E6D3]/50 text-sm">Soirée en cours — Le Bar des Amis</p>
        </div>
      </div>

      <div className="px-4 pt-2 flex flex-col gap-3">

        {/* 🔥 Défi Privé — feature phare */}
        <button
          onClick={() => router.push('/games/challenge')}
          className="rounded-2xl p-4 text-left transition-transform active:scale-95"
          style={{ ...glassCard, border: '2px solid #F59E0B', boxShadow: '0 0 24px rgba(245,158,11,0.2)' }}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">⚔️</span>
            <div>
              <div className="text-[#F5E6D3] font-black text-base">Défi Privé — Entre potes</div>
              <div className="text-[#A07850] text-xs">Challenge ta table, pas besoin que le bar lance un jeu</div>
            </div>
            <div className="ml-auto btn-primary text-xs px-3 py-1.5 flex-shrink-0">Lancer</div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {['🎵 Blind Test', '❓ Quiz', '🏆 Score'].map((t, i) => (
              <span key={i} className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(245,158,11,0.2)', color: '#F59E0B' }}>{t}</span>
            ))}
            <span className="text-xs px-2 py-0.5 rounded-full text-[#A07850]" style={{ background: 'rgba(255,255,255,0.06)' }}>accès 10 coins · mise partagée</span>
          </div>
        </button>

        <div className="section-label px-1 mt-1">Jeux lancés par le bar</div>

        {games.map(g => (
          <div key={g.id}
            className={`rounded-2xl p-4 flex items-center gap-4 transition-transform ${g.active ? 'active:scale-[0.98] cursor-pointer' : 'opacity-50'}`}
            style={g.active
              ? { ...glassCard, boxShadow: '0 0 12px rgba(245,158,11,0.08)' }
              : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            onClick={() => g.active && g.route && router.push(g.route)}>
            <div className="text-3xl flex-shrink-0">{g.icon}</div>
            <div className="flex-1">
              <div className="font-bold text-sm text-[#F5E6D3]">{g.title}</div>
              <div className="text-[#A07850] text-xs">{g.desc}</div>
              <div className="text-xs font-bold mt-1" style={{ color: g.active ? '#F59E0B' : '#A07850' }}>{g.gain}</div>
            </div>
            {g.active ? (
              <div className="btn-primary text-xs px-3 py-1.5">Jouer</div>
            ) : (
              <div className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#A07850]"
                style={{ background: 'rgba(245,158,11,0.1)' }}>{g.soon || 'Bientôt'}</div>
            )}
          </div>
        ))}
      </div>
      <BottomNav active="games" />
    </div>
  )
}
