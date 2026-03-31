// ============================================================
// lib/game-engine/questions.ts
// Sélection, indexation, anti-répétition des questions.
// Aucun composant UI n'importe directement le JSON questions.
// Tout passe par ce module.
// ============================================================

import type { RawQuestion } from '@/lib/barcoins/gameTypes'

/**
 * Indexe un tableau de questions par id pour accès O(1).
 */
export function indexQuestions(
  questions: RawQuestion[]
): Record<string, RawQuestion> {
  return questions.reduce<Record<string, RawQuestion>>(
    (acc, q) => ({ ...acc, [q.id]: q }),
    {}
  )
}

/**
 * Récupère une question depuis l'index. Retourne null si inconnue.
 */
export function getQuestion(
  pool: Record<string, RawQuestion>,
  id: string
): RawQuestion | null {
  return pool[id] ?? null
}

/**
 * Filtre les ids déjà vus (anti-répétition).
 * Si tous les ids ont été vus, retourne la liste complète (cycle).
 * Garantit qu'il y a toujours des questions disponibles.
 */
export function filterSeenIds(ids: string[], seenIds: string[]): string[] {
  const unseen = ids.filter((id) => !seenIds.includes(id))
  return unseen.length > 0 ? unseen : ids
}

/**
 * Sélectionne les questions d'un round depuis le pool.
 * Respecte l'ordre défini par le game designer (pas de shuffle en V1).
 * Applique le filtre anti-répétition.
 */
export function selectRoundQuestions(
  questionIds: string[],
  pool: Record<string, RawQuestion>,
  seenIds: string[]
): RawQuestion[] {
  const filtered = filterSeenIds(questionIds, seenIds)
  return filtered
    .map((id) => pool[id])
    .filter((q): q is RawQuestion => q !== undefined)
}

/**
 * Shuffle Fisher-Yates — utilisé pour randomiser l'ordre des options.
 * Pas utilisé sur les questions en V1 (ordre game designer).
 */
export function shuffleArray<T>(arr: T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}
