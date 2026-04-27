'use client'
import { GameState } from '@/lib/game-engine/state'
import { useState } from 'react'

interface Props {
  state: GameState
  onPlaceBets: () => void
  onBetChange: (playerId: string, amount: number) => void
}

export function BetScreen({ state, onPlaceBets, onBetChange }: Props) {
  const { currentQuestion, session, currentRoundIndex, players } = state
  if (!currentQuestion || !session) return null

  const round = session.rounds[currentRoundIndex]
  const currentBets = state.playerBets || {}

  // Calculer les coins disponibles pour chaque joueur (optionnel)
  const maxBet = 500 // Valeur fictive pour la démo

  return (
    <div className="min-h-dvh flex flex-col px-6 pt-8 pb-8" style={{ background: '#1a0a00' }}>
      {/* Manche indicator */}
      <div className="mb-6 p-3 rounded-lg text-center font-bold text-lg" style={{ background: 'rgba(255,214,0,0.1)', color: '#FFD600' }}>
        MANCHE {currentRoundIndex + 1}/{session.rounds.length} — MISE EN COINS
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[#F5E6D3]/40 text-xs uppercase tracking-wider">{round.nom}</div>
          <div className="text-[#F5E6D3]/60 text-sm">Manche de mise stratégique</div>
        </div>
        <div className="px-3 py-1 rounded-full text-xs font-black" style={{ background: 'rgba(245,158,11,0.2)', color: '#F59E0B' }}>
          ×{round.multiplier}
        </div>
      </div>

      <div className="w-full h-2 rounded-full mb-6" style={{ background: 'rgba(255,255,255,0.1)' }} />

      {/* Question preview */}
      <div className="mb-8 p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
        <div className="text-[#F5E6D3]/60 text-xs uppercase tracking-wider mb-2">Question à répondre :</div>
        <div className="text-xl font-semibold text-[#F5E6D3]">{currentQuestion.question}</div>
      </div>

      {/* Bets for each player */}
      <div className="flex-1">
        <div className="text-[#F5E6D3]/60 text-xs uppercase tracking-wider mb-4">Placez vos mises</div>
        <div className="space-y-4">
          {players.map(player => {
            const currentBet = currentBets[player.id] || 0
            const isEliminated = state.eliminatedPlayers?.includes(player.id)

            return (
              <div
                key={player.id}
                className="p-4 rounded-lg"
                style={{
                  background: isEliminated ? 'rgba(239,75,75,0.1)' : 'rgba(255,255,255,0.05)',
                  opacity: isEliminated ? 0.5 : 1,
                  pointerEvents: isEliminated ? 'none' : 'auto',
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#F5E6D3]">{player.nickname}</span>
                    {isEliminated && (
                      <span className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(239,75,75,0.3)', color: '#EF4444' }}>
                        Éliminé
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-[#F5E6D3]/60">
                    Score : {state.scores[player.id] || 0}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max={maxBet}
                    value={currentBet}
                    onChange={e => onBetChange(player.id, parseInt(e.target.value))}
                    disabled={isEliminated}
                    className="flex-1 h-2 rounded-lg appearance-none"
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      cursor: isEliminated ? 'not-allowed' : 'pointer',
                    }}
                  />
                  <input
                    type="number"
                    min="0"
                    max={maxBet}
                    value={currentBet}
                    onChange={e => onBetChange(player.id, Math.min(maxBet, parseInt(e.target.value) || 0))}
                    disabled={isEliminated}
                    className="w-20 px-3 py-2 rounded-lg text-center font-semibold"
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      color: '#FFD600',
                      border: '1px solid rgba(255,214,0,0.3)',
                      cursor: isEliminated ? 'not-allowed' : 'text',
                    }}
                  />
                  <span className="text-[#F5E6D3] font-semibold w-12">Coins</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Action button */}
      <button
        onClick={onPlaceBets}
        className="w-full py-4 rounded-lg font-bold text-lg uppercase tracking-wider transition-all"
        style={{
          background: '#FFD600',
          color: '#13161c',
          marginTop: 24,
        }}
        onMouseEnter={e => {
          ;(e.target as HTMLButtonElement).style.background = '#F5B900'
        }}
        onMouseLeave={e => {
          ;(e.target as HTMLButtonElement).style.background = '#FFD600'
        }}
      >
        Valider les mises
      </button>
    </div>
  )
}
