// ============================================================
// BARCOINS — RÈGLES MÉTIER OFFICIELLES
// Arbitrages validés par JC — Mars 2026
// ⚠️  NE JAMAIS hard-coder ces valeurs dans les composants
// ============================================================

// --- 2.2 MULTIPLICATEURS PAR PLAN ---
export const PLAN_MULTIPLIERS = {
  STARTER: 2,
  STANDARD: 3,
  PREMIUM: 4,
} as const;

// Règle de calcul officielle (plafond absolu x6) :
// effectiveMultiplier = Math.min(planMultiplier * (boostActive ? 2 : 1), 6)
// Starter+boost = x4, Standard+boost = x6, Premium+boost = x6 plafonné
export function getEffectiveMultiplier(plan: keyof typeof PLAN_MULTIPLIERS, boostActive: boolean): number {
  return Math.min(PLAN_MULTIPLIERS[plan] * (boostActive ? 2 : 1), 6);
}

// --- 2.3 STATUTS JOUEUR (reporté post-beta) ---
export const PLAYER_STATUS_THRESHOLDS = {
  REGULAR: 0,
  VIP: 1000,      // TODO_VALIDER_JC post-beta
  LEGEND: 10000,  // TODO_VALIDER_JC post-beta
} as const;

// --- 2.1 RÉCOMPENSES FIDÉLITÉ ---
// NE PAS hard-coder les valeurs de récompenses ici.
// Toutes les récompenses viennent de la BDD via API /loyalty/rewards.
// Valeurs de démonstration pour dev local UNIQUEMENT :
export const LOYALTY_REWARDS_DEMO = [
  { name: "Demi offert",     cost: "TODO_VALIDER_JC", icon: "biere"    },
  { name: "Cocktail offert", cost: "TODO_VALIDER_JC", icon: "cocktail" },
  { name: "Planche offerte", cost: "TODO_VALIDER_JC", icon: "planche"  },
] as const;

// --- BLIND TEST MISE MAX ---
// TODO_VALIDER_JC : mise max Blind Test (actuellement 500 — à confirmer)
export const BLIND_TEST_BET_MAX = "TODO_VALIDER_JC" as unknown as number; // placeholder

// --- PALIERS COINS PAR CONSOMMATION ---
// TODO_VALIDER_JC : les paliers (5€=20c, 10€=50c, 20€=120c, 50€=350c) sont non validés
// À configurer depuis le dashboard gérant via BDD
export const COINS_PALIERS_DEMO = [
  { conso: '5€',  coins: "TODO_VALIDER_JC", label: 'Soft / café'       },
  { conso: '10€', coins: "TODO_VALIDER_JC", label: 'Bière / verre'     },
  { conso: '20€', coins: "TODO_VALIDER_JC", label: 'Cocktail + apéro'  },
  { conso: '50€', coins: "TODO_VALIDER_JC", label: 'Table complète'    },
] as const;

// --- PRODUITS VEDETTE COINS ---
// TODO_VALIDER_JC : coins par produit (+40, +100, +80, +60) sont non validés
// Doivent venir de l'API bar via BDD (prix_produit * effectiveMultiplier)
