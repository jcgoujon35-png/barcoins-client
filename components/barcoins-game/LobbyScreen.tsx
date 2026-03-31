'use client'
import { GameState } from '@/lib/game-engine/state'

interface Props {
  state: GameState
  onStart: () => void
}

export function LobbyScreen({ state, onStart }: Props) {
  const { session, players } = state
  const humanPlayer = players.find(p => !p.isBot)
  const bots = players.filter(p => p.isBot)

  return (
    <div className="min-h-dvh flex flex-col px-6 pt-12 pb-8" style={{ background: '#1a0a00' }}>
      <div className="text-4xl mb-3">🎬</div>
      <h1 className="text-[#F5E6D3] text-2xl font-black mb-1">Quiz Cinéma</h1>
      <p className="text-[#F5E6D3]/50 text-sm mb-6">CLASSIQUE</p>

      <div className="bg-white/10 rounded-2xl p-5 mb-4">
        <div className="text-[#F5E6D3]/60 text-xs mb-3 uppercase tracking-wider">Session</div>
        <div className="text-[#F5E6D3] font-semibold mb-1">{session?.gameRef ?? '—'}</div>
        <div className="flex gap-4 mt-3">
          <div className="text-center">
            <div className="text-[#F59E0B] text-xl font-black">{session?.rounds.length ?? 0}</div>
            <div className="text-[#F5E6D3]/40 text-xs">manches</div>
          </div>
          <div className="text-center">
            <div className="text-[#F59E0B] text-xl font-black">
              {session?.rounds.reduce((acc, r) => acc + r.questionIds.length, 0) ?? 0}
            </div>
            <div className="text-[#F5E6D3]/40 text-xs">questions</div>
          </div>
          <div className="text-center">
            <div className="text-[#F59E0B] text-xl font-black">{session?.timerPerQuestion ?? 10}s</div>
            <div className="text-[#F5E6D3]/40 text-xs">par question</div>
          </div>
        </div>
      </div>

      <div className="bg-white/10 rounded-2xl p-5 mb-6">
        <div className="text-[#F5E6D3]/60 text-xs mb-3 uppercase tracking-wider">Joueurs ({players.length})</div>
        {humanPlayer && (
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black" style={{ background: '#F59E0B', color: '#1a0a00' }}>
              {humanPlayer.nickname[0]}
            </div>
            <span className="text-[#F5E6D3] font-semibold">{humanPlayer.nickname}</span>
            <span className="text-xs text-[#F59E0B] ml-auto">Toi</span>
          </div>
        )}
        {bots.map(bot => (
          <div key={bot.id} className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: 'rgba(255,255,255,0.1)', color: '#F5E6D3' }}>
              🤖
            </div>
            <span className="text-[#F5E6D3]/60">{bot.nickname}</span>
          </div>
        ))}
      </div>

      <div className="text-[#F5E6D3]/40 text-xs text-center mb-4">
        Mise d'entrée : 10 Bcoins · Top 3 partagent le pot
      </div>

      <button
        onClick={onStart}
        className="w-full py-4 rounded-2xl text-lg font-black transition-opacity active:opacity-80"
        style={{ background: '#F59E0B', color: '#1a0a00' }}
      >
        Lancer la partie
      </button>
    </div>
  )
}
