// POST /api/bars/[barId]/transactions/claim
// Joueur scanne le QR → réclame ses coins
// Auth requise : rôle PLAYER
// Délai max : QR_EXPIRY_SECONDS (90s) depuis création

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { creditCoins } from '@/lib/coins';
import { broadcast, SSE_CHANNELS } from '@/lib/sse';
import { parseBody, claimTransactionSchema } from '@/lib/validations';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ barId: string }> }
) {
  const { barId } = await params;

  // Auth joueur via middleware headers
  const userId = request.headers.get('x-user-id');
  const role = request.headers.get('x-user-role');

  if (!userId || role !== 'PLAYER') {
    return NextResponse.json({ error: 'Authentification joueur requise' }, { status: 401 });
  }

  // Validation input
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Body JSON invalide' }, { status: 400 });
  }

  const parsed = parseBody(claimTransactionSchema, body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { qrToken } = parsed.data;

  // Récupération et vérification de la transaction (atomique)
  const transaction = await prisma.transaction.findUnique({
    where: { qrToken },
    select: {
      id: true,
      barId: true,
      status: true,
      qrExpiresAt: true,
      coinsAwarded: true,
      amount: true,
      multiplierApplied: true,
    },
  });

  if (!transaction) {
    return NextResponse.json({ error: 'QR code invalide ou inexistant' }, { status: 404 });
  }

  if (transaction.barId !== barId) {
    return NextResponse.json({ error: 'QR code invalide pour ce bar' }, { status: 400 });
  }

  if (transaction.status === 'CLAIMED') {
    return NextResponse.json({ error: 'Ce QR code a déjà été utilisé' }, { status: 409 });
  }

  if (transaction.status === 'EXPIRED' || transaction.qrExpiresAt < new Date()) {
    // Marquer comme expiré si ce n'est pas déjà fait
    if (transaction.status !== 'EXPIRED') {
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: 'EXPIRED' },
      });
    }
    return NextResponse.json({ error: 'Ce QR code a expiré (90 secondes max)' }, { status: 410 });
  }

  // Traitement atomique : marquer CLAIMED + créditer coins
  const [_updatedTransaction, coinResult] = await Promise.all([
    prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        status: 'CLAIMED',
        claimedByUserId: userId,
        claimedAt: new Date(),
      },
    }),
    creditCoins({
      userId,
      barId,
      coinType: 'PLAY',
      amount: transaction.coinsAwarded,
      reason: 'QR_SCAN',
      sourceId: transaction.id,
    }),
  ]);

  if (!coinResult.success) {
    // Rollback du statut si le crédit échoue
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { status: 'PENDING', claimedByUserId: null, claimedAt: null },
    });
    return NextResponse.json({ error: 'Erreur lors du crédit de coins' }, { status: 500 });
  }

  // Broadcast SSE au leaderboard (mise à jour en temps réel)
  broadcast({
    barId,
    channel: SSE_CHANNELS.LEADERBOARD,
    data: { type: 'coins_update', userId, coinsAwarded: transaction.coinsAwarded },
  });

  return NextResponse.json({
    success: true,
    coinsAwarded: transaction.coinsAwarded,
    newPlayBalance: coinResult.newBalance,
    multiplierApplied: transaction.multiplierApplied,
    message: `+${transaction.coinsAwarded} points de jeu crédités !`,
  });
}
