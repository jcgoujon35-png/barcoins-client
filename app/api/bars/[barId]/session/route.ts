// POST /api/bars/[barId]/session — Lancer une soirée (Mode Gérant Pressé)
// GET  /api/bars/[barId]/session — Statut de la soirée en cours
// DELETE /api/bars/[barId]/session — Terminer la soirée

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { broadcast, SSE_CHANNELS } from '@/lib/sse';

type Params = { params: Promise<{ barId: string }> };

// GET — soirée en cours
export async function GET(_request: NextRequest, { params }: Params) {
  const { barId } = await params;

  const activeGame = await prisma.game.findFirst({
    where: { barId, status: { in: ['SCHEDULED', 'ACTIVE', 'PAUSED'] } },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, type: true, status: true, isAutoMode: true,
      scheduledAt: true, startedAt: true, config: true,
    },
  });

  const bar = await prisma.bar.findUnique({
    where: { id: barId },
    select: {
      id: true, name: true, plan: true,
      boostActive: true, boostExpiresAt: true,
      activeMultiplier: true, healthScore: true,
    },
  });

  // Stats soirée : coins distribués ce soir
  const soireeStart = new Date();
  soireeStart.setHours(17, 0, 0, 0);

  const [coinsStats, playerCount] = await Promise.all([
    prisma.coinLedger.aggregate({
      where: { barId, coinType: 'PLAY', amount: { gt: 0 }, createdAt: { gte: soireeStart } },
      _sum: { amount: true },
      _count: true,
    }),
    prisma.coinLedger.groupBy({
      by: ['userId'],
      where: { barId, createdAt: { gte: soireeStart } },
    }).then((r) => r.length),
  ]);

  return NextResponse.json({
    bar,
    activeGame,
    stats: {
      coinsDistributed: coinsStats._sum.amount ?? 0,
      transactionCount: coinsStats._count,
      playerCount,
    },
  });
}

// POST — lancer une soirée (1 clic — Mode Gérant Pressé)
export async function POST(request: NextRequest, { params }: Params) {
  const { barId } = await params;

  const role    = request.headers.get('x-user-role');
  const barIdH  = request.headers.get('x-bar-id');

  if (!['OWNER', 'MANAGER'].includes(role ?? '') || barIdH !== barId) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
  }

  // Vérifier qu'il n'y a pas déjà une soirée active
  const existing = await prisma.game.findFirst({
    where: { barId, status: { in: ['SCHEDULED', 'ACTIVE'] } },
  });

  if (existing) {
    return NextResponse.json({ error: 'Une soirée est déjà en cours', gameId: existing.id }, { status: 409 });
  }

  let body: Record<string, unknown> = {};
  try { body = await request.json(); } catch { /* body optionnel */ }

  // Config par défaut Mode Gérant Pressé
  const config = {
    name: (body.name as string) ?? 'Soirée BarCoins',
    autoMode: (body.autoMode as boolean) ?? true,
    blindTestEnabled: true,
    quizEnabled: true,
    pvpEnabled: true,
  };

  const game = await prisma.game.create({
    data: {
      barId,
      type: 'QUIZ',
      status: 'ACTIVE',
      isAutoMode: config.autoMode,
      config,
      startedAt: new Date(),
    },
    select: { id: true, status: true, startedAt: true, config: true },
  });

  // Broadcast SSE à tous les joueurs connectés
  broadcast({
    barId,
    channel: SSE_CHANNELS.GAME_STATE,
    data: { type: 'session_started', gameId: game.id, config },
    eventType: 'session_started',
  });

  return NextResponse.json({ success: true, game });
}

// DELETE — terminer la soirée
export async function DELETE(request: NextRequest, { params }: Params) {
  const { barId } = await params;

  const role   = request.headers.get('x-user-role');
  const barIdH = request.headers.get('x-bar-id');

  if (!['OWNER', 'MANAGER'].includes(role ?? '') || barIdH !== barId) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
  }

  await prisma.game.updateMany({
    where: { barId, status: { in: ['SCHEDULED', 'ACTIVE', 'PAUSED'] } },
    data: { status: 'COMPLETED', endedAt: new Date() },
  });

  broadcast({
    barId,
    channel: SSE_CHANNELS.GAME_STATE,
    data: { type: 'session_ended' },
    eventType: 'session_ended',
  });

  return NextResponse.json({ success: true });
}
