'use client'
import { useReducer, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

import { gameReducer } from '@/lib/game-engine/reducer'
import { INITIAL_GAME_STATE } from '@/lib/game-engine/state'
import { createInitialGameState, createDefaultPlayers } from '@/lib/game-engine/session'

import { LobbyScreen } from '@/components/barcoins-game/LobbyScreen'
import { QuestionScreen } from '@/components/barcoins-game/QuestionScreen'
import { ResultScreen } from '@/components/barcoins-game/ResultScreen'
import { LeaderboardScreen } from '@/components/barcoins-game/LeaderboardScreen'
import { FinalScreen } from '@/components/barcoins-game/FinalScreen'

import sessionData from '@/data/game/cinema_quiz_classique_session_v1.json'
import questionsData from '@/data/game/cinema_quiz_classique.json'

import type { RawSession, RawQuestion } from '@/lib/barcoins/gameTypes'

// Typage strict des imports JSON
const rawSession = sessionData as RawSession
const rawQuestions = questionsData as RawQuestion[]

export default function QuizCinemaPage() {
  const router = useRouter()

  const [state, dispatch] = useReducer(gameReducer, INITIAL_GAME_STATE)

  // Initialisation au montage : 1 humain + 3 bots
  useEffect(() => {
    const players = createDefaultPlayers(4)
    dispatch({
      type: 'INIT_GAME',
      payload: { session: rawSession, questions: rawQuestions, players },
    })
  }, [])

  // Timer — tourne uniquement pendant QUESTION, s'arrête quand réponse verrouillée
  useEffect(() => {
    if (state.phase !== 'QUESTION' || state.answerLocked) return
    const interval = setInterval(() => dispatch({ type: 'TICK' }), 1000)
    return () => clearInterval(interval)
  }, [state.phase, state.answerLocked])

  const handleAnswer = useCallback((answer: string) => {
    if (!state.questionStartTime) return
    const responseTimeMs = Date.now() - state.questionStartTime
    dispatch({ type: 'SUBMIT_ANSWER', payload: { answer, responseTimeMs } })
  }, [state.questionStartTime])

  const handleNext = useCallback(() => dispatch({ type: 'NEXT_STEP' }), [])
  const handleStart = useCallback(() => dispatch({ type: 'START_GAME' }), [])
  const handleRestart = useCallback(() => dispatch({ type: 'RESTART_GAME' }), [])
  const handleExit = useCallback(() => router.push('/games'), [router])

  switch (state.phase) {
    case 'LOBBY':
      return <LobbyScreen state={state} onStart={handleStart} />
    case 'QUESTION':
      return <QuestionScreen state={state} onAnswer={handleAnswer} />
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
