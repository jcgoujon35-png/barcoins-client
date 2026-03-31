// ============================================================
// lib/game-engine/scoring.ts
// Calcul des scores et Bcoins.
// Jamais appelé depuis un composant UI directement.
// ============================================================

import type { Player } from './state'

/**
 * Calcule les points pour une réponse basée sur la rapidité.
 *
 * Distribution [20, 15, 10, 5, 0] mappée sur le temps de réponse :
 *   0–20% du temps   → 20 pts  (très rapide)
 *   20–40%           → 15 pts
 *   40–60%           → 10 pts
 *   60–80%           → 5 pts
 *   80–100% ou délai → 0 pts
 *
 * Le résultat est multiplié par le multiplicateur de la manche.
 */
export function calculatePoints(
  isCorrect: boolean,
  responseTimeMs: number,
  timerDurationMs: number,
  distribution: number[],
  roundMultiplier: number
): number {
  if (!isCorrect) return 0

  const ratio = Math.min(responseTimeMs / timerDurationMs, 1)
  let basePoints: number

  if (ratio < 0.2)      basePoints = distribution[0] ?? 20
  else if (ratio < 0.4) basePoints = distribution[1] ?? 15
  else if (ratio < 0.6) basePoints = distribution[2] ?? 10
  else if (ratio < 0.8) basePoints = distribution[3] ?? 5
  else                  basePoints = distribution[4] ?? 0

  return basePoints * roundMultiplier
}

/**
 * Score simulé pour les bots — V1 local uniquement.
 * Correct 65% du temps, avec distribution pondérée sur la rapidité.
 * Remplacer par données serveur en V2 multijoueur réel.
 */
export function generateBotPoints(
  distribution: number[],
  roundMultiplier: number
): number {
  if (Math.random() > 0.65) return 0

  // Poids : les bots tendent à répondre "correctement" à vitesse moyenne
  const weights = [0.15, 0.25, 0.30, 0.20, 0.10]
  const rand = Math.random()
  let cumul = 0
  for (let i = 0; i < weights.length; i++) {
    cumul += weights[i]
    if (rand < cumul) {
      return (distribution[i] ?? 0) * roundMultiplier
    }
  }
  return 0
}

/**
 * Calcule le classement trié par score décroissant.
 */
export function computeLeaderboard(
  scores: Record<string, number>,
  players: Player[]
): { playerId: string; nickname: string; score: number; rank: number }[] {
  return players
    .map((p) => ({
      playerId: p.id,
      nickname: p.nickname,
      score: scores[p.id] ?? 0,
    }))
    .sort((a, b) => b.score - a.score)
    .map((entry, i) => ({ ...entry, rank: i + 1 }))
}

/**
 * Calcule les Bcoins gagnés en fin de partie.
 * Distribution top-3 : 50% / 30% / 20% du pot total.
 * Pot = nbJoueurs × ticketCost (10 Bcoins par défaut).
 */
export function calculateBcoinsReward(
  rank: number,
  playerCount: number,
  ticketCost = 10
): number {
  const pot = playerCount * ticketCost
  const distribution = [0.5, 0.3, 0.2]
  const share = distribution[rank - 1]
  if (!share) return 0
  return Math.floor(pot * share)
}
