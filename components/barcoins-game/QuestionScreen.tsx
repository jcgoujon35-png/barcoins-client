'use client'
import { GameState } from '@/lib/game-engine/state'

interface Props {
  state: GameState
  onAnswer: (answer: string) => void
}

export function QuestionScreen({ state, onAnswer }: Props) {
  const { currentQuestion, session, currentRoundIndex, currentQuestionIndex, timerRemaining, answerLocked, selectedAnswer } = state
  if (!currentQuestion || !session) return null

  const round = session.rounds[currentRoundIndex]
  const totalInRound = round.questionIds.length
  const timerPercent = (timerRemaining / session.timerPerQuestion) * 100
  const isUrgent = timerRemaining <= 3
  const timerColor = isUrgent ? '#EF4444' : timerPercent > 50 ? '#F59E0B' : '#F97316'

  return (
    <div className="min-h-dvh flex flex-col px-6 pt-8 pb-8" style={{ background: '#1a0a00' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[#F5E6D3]/40 text-xs uppercase tracking-wider">{round.nom}</div>
          <div className="text-[#F5E6D3]/60 text-sm">
            Question {currentQuestionIndex + 1}/{totalInRound}
          </div>
        </div>
        {round.multiplier > 1 && (
          <div className="px-3 py-1 rounded-full text-xs font-black" style={{ background: 'rgba(245,158,11,0.2)', color: '#F59E0B' }}>
            ×{round.multiplier}
          </div>
        )}
      </div>

      {/* Timer bar */}
      <div className="w-full h-2 rounded-full mb-6" style={{ background: 'rgba(255,255,255,0.1)' }}>
        <div
          className="h-2 rounded-full transition-all duration-1000"
          style={{ width: `${timerPercent}%`, background: timerColor }}
        />
      </div>

      {/* Timer number */}
      <div className="text-center mb-6">
        <span
          className="text-5xl font-black tabular-nums"
          style={{ color: isUrgent ? '#EF4444' : '#F59E0B' }}
        >
          {timerRemaining}
        </span>
      </div>

      {/* Question */}
      <div className="bg-white/10 rounded-2xl p-5 mb-6 flex-1 flex items-center">
        <p className="text-[#F5E6D3] text-lg font-semibold leading-snug text-center w-full">
          {currentQuestion.question}
        </p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {currentQuestion.options.map((option, i) => {
          let bg = 'rgba(255,255,255,0.1)'
          let textColor = '#F5E6D3'
          let border = 'transparent'

          if (answerLocked) {
            if (option === currentQuestion.bonne_reponse) {
              bg = 'rgba(34,197,94,0.3)'
              textColor = '#86EFAC'
              border = '#22C55E'
            } else if (option === selectedAnswer && option !== currentQuestion.bonne_reponse) {
              bg = 'rgba(239,68,68,0.3)'
              textColor = '#FCA5A5'
              border = '#EF4444'
            }
          }

          return (
            <button
              key={i}
              onClick={() => !answerLocked && onAnswer(option)}
              disabled={answerLocked}
              className="rounded-xl p-4 text-sm font-semibold text-left leading-snug transition-all active:scale-95"
              style={{
                background: bg,
                color: textColor,
                border: `2px solid ${border}`,
                opacity: answerLocked && option !== currentQuestion.bonne_reponse && option !== selectedAnswer ? 0.5 : 1,
              }}
            >
              {option}
            </button>
          )
        })}
      </div>
    </div>
  )
}
