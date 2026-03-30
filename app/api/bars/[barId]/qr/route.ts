// POST /api/bars/[barId]/qr
// Génère un QR code pour un montant donné — version simplifiée pour l'interface gérant
// Retourne l'URL à encoder en QR (utilisée par le frontend avec une librairie QR)

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getEffectiveMultiplier, calcCoinsForAmount, COIN_ECONOMICS } from '@/config/business-rules';
import type { PlanKey } from '@/config/business-rules';

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
    select: { plan: true, boostActive: true, boostExpiresAt: true },
  });

  if (!bar) return NextResponse.json({ error: 'Bar introuvable' }, { status: 404 });

  const boostActive = bar.boostActive && bar.boostExpiresAt
    ? new Date(bar.boostExpiresAt) > new Date() : false;

  const effectiveMultiplier = getEffectiveMultiplier(bar.plan as PlanKey, boostActive);
  const coinsAwarded        = calcCoinsForAmount(amount, effectiveMultiplier);
  const qrExpiresAt         = new Date(Date.now() + COIN_ECONOMICS.QR_EXPIRY_SECONDS * 1000);

  const transaction = await prisma.transaction.create({
    data: {
      barId,
      staffId: userId,
      amount,
      coinsAwarded,
      qrExpiresAt,
      multiplierApplied: effectiveMultiplier,
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
    expiresInSeconds: COIN_ECONOMICS.QR_EXPIRY_SECONDS,
  });
}
