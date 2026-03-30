// ============================================================
// BARCOINS — Schémas de validation Zod (réutilisables)
// Utilisés dans toutes les API routes pour valider les inputs
// ============================================================

import { z } from 'zod';

// ─────────────────────────────────────────────
// Utilitaires
// ─────────────────────────────────────────────

export const phoneSchema = z
  .string()
  .regex(/^\+[1-9]\d{7,14}$/, 'Numéro de téléphone invalide (format international requis, ex: +33612345678)');

export const cuidSchema = z.string().cuid();

export const positiveInt = z.number().int().positive();

// ─────────────────────────────────────────────
// Auth
// ─────────────────────────────────────────────

export const sendOtpSchema = z.object({
  phone: phoneSchema,
  barId: z.string().optional(), // optionnel — attaché à un bar si fourni
});

export const verifyOtpSchema = z.object({
  phone: phoneSchema,
  code: z.string().length(6, 'Le code doit faire 6 chiffres'),
  barId: z.string().optional(),
});

export const staffLoginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Mot de passe trop court'),
});

// ─────────────────────────────────────────────
// Transactions QR
// ─────────────────────────────────────────────

export const createTransactionSchema = z.object({
  amount: z.number().positive('Le montant doit être positif').max(10000, 'Montant trop élevé'),
  // staffId vient du token JWT (middleware header)
});

export const claimTransactionSchema = z.object({
  qrToken: z.string().min(1, 'Token QR requis'),
  barId: z.string().min(1, 'Bar ID requis'),
});

// ─────────────────────────────────────────────
// Profil joueur
// ─────────────────────────────────────────────

export const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  nickname: z.string().min(1).max(30).optional(),
  birthDate: z.string().datetime().optional(),
  gender: z.enum(['M', 'F', 'NB', 'NS']).optional(),
});

// ─────────────────────────────────────────────
// PvP
// ─────────────────────────────────────────────

export const createPvPSchema = z.object({
  opponentId: z.string().min(1),
  gameType: z.enum(['QUIZ', 'BLIND_TEST', 'PVP', 'SPORTS_BET', 'TOURNAMENT']),
  challengerBet: positiveInt.max(10000),
  opponentBet: positiveInt.max(10000),
  physicalGameId: z.string().optional(),
});

export const declarePvPResultSchema = z.object({
  result: z.enum(['WIN', 'LOSS']),
});

// ─────────────────────────────────────────────
// Classement
// ─────────────────────────────────────────────

export const leaderboardQuerySchema = z.object({
  type: z.enum(['SOIREE', 'HEBDO', 'MENSUEL', 'ANNUEL']).default('SOIREE'),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// ─────────────────────────────────────────────
// Helper : parse et retourne erreur 400 formatée
// ─────────────────────────────────────────────

export function parseBody<T>(schema: z.ZodSchema<T>, data: unknown):
  | { success: true; data: T }
  | { success: false; error: string } {
  const result = schema.safeParse(data);
  if (!result.success) {
    const firstError = result.error.errors[0];
    return { success: false, error: `${firstError.path.join('.')}: ${firstError.message}` };
  }
  return { success: true, data: result.data };
}
