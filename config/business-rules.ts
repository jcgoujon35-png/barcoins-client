// ============================================================
// BARCOINS — RÈGLES MÉTIER OFFICIELLES V2
// Toutes les valeurs validées par JC — Mars 2026
// ⚠️  NE JAMAIS hard-coder ces valeurs dans les composants
// ⚠️  Toute valeur non listée ici → TODO_VALIDER_JC
// ============================================================

// ─────────────────────────────────────────────
// PLANS & TARIFS
// ─────────────────────────────────────────────

export const PLANS = {
  STARTER: {
    name: 'Starter',
    priceMonthly: 89,     // €/mois
    maxPlayers: 50,
    multiplier: 2,
  },
  STANDARD: {
    name: 'Standard',
    priceMonthly: 149,    // €/mois beta | 169€ post-beta
    maxPlayers: 150,
    multiplier: 3,
  },
  PREMIUM: {
    name: 'Premium',
    priceMonthly: 249,    // €/mois beta | 299-349€ post-beta
    maxPlayers: null,     // illimité
    multiplier: 4,
    multiSite: true,
  },
} as const;

export type PlanKey = keyof typeof PLANS;

// ─────────────────────────────────────────────
// ÉCONOMIE COINS
// ─────────────────────────────────────────────

export const COIN_ECONOMICS = {
  // Valeur perçue — NE JAMAIS afficher côté client public
  PERCEIVED_VALUE_EUR: 0.50,

  // Taux de base : 1€ consommé = 10 coins (avant multiplicateur)
  BASE_RATE_COINS_PER_EUR: 10,

  // Délai d'expiration QR code (secondes)
  QR_EXPIRY_SECONDS: 90,
} as const;

// ─────────────────────────────────────────────
// MULTIPLICATEURS
// ─────────────────────────────────────────────

export const PLAN_MULTIPLIERS: Record<PlanKey, number> = {
  STARTER: 2,
  STANDARD: 3,
  PREMIUM: 4,
};

// Plafond absolu du multiplicateur boosté : ×6
export const BOOST_CAP = 6;

/**
 * Calcule le multiplicateur effectif d'un bar.
 * Règle officielle : min(planMultiplier × (boost ? 2 : 1), 6)
 * Starter+boost = ×4 | Standard+boost = ×6 | Premium+boost = ×6 (plafonné)
 */
export function getEffectiveMultiplier(plan: PlanKey, boostActive: boolean): number {
  return Math.min(PLAN_MULTIPLIERS[plan] * (boostActive ? 2 : 1), BOOST_CAP);
}

/**
 * Calcule les coins à attribuer pour un montant consommé.
 * Jamais appeler directement — passer par lib/coins.ts creditCoins()
 */
export function calcCoinsForAmount(amountEur: number, effectiveMultiplier: number): number {
  return Math.round(amountEur * COIN_ECONOMICS.BASE_RATE_COINS_PER_EUR * effectiveMultiplier);
}

// ─────────────────────────────────────────────
// PVP
// ─────────────────────────────────────────────

export const PVP = {
  COMMISSION: 0.10,             // 10% de commission sur le pot
  ACCEPT_TIMEOUT_MIN: 3,        // minutes pour accepter un défi
  RESULT_TIMEOUT_MIN: 10,       // minutes pour déclarer le résultat
} as const;

/**
 * Calcule pot, commission et payout d'un match PvP
 */
export function calcPvPPot(challengerBet: number, opponentBet: number) {
  const totalPot = challengerBet + opponentBet;
  const commission = Math.round(totalPot * PVP.COMMISSION);
  const winnerPayout = totalPot - commission;
  return { totalPot, commission, winnerPayout };
}

// ─────────────────────────────────────────────
// PACKS FIDÉLITÉ
// ─────────────────────────────────────────────

export const FIDELITE_PACKS = {
  DECOUVERTE: {
    priceEur: 5,
    fideliteCoins: 15,
    spinsIncluded: 1,
    bonusPlayCoins: 0,
  },
  STANDARD: {
    priceEur: 10,
    fideliteCoins: 35,
    spinsIncluded: 2,
    bonusPlayCoins: 0,
  },
  PREMIUM: {
    priceEur: 20,
    fideliteCoins: 90,
    spinsIncluded: 4,
    bonusPlayCoins: 20,
  },
} as const;

// ─────────────────────────────────────────────
// CATALOGUE RÉCOMPENSES (coins Play)
// Ces valeurs sont les défauts — le gérant peut les personnaliser en BDD
// ─────────────────────────────────────────────

export const DEFAULT_REWARDS = {
  SHOT: { name: 'Shot offert', coinCost: 30 },
  BIERE: { name: 'Bière offerte', coinCost: 40 },
  BIERE_QUALITE: { name: 'Bière qualité offerte', coinCost: 50 },
  COCKTAIL: { name: 'Cocktail offert', coinCost: 90 },
  PREMIUM: { name: 'Récompense premium', coinCost: 140 },
  PLANCHE: { name: 'Planche apéro offerte', coinCost: 150 },
} as const;

// ─────────────────────────────────────────────
// RÉDUCTIONS FIDÉLITÉ (utilisation en caisse)
// ─────────────────────────────────────────────

export const FIDELITE_REDUCTION = {
  // 10 coins Fidélité = 0.50€ de réduction
  COINS_PER_EUR: 20,           // 20 coins = 1€ de réduction
  MAX_PCT_OF_BILL: 0.30,       // max 30% de la note
  ABSOLUTE_MAX_EUR: 50,        // jamais plus de 50€ de réduction
} as const;

/**
 * Calcule la réduction maximale applicable pour un montant donné
 */
export function calcMaxFideliteReduction(billAmountEur: number, fideliteBalance: number): {
  maxReductionEur: number;
  coinsRequired: number;
} {
  const maxByPct = billAmountEur * FIDELITE_REDUCTION.MAX_PCT_OF_BILL;
  const maxByAbsolute = FIDELITE_REDUCTION.ABSOLUTE_MAX_EUR;
  const maxByBalance = fideliteBalance / FIDELITE_REDUCTION.COINS_PER_EUR;
  const maxReductionEur = Math.min(maxByPct, maxByAbsolute, maxByBalance);
  const coinsRequired = Math.ceil(maxReductionEur * FIDELITE_REDUCTION.COINS_PER_EUR);
  return { maxReductionEur, coinsRequired };
}

// ─────────────────────────────────────────────
// STATUTS SOIRÉE (achetés en coins Fidélité)
// ─────────────────────────────────────────────

export const STATUS_CATALOGUE = {
  VIP_ECRAN: {
    name: 'VIP Écran',
    coinCost: 30,
    durationHours: 2,
    maxPerEvening: null,
  },
  MAITRE_QUIZ: {
    name: 'Maître du Quiz',
    coinCost: 50,
    durationHours: null, // toute la soirée
    maxPerEvening: null,
  },
  DOUBLE_OU_RIEN: {
    name: 'Double ou Rien',
    coinCost: 60,
    durationHours: 2,
    maxPerEvening: null,
  },
  DJ_MOMENT: {
    name: 'Mon Moment DJ',
    coinCost: 40,
    durationHours: null, // 3 titres
    titres: 3,
    maxPerEvening: null,
  },
  MON_COCKTAIL: {
    name: 'Mon Cocktail',
    coinCost: 80,
    durationHours: 1,
    maxPerEvening: null,
  },
  LE_LEGEND: {
    name: 'Le Legend',
    coinCost: 200,
    durationHours: 3,
    maxPerEvening: 1,   // 1 seul Legend par soirée
  },
} as const;

// ─────────────────────────────────────────────
// CLASSEMENTS — RÉCOMPENSES
// (à la charge du bar pour soirée/hebdo/mensuel)
// ─────────────────────────────────────────────

export const LEADERBOARD_REWARDS = {
  SOIREE: [
    { rank: 1, rewardEur: 8, description: 'Conso offerte par le bar' },
  ],
  HEBDO: [
    { rank: 1, rewardEur: 15, description: '1ère place semaine' },
    { rank: 2, rewardEur: 8,  description: '2ème place semaine' },
    { rank: 3, rewardEur: 4,  description: '3ème place semaine' },
  ],
  MENSUEL: [
    { rank: 1, rewardEur: 50, description: '1ère place mois' },
    { rank: 2, rewardEur: 25, description: '2ème place mois' },
    { rank: 3, rewardEur: 10, description: '3ème place mois' },
  ],
  // ANNUEL : à la charge BarCoins (financé commissions PvP/tournois)
  ANNUEL: 'TODO_VALIDER_JC',
} as const;

// ─────────────────────────────────────────────
// ROUE DE LA FORTUNE
// wheelEnabled = false pendant toute la beta
// Activation uniquement après validation JC + analyse ANJ
// ─────────────────────────────────────────────

export const WHEEL = {
  ENABLED_DEFAULT: false,       // ← NE JAMAIS passer à true sans validation JC
  TOTAL_CASES: 10000,
  SPIN_COST_COINS: 15,          // coins Fidélité par spin
  JACKPOT_MONTHLY_CAP: 1,       // 1 jackpot max par bar par mois

  // Probabilités (somme = 1.0)
  PROBABILITIES: {
    RETRY: 0.40,
    PLAY_BONUS: 0.20,
    DISCOUNT_10: 0.10,
    DISCOUNT_20: 0.05,
    SOFT: 0.08,
    BIERE: 0.06,
    COCKTAIL: 0.05,
    COCKTAIL_PREMIUM: 0.03,
    VIN: 0.015,
    SPIRITUEUX: 0.008,
    SEJOUR: 0.002,
  },
} as const;

// ─────────────────────────────────────────────
// HEALTH SCORE
// ─────────────────────────────────────────────

export const HEALTH_SCORE = {
  PONDERATION: {
    sessions: 30,
    joueurs: 25,
    coins: 25,
    features: 20,
  },
  SEUILS: {
    VERT: 70,
    ORANGE: 40,
    // < 40 = rouge → intervention proactive BarCoins
  },
} as const;

// ─────────────────────────────────────────────
// ONBOARDING
// ─────────────────────────────────────────────

export const ONBOARDING = {
  DISCOVERY_WEEKS: 2,     // S1-S2
  ENGAGEMENT_WEEKS: 2,    // S3-S4
  // COMPLETE = M2+
} as const;

// ─────────────────────────────────────────────
// FEATURE FLAGS
// ─────────────────────────────────────────────

export const FEATURE_FLAGS = {
  WHEEL_ENABLED: false,   // ← JAMAIS true sans validation JC
  SPORTS_BET_ENABLED: false, // V1 post-beta
  TOURNAMENT_ENABLED: false, // V1 post-beta
} as const;

// ─────────────────────────────────────────────
// SÉMANTIQUE LÉGALE — textes autorisés côté client
// ─────────────────────────────────────────────

export const LEGAL_LABELS = {
  // Ce que JE DOIS afficher
  COINS_PLAY: 'points de jeu',
  COINS_FIDELITE: 'points fidélité',
  EARN_COINS: 'visite validée par le manager',
  WHEEL_DISABLED: 'Disponible prochainement',

  // Ce que JE NE DOIS JAMAIS afficher côté client public
  // 'monnaie virtuelle' → INTERDIT
  // 'token' → INTERDIT (risque MiCA)
  // 'ANJ' / 'Post-ANJ' → INTERDIT
  // '1 coin = 0.50€' → INTERDIT (équivalence monétaire)
} as const;

// ─────────────────────────────────────────────
// STATUTS JOUEUR (seuils en coins Fidélité cumulés)
// ─────────────────────────────────────────────

export const PLAYER_STATUS_THRESHOLDS = {
  REGULAR: 0,
  VIP: 1000,      // TODO_VALIDER_JC — seuil post-beta à affiner selon usage réel
  LEGEND: 10000,  // TODO_VALIDER_JC — seuil post-beta à affiner selon usage réel
} as const;
