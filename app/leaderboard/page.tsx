'use client'
import { useState, useEffect } from 'react'
import BottomNav from '@/components/BottomNav'

const initial = [
  { rank: 1, name: 'Julien R.', initials: 'JR', coins: 1580, delta: 80 },
  { rank: 2, name: 'Marc T.', initials: 'MT', coins: 1290, delta: 120 },
  { rank: 3, name: 'Alexandre M.', initials: 'AM', coins: 1247, delta: 50, isMe: true },
  { rank: 4, name: 'Sophie L.', initials: 'SL', coins: 980, delta: 30 },
  { rank: 5, name: 'Kevin B.', initials: 'KB', coins: 840, delta: 90 },
  { rank: 6, name: 'Emma D.', initials: 'ED', coins: 790, delta: -20 },
  { rank: 7, name: 'Nico P.', initials: 'NP', coins: 680, delta: 10 },
  { rank: 8, name: 'Laura M.', initials: 'LM', coins: 520, delta: 60 },
  { rank: 9, name: 'Thomas G.', initials: 'TG', coins: 480, delta: 0 },
  { rank: 10, name: 'Camille R.', initials: 'CR', coins: 310, delta: 40 },
]

export default function Leaderboard() {
  const [players, setPlayers] = useState(initial)

  useEffect(() => {
    const t = setInterval(() => {
      setPlayers(prev => prev.map(p => ({
        ...p,
        coins: Math.max(0, p.coins + Math.floor(Math.random() * 30) - 10),
        delta: Math.floor(Math.random() * 60) - 10,
      })).sort((a, b) => b.coins - a.coins).map((p, i) => ({ ...p, rank: i + 1 })))
    }, 5000)
    return () => clearInterval(t)
  }, [])

  const top3 = players.slice(0, 3)
  const rest = players.slice(3)
  const me = players.find(p => p.isMe)
  const first = players[0]
  const gapTo1st = me && first && !me.isMe || (me?.rank ?? 1) > 1 ? (first?.coins ?? 0) - (me?.coins ?? 0) : 0

  return (
    <div className="min-h-dvh pb-20" style={{background:'linear-gradient(180deg, #1a1a2e 0%, #0f3460 100%)'}}>
      <div className="px-4 pt-12 pb-2">
        <h1 className="text-[#F5E6D3] text-xl font-black">Classement — Ce Soir</h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="w-2 h-2 rounded-full bg-red-400 pulse-gold"></span>
          <span className="text-red-400 text-xs">Live — se met à jour en temps réel</span>
        </div>
      </div>

      {/* Bannière gap to 1st */}
      {gapTo1st > 0 && (
        <div className="mx-4 mt-3 rounded-xl px-4 py-2 flex items-center gap-2" style={{background:'rgba(245,158,11,0.15)', border:'1px solid rgba(245,158,11,0.4)'}}>
          <span className="text-lg">🎯</span>
          <span className="text-sm" style={{color:'#F59E0B'}}>
            Il te manque <strong>{gapTo1st} coins</strong> pour prendre la 1ère place !
          </span>
        </div>
      )}
      {gapTo1st <= 0 && me && (
        <div className="mx-4 mt-3 rounded-xl px-4 py-2 flex items-center gap-2" style={{background:'rgba(34,197,94,0.15)', border:'1px solid rgba(34,197,94,0.4)'}}>
          <span className="text-lg">🥇</span>
          <span className="text-sm font-bold" style={{color:'#22c55e'}}>Tu mènes la soirée ! Continue comme ça !</span>
        </div>
      )}

      {/* Podium */}
      <div className="px-4 py-4 flex items-end justify-center gap-3">
        {[top3[1], top3[0], top3[2]].map((p, i) => {
          const heights = ['h-24', 'h-32', 'h-20']
          const medals = ['🥈', '🥇', '🥉']
          const sizes = ['w-14', 'w-16', 'w-12']
          return (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="text-lg">{medals[i]}</div>
              <div className={`${sizes[i]} aspect-square rounded-full flex items-center justify-center font-bold text-sm`}
                style={{background: p?.isMe ? '#F59E0B' : 'rgba(255,255,255,0.15)', color: p?.isMe ? '#1a1a2e' : '#fff'}}>
                {p?.initials}
              </div>
              <div className={`w-20 ${heights[i]} rounded-t-xl flex flex-col items-center justify-center`}
                style={{background: i===1 ? '#F59E0B' : 'rgba(255,255,255,0.1)'}}>
                <div className="text-xs font-bold" style={{color: i===1 ? '#1a1a2e' : '#fff'}}>{p?.name.split(' ')[0]}</div>
                <div className="text-sm font-black" style={{color: i===1 ? '#1a1a2e' : '#F59E0B'}}>{p?.coins}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Reste */}
      <div className="mx-4 rounded-2xl overflow-hidden" style={{background:'rgba(255,255,255,0.05)'}}>
        {rest.map((p) => (
          <div key={p.rank} className="flex items-center gap-3 px-4 py-3 border-b"
            style={{borderColor:'rgba(255,255,255,0.05)', background: p.isMe ? 'rgba(245,158,11,0.15)' : 'transparent'}}>
            <span className="text-[#A07850] w-5 text-sm font-bold">{p.rank}</span>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{background: p.isMe ? '#F59E0B' : 'rgba(255,255,255,0.15)', color: p.isMe ? '#1a1a2e' : '#fff'}}>
              {p.initials}
            </div>
            <span className="flex-1 text-sm font-medium" style={{color: p.isMe ? '#F59E0B' : '#fff'}}>
              {p.name}{p.isMe ? ' (toi)' : ''}
            </span>
            <span className="font-bold text-sm" style={{color:'#F59E0B'}}>{p.coins}</span>
            <span className="text-xs w-10 text-right" style={{color: p.delta >= 0 ? '#22c55e' : '#ef4444'}}>
              {p.delta >= 0 ? `+${p.delta}` : p.delta}
            </span>
          </div>
        ))}
      </div>
      <BottomNav active="leaderboard" />
    </div>
  )
}
