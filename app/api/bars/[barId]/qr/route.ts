// POST /api/bars/[barId]/qr
// Génère un QR code pour un montant donné — version simplifiée pour l'interface gérant
// Retourne l'URL à encoder en QR (utilisée par le frontend avec une librairie QR)

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getTierMultiplier, QR_RULES } from '@/config/business-rules';
import { calculateQRPlayCoins } from '@/lib/coins';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ barId: string }> }
) {
  const { barId } = await params;

  const userId = request.headers.get('x-user-id');
  const role   = request.headers.get('x-user-role');
  const barIdH = request.headers.get('x-bar-id');

  if (!userId || !['OWNER', 'MANAGER', 'ANIMATOR', 'BARMAN'].includes(role ?? '') || barIdH !== barId) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
  }

  let body: { amount?: number } = {};
  try { body = await request.json(); } catch { /* ok */ }

  const amount = Number(body.amount);
  if (!amount || amount <= 0 || amount > 10000) {
    return NextResponse.json({ error: 'Montant invalide (0 < montant ≤ 10 000)' }, { status: 400 });
  }

  const bar = await prisma.bar.findUnique({
    where: { id: barId },
    select: { id: true },
  });

  if (!bar) return NextResponse.json({ error: 'Bar introuvable' }, { status: 404 });

  // Calcul des coins : paliers sur le montant de la note (pas le plan)
  const coinsAwarded   = calculateQRPlayCoins(amount);
  const tierMultiplier = getTierMultiplier(amount);
  const qrExpiresAt    = new Date(Date.now() + QR_RULES.EXPIRY_SECONDS * 1000);

  const transaction = await prisma.transaction.create({
    data: {
      barId,
      staffId: userId,
      amount,
      coinsAwarded,
      qrExpiresAt,
      multiplierApplied: tierMultiplier,
      status: 'PENDING',
    },
    select: { id: true, qrToken: true, coinsAwarded: true, qrExpiresAt: true, multiplierApplied: true },
  });

  const claimUrl = `${process.env.NEXT_PUBLIC_APP_URL}/claim/${transaction.qrToken}`;

  return NextResponse.json({
    qrToken: transaction.qrToken,
    claimUrl,
    coinsAwarded: transaction.coinsAwarded,
    multiplierApplied: transaction.multiplierApplied,
    expiresAt: transaction.qrExpiresAt.toISOString(),
    expiresInSeconds: QR_RULES.EXPIRY_SECONDS,
  });
}
