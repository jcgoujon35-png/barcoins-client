// ============================================================
// config/business-rules.ts
// ÉCONOMIE BARCOINS — Valeurs définitives validées par JC
// Source : sessions 25/02 + 26/02 + 20/03/2026
// ⚠️  Ne jamais modifier sans validation explicite de JC
// ⚠️  Ne jamais hard-coder ces valeurs dans les composants
// ============================================================

// ------------------------------------------------------------
// 1. VALEUR FONDAMENTALE
// ------------------------------------------------------------

export const COIN_VALUE = {
  // 1 BarCoin = 0.50€ de valeur PERÇUE par le client
  // Usage interne uniquement — jamais affiché publiquement (Loi Évin)
  PERCEIVED_VALUE_EUR: 0.50,
} as const;

// ------------------------------------------------------------
// 2. PALIERS DE CONSOMMATION — Play coins
// ------------------------------------------------------------
// Formule : coins = floor(montantEuros × multiplicateur_du_palier_atteint)
// Le multiplicateur s'applique sur le montant TOTAL de la note,
// selon le palier dans lequel tombe ce montant.
// NE PAS calculer tranche par tranche — multiplicateur unique sur total.
// Validé 26/02/2026 : "ok c'est bon pour moi"

export const CONSUMPTION_TIERS = [
  { minEur: 0,  maxEur: 9,        multiplier: 1.0 }, // 8€  → 8 coins
  { minEur: 10, maxEur: 19,       multiplier: 1.5 }, // 15€ → 22 coins
  { minEur: 20, maxEur: 29,       multiplier: 2.0 }, // 25€ → 50 coins
  { minEur: 30, maxEur: 49,       multiplier: 3.0 }, // 40€ → 120 coins
  { minEur: 50, maxEur: Infinity, multiplier: 4.0 }, // 60€ → 240 coins
] as const;

// Tableau de référence validé :
// 5€  × 1.0 =  5 coins  | val perçue  2.50€
// 10€ × 1.5 = 15 coins  | val perçue  7.50€
// 15€ × 1.5 = 22 coins  | val perçue 11.00€
// 20€ × 2.0 = 40 coins  | val perçue 20.00€
// 25€ × 2.0 = 50 coins  | val perçue 25.00€
// 30€ × 3.0 = 90 coins  | val perçue 45.00€ ← saut psychologique clé
// 40€ × 3.0 = 120 coins | val perçue 60.00€
// 50€ × 4.0 = 200 coins | val perçue 100.00€
// 60€ × 4.0 = 240 coins | val perçue 120.00€

/**
 * Calcule les Play coins à attribuer pour un montant consommé.
 * Le multiplicateur dépend du MONTANT DE LA NOTE, pas du plan.
 * Appeler via lib/coins.ts calculateQRPlayCoins() — jamais directement depuis les composants.
 */
export function calculatePlayCoins(montantEuros: number): number {
  const tier = CONSUMPTION_TIERS.find(
    (t) => montantEuros >= t.minEur && montantEuros <= t.maxEur
  );
  if (!tier) return 0;
  return Math.floor(montantEuros * tier.multiplier);
}

/**
 * Retourne le multiplicateur du palier pour un montant donné.
 * Utilisé pour stocker multiplierApplied sur la Transaction.
 */
export function getTierMultiplier(montantEuros: number): number {
  const tier = CONSUMPTION_TIERS.find(
    (t) => montantEuros >= t.minEur && montantEuros <= t.maxEur
  );
  return tier?.multiplier ?? 1.0;
}

// ------------------------------------------------------------
// 3. CATALOGUE RÉCOMPENSES — Play coins
// ------------------------------------------------------------
// Ratio cible : client dépense ~5× la valeur de la récompense
// Le gérant peut ajuster dans son dashboard (plancher imposé par BarCoins)
// Récompenses payées par le gérant sur sa propre marge boisson (70-80%)
// Validé définitivement 26/02/2026

export const REWARDS_CATALOG = {
  SHOT: {
    label: 'Shot',
    playCoins: 30,
    priceVenteMoyen: 3.00,
    coutReelGerant: 0.50,
    depenseMinRequise: 20,
    ratioDepenseRecompense: 6.7,
  },
  SOFT: {
    label: 'Soft / eau',
    playCoins: 35,
    priceVenteMoyen: 3.00,
    coutReelGerant: 0.40,
    depenseMinRequise: 20,
    ratioDepenseRecompense: 6.7,
  },
  BIERE_BASE: {
    label: 'Bière pression entrée gamme',
    playCoins: 40,
    priceVenteMoyen: 3.50,
    coutReelGerant: 0.60,
    depenseMinRequise: 20,
    ratioDepenseRecompense: 5.7,
  },
  BIERE_BOUTEILLE: {
    label: 'Bière bouteille',
    playCoins: 45,
    priceVenteMoyen: 4.50,
    coutReelGerant: 0.90,
    depenseMinRequise: 23,
    ratioDepenseRecompense: 5.1,
  },
  BIERE_QUALITE: {
    label: 'Bière qualité (Leffe, Grimbergen...)',
    playCoins: 50,
    priceVenteMoyen: 5.00,
    coutReelGerant: 1.00,
    depenseMinRequise: 25, // → 25€ → 50 coins exactement
    ratioDepenseRecompense: 5.0,
  },
  COCKTAIL: {
    label: 'Cocktail simple',
    playCoins: 90,
    priceVenteMoyen: 8.00,
    coutReelGerant: 1.50,
    depenseMinRequise: 30, // → saut psychologique voulu : 30€ = cocktail
    ratioDepenseRecompense: 3.8,
  },
  COCKTAIL_PREMIUM: {
    label: 'Cocktail premium',
    playCoins: 140,
    priceVenteMoyen: 12.00,
    coutReelGerant: 2.50,
    depenseMinRequise: 47,
    ratioDepenseRecompense: 3.9,
  },
  PLANCHE: {
    label: 'Planche apéro / tapas',
    playCoins: 150,
    priceVenteMoyen: 12.00,
    coutReelGerant: 4.00,
    depenseMinRequise: 50,
    ratioDepenseRecompense: 4.2,
  },
} as const;

// Tableau croisé panier → récompenses accessibles :
// 20€ → 40 coins → Shot ✓, Bière base ✓
// 25€ → 50 coins → + Bière qualité ✓
// 30€ → 90 coins → + Cocktail ✓  ← saut clé
// 50€ → 200 coins → tout ✓

// ------------------------------------------------------------
// 4. PACKS FIDÉLITÉ — achat Stripe
// ------------------------------------------------------------

export const FIDELITE_PACKS = {
  DECOUVERTE: {
    label: 'Pack Découverte',
    priceEur: 5,
    fideliteCoins: 15,
    spinsIncluded: 1,     // affiché "disponible au lancement Roue" pendant beta
    bonusPlayCoins: 0,
    valeurPercue: 7.50,   // 15 × 0.50€
    coutParCoin: 0.333,
  },
  STANDARD: {
    label: 'Pack Standard',
    priceEur: 10,
    fideliteCoins: 35,
    spinsIncluded: 2,
    bonusPlayCoins: 0,
    valeurPercue: 17.50,
    coutParCoin: 0.286,
  },
  PREMIUM: {
    label: 'Pack Premium',
    priceEur: 20,
    fideliteCoins: 90,
    spinsIncluded: 4,
    bonusPlayCoins: 20,   // 20 Play coins offerts en bonus
    valeurPercue: 45.00,
    coutParCoin: 0.222,
  },
} as const;

// Règle d'affichage spins en beta (wheelEnabled = false) :
// "X spin(s) disponible(s) au lancement de la Roue"
// JAMAIS afficher "ANJ" ou "Post-ANJ"

// ------------------------------------------------------------
// 5. RÉDUCTIONS FIDÉLITÉ — sur note
// ------------------------------------------------------------

export const FIDELITE_REDUCTION = {
  // 10 Fidélité coins = 0.50€ de réduction
  COINS_PAR_REDUCTION_UNITE: 10,
  VALEUR_REDUCTION_UNITE_EUR: 0.50,
  // Plafond %
  MAX_REDUCTION_PCT: 0.30,      // 30% max de la note
  // Plafond absolu
  MAX_REDUCTION_EUR: 50,         // 50€ max quelle que soit la note
} as const;

/**
 * Calcule la réduction maximale applicable pour un montant et un solde donnés.
 */
export function calcMaxFideliteReduction(
  billAmountEur: number,
  fideliteBalance: number
): { maxReductionEur: number; coinsRequired: number } {
  const coinsPerEur = FIDELITE_REDUCTION.COINS_PAR_REDUCTION_UNITE / FIDELITE_REDUCTION.VALEUR_REDUCTION_UNITE_EUR;
  const maxByPct     = billAmountEur * FIDELITE_REDUCTION.MAX_REDUCTION_PCT;
  const maxByAbsolute = FIDELITE_REDUCTION.MAX_REDUCTION_EUR;
  const maxByBalance  = fideliteBalance / coinsPerEur;
  const maxReductionEur = Math.min(maxByPct, maxByAbsolute, maxByBalance);
  const coinsRequired   = Math.ceil(maxReductionEur * coinsPerEur);
  return { maxReductionEur, coinsRequired };
}

// ------------------------------------------------------------
// 6. STATUTS SOIRÉE — Fidélité coins
// ------------------------------------------------------------

export const STATUTS_SOIREE = {
  VIP_ECRAN: {
    label: 'VIP Écran',
    fideliteCoins: 30,
    dureeMinutes: 120,
    effet: 'Pseudo affiché en doré sur écran TV du bar',
    coutReelGerant: 0,
    maxSimultane: null,
  },
  MAITRE_QUIZ: {
    label: 'Maître du Quiz',
    fideliteCoins: 50,
    dureeMinutes: null,
    effet: 'Choisit le thème de la prochaine question',
    coutReelGerant: 0,
    maxSimultane: 1,
  },
  DOUBLE_OU_RIEN: {
    label: 'Double ou Rien',
    fideliteCoins: 60,
    dureeMinutes: 120,
    effet: 'Multiplicateur ×2 sur tous les Play coins gagnés',
    coutReelGerant: 0,
    maxSimultane: null,
    peutCoexister: true, // EXCEPTION : peut coexister avec d'autres statuts
  },
  DJ_MOMENT: {
    label: 'DJ For a Moment',
    fideliteCoins: 40,
    dureeMinutes: null,
    effet: 'Choisit 3 titres musicaux diffusés',
    coutReelGerant: 0,
    maxSimultane: 1,
  },
  MON_COCKTAIL: {
    label: 'Mon Cocktail',
    fideliteCoins: 80,
    dureeMinutes: 60,
    effet: 'Cocktail créé et nommé au nom du joueur pendant 1h',
    coutReelGerant: 10,  // seul statut avec coût physique
    maxSimultane: 1,
  },
  LE_LEGEND: {
    label: 'Le Legend',
    fideliteCoins: 200,
    dureeMinutes: 180,
    effet: 'TOUT inclus + multiplicateur ×2 sur 3h',
    coutReelGerant: 10,
    maxParSoiree: 1,
    maxSimultane: 1,
  },
} as const;

export const STATUTS_RULES = {
  ANNULATION_WINDOW_SECONDS: 60,
  MAX_ACTIFS_SIMULTANEMENT: 1,  // sauf DOUBLE_OU_RIEN
} as const;

// Pour rétrocompatibilité avec le code existant
export const STATUS_CATALOGUE = STATUTS_SOIREE;

// ------------------------------------------------------------
// 7. PVP — Mises et commissions
// ------------------------------------------------------------

export const PVP_RULES = {
  COIN_TYPE: 'PLAY' as const,
  COMMISSION_RATE: 0.10,
  WINNER_PAYOUT_RATE: 0.90,
  ACCEPT_TIMEOUT_MINUTES: 3,
  RESULT_TIMEOUT_MINUTES: 10,
  MISE_MIN_COINS: 'TODO_VALIDER_JC',
  MISE_MAX_COINS: 'TODO_VALIDER_JC',
  TOURNOI_SPLIT: [0.60, 0.30, 0.10] as const,
} as const;

// Pour rétrocompatibilité
export const PVP = {
  COMMISSION: PVP_RULES.COMMISSION_RATE,
  ACCEPT_TIMEOUT_MIN: PVP_RULES.ACCEPT_TIMEOUT_MINUTES,
  RESULT_TIMEOUT_MIN: PVP_RULES.RESULT_TIMEOUT_MINUTES,
} as const;

export function calcPvPPot(challengerBet: number, opponentBet: number) {
  const totalPot    = challengerBet + opponentBet;
  const commission  = Math.round(totalPot * PVP_RULES.COMMISSION_RATE);
  const winnerPayout = totalPot - commission;
  return { totalPot, commission, winnerPayout };
}

// ------------------------------------------------------------
// 8. CLASSEMENTS ET RÉCOMPENSES
// ------------------------------------------------------------
// Soirée/Hebdo/Mensuel = à la charge du bar
// Annuel = à la charge de BarCoins (financé commissions PvP/tournois)

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
  ANNUEL: 'TODO_VALIDER_JC',
} as const;

// ------------------------------------------------------------
// 9. ROUE DE LA FORTUNE
// ------------------------------------------------------------
// wheelEnabled = false pendant TOUTE la beta — vérification serveur
// Activation uniquement par JC après validation ANJ

export const WHEEL_CONFIG = {
  ENABLED_DEFAULT: false,
  TOTAL_CASES: 10000,
  SPIN_COST_FIDELITE_COINS: 15,
  JACKPOT_CAP_PAR_MOIS: 1,

  PROBABILITIES: {
    RETRY:            0.400,
    PLAY_BONUS_5:     0.200,
    DISCOUNT_10PCT:   0.100,
    DISCOUNT_20PCT:   0.050,
    SOFT:             0.080,
    BIERE:            0.060,
    COCKTAIL:         0.050,
    COCKTAIL_PREMIUM: 0.030,
    VIN:              0.015,
    SPIRITUEUX:       0.008,
    SEJOUR_JACKPOT:   0.002,
  },

  // Économie roue (référence interne — ne pas afficher) :
  // Coût moyen/spin : 2.091€ | Revenus moy/spin : 4.38€ | Marge : ~52.5%
  DISPLAY_BETA_LABEL: 'Disponible prochainement',
} as const;

// Pour rétrocompatibilité
export const WHEEL = {
  ENABLED_DEFAULT: WHEEL_CONFIG.ENABLED_DEFAULT,
  TOTAL_CASES: WHEEL_CONFIG.TOTAL_CASES,
  SPIN_COST_COINS: WHEEL_CONFIG.SPIN_COST_FIDELITE_COINS,
  JACKPOT_MONTHLY_CAP: WHEEL_CONFIG.JACKPOT_CAP_PAR_MOIS,
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

// ------------------------------------------------------------
// 10. PLANS ABONNEMENT
// ------------------------------------------------------------
// Note : les multiplicateurs de palier consommation (×1/×1.5/×2/×3/×4)
// sont indépendants du plan. Ils dépendent du montant de la note, pas du plan.
// Le plan contrôle les features et le nb de joueurs, pas l'économie coins.

export const PLANS = {
  STARTER: {
    label: 'Starter',
    priceMonthly: 89,
    priceAnnual: 89 * 10,   // 2 mois offerts
    maxJoueursParSoiree: 50,
    multiSite: false,
  },
  STANDARD: {
    label: 'Standard',
    priceMonthly: 149,
    priceAnnual: 149 * 10,
    maxJoueursParSoiree: 150,
    multiSite: false,
  },
  PREMIUM: {
    label: 'Premium',
    priceMonthly: 249,
    priceAnnual: 249 * 10,
    maxJoueursParSoiree: Infinity,
    multiSite: true,
  },
} as const;

export type PlanKey = keyof typeof PLANS;

// ------------------------------------------------------------
// 11. RATIO COMMERCIAL — référence gérant
// ------------------------------------------------------------

export const COMMERCIAL_RATIOS = {
  MAX_REWARDS_PCT_OF_CA: 0.08,
  TARGET_SPEND_REWARD_RATIO: 5,
  ESTIMATED_COIN_USAGE_RATE: 0.30,
  MARGE_BOISSONS_MIN: 0.70,
  MARGE_BOISSONS_MAX: 0.80,
} as const;

// ------------------------------------------------------------
// 12. SÉMANTIQUE LÉGALE — Loi Évin
// ------------------------------------------------------------

export const LEGAL_LABELS = {
  POINTS_NAME:        'points fidélité',
  COINS_PLAY:         'points de jeu',       // rétrocompatibilité
  COINS_FIDELITE:     'points fidélité',     // rétrocompatibilité
  EARN_ACTION:        'visite validée par le manager',
  EARN_COINS:         'visite validée par le manager', // rétrocompatibilité
  WHEEL_BETA_LABEL:   'Disponible prochainement',
  WHEEL_DISABLED:     'Disponible prochainement',      // rétrocompatibilité
  // JAMAIS afficher COIN_VALUE.PERCEIVED_VALUE_EUR publiquement
  // JAMAIS utiliser le mot "token" (risque MiCA/crypto)
  // JAMAIS afficher "ANJ" / "Post-ANJ"
} as const;

// ------------------------------------------------------------
// 13. QR CODE — anti-fraude
// ------------------------------------------------------------

export const QR_RULES = {
  EXPIRY_SECONDS: 90,
  MAX_CLAIMS_PER_MINUTE_PER_USER: 3,
  REDIS_LOCK_PREFIX: 'qr:',
} as const;

// Alias rétrocompatibilité pour les routes qui utilisent COIN_ECONOMICS.QR_EXPIRY_SECONDS
export const COIN_ECONOMICS = {
  PERCEIVED_VALUE_EUR: COIN_VALUE.PERCEIVED_VALUE_EUR,
  QR_EXPIRY_SECONDS: QR_RULES.EXPIRY_SECONDS,
} as const;

// ------------------------------------------------------------
// 14. FEATURE FLAGS
// ------------------------------------------------------------

export const FEATURE_FLAGS = {
  WHEEL_ENABLED: false,         // ← JAMAIS true sans validation JC
  SPORTS_BET_ENABLED: false,    // V1 post-beta
  TOURNAMENT_ENABLED: false,    // V1 post-beta
} as const;

// ------------------------------------------------------------
// 15. STATUTS JOUEUR (seuils en coins Fidélité cumulés)
// ------------------------------------------------------------
// TODO_VALIDER_JC — seuils à affiner selon usage réel post-beta

export const PLAYER_STATUS_THRESHOLDS = {
  REGULAR: 0,
  VIP: 1000,
  LEGEND: 10000,
} as const;

// ------------------------------------------------------------
// RÈGLE ABSOLUE
// ------------------------------------------------------------
// Toute valeur non listée dans ce fichier = TODO_VALIDER_JC
// Ne jamais inventer une valeur métier.
// Ne jamais hard-coder une valeur dans un composant.
// Toutes les logiques métier passent par ce fichier.
