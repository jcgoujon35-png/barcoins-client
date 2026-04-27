'use client'
import { GameState } from '@/lib/game-engine/state'

interface Props {
  state: GameState
  onContinue: () => void
}

export function TwistRevealScreen({ state, onContinue }: Props) {
  return (
    <div className="min-h-dvh flex flex-col px-6 pt-8 pb-8" style={{ background: '#1a0a00' }}>
      {/* Animated background effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(255,214,0,0.1) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Content */}
      <div className="flex flex-col items-center justify-center flex-1 relative z-10">
        {/* Icon/Animation */}
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center mb-8 animate-bounce"
          style={{
            background: 'linear-gradient(135deg, #FFD600 0%, #F59E0B 100%)',
          }}
        >
          <div className="text-4xl">⚡</div>
        </div>

        {/* Title */}
        <h1 className="text-5xl font-black text-center mb-4" style={{ color: '#FFD600' }}>
          DOUBLE OU RIEN !
        </h1>

        {/* Description */}
        <div className="text-center max-w-md mb-8">
          <p className="text-xl text-[#F5E6D3]/80 mb-4">
            Un événement spécial survient...
          </p>
          <p className="text-lg text-[#F5E6D3]/60">
            Tous vos points de la manche finale seront <span className="font-bold" style={{ color: '#FFD600' }}>doublés !</span>
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-xs mb-8">
          <div className="p-4 rounded-lg" style={{ background: 'rgba(255,214,0,0.1)' }}>
            <div className="text-sm text-[#F5E6D3]/60 mb-2">Joueurs restants</div>
            <div className="text-2xl font-bold text-[#FFD600]">
              {state.players.length - state.eliminatedPlayers.length}/{state.players.length}
            </div>
          </div>
          <div className="p-4 rounded-lg" style={{ background: 'rgba(245,158,11,0.1)' }}>
            <div className="text-sm text-[#F5E6D3]/60 mb-2">Points en jeu</div>
            <div className="text-2xl font-bold text-[#F59E0B]">×2</div>
          </div>
        </div>

        {/* Auto-continue hint */}
        <div className="text-sm text-[#F5E6D3]/40 mt-4">
          Continuant automatiquement dans {state.autoAdvanceTimer}s...
        </div>
      </div>

      {/* Optional: Manual continue button */}
      <button
        onClick={onContinue}
        className="w-full py-4 rounded-lg font-bold text-lg uppercase tracking-wider transition-all"
        style={{
          background: 'rgba(255,214,0,0.2)',
          color: '#FFD600',
          border: '2px solid #FFD600',
        }}
        onMouseEnter={e => {
          ;(e.target as HTMLButtonElement).style.background = '#FFD600'
          ;(e.target as HTMLButtonElement).style.color = '#13161c'
        }}
        onMouseLeave={e => {
          ;(e.target as HTMLButtonElement).style.background = 'rgba(255,214,0,0.2)'
          ;(e.target as HTMLButtonElement).style.color = '#FFD600'
        }}
      >
        Continuer
      </button>
    </div>
  )
}
