// lib/game-engine/session.ts

import { RawSession, RawQuestion } from '@/lib/barcoins/gameTypes'
import { SessionConfig, Player, GameState, INITIAL_GAME_STATE } from './state'
import * as questionsModule from './questions'

export function parseRawSession(rawSession: RawSession): SessionConfig {
  return {
    sessionId: rawSession.session_id,
    gameRef: rawSession.game_ref,
    timerPerQuestion: rawSession.configuration.temps_par_question,
    pointsDistribution: rawSession.scoring.points_distribution,
    rounds: rawSession.manches.map(r => ({
      id: r.id,
      nom: r.nom,
      questionIds: r.questions_ids,
      multiplier: r.multiplicateur_points,
    })),
  }
}

export function createInitialGameState(params: {
  rawSession: RawSession
  rawQuestions: RawQuestion[]
  players: Player[]
}): GameState {
  const { rawSession, rawQuestions, players } = params
  return {
    ...INITIAL_GAME_STATE,
    phase: 'LOBBY',
    session: parseRawSession(rawSession),
    questionsPool: questionsModule.indexQuestions(rawQuestions),
    players,
    currentPlayerId: players[0]?.id || '',
    scores: Object.fromEntries(players.map(p => [p.id, 0])),
    leaderboard: [],
    questionResults: [],
    seenQuestionIds: [],
  }
}

export function createDefaultPlayers(count: number = 1): Player[] {
  if (count < 1) count = 1
  const players: Player[] = [
    {
      id: 'player-1',
      nickname: 'Joueur',
      score: 0,
      isBot: false,
    },
  ]
  for (let i = 2; i <= count; i++) {
    players.push({
      id: `bot-${i - 1}`,
      nickname: `Bot${i - 1}`,
      score: 0,
      isBot: true,
    })
  }
  return players
}
