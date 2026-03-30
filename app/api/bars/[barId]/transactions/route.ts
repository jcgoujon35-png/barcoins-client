// POST /api/bars/[barId]/transactions
// Barman génère un QR code à partir d'un montant de consommation
// Auth requise : rôle BARMAN, ANIMATOR, MANAGER ou OWNER du bar

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parseBody, createTransactionSchema } from '@/lib/validations';
import { getEffectiveMultiplier, calcCoinsForAmount, COIN_ECONOMICS } from '@/config/business-rules';
import type { PlanKey } from '@/config/business-rules';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ barId: string }> }
) {
  const { barId } = await params;

  // Auth via headers injectés par middleware.ts
  const userId = request.headers.get('x-user-id');
  const role = request.headers.get('x-user-role');

  if (!userId || !['OWNER', 'MANAGER', 'ANIMATOR', 'BARMAN'].includes(role ?? '')) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  // Validation input
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Body JSON invalide' }, { status: 400 });
  }

  const parsed = parseBody(createTransactionSchema, body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { amount } = parsed.data;

  // Récupération du bar avec son plan et multiplicateur
  const bar = await prisma.bar.findUnique({
    where: { id: barId },
    select: { id: true, plan: true, activeMultiplier: true, boostActive: true, boostExpiresAt: true },
  });

  if (!bar) {
    return NextResponse.json({ error: 'Bar introuvable' }, { status: 404 });
  }

  // Vérification que le staff appartient bien à ce bar
  const staff = await prisma.staffMember.findFirst({
    where: { id: userId, barId },
  });

  if (!staff) {
    return NextResponse.json({ error: 'Non autorisé pour ce bar' }, { status: 403 });
  }

  // Calcul du boost (expiration vérifiée)
  const boostActive =
    bar.boostActive && bar.boostExpiresAt ? bar.boostExpiresAt > new Date() : false;

  const effectiveMultiplier = getEffectiveMultiplier(bar.plan as PlanKey, boostActive);
  const coinsAwarded = calcCoinsForAmount(amount, effectiveMultiplier);

  // Création de la transaction avec QR token unique
  const qrExpiresAt = new Date(Date.now() + COIN_ECONOMICS.QR_EXPIRY_SECONDS * 1000);

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
    select: {
      id: true,
      qrToken: true,
      amount: true,
      coinsAwarded: true,
      multiplierApplied: true,
      qrExpiresAt: true,
    },
  });

  return NextResponse.json({
    success: true,
    transaction: {
      id: transaction.id,
      qrToken: transaction.qrToken,
      amount: transaction.amount,
      coinsAwarded: transaction.coinsAwarded,
      multiplierApplied: transaction.multiplierApplied,
      expiresAt: transaction.qrExpiresAt.toISOString(),
      // URL QR : le client encode cette URL en QR code
      qrUrl: `${process.env.NEXT_PUBLIC_APP_URL}/claim/${transaction.qrToken}`,
    },
  });
}

// GET /api/bars/[barId]/transactions
// Liste les transactions récentes du bar (dashboard gérant)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ barId: string }> }
) {
  const { barId } = await params;
  const role = request.headers.get('x-user-role');
  const headerBarId = request.headers.get('x-bar-id');

  if (!['OWNER', 'MANAGER'].includes(role ?? '') || headerBarId !== barId) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const url = new URL(request.url);
  const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '50', 10), 100);

  const transactions = await prisma.transaction.findMany({
    where: { barId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      amount: true,
      coinsAwarded: true,
      status: true,
      multiplierApplied: true,
      claimedAt: true,
      createdAt: true,
      claimedBy: { select: { nickname: true, firstName: true, phone: true } },
      staff: { select: { email: true, role: true } },
    },
  });

  return NextResponse.json({ transactions });
}
