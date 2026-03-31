'use client'
import { GameState } from '@/lib/game-engine/state'

interface Props {
  state: GameState
  onRestart: () => void
  onExit: () => void
}

const PODIUM = ['🥇', '🥈', '🥉']

export function FinalScreen({ state, onRestart, onExit }: Props) {
  const { finalResults, currentPlayerId, coinsEarned, questionResults } = state
  const myResult = finalResults.find(r => r.playerId === currentPlayerId)
  const totalQuestions = questionResults.length
  const correctAnswers = questionResults.filter(r => r.isCorrect).length

  return (
    <div className="min-h-dvh flex flex-col px-6 pt-10 pb-8" style={{ background: '#1a0a00' }}>
      <h2 className="text-[#F5E6D3] text-2xl font-black mb-1">Fin de partie</h2>
      <p className="text-[#F5E6D3]/40 text-sm mb-8">Résultats finaux</p>

      {/* Podium */}
      <div className="flex flex-col gap-3 mb-6">
        {finalResults.slice(0, 3).map((entry) => {
          const isMe = entry.playerId === currentPlayerId
          return (
            <div
              key={entry.playerId}
              className="flex items-center gap-4 rounded-2xl px-4 py-4"
              style={{
                background: isMe ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.07)',
                border: isMe ? '1px solid rgba(245,158,11,0.4)' : '1px solid transparent',
              }}
            >
              <div className="text-3xl">{PODIUM[entry.rank - 1]}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[#F5E6D3] font-semibold">{entry.nickname}</span>
                  {isMe && <span className="text-xs text-[#F59E0B]">Toi</span>}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[#F59E0B] font-black text-xl">{entry.score}</div>
                <div className="text-[#F5E6D3]/40 text-xs">pts</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Mon résumé */}
      <div className="bg-white/10 rounded-2xl p-5 mb-4">
        <div className="text-[#F5E6D3]/60 text-xs mb-3 uppercase tracking-wider">Ton bilan</div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-[#F59E0B] text-2xl font-black">{myResult?.rank ?? '—'}</div>
            <div className="text-[#F5E6D3]/40 text-xs">classement</div>
          </div>
          <div>
            <div className="text-[#F59E0B] text-2xl font-black">
              {correctAnswers}/{totalQuestions}
            </div>
            <div className="text-[#F5E6D3]/40 text-xs">bonnes rép.</div>
          </div>
          <div>
            <div
              className="text-2xl font-black"
              style={{ color: coinsEarned > 0 ? '#F59E0B' : '#F5E6D3' }}
            >
              {coinsEarned > 0 ? `+${coinsEarned}` : '0'}
            </div>
            <div className="text-[#F5E6D3]/40 text-xs">Bcoins</div>
          </div>
        </div>
      </div>

      {coinsEarned > 0 && (
        <div
          className="rounded-xl px-4 py-3 text-center text-sm font-semibold mb-6"
          style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B' }}
        >
          🎉 {coinsEarned} Bcoins crédités sur ton compte !
        </div>
      )}

      <div className="flex gap-3 mt-auto">
        <button
          onClick={onExit}
          className="flex-1 py-4 rounded-2xl font-semibold"
          style={{ background: 'rgba(255,255,255,0.1)', color: '#F5E6D3' }}
        >
          Quitter
        </button>
        <button
          onClick={onRestart}
          className="flex-1 py-4 rounded-2xl font-black transition-opacity active:opacity-80"
          style={{ background: '#F59E0B', color: '#1a0a00' }}
        >
          Rejouer
        </button>
      </div>
    </div>
  )
}
