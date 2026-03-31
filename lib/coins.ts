// ============================================================
// BARCOINS — Moteur de coins (ACID)
// RÈGLE ABSOLUE : tout mouvement de coins passe par ce fichier.
// Jamais de UPDATE direct sur BarClient.playBalance / fideliteBalance.
// Le CoinLedger est append-only — jamais de DELETE en production.
// ============================================================

import { CoinType, CoinReason } from '@prisma/client';
import { prisma } from './prisma';
import { calculatePlayCoins } from '@/config/business-rules';

// ─────────────────────────────────────────────
// calculateQRPlayCoins — calcul officiel pour tout QR scan
// Le multiplicateur vient du MONTANT DE LA NOTE (paliers),
// pas du plan d'abonnement du bar.
// ─────────────────────────────────────────────

export function calculateQRPlayCoins(montantEuros: number): number {
  return calculatePlayCoins(montantEuros);
}

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface CreditParams {
  userId: string;
  barId: string;
  coinType: CoinType;
  amount: number;       // doit être > 0
  reason: CoinReason;
  sourceId?: string;    // id de la source (transactionId, gameId, pvpMatchId…)
  note?: string;        // usage debug/admin uniquement
}

export interface DebitParams {
  userId: string;
  barId: string;
  coinType: CoinType;
  amount: number;       // doit être > 0
  reason: CoinReason;
  sourceId?: string;
  note?: string;
}

export interface CoinOperationResult {
  success: boolean;
  newBalance: number;
  ledgerEntryId: string;
  error?: string;
}

// ─────────────────────────────────────────────
// creditCoins — ajoute des coins au joueur
// Transaction ACID : CoinLedger + BarClient.balance en une seule opération
// ─────────────────────────────────────────────

export async function creditCoins(params: CreditParams): Promise<CoinOperationResult> {
  if (params.amount <= 0) {
    return { success: false, newBalance: 0, ledgerEntryId: '', error: 'Le montant doit être positif' };
  }

  const balanceField = params.coinType === 'PLAY' ? 'playBalance' : 'fideliteBalance';

  try {
    const [ledgerEntry, barClient] = await prisma.$transaction([
      // 1. Écriture dans le ledger (append-only)
      prisma.coinLedger.create({
        data: {
          userId: params.userId,
          barId: params.barId,
          coinType: params.coinType,
          amount: params.amount,          // positif = crédit
          reason: params.reason,
          sourceId: params.sourceId,
          note: params.note,
        },
      }),

      // 2. Mise à jour du solde sur BarClient
      prisma.barClient.upsert({
        where: { userId_barId: { userId: params.userId, barId: params.barId } },
        create: {
          userId: params.userId,
          barId: params.barId,
          [balanceField]: params.amount,
          totalCoinsEarned: params.coinType === 'PLAY' ? params.amount : 0,
        },
        update: {
          [balanceField]: { increment: params.amount },
          ...(params.coinType === 'PLAY' && {
            totalCoinsEarned: { increment: params.amount },
          }),
        },
      }),
    ]);

    return {
      success: true,
      newBalance: barClient[balanceField] as number,
      ledgerEntryId: ledgerEntry.id,
    };
  } catch (error) {
    console.error('[creditCoins] Erreur transaction:', error);
    return {
      success: false,
      newBalance: 0,
      ledgerEntryId: '',
      error: 'Erreur lors du crédit de coins',
    };
  }
}

// ─────────────────────────────────────────────
// debitCoins — retire des coins au joueur
// Vérifie le solde DANS la transaction pour éviter les race conditions
// ─────────────────────────────────────────────

export async function debitCoins(params: DebitParams): Promise<CoinOperationResult> {
  if (params.amount <= 0) {
    return { success: false, newBalance: 0, ledgerEntryId: '', error: 'Le montant doit être positif' };
  }

  const balanceField = params.coinType === 'PLAY' ? 'playBalance' : 'fideliteBalance';

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Lecture du solde actuel (avec lock via SELECT FOR UPDATE simulé par la transaction)
      const barClient = await tx.barClient.findUnique({
        where: { userId_barId: { userId: params.userId, barId: params.barId } },
        select: { [balanceField]: true },
      });

      const currentBalance = ((barClient?.[balanceField] as unknown) as number) ?? 0;

      if (currentBalance < params.amount) {
        throw new InsufficientBalanceError(
          `Solde insuffisant: ${currentBalance} < ${params.amount} coins ${params.coinType}`
        );
      }

      // 2. Écriture dans le ledger (montant négatif = débit)
      const ledgerEntry = await tx.coinLedger.create({
        data: {
          userId: params.userId,
          barId: params.barId,
          coinType: params.coinType,
          amount: -params.amount,       // négatif = débit
          reason: params.reason,
          sourceId: params.sourceId,
          note: params.note,
        },
      });

      // 3. Décrémentation du solde
      const updatedBarClient = await tx.barClient.update({
        where: { userId_barId: { userId: params.userId, barId: params.barId } },
        data: { [balanceField]: { decrement: params.amount } },
      });

      return {
        ledgerEntryId: ledgerEntry.id,
        newBalance: updatedBarClient[balanceField] as number,
      };
    });

    return {
      success: true,
      newBalance: result.newBalance,
      ledgerEntryId: result.ledgerEntryId,
    };
  } catch (error) {
    if (error instanceof InsufficientBalanceError) {
      return {
        success: false,
        newBalance: 0,
        ledgerEntryId: '',
        error: error.message,
      };
    }
    console.error('[debitCoins] Erreur transaction:', error);
    return {
      success: false,
      newBalance: 0,
      ledgerEntryId: '',
      error: 'Erreur lors du débit de coins',
    };
  }
}

// ─────────────────────────────────────────────
// transferCoins — PvP : débit challenger + crédit gagnant en une seule tx
// ─────────────────────────────────────────────

export async function transferCoins(params: {
  fromUserId: string;
  toUserId: string;
  barId: string;
  coinType: CoinType;
  amount: number;
  commission: number;  // déduit du pot avant payout
  reason: CoinReason;
  sourceId?: string;
}): Promise<{ success: boolean; error?: string }> {
  const balanceField = params.coinType === 'PLAY' ? 'playBalance' : 'fideliteBalance';
  const winnerPayout = params.amount - params.commission;

  try {
    await prisma.$transaction(async (tx) => {
      // Vérification solde source
      const from = await tx.barClient.findUnique({
        where: { userId_barId: { userId: params.fromUserId, barId: params.barId } },
        select: { [balanceField]: true },
      });

      if (((from?.[balanceField] as unknown as number) ?? 0) < params.amount) {
        throw new InsufficientBalanceError('Solde insuffisant pour le transfert');
      }

      // Débit source
      await tx.coinLedger.create({
        data: {
          userId: params.fromUserId, barId: params.barId,
          coinType: params.coinType, amount: -params.amount,
          reason: params.reason, sourceId: params.sourceId,
        },
      });
      await tx.barClient.update({
        where: { userId_barId: { userId: params.fromUserId, barId: params.barId } },
        data: { [balanceField]: { decrement: params.amount } },
      });

      // Crédit gagnant (payout net de commission)
      await tx.coinLedger.create({
        data: {
          userId: params.toUserId, barId: params.barId,
          coinType: params.coinType, amount: winnerPayout,
          reason: params.reason, sourceId: params.sourceId,
        },
      });
      await tx.barClient.upsert({
        where: { userId_barId: { userId: params.toUserId, barId: params.barId } },
        create: { userId: params.toUserId, barId: params.barId, [balanceField]: winnerPayout },
        update: { [balanceField]: { increment: winnerPayout } },
      });
    });

    return { success: true };
  } catch (error) {
    if (error instanceof InsufficientBalanceError) {
      return { success: false, error: error.message };
    }
    console.error('[transferCoins] Erreur:', error);
    return { success: false, error: 'Erreur lors du transfert' };
  }
}

// ─────────────────────────────────────────────
// getBalance — lecture simple du solde
// ─────────────────────────────────────────────

export async function getBalance(
  userId: string,
  barId: string
): Promise<{ playBalance: number; fideliteBalance: number }> {
  const barClient = await prisma.barClient.findUnique({
    where: { userId_barId: { userId, barId } },
    select: { playBalance: true, fideliteBalance: true },
  });
  return {
    playBalance: barClient?.playBalance ?? 0,
    fideliteBalance: barClient?.fideliteBalance ?? 0,
  };
}

// ─────────────────────────────────────────────
// Erreur personnalisée
// ─────────────────────────────────────────────

class InsufficientBalanceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InsufficientBalanceError';
  }
}
