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

export default function Games() {
  const router = useRouter()
  return (
    <div className="min-h-dvh pb-20" style={{background:'#f4f5f7'}}>
      <div className="px-4 pt-12 pb-4" style={{background:'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)'}}>
        <h1 className="text-[#F5E6D3] text-xl font-black">Jeux disponibles</h1>
        <p className="text-[#F5E6D3]/50 text-sm">Soirée en cours — Le Bar des Amis</p>
      </div>

      <div className="px-4 pt-4 flex flex-col gap-3">

        {/* 🔥 Défi Privé — feature phare */}
        <button
          onClick={() => router.push('/games/challenge')}
          className="rounded-2xl p-4 text-left transition-transform active:scale-95 shadow-md"
          style={{background:'linear-gradient(135deg, #1a1a2e, #0f3460)', border:'2px solid #F59E0B'}}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">⚔️</span>
            <div>
              <div className="text-[#F5E6D3] font-black text-base">Défi Privé — Entre potes</div>
              <div className="text-[#F5E6D3]/50 text-xs">Challenge ta table, pas besoin que le bar lance un jeu</div>
            </div>
            <div className="ml-auto px-3 py-1.5 rounded-xl text-xs font-bold flex-shrink-0" style={{background:'#F59E0B',color:'#1a1a2e'}}>Lancer</div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {['🎵 Blind Test', '❓ Quiz', '🏆 Score'].map((t,i) => (
              <span key={i} className="text-xs px-2 py-0.5 rounded-full" style={{background:'rgba(245,158,11,0.2)',color:'#F59E0B'}}>{t}</span>
            ))}
            <span className="text-xs px-2 py-0.5 rounded-full" style={{background:'rgba(255,255,255,0.1)',color:'rgba(255,255,255,0.6)'}}>accès 10 coins · mis partagée</span>
          </div>
        </button>

        <div className="text-[#A07850] text-xs font-bold uppercase tracking-wider px-1 mt-1">Jeux lancés par le bar</div>

        {games.map(g => (
          <div key={g.id}
            className={`rounded-2xl p-4 flex items-center gap-4 shadow-sm transition-transform ${g.active ? 'active:scale-98 cursor-pointer bg-white' : 'opacity-60'}`}
            style={g.active ? {} : {background:'#e5e7eb'}}
            onClick={() => g.active && g.route && router.push(g.route)}>
            <div className="text-3xl flex-shrink-0">{g.icon}</div>
            <div className="flex-1">
              <div className="font-bold text-sm" style={{color:'#1a1a2e'}}>{g.title}</div>
              <div className="text-[#A07850] text-xs">{g.desc}</div>
              <div className="text-xs font-bold mt-1" style={{color: g.active ? '#F59E0B' : '#9ca3af'}}>{g.gain}</div>
            </div>
            {g.active ? (
              <div className="px-3 py-1.5 rounded-xl text-xs font-bold" style={{background:'#F59E0B',color:'#1a1a2e'}}>Jouer</div>
            ) : (
              <div className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#F59E0B]/20 text-[#A07850]">{g.soon || 'Bientôt'}</div>
            )}
          </div>
        ))}
      </div>
      <BottomNav active="games" />
    </div>
  )
}
