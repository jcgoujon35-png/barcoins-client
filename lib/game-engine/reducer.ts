// lib/game-engine/reducer.ts

import { GameState, INITIAL_GAME_STATE, Player, QuestionResult, type RoundType } from './state'
import { RawSession, RawQuestion } from '@/lib/barcoins/gameTypes'
import * as questionsModule from './questions'
import * as scoring from './scoring'

export type GameAction =
  | { type: 'INIT_GAME'; payload: { session: RawSession; questions: RawQuestion[]; players: Player[] } }
  | { type: 'START_GAME' }
  | { type: 'SUBMIT_ANSWER'; payload: { answer: string; responseTimeMs: number } }
  | { type: 'SET_BET'; payload: { playerId: string; amount: number } }
  | { type: 'PLACE_BETS' }
  | { type: 'ELIMINATE_PLAYER'; payload: { playerId: string } }
  | { type: 'TRIGGER_DOUBLE_OR_NOTHING' }
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
            type: (r as any).type || 'standard', // Lire le type de la session, défaut: standard
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
        currentRoundType: 'standard',
      }
    }

    case 'START_GAME': {
      if (!state.session || !state.players.length) return state
      const entryFee = 10
      const pot = entryFee * state.players.length
      const firstRound = state.session.rounds[0]
      const roundType = firstRound.type || 'standard'
      const firstQuestionId = firstRound.questionIds[0]
      const currentQuestion = questionsModule.getQuestion(state.questionsPool, firstQuestionId)
      if (!currentQuestion) return state
      
      // Pour les manches MISE, aller à BET_SCREEN d'abord
      if (roundType === 'mise') {
        return {
          ...state,
          phase: 'BET_SCREEN',
          currentRoundIndex: 0,
          currentQuestionIndex: 0,
          currentQuestion,
          selectedAnswer: null,
          answerLocked: false,
          timerRemaining: state.session.timerPerQuestion,
          questionStartTime: null,
          entryFee,
          pot,
          autoAdvanceTimer: null,
          currentRoundType: roundType,
          playerBets: Object.fromEntries(state.players.map(p => [p.id, 0])),
        }
      }
      
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
        autoAdvanceTimer: null,
        currentRoundType: roundType,
      }
    }

    case 'SUBMIT_ANSWER': {
      if (state.phase !== 'QUESTION' || !state.currentQuestion || state.answerLocked) return state

      const { answer, responseTimeMs } = action.payload
      const isCorrect = answer === state.currentQuestion.bonne_reponse
      const round = state.session?.rounds[state.currentRoundIndex]
      const roundType = round?.type || 'standard'
      const roundMultiplier = round?.multiplier ?? 1
      const timerMs = (state.session?.timerPerQuestion ?? 10) * 1000
      const pointsDist = state.session?.pointsDistribution ?? [20, 15, 10, 5, 0]

      // Déterminer les points selon le type de manche
      let points = 0
      let shouldEliminate = false

      if (roundType === 'audio' || roundType === 'standard') {
        // Scoring par rapidité
        points = scoring.calculatePoints(isCorrect, responseTimeMs, timerMs, pointsDist, roundMultiplier)
      } else if (roundType === 'buzzer') {
        // Buzzer: +80 ou -40
        points = isCorrect ? 80 * roundMultiplier : -40
        shouldEliminate = !isCorrect // Éliminer si mauvaise réponse
      } else if (roundType === 'mise') {
        // Mise: utiliser les bets enregistrés
        const playerBet = state.playerBets[state.currentPlayerId] || 0
        points = isCorrect ? playerBet * 2 * roundMultiplier : -playerBet
      }

      const questionResult: QuestionResult = {
        questionId: state.currentQuestion.id,
        selectedAnswer: answer,
        isCorrect,
        pointsEarned: points,
        responseTimeMs,
      }

      // Mise à jour scores
      const updatedScores = { ...state.scores }
      updatedScores[state.currentPlayerId] = (updatedScores[state.currentPlayerId] || 0) + points
      
      // Éliminer si nécessaire (buzzer)
      let updatedEliminated = [...state.eliminatedPlayers]
      if (shouldEliminate && !updatedEliminated.includes(state.currentPlayerId)) {
        updatedEliminated.push(state.currentPlayerId)
      }

      // Bots jouent aussi
      for (const player of state.players) {
        if (player.isBot) {
          let botPts = 0
          if (roundType === 'audio' || roundType === 'standard') {
            botPts = scoring.generateBotPoints(pointsDist, roundMultiplier)
          } else if (roundType === 'buzzer') {
            botPts = Math.random() > 0.5 ? 80 * roundMultiplier : -40
            if (botPts < 0 && !updatedEliminated.includes(player.id)) {
              updatedEliminated.push(player.id)
            }
          } else if (roundType === 'mise') {
            const botBet = state.playerBets[player.id] || 5
            botPts = Math.random() > 0.5 ? botBet * 2 * roundMultiplier : -botBet
          }
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
        eliminatedPlayers: updatedEliminated,
        phase: 'RESULT',
        autoAdvanceTimer: 3,
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
        autoAdvanceTimer: 3, // Auto-advance after 3 seconds
      }
    }

    case 'TICK': {
      // Décrémenter timer de question si en phase QUESTION
      if (state.phase === 'QUESTION' && !state.answerLocked) {
        const newTimer = state.timerRemaining - 1
        if (newTimer <= 0) {
          // Déclencher TIME_UP inline — évite un cycle de rendu supplémentaire
          return gameReducer({ ...state, timerRemaining: 0 }, { type: 'TIME_UP' })
        }
        return { ...state, timerRemaining: newTimer }
      }

      // Auto-advance en RESULT, LEADERBOARD, ou FINAL
      if ((state.phase === 'RESULT' || state.phase === 'LEADERBOARD' || state.phase === 'FINAL') && state.autoAdvanceTimer !== null) {
        const newAutoTimer = state.autoAdvanceTimer - 1
        if (newAutoTimer <= 0) {
          // Auto-transition: déclencher NEXT_STEP
          return gameReducer({ ...state, autoAdvanceTimer: null }, { type: 'NEXT_STEP' })
        }
        return { ...state, autoAdvanceTimer: newAutoTimer }
      }

      return state
    }

    case 'NEXT_STEP': {
      if (!state.session) return state

      if (state.phase === 'RESULT') {
        const rounds = state.session.rounds
        const round = rounds[state.currentRoundIndex]
        const nextQuestionIndex = state.currentQuestionIndex + 1

        if (nextQuestionIndex < round.questionIds.length) {
          // Plus de questions dans cette manche
          // Vérifier si on doit afficher TWIST_REVEAL avant
          const isLastQuestion = nextQuestionIndex === round.questionIds.length - 1
          if (isLastQuestion && state.doubleOrNothing) {
            return {
              ...state,
              phase: 'TWIST_REVEAL',
              autoAdvanceTimer: 3,
            }
          }
          // Sinon passer à la question suivante
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
            autoAdvanceTimer: null,
          }
        } else {
          // Fin de la manche, passer au leaderboard
          // Appliquer multiplicateur doubleOrNothing si actif
          let updatedScores = state.scores
          if (state.doubleOrNothing && round.type === 'mise') {
            updatedScores = Object.fromEntries(
              Object.entries(state.scores).map(([id, score]) => [id, score * 2])
            )
          }
          return {
            ...state,
            phase: 'LEADERBOARD',
            scores: updatedScores,
            leaderboard: scoring.computeLeaderboard(updatedScores, state.players),
            autoAdvanceTimer: 3, // Auto-advance from LEADERBOARD after 3 seconds
          }
        }
      }

      if (state.phase === 'LEADERBOARD' || state.phase === 'TWIST_REVEAL') {
        const rounds = state.session.rounds
        const nextRoundIndex = state.currentRoundIndex + 1

        if (nextRoundIndex < rounds.length) {
          const nextRound = rounds[nextRoundIndex]
          
          // Réinitialiser les éliminations et les mises pour la nouvelle manche
          const playersForNextRound = state.players.filter(p => !state.eliminatedPlayers.includes(p.id))
          
          // Vérifier le type de manche
          if (nextRound.type === 'mise') {
            // Pour une manche 'mise', afficher BET_SCREEN
            const nextQuestion = questionsModule.getQuestion(state.questionsPool, nextRound.questionIds[0])
            if (!nextQuestion) return state
            
            return {
              ...state,
              phase: 'BET_SCREEN',
              currentRoundIndex: nextRoundIndex,
              currentQuestionIndex: 0,
              currentQuestion: nextQuestion,
              currentRoundType: nextRound.type,
              playerBets: Object.fromEntries(playersForNextRound.map(p => [p.id, 0])),
              selectedAnswer: null,
              answerLocked: false,
              autoAdvanceTimer: null,
            }
          } else {
            // Pour les autres types, passer directement à QUESTION
            const nextQuestion = questionsModule.getQuestion(state.questionsPool, nextRound.questionIds[0])
            if (!nextQuestion) return state
            
            return {
              ...state,
              phase: 'QUESTION',
              currentRoundIndex: nextRoundIndex,
              currentQuestionIndex: 0,
              currentQuestion: nextQuestion,
              currentRoundType: nextRound.type,
              selectedAnswer: null,
              answerLocked: false,
              timerRemaining: state.session.timerPerQuestion,
              questionStartTime: Date.now(),
              autoAdvanceTimer: null,
            }
          }
        } else {
          // Toutes les manches terminées, passer à FINAL
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
            autoAdvanceTimer: null,
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
        autoAdvanceTimer: null,
      }
    }

    case 'SET_BET': {
      if (state.phase !== 'BET_SCREEN') return state
      const { playerId, amount } = action.payload
      const updatedBets = { ...state.playerBets }
      updatedBets[playerId] = amount
      return { ...state, playerBets: updatedBets }
    }

    case 'PLACE_BETS': {
      if (state.phase !== 'BET_SCREEN' || !state.currentQuestion) return state
      // Tous les joueurs ont placé leurs mises, passer à QUESTION
      return {
        ...state,
        phase: 'QUESTION',
        questionStartTime: Date.now(),
        timerRemaining: state.session?.timerPerQuestion || 10,
      }
    }

    case 'ELIMINATE_PLAYER': {
      const { playerId } = action.payload
      return {
        ...state,
        eliminatedPlayers: [...state.eliminatedPlayers, playerId],
      }
    }

    case 'TRIGGER_DOUBLE_OR_NOTHING': {
      return {
        ...state,
        doubleOrNothing: true,
        phase: 'TWIST_REVEAL',
        autoAdvanceTimer: 3,
      }
    }

    default:
      return state
  }
}
