'use client'
import { useReducer, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

import { gameReducer } from '@/lib/game-engine/reducer'
import { INITIAL_GAME_STATE } from '@/lib/game-engine/state'
import { createDefaultPlayers } from '@/lib/game-engine/session'

import { LobbyScreen } from '@/components/barcoins-game/LobbyScreen'
import { QuestionScreen } from '@/components/barcoins-game/QuestionScreen'
import { ResultScreen } from '@/components/barcoins-game/ResultScreen'
import { LeaderboardScreen } from '@/components/barcoins-game/LeaderboardScreen'
import { FinalScreen } from '@/components/barcoins-game/FinalScreen'
import { BetScreen } from '@/components/barcoins-game/BetScreen'
import { TwistRevealScreen } from '@/components/barcoins-game/TwistRevealScreen'

import sessionData from '@/data/game/cinema_quiz_classique_session_v1.json'
import questionsData from '@/data/game/cinema_quiz_classique_extended.json'

import type { RawSession, RawQuestion } from '@/lib/barcoins/gameTypes'

// Typage strict des imports JSON
const rawSession = sessionData as RawSession
const rawQuestions = questionsData as RawQuestion[]

export default function QuizCinemaPage() {
  const router = useRouter()

  const [state, dispatch] = useReducer(gameReducer, INITIAL_GAME_STATE)

  // Initialisation au montage : 1 joueur humain (bots seront ajoutés plus tard avec gerant)
  useEffect(() => {
    const players = createDefaultPlayers(1)
    dispatch({
      type: 'INIT_GAME',
      payload: { session: rawSession, questions: rawQuestions, players },
    })
  }, [])

  // Timer — runs during QUESTION and auto-advance phases (RESULT, LEADERBOARD, FINAL)
  useEffect(() => {
    const shouldTick = 
      (state.phase === 'QUESTION' && !state.answerLocked) ||
      (state.autoAdvanceTimer !== null && (state.phase === 'RESULT' || state.phase === 'LEADERBOARD' || state.phase === 'FINAL'))
    
    if (!shouldTick) return
    
    const interval = setInterval(() => dispatch({ type: 'TICK' }), 1000)
    return () => clearInterval(interval)
  }, [state.phase, state.answerLocked, state.autoAdvanceTimer])

  const handleAnswer = useCallback((answer: string) => {
    if (!state.questionStartTime) return
    const responseTimeMs = Date.now() - state.questionStartTime
    dispatch({ type: 'SUBMIT_ANSWER', payload: { answer, responseTimeMs } })
  }, [state.questionStartTime])

  const handleBetChange = useCallback((playerId: string, amount: number) => {
    dispatch({ type: 'SET_BET', payload: { playerId, amount } })
  }, [])

  const handlePlaceBets = useCallback(() => {
    dispatch({ type: 'PLACE_BETS' })
  }, [])

  const handleNext = useCallback(() => dispatch({ type: 'NEXT_STEP' }), [])
  const handleStart = useCallback(() => dispatch({ type: 'START_GAME' }), [])
  const handleRestart = useCallback(() => dispatch({ type: 'RESTART_GAME' }), [])
  const handleExit = useCallback(() => router.push('/games'), [router])

  switch (state.phase) {
    case 'LOBBY':
      return <LobbyScreen state={state} onStart={handleStart} />
    case 'BET_SCREEN':
      return <BetScreen state={state} onBetChange={handleBetChange} onPlaceBets={handlePlaceBets} />
    case 'QUESTION':
      return <QuestionScreen state={state} onAnswer={handleAnswer} />
    case 'TWIST_REVEAL':
      return <TwistRevealScreen state={state} onContinue={handleNext} />
    case 'RESULT':
      return <ResultScreen state={state} onNext={handleNext} />
    case 'LEADERBOARD':
      return <LeaderboardScreen state={state} onNext={handleNext} />
    case 'FINAL':
      return <FinalScreen state={state} onRestart={handleRestart} onExit={handleExit} />
    default:
      return null
  }
}
