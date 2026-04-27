// ============================================================
// lib/game-engine/state.ts
// GameState central — source de vérité unique du moteur de jeu.
// Jamais d'état de jeu en dehors de cet objet.
// ============================================================

import type { RawQuestion } from '@/lib/barcoins/gameTypes'

// --------------- Phases de jeu ---------------

export type GamePhase =
  | 'LOBBY'
  | 'QUESTION'
  | 'RESULT'
  | 'LEADERBOARD'
  | 'FINAL'
  | 'BET_SCREEN'
  | 'TWIST_REVEAL'

// --------------- Types de manches ---------------

export type RoundType = 'audio' | 'buzzer' | 'mise' | 'standard'

// --------------- Entités ---------------

export interface Player {
  id: string
  nickname: string
  score: number
  isBot: boolean
}

export interface Round {
  id: number
  nom: string
  questionIds: string[]
  multiplier: number
  type?: 'audio' | 'buzzer' | 'mise' | 'standard'
}

export interface SessionConfig {
  sessionId: string
  gameRef: string
  timerPerQuestion: number       // secondes
  pointsDistribution: number[]   // [20, 15, 10, 5, 0]
  rounds: Round[]
}

// --------------- Résultats ---------------

export interface QuestionResult {
  questionId: string
  selectedAnswer: string | null
  isCorrect: boolean
  pointsEarned: number
  responseTimeMs: number
}

export interface LeaderboardEntry {
  playerId: string
  nickname: string
  score: number
  rank: number
}

// --------------- GameState ---------------

export interface GameState {
  pot: number;
  entryFee: number;
  // Phase courante — pilote quel écran est rendu
  phase: GamePhase

  // Session chargée (null avant init)
  session: SessionConfig | null

  // Pool de questions indexées par id — O(1) accès
  questionsPool: Record<string, RawQuestion>

  // Joueurs (courant + bots en V1)
  players: Player[]
  currentPlayerId: string

  // Progression dans la session
  currentRoundIndex: number
  currentQuestionIndex: number // index dans le round courant

  // Question active
  currentQuestion: RawQuestion | null
  selectedAnswer: string | null
  answerLocked: boolean
  questionStartTime: number | null // Date.now() au moment d'affichage

  // Résultats accumulés (toute la session)
  questionResults: QuestionResult[]

  // Scores par playerId
  scores: Record<string, number>

  // Classement courant (calculé à chaque LEADERBOARD/FINAL)
  leaderboard: LeaderboardEntry[]

  // Timer (secondes restantes)
  timerRemaining: number

  // Résultats finaux
  finalResults: LeaderboardEntry[]
  coinsEarned: number

  // Anti-répétition — ids des questions déjà vues cette session
  seenQuestionIds: string[]

  // Auto-transition timer (in seconds) — null = disabled, > 0 = counting down
  autoAdvanceTimer: number | null

  // Manche actuelle: type (audio, buzzer, mise, standard)
  currentRoundType: RoundType

  // Mise en coins (pour manches MISE) — par playerId
  playerBets: Record<string, number>

  // Joueurs éliminés (pour manche BUZZER)
  eliminatedPlayers: string[]

  // Événement spécial: Double ou Rien activé ?
  doubleOrNothing: boolean

  // Dernière action chronométrée (pour rapidité)
  responseTimestamp: Record<string, number>
}

// --------------- État initial vide ---------------

export const INITIAL_GAME_STATE: GameState = {
  pot: 0,
  entryFee: 0,
  phase: 'LOBBY',
  session: null,
  questionsPool: {},
  players: [],
  currentPlayerId: 'player-1',
  currentRoundIndex: 0,
  currentQuestionIndex: 0,
  currentQuestion: null,
  selectedAnswer: null,
  answerLocked: false,
  questionStartTime: null,
  questionResults: [],
  scores: {},
  leaderboard: [],
  timerRemaining: 10,
  finalResults: [],
  coinsEarned: 0,
  seenQuestionIds: [],
  autoAdvanceTimer: null,
  currentRoundType: 'standard',
  playerBets: {},
  eliminatedPlayers: [],
  doubleOrNothing: false,
  responseTimestamp: {},
}
