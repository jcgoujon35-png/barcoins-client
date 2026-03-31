'use client'
import { GameState } from '@/lib/game-engine/state'

interface Props {
  state: GameState
  onNext: () => void
}

const RANK_ICONS = ['🥇', '🥈', '🥉']

export function LeaderboardScreen({ state, onNext }: Props) {
  const { leaderboard, currentPlayerId, session, currentRoundIndex } = state
  const round = session?.rounds[currentRoundIndex]
  const isLastRound = session ? currentRoundIndex >= session.rounds.length - 1 : false

  return (
    <div className="min-h-dvh flex flex-col px-6 pt-10 pb-8" style={{ background: '#1a0a00' }}>
      <div className="text-[#F5E6D3]/40 text-xs uppercase tracking-wider mb-1">Fin de manche</div>
      <h2 className="text-[#F5E6D3] text-2xl font-black mb-6">
        {round?.nom ?? 'Classement'}
      </h2>

      <div className="flex flex-col gap-3 flex-1">
        {leaderboard.map((entry) => {
          const isMe = entry.playerId === currentPlayerId
          const rankIcon = RANK_ICONS[entry.rank - 1]

          return (
            <div
              key={entry.playerId}
              className="flex items-center gap-4 rounded-2xl px-4 py-3"
              style={{
                background: isMe ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.07)',
                border: isMe ? '1px solid rgba(245,158,11,0.4)' : '1px solid transparent',
              }}
            >
              <div className="text-2xl w-8 text-center">
                {rankIcon ?? <span className="text-[#F5E6D3]/40 text-lg">{entry.rank}</span>}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[#F5E6D3] font-semibold">{entry.nickname}</span>
                  {isMe && <span className="text-xs text-[#F59E0B]">Toi</span>}
                </div>
              </div>
              <div className="text-[#F59E0B] font-black text-lg">{entry.score}</div>
            </div>
          )
        })}
      </div>

      <button
        onClick={onNext}
        className="w-full py-4 rounded-2xl text-lg font-black mt-8 transition-opacity active:opacity-80"
        style={{ background: '#F59E0B', color: '#1a0a00' }}
      >
        {isLastRound ? 'Voir les résultats' : 'Manche suivante →'}
      </button>
    </div>
  )
}
