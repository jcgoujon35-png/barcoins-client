// lib/game-engine/reducer.ts

import { GameState, INITIAL_GAME_STATE, Player, QuestionResult } from './state'
import { RawSession, RawQuestion } from '@/lib/barcoins/gameTypes'
import * as questionsModule from './questions'
import * as scoring from './scoring'

export type GameAction =
  | { type: 'INIT_GAME'; payload: { session: RawSession; questions: RawQuestion[]; players: Player[] } }
  | { type: 'START_GAME' }
  | { type: 'SUBMIT_ANSWER'; payload: { answer: string; responseTimeMs: number } }
  | { type: 'TIME_UP' }
  | { type: 'TICK' }
  | { type: 'NEXT_STEP' }
  | { type: 'RESTART_GAME' }

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'INIT_GAME': {
      const { session, questions, players } = action.payload
      return {
        ...INITIAL_GAME_STATE,
        phase: 'LOBBY',
        session: {
          sessionId: session.session_id,
          gameRef: session.game_ref,
          timerPerQuestion: session.configuration.temps_par_question,
          pointsDistribution: session.scoring.points_distribution,
          rounds: session.manches.map(r => ({
            id: r.id,
            nom: r.nom,
            questionIds: r.questions_ids,
            multiplier: r.multiplicateur_points,
          })),
        },
        questionsPool: questionsModule.indexQuestions(questions),
        players,
        currentPlayerId: players[0]?.id || '',
        scores: Object.fromEntries(players.map(p => [p.id, 0])),
        leaderboard: [],
        questionResults: [],
        seenQuestionIds: [],
        pot: 0,
        entryFee: 0,
      }
    }

    case 'START_GAME': {
      if (!state.session || !state.players.length) return state
      const entryFee = 10
      const pot = entryFee * state.players.length
      const firstRound = state.session.rounds[0]
      const firstQuestionId = firstRound.questionIds[0]
      const currentQuestion = questionsModule.getQuestion(state.questionsPool, firstQuestionId)
      if (!currentQuestion) return state
      return {
        ...state,
        phase: 'QUESTION',
        currentRoundIndex: 0,
        currentQuestionIndex: 0,
        currentQuestion,
        selectedAnswer: null,
        answerLocked: false,
        timerRemaining: state.session.timerPerQuestion,
        questionStartTime: Date.now(),
        entryFee,
        pot,
      }
    }

    case 'SUBMIT_ANSWER': {
      if (state.phase !== 'QUESTION' || !state.currentQuestion || state.answerLocked) return state

      const { answer, responseTimeMs } = action.payload
      const isCorrect = answer === state.currentQuestion.bonne_reponse
      const round = state.session?.rounds[state.currentRoundIndex]
      const roundMultiplier = round?.multiplier ?? 1
      const timerMs = (state.session?.timerPerQuestion ?? 10) * 1000
      const pointsDist = state.session?.pointsDistribution ?? [20, 15, 10, 5, 0]

      const points = scoring.calculatePoints(isCorrect, responseTimeMs, timerMs, pointsDist, roundMultiplier)

      const questionResult: QuestionResult = {
        questionId: state.currentQuestion.id,
        selectedAnswer: answer,
        isCorrect,
        pointsEarned: points,
        responseTimeMs,
      }

      // Mise à jour scores : joueur humain + tous les bots
      const updatedScores = { ...state.scores }
      updatedScores[state.currentPlayerId] = (updatedScores[state.currentPlayerId] || 0) + points
      for (const player of state.players) {
        if (player.isBot) {
          const botPts = scoring.generateBotPoints(pointsDist, roundMultiplier)
          updatedScores[player.id] = (updatedScores[player.id] || 0) + botPts
        }
      }

      return {
        ...state,
        answerLocked: true,
        selectedAnswer: answer,
        questionResults: [...state.questionResults, questionResult],
        scores: updatedScores,
        seenQuestionIds: [...state.seenQuestionIds, state.currentQuestion.id],
        phase: 'RESULT',
      }
    }

    case 'TIME_UP': {
      if (state.phase !== 'QUESTION' || !state.currentQuestion || state.answerLocked) return state

      const round = state.session?.rounds[state.currentRoundIndex]
      const roundMultiplier = round?.multiplier ?? 1
      const timerMs = (state.session?.timerPerQuestion ?? 10) * 1000
      const pointsDist = state.session?.pointsDistribution ?? [20, 15, 10, 5, 0]

      const questionResult: QuestionResult = {
        questionId: state.currentQuestion.id,
        selectedAnswer: null,
        isCorrect: false,
        pointsEarned: 0,
        responseTimeMs: timerMs,
      }

      // Bots jouent quand même quand le timer expire
      const updatedScores = { ...state.scores }
      for (const player of state.players) {
        if (player.isBot) {
          const botPts = scoring.generateBotPoints(pointsDist, roundMultiplier)
          updatedScores[player.id] = (updatedScores[player.id] || 0) + botPts
        }
      }

      return {
        ...state,
        answerLocked: true,
        selectedAnswer: null,
        questionResults: [...state.questionResults, questionResult],
        scores: updatedScores,
        seenQuestionIds: [...state.seenQuestionIds, state.currentQuestion.id],
        phase: 'RESULT',
      }
    }

    case 'TICK': {
      if (state.phase !== 'QUESTION' || state.answerLocked) return state
      const newTimer = state.timerRemaining - 1
      if (newTimer <= 0) {
        // Déclencher TIME_UP inline — évite un cycle de rendu supplémentaire
        return gameReducer({ ...state, timerRemaining: 0 }, { type: 'TIME_UP' })
      }
      return { ...state, timerRemaining: newTimer }
    }

    case 'NEXT_STEP': {
      if (!state.session) return state

      if (state.phase === 'RESULT') {
        const rounds = state.session.rounds
        const round = rounds[state.currentRoundIndex]
        const nextQuestionIndex = state.currentQuestionIndex + 1

        if (nextQuestionIndex < round.questionIds.length) {
          const nextQuestionId = round.questionIds[nextQuestionIndex]
          const nextQuestion = questionsModule.getQuestion(state.questionsPool, nextQuestionId)
          if (!nextQuestion) return state
          return {
            ...state,
            phase: 'QUESTION',
            currentQuestionIndex: nextQuestionIndex,
            currentQuestion: nextQuestion,
            selectedAnswer: null,
            answerLocked: false,
            timerRemaining: state.session.timerPerQuestion,
            questionStartTime: Date.now(),
          }
        } else {
          return {
            ...state,
            phase: 'LEADERBOARD',
            leaderboard: scoring.computeLeaderboard(state.scores, state.players),
          }
        }
      }

      if (state.phase === 'LEADERBOARD') {
        const rounds = state.session.rounds
        const nextRoundIndex = state.currentRoundIndex + 1

        if (nextRoundIndex < rounds.length) {
          const round = rounds[nextRoundIndex]
          const nextQuestion = questionsModule.getQuestion(state.questionsPool, round.questionIds[0])
          if (!nextQuestion) return state
          return {
            ...state,
            phase: 'QUESTION',
            currentRoundIndex: nextRoundIndex,
            currentQuestionIndex: 0,
            currentQuestion: nextQuestion,
            selectedAnswer: null,
            answerLocked: false,
            timerRemaining: state.session.timerPerQuestion,
            questionStartTime: Date.now(),
          }
        } else {
          const finalResults = scoring.computeLeaderboard(state.scores, state.players)
          const playerRank = finalResults.find(lb => lb.playerId === state.currentPlayerId)?.rank ?? 0
          // Distribution 50/30/20 — alignée avec scoring.calculateBcoinsReward()
          const coinsEarned = scoring.calculateBcoinsReward(playerRank, state.players.length, state.entryFee)
          return {
            ...state,
            phase: 'FINAL',
            finalResults,
            coinsEarned,
            currentQuestion: null,
            selectedAnswer: null,
            answerLocked: false,
            questionStartTime: null,
          }
        }
      }

      return state
    }

    case 'RESTART_GAME': {
      return {
        ...INITIAL_GAME_STATE,
        phase: 'LOBBY',
        session: state.session,
        questionsPool: state.questionsPool,
        players: state.players,
        currentPlayerId: state.players[0]?.id || '',
        scores: Object.fromEntries(state.players.map(p => [p.id, 0])),
        leaderboard: [],
        seenQuestionIds: [],
        pot: 0,
        entryFee: 0,
      }
    }

    default:
      return state
  }
}
