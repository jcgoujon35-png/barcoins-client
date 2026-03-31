// ============================================================
// lib/barcoins/gameTypes.ts
// Types partagés du système de jeu BarCoins
// Le moteur ne connaît jamais un thème spécifique — ces types
// sont génériques et valables pour tout jeu QCM.
// ============================================================

export type QuestionDifficulty = 'facile' | 'moyen' | 'difficile'

export type QuestionContentType =
  | 'acteur'
  | 'realisateur'
  | 'film'
  | 'replique_culte'
  | 'personnage'
  | 'objet_culte'
  | 'scene'

export interface RawQuestion {
  id: string
  type: 'qcm'
  question: string
  options: string[]
  bonne_reponse: string
  difficulte: QuestionDifficulty
  contenu_type: QuestionContentType
}

export interface RawRound {
  id: number
  nom: string
  questions_ids: string[]
  multiplicateur_points: number
}

export interface RawSession {
  session_id: string
  game_ref: string
  configuration: {
    nombre_total_questions: number
    temps_par_question: number
    temps_affichage_reponse: number
  }
  manches: RawRound[]
  scoring: {
    mode: 'rapidite' | 'classement'
    points_distribution: number[]
  }
  conditions: {
    fin: string
  }
}
