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
  const gapTo1st = me && (me.rank ?? 1) > 1 ? (first?.coins ?? 0) - (me?.coins ?? 0) : 0

  return (
    <div className="min-h-dvh pb-20" style={{ background: 'linear-gradient(180deg, #0F1923 0%, #0D1B2E 50%, #1A1035 100%)' }}>
      {/* Header */}
      <div className="px-4 pt-12 pb-2">
        <h1 className="text-xl font-black" style={{ color: '#F5F0E8', textShadow: '0 0 16px rgba(201,146,42,0.3)' }}>Classement — Ce Soir</h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="w-2 h-2 rounded-full live-dot inline-block" style={{ background: '#22C55E' }}></span>
          <span className="text-xs font-medium" style={{ color: '#22C55E' }}>Live — mise à jour en temps réel</span>
        </div>
      </div>

      {/* Bannière gap to 1st */}
      {gapTo1st > 0 && (
        <div className="mx-4 mt-3 rounded-xl px-4 py-2 flex items-center gap-2"
          style={{ background: 'rgba(201,146,42,0.12)', border: '1px solid rgba(201,146,42,0.4)' }}>
          <span className="text-lg">🎯</span>
          <span className="text-sm" style={{ color: '#C9922A' }}>
            Il te manque <strong>{gapTo1st} coins</strong> pour prendre la 1ère place !
          </span>
        </div>
      )}
      {gapTo1st <= 0 && me && (
        <div className="mx-4 mt-3 rounded-xl px-4 py-2 flex items-center gap-2"
          style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.4)' }}>
          <span className="text-lg">🥇</span>
          <span className="text-sm font-bold" style={{ color: '#22C55E' }}>Tu mènes la soirée ! Continue comme ça !</span>
        </div>
      )}

      {/* Podium */}
      <div className="px-4 py-6 flex items-end justify-center gap-3">
        {[top3[1], top3[0], top3[2]].map((p, i) => {
          const podiumHeights  = [70, 90, 55]
          const avatarSizes    = [60, 72, 60]
          const isCenter       = i === 1
          const medals         = ['🥈', '👑', '🥉']
          const borderColors   = ['#C0C0C0', '#C9922A', '#CD7F32']
          const podiumBg = [
            'linear-gradient(180deg, #A0A0A0 0%, #808080 100%)',
            'linear-gradient(180deg, #C9922A 0%, #E8860A 100%)',
            'linear-gradient(180deg, #8B5A2B 0%, #6B3F1B 100%)',
          ]
          const riseClass = ['podium-rise-2', 'podium-rise-1', 'podium-rise-3']

          return (
            <div key={i} className={`flex flex-col items-center gap-2 ${riseClass[i]}`}>
              {/* Médaille / couronne */}
              <span style={{
                fontSize: isCenter ? '28px' : '22px',
                filter: isCenter ? 'drop-shadow(0 0 8px rgba(201,146,42,0.7))' : 'none'
              }}>{medals[i]}</span>

              {/* Avatar */}
              <div style={{
                width: `${avatarSizes[i]}px`, height: `${avatarSizes[i]}px`,
                borderRadius: '50%', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontWeight: 'bold',
                fontSize: isCenter ? '18px' : '14px',
                background: p?.isMe
                  ? 'linear-gradient(135deg, #C9922A, #E8860A)'
                  : isCenter ? 'rgba(201,146,42,0.25)' : 'rgba(255,255,255,0.1)',
                color: p?.isMe ? '#0F1923' : '#F5F0E8',
                border: `3px solid ${borderColors[i]}`,
                boxShadow: isCenter
                  ? '0 0 0 6px rgba(201,146,42,0.2), 0 0 30px rgba(201,146,42,0.3)'
                  : 'none',
              }}>
                {p?.initials}
              </div>

              {/* Barre podium */}
              <div style={{
                width: '80px', height: `${podiumHeights[i]}px`,
                borderRadius: '8px 8px 0 0',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: '2px',
                background: podiumBg[i],
                boxShadow: isCenter
                  ? '0 0 0 4px rgba(201,146,42,0.15), 0 0 25px rgba(201,146,42,0.4)'
                  : 'none',
              }}>
                <div style={{ color: isCenter ? '#0F1923' : '#F5F0E8', fontSize: '11px', fontWeight: 900 }}>
                  {p?.name.split(' ')[0]}
                </div>
                <div style={{
                  color: isCenter ? '#0F1923' : '#F5F0E8',
                  fontSize: isCenter ? '16px' : '14px',
                  fontWeight: 900
                }}>
                  {p?.coins}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Reste du classement */}
      <div className="mx-4 rounded-2xl overflow-hidden"
        style={{ background: '#1A2942', border: '1px solid rgba(201,146,42,0.12)' }}>
        {rest.map((p) => (
          <div key={p.rank} className="flex items-center gap-3 px-4 py-3 border-b"
            style={{
              borderColor: 'rgba(201,146,42,0.08)',
              background: p.isMe ? 'rgba(201,146,42,0.12)' : 'transparent',
              borderLeft: p.isMe ? '3px solid #C9922A' : '3px solid transparent',
            }}>
            <span className="w-5 text-sm font-bold" style={{ color: 'rgba(245,240,232,0.5)' }}>{p.rank}</span>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{
                background: p.isMe ? 'linear-gradient(135deg, #C9922A, #E8860A)' : 'rgba(255,255,255,0.08)',
                color: p.isMe ? '#0F1923' : '#F5F0E8',
              }}>
              {p.initials}
            </div>
            <span className="flex-1 text-sm font-medium" style={{ color: p.isMe ? '#C9922A' : '#F5F0E8' }}>
              {p.name}{p.isMe ? ' (toi)' : ''}
            </span>
            <span className="font-bold text-sm" style={{ color: p.isMe ? '#E8860A' : '#C9922A' }}>{p.coins}</span>
            <span className="text-xs w-10 text-right" style={{ color: p.delta >= 0 ? '#22C55E' : '#ef4444' }}>
              {p.delta >= 0 ? `+${p.delta}` : p.delta}
            </span>
          </div>
        ))}
      </div>
      <BottomNav active="leaderboard" />
    </div>
  )
}
