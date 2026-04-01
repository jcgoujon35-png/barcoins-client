// ============================================================
// lib/game-engine/parseGameDefinition.ts
// Adapte un game.json GDF vers les types natifs du moteur.
// Aucun import depuis reducer.ts — zéro dépendance circulaire.
// ============================================================

import type { SessionConfig, Round } from './state'
import type { RawQuestion } from '@/lib/barcoins/gameTypes'

// --------------- Types GDF (input) ---------------

export interface GDFScoringConfig {
  method: 'speed_decay' | 'first_correct' | 'proportional_bet' | 'bet_before_answer'
  max_points?: number
  min_points?: number
  decay_per_second?: number
  bonus_streak?: boolean
  streak_multiplier?: number
  bet_min?: number
  bet_max?: number
  correct_multiplier?: number
  wrong_multiplier?: number
}

export interface GDFRound {
  id: string
  name: string
  type: string
  sub_type?: string
  description?: string
  questions_count: number
  timer_seconds: number
  scoring: GDFScoringConfig
  coin_logic?: {
    entry_fee?: number
    pot_contribution?: boolean
    multiplier?: number
    pot_redistribution?: number[]
  }
  special_rules?: { id: string; trigger: string; effect: string; label: string }[]
  content_tags?: string[]
}

export interface GDFMeta {
  title: string
  theme: string
  sub_themes?: string[]
  version?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  target_players?: { min: number; max: number }
  duration_minutes?: { min: number; max: number }
}

export interface GDFQuestion {
  id: string
  round_id: string
  question: string
  options: string[]
  bonne_reponse: string
  difficulte?: 'facile' | 'moyen' | 'difficile'
  contenu_type?: string
}

export interface GameDefinitionFormat {
  id: string
  meta: GDFMeta
  rounds: GDFRound[]
  questions?: GDFQuestion[]
  dynamic_events?: { trigger: string; message: string }[]
  bonuses?: unknown[]
  tech_needs?: Record<string, boolean>
}

// --------------- Résultat de parsing ---------------

export interface ParsedGameDefinition {
  session: SessionConfig
  questions: RawQuestion[]
}

// --------------- Mapping scoring GDF → points_distribution ---------------
// On normalise tout sur [20, 15, 10, 5, 0] par défaut.
// Les méthodes avancées (proportional_bet, etc.) gardent la même
// distribution — c'est le reducer qui différenciera le comportement
// quand il supportera scoring.method.

function toPointsDistribution(scoring: GDFScoringConfig): number[] {
  if (scoring.method === 'speed_decay') {
    const max = scoring.max_points ?? 20
    // Dériver 5 paliers depuis max_points
    return [max, Math.floor(max * 0.75), Math.floor(max * 0.5), Math.floor(max * 0.25), 0]
  }
  if (scoring.method === 'first_correct') {
    const max = scoring.max_points ?? 150
    return [max, Math.floor(max * 0.5), Math.floor(max * 0.3), 0, 0]
  }
  // proportional_bet / bet_before_answer → distribution neutre, la mise pilote les gains
  return [20, 15, 10, 5, 0]
}

// --------------- Difficulté GDF → RawQuestion ---------------

function mapDifficulty(gdfDiff?: string): 'facile' | 'moyen' | 'difficile' {
  if (gdfDiff === 'hard') return 'difficile'
  if (gdfDiff === 'medium') return 'moyen'
  return 'facile'
}

// --------------- Parser principal ---------------

export function parseGameDefinition(gdf: GameDefinitionFormat): ParsedGameDefinition {
  // --- Session ---
  // timer : prend le max des timers de rounds (le moteur applique 1 timer par session)
  const maxTimer = Math.max(...gdf.rounds.map(r => r.timer_seconds), 10)

  // points_distribution : depuis le 1er round (référence principale)
  const firstRoundScoring = gdf.rounds[0]?.scoring
  const pointsDistribution = firstRoundScoring
    ? toPointsDistribution(firstRoundScoring)
    : [20, 15, 10, 5, 0]

  const rounds: Round[] = gdf.rounds.map((r, index) => ({
    id: index + 1,
    nom: r.name,
    questionIds: (gdf.questions ?? [])
      .filter(q => q.round_id === r.id)
      .map(q => q.id),
    multiplier: r.coin_logic?.multiplier ?? 1,
  }))

  const session: SessionConfig = {
    sessionId: gdf.id,
    gameRef: gdf.meta.title,
    timerPerQuestion: maxTimer,
    pointsDistribution,
    rounds,
  }

  // --- Questions ---
  const questions: RawQuestion[] = (gdf.questions ?? []).map(q => ({
    id: q.id,
    type: 'qcm' as const,
    question: q.question,
    options: q.options,
    bonne_reponse: q.bonne_reponse,
    difficulte: mapDifficulty(q.difficulte ?? gdf.meta.difficulty),
    contenu_type: (q.contenu_type ?? gdf.meta.theme) as RawQuestion['contenu_type'],
  }))

  return { session, questions }
}
