// app/game-demo/page.tsx
'use client'

import React, { useReducer, useEffect, useRef } from 'react'
import { gameReducer } from '@/lib/game-engine/reducer'
import { INITIAL_GAME_STATE } from '@/lib/game-engine/state'
import { createInitialGameState, createDefaultPlayers } from '@/lib/game-engine/session'
import { BetScreen } from '@/components/barcoins-game/BetScreen'
import { TwistRevealScreen } from '@/components/barcoins-game/TwistRevealScreen'
import rawQuestions from '@/data/game/cinema_quiz_classique_extended.json'
import rawSession from '@/data/game/cinema_quiz_classique_session_v1.json'

const BG = '#13161c'
const BTN = '#FFD600'
const TXT = '#fff'
const GREEN = '#00E676'
const RED = '#F54B40'

export default function GameDemoPage() {
  const players = createDefaultPlayers(1)
  const initialState = createInitialGameState({ rawSession, rawQuestions, players })
  const [state, dispatch] = useReducer(gameReducer, initialState)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const [localTimer, setLocalTimer] = React.useState(state.timerRemaining)
  const [answerClickMs, setAnswerClickMs] = React.useState<number|undefined>(undefined)

  // TIMER : synchronisation + TIME_UP auto
  useEffect(() => {
    if (state.phase === 'QUESTION' && !state.answerLocked) {
      setLocalTimer(state.timerRemaining)
      timerRef.current && clearInterval(timerRef.current)
      const start = Date.now();
      timerRef.current = setInterval(() => {
        setLocalTimer(prev => {
          if (prev <= 1) {
            timerRef.current && clearInterval(timerRef.current);
            dispatch({ type: 'TIME_UP' })
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => timerRef.current && clearInterval(timerRef.current)
    } else {
      timerRef.current && clearInterval(timerRef.current)
      setLocalTimer(state.session?.timerPerQuestion || 0)
    }
  }, [state.phase, state.answerLocked, state.currentQuestion, state.session?.timerPerQuestion])

  // RESULT/LEADERBOARD transitions auto
  useEffect(() => {
    if (state.phase === 'RESULT') {
      const t = setTimeout(() => { dispatch({ type: 'NEXT_STEP' }) }, 2000)
      return () => clearTimeout(t)
    }
    if (state.phase === 'LEADERBOARD') {
      const t = setTimeout(() => { dispatch({ type: 'NEXT_STEP' }) }, 3000)
      return () => clearTimeout(t)
    }
  }, [state.phase])

  const score = state.scores[state.currentPlayerId] || 0
  const phase = state.phase
  const roundIdx = state.currentRoundIndex + 1
  const questionIdx = state.currentQuestionIndex + 1
  const question = state.currentQuestion
  const lastResult = state.questionResults[state.questionResults.length-1]
  const bonneReponse = question?.bonne_reponse
  const aRepondu = answerClickMs !== undefined

  // FUNCTION: get color for a response button
  const buttonColor = (option: string) => {
    if (state.answerLocked && question) {
      if (option === bonneReponse) return GREEN
      if (option === lastResult?.selectedAnswer && !lastResult?.isCorrect) return RED
    }
    return BTN
  }

  // FUNCTION: get txt color for option
  const txtColor = (option: string) => {
    if (state.answerLocked && question) {
      if (option === bonneReponse) return '#111'
      if (option === lastResult?.selectedAnswer && !lastResult?.isCorrect) return '#fff'
    }
    return '#111'
  }

  return (
    <div style={{ background: BG, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ maxWidth: 480, margin: '0 auto', width: '100%', padding: 24, color: TXT }}>
        {/* DEBUG */}
        <div style={{ marginBottom: 16, fontSize: 13, fontWeight: 500, color: '#ccc' }}>
          <div>Phase: <b>{phase}</b></div>
          <div>Score: <b>{score}</b></div>
          <div>Round: {roundIdx} / {state.session?.rounds.length || 0} &nbsp;| Q: {questionIdx} / {state.session?.rounds[state.currentRoundIndex]?.questionIds.length || 0}</div>
        </div>

        {/* TIMER BAR */}
        {phase === 'QUESTION' && (
          <div style={{marginBottom:12}}>
            <div style={{height:12, width:'100%', background:'#21242b', borderRadius:6, overflow:'hidden', marginBottom:6}}>
              <div style={{height:'100%', background:BTN, width:`${(localTimer/(state.session?.timerPerQuestion||1))*100}%`, transition:'width 0.4s'}} />
            </div>
            <div style={{fontSize:20, fontWeight:600, textAlign:'right'}}>{localTimer}s</div>
          </div>
        )}

        {phase === 'LOBBY' && (
          <div style={{textAlign:'center', minHeight:300, display:'flex', flexDirection:'column', justifyContent:'center', gap:30}}>
            <h2 style={{fontSize:38}}>Lobby</h2>
            <button style={btnStyleBig} onClick={() => dispatch({ type: 'START_GAME' })}>
              Commencer
            </button>
          </div>
        )}

        {phase === 'BET_SCREEN' && question && (
          <BetScreen
            state={state}
            onBetChange={(playerId, amount) => {
              dispatch({ type: 'SET_BET', payload: { playerId, amount } })
            }}
            onPlaceBets={() => {
              dispatch({ type: 'PLACE_BETS' })
            }}
          />
        )}

        {phase === 'TWIST_REVEAL' && (
          <TwistRevealScreen
            state={state}
            onContinue={() => {
              dispatch({ type: 'NEXT_STEP' })
            }}
          />
        )}

        {phase === 'QUESTION' && question && (
          <div style={{display:'flex', flexDirection:'column', alignItems:'center', minHeight:280, justifyContent:'center'}}>
            <div style={{ fontSize:26, fontWeight:700, marginBottom:30, textAlign:'center' }}>{question.question}</div>
            <div style={{display:'flex', flexDirection:'column', gap:18, width:'100%'}}>
              {question.options.map((option: string) => (
                <button
                  key={option}
                  style={{
                    ...btnStyleBig,
                    background: buttonColor(option),
                    color: txtColor(option),
                    minHeight:60,
                    fontSize:22,
                    opacity: state.answerLocked ? (option === bonneReponse || option === lastResult?.selectedAnswer ? 1 : 0.7) : 1
                  }}
                  disabled={state.answerLocked}
                  onClick={() => {
                    setAnswerClickMs(Date.now());
                    const timeMs = Date.now() - (state.questionStartTime || Date.now())
                    dispatch({ type: 'SUBMIT_ANSWER', payload: { answer: option, responseTimeMs: timeMs } })
                  }}>
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === 'RESULT' && (
          <div style={{display:'flex', flexDirection:'column', alignItems:'center', minHeight:200, justifyContent:'center'}}>
            <div style={{ fontSize:32, fontWeight:800, color: lastResult?.isCorrect ? GREEN : RED, marginBottom:8 }}>
              {lastResult?.isCorrect ? 'BONNE RÉPONSE !' : 'MAUVAISE RÉPONSE'}
            </div>
            <div style={{ fontSize:20, marginBottom:14 }}>
              La bonne réponse était : <b style={{color:GREEN}}>{bonneReponse}</b>
            </div>
            <div style={{ fontSize:18, marginBottom:18 }}>
              Points : <b>{lastResult?.pointsEarned ?? 0}</b>
            </div>
            {/* Aucun bouton : transition auto */}
          </div>
        )}

        {phase === 'LEADERBOARD' && (
          <div style={{display:'flex', flexDirection:'column', alignItems:'center', minHeight:200, justifyContent:'center'}}>
            <h3 style={{fontSize:28}}>Classement</h3>
            <ol style={{ width:'100%', fontSize:22 }}>
              {state.leaderboard.map(lb => (
                <li key={lb.playerId}>
                  {lb.nickname} : {lb.score} pts (rang {lb.rank})
                </li>
              ))}
            </ol>
            {/* Pas de bouton, transition auto */}
          </div>
        )}

        {phase === 'FINAL' && (
          <div style={{display:'flex', flexDirection:'column', alignItems:'center', minHeight:200, justifyContent:'center'}}>
            <h2 style={{fontSize:36}}>FIN DE PARTIE</h2>
            <div style={{fontSize:22, marginBottom:10}}>Classement final :</div>
            <ol style={{ width:'100%', fontSize:22, marginBottom: 14 }}>
              {state.finalResults.map(lb => (
                <li key={lb.playerId}>
                  {lb.nickname} : {lb.score} pts (rang {lb.rank})
                </li>
              ))}
            </ol>
            <div style={{ fontWeight: 'bold', marginTop:10, fontSize: 22 }}>
              Coins gagnés : {state.coinsEarned || 0}
            </div>
            <button style={btnStyleBig} onClick={() => dispatch({ type: 'RESTART_GAME' })}>
              Recommencer
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const btnStyleBig: React.CSSProperties = {
  margin: '18px 0',
  fontSize: 22,
  padding: '20px 8px',
  minWidth: 220,
  minHeight: 60,
  borderRadius: 12,
  border: 'none',
  background: '#FFD600',
  color: '#111',
  fontWeight: 700,
  cursor: 'pointer',
  boxShadow: '0 4px 24px #0002',
  letterSpacing: '0.7px',
}
