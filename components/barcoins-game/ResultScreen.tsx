'use client'
import { GameState } from '@/lib/game-engine/state'

interface Props {
  state: GameState
  onNext: () => void
}

export function ResultScreen({ state, onNext }: Props) {
  const { questionResults, currentPlayerId, scores, currentQuestion } = state
  const lastResult = questionResults[questionResults.length - 1]
  if (!lastResult) return null

  const totalScore = scores[currentPlayerId] ?? 0
  const isCorrect = lastResult.isCorrect
  const isTimeout = lastResult.selectedAnswer === null

  return (
    <div className="min-h-dvh flex flex-col items-center px-6 pt-16 pb-8" style={{ background: '#1a0a00' }}>
      {/* Verdict */}
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mb-6"
        style={{ background: isCorrect ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)' }}
      >
        {isTimeout ? '⏰' : isCorrect ? '✅' : '❌'}
      </div>

      <h2 className="text-[#F5E6D3] text-2xl font-black mb-2">
        {isTimeout ? 'Temps écoulé !' : isCorrect ? 'Bonne réponse !' : 'Raté !'}
      </h2>

      {!isCorrect && currentQuestion && (
        <p className="text-[#F5E6D3]/60 text-sm text-center mb-6">
          La bonne réponse était{' '}
          <span className="text-[#86EFAC] font-semibold">{currentQuestion.bonne_reponse}</span>
        </p>
      )}

      {/* Points */}
      <div className="bg-white/10 rounded-2xl p-6 w-full text-center mb-4">
        <div
          className="text-5xl font-black mb-1"
          style={{ color: isCorrect ? '#F59E0B' : '#EF4444' }}
        >
          {isCorrect ? `+${lastResult.pointsEarned}` : '0'}
        </div>
        <div className="text-[#F5E6D3]/40 text-xs">points gagnés</div>
      </div>

      <div className="bg-white/10 rounded-2xl p-4 w-full text-center mb-8">
        <div className="text-2xl font-black text-[#F5E6D3]">{totalScore}</div>
        <div className="text-[#F5E6D3]/40 text-xs">score total</div>
      </div>

      <button
        onClick={onNext}
        className="w-full py-4 rounded-2xl text-lg font-black transition-opacity active:opacity-80"
        style={{ background: '#F59E0B', color: '#1a0a00' }}
      >
        Suivant →
      </button>
    </div>
  )
}
